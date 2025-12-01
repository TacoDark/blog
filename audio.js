const output = document.getElementById('output');
const input = document.getElementById('command-input');
const terminalContainer = document.querySelector('.terminal-container');
const audioPlayer = document.getElementById('audio-player');
const nowPlayingText = document.getElementById('now-playing-text');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeSlider = document.getElementById('volume-slider');
const volumeFill = document.getElementById('volume-fill');
const volumePercent = document.getElementById('volume-percent');
const trackList = document.getElementById('track-list');
const breadcrumb = document.getElementById('breadcrumb');
const visualizer = document.getElementById('visualizer');

// Player state
let currentPath = '/mp3';
let currentTrackIndex = -1;
let playlist = [];
let shuffle = false;
let repeat = false;
let commandHistory = [];
let historyIndex = -1;

// Music library structure (loaded from JSON file)
let musicLibrary = {};


// Commands
const commands = {
    'help': 'List all available commands',
    'ls': 'List files and folders in current directory',
    'cd [folder]': 'Change directory (use ".." to go back)',
    'play [number]': 'Play track by number from list',
    'pause': 'Pause playback',
    'resume': 'Resume playback',
    'stop': 'Stop playback',
    'next': 'Play next track',
    'prev': 'Play previous track',
    'shuffle': 'Toggle shuffle mode',
    'repeat': 'Toggle repeat mode',
    'volume [0-100]': 'Set volume (0-100)',
    'queue': 'Show current playlist queue',
    'clear': 'Clear terminal output',
    'home': 'Return to main website'
};

// Initialize visualizer bars
for (let i = 0; i < 32; i++) {
    const bar = document.createElement('div');
    bar.className = 'visualizer-bar';
    visualizer.appendChild(bar);
}

// Button event listeners
document.getElementById('play-btn').addEventListener('click', () => {
    if (currentTrackIndex >= 0) {
        audioPlayer.play();
    } else if (playlist.length > 0) {
        playTrack(0);
    }
});

document.getElementById('pause-btn').addEventListener('click', () => {
    audioPlayer.pause();
});

document.getElementById('stop-btn').addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
});

document.getElementById('prev-btn').addEventListener('click', () => {
    playPrevious();
});

document.getElementById('next-btn').addEventListener('click', () => {
    playNext();
});

document.getElementById('shuffle-btn').addEventListener('click', () => {
    shuffle = !shuffle;
    document.getElementById('shuffle-btn').textContent = `🔀 Shuffle: ${shuffle ? 'ON' : 'OFF'}`;
    printToTerminal(`Shuffle mode: ${shuffle ? 'ON' : 'OFF'}`);
});

document.getElementById('repeat-btn').addEventListener('click', () => {
    repeat = !repeat;
    document.getElementById('repeat-btn').textContent = `🔁 Repeat: ${repeat ? 'ON' : 'OFF'}`;
    printToTerminal(`Repeat mode: ${repeat ? 'ON' : 'OFF'}`);
});

// Progress bar click
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

// Volume slider click
volumeSlider.addEventListener('click', (e) => {
    const rect = volumeSlider.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.round(percent * 100));
});

// Audio player events
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = percent + '%';
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
        updateVisualizer();
    }
});

audioPlayer.addEventListener('ended', () => {
    if (repeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNext();
    }
});

audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
});

// Focus input on click
document.addEventListener('click', (e) => {
    if (!e.target.closest('button') && !e.target.closest('.progress-bar') && !e.target.closest('.volume-slider')) {
        input.focus();
    }
});

// Command input
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value.trim();
        if (command) {
            executeCommand(command);
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            input.value = '';
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    }
});

function executeCommand(cmdStr) {
    const parts = cmdStr.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    printToTerminal(`player@audio:~$ ${cmdStr}`, 'command-echo');

    switch (cmd) {
        case 'help':
            let helpText = 'Available commands:\n';
            for (const [key, desc] of Object.entries(commands)) {
                helpText += `  ${key.padEnd(20)} - ${desc}\n`;
            }
            printToTerminal(helpText);
            break;

        case 'ls':
            listDirectory();
            break;

        case 'cd':
            if (args.length === 0) {
                printToTerminal('Usage: cd [folder] or cd .. to go back', 'error');
            } else {
                changeDirectory(args[0]);
            }
            break;

        case 'play':
            if (args.length === 0) {
                if (currentTrackIndex >= 0) {
                    audioPlayer.play();
                } else if (playlist.length > 0) {
                    playTrack(0);
                } else {
                    printToTerminal('No tracks in playlist. Use "ls" to see available tracks.', 'error');
                }
            } else {
                const trackNum = parseInt(args[0]) - 1;
                if (trackNum >= 0 && trackNum < playlist.length) {
                    playTrack(trackNum);
                } else {
                    printToTerminal(`Invalid track number. Use 1-${playlist.length}`, 'error');
                }
            }
            break;

        case 'pause':
            audioPlayer.pause();
            printToTerminal('Playback paused');
            break;

        case 'resume':
            audioPlayer.play();
            printToTerminal('Playback resumed');
            break;

        case 'stop':
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            printToTerminal('Playback stopped');
            break;

        case 'next':
            playNext();
            break;

        case 'prev':
        case 'previous':
            playPrevious();
            break;

        case 'shuffle':
            shuffle = !shuffle;
            document.getElementById('shuffle-btn').textContent = `🔀 Shuffle: ${shuffle ? 'ON' : 'OFF'}`;
            printToTerminal(`Shuffle mode: ${shuffle ? 'ON' : 'OFF'}`);
            break;

        case 'repeat':
            repeat = !repeat;
            document.getElementById('repeat-btn').textContent = `🔁 Repeat: ${repeat ? 'ON' : 'OFF'}`;
            printToTerminal(`Repeat mode: ${repeat ? 'ON' : 'OFF'}`);
            break;

        case 'volume':
        case 'vol':
            if (args.length === 0) {
                printToTerminal(`Current volume: ${Math.round(audioPlayer.volume * 100)}%`);
            } else {
                const vol = parseInt(args[0]);
                if (vol >= 0 && vol <= 100) {
                    setVolume(vol);
                    printToTerminal(`Volume set to ${vol}%`);
                } else {
                    printToTerminal('Volume must be between 0 and 100', 'error');
                }
            }
            break;

        case 'queue':
            showQueue();
            break;

        case 'clear':
            clearTerminal();
            break;

        case 'home':
            window.location.href = 'index.html';
            break;

        default:
            printToTerminal(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
            break;
    }
}

function listDirectory() {
    const dir = musicLibrary[currentPath];
    if (!dir) {
        printToTerminal('Directory not found', 'error');
        return;
    }

    trackList.innerHTML = '';
    playlist = [];

    // Show parent directory option if not at root
    if (currentPath !== '/mp3') {
        const parentDiv = document.createElement('div');
        parentDiv.className = 'folder-item';
        parentDiv.textContent = '.. (parent directory)';
        parentDiv.onclick = () => changeDirectory('..');
        trackList.appendChild(parentDiv);
    }

    // Show folders
    dir.folders.forEach(folder => {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'folder-item';
        folderDiv.textContent = folder;
        folderDiv.onclick = () => changeDirectory(folder);
        trackList.appendChild(folderDiv);
    });

    // Show files
    dir.files.forEach((file, index) => {
        playlist.push(file);
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track-item';
        trackDiv.textContent = `${index + 1}. ${file.name}`;
        trackDiv.onclick = () => playTrack(index);
        trackList.appendChild(trackDiv);
    });

    const albumName = currentPath.split('/').pop() || 'Root';
    printToTerminal(`\nListing: ${currentPath} (Album: ${albumName})\n` +
        `Folders: ${dir.folders.length}\n` +
        `Tracks: ${dir.files.length}\n`);
}

function changeDirectory(folder) {
    if (folder === '..') {
        const parts = currentPath.split('/');
        if (parts.length > 2) {
            parts.pop();
            currentPath = parts.join('/');
        }
    } else {
        const newPath = currentPath + '/' + folder;
        if (musicLibrary[newPath]) {
            currentPath = newPath;
        } else {
            printToTerminal(`Folder not found: ${folder}`, 'error');
            return;
        }
    }

    breadcrumb.textContent = `📂 ${currentPath}`;
    listDirectory();
}

function playTrack(index) {
    if (index < 0 || index >= playlist.length) return;

    currentTrackIndex = index;
    const track = playlist[index];

    // In production, this would load the actual file
    // For demo purposes, we'll show it's "playing"
    audioPlayer.src = track.path;
    audioPlayer.play().catch(err => {
        printToTerminal(`Error playing track: ${err.message}`, 'error');
        printToTerminal('Note: This is a demo. Add actual audio files to /mp3 folder to play them.', 'error');
    });

    const albumName = currentPath.split('/').pop() || 'Root';
    nowPlayingText.textContent = `♪ Now Playing: ${track.name} [Album: ${albumName}]`;

    // Update track list highlighting
    document.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    printToTerminal(`Playing: ${track.name}`);
}

function playNext() {
    if (playlist.length === 0) {
        printToTerminal('No tracks in playlist', 'error');
        return;
    }

    let nextIndex;
    if (shuffle) {
        nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
        nextIndex = (currentTrackIndex + 1) % playlist.length;
    }

    playTrack(nextIndex);
}

function playPrevious() {
    if (playlist.length === 0) {
        printToTerminal('No tracks in playlist', 'error');
        return;
    }

    let prevIndex;
    if (shuffle) {
        prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
        prevIndex = currentTrackIndex - 1;
        if (prevIndex < 0) prevIndex = playlist.length - 1;
    }

    playTrack(prevIndex);
}

function setVolume(percent) {
    audioPlayer.volume = percent / 100;
    volumeFill.style.width = percent + '%';
    volumePercent.textContent = percent + '%';
}

function showQueue() {
    if (playlist.length === 0) {
        printToTerminal('Playlist is empty', 'error');
        return;
    }

    const albumName = currentPath.split('/').pop() || 'Root';
    let queueText = `\nCurrent Playlist (Album: ${albumName}):\n`;
    playlist.forEach((track, i) => {
        const marker = i === currentTrackIndex ? '▶' : ' ';
        queueText += `${marker} ${i + 1}. ${track.name}\n`;
    });
    queueText += `\nTotal tracks: ${playlist.length}`;
    printToTerminal(queueText);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateVisualizer() {
    const bars = visualizer.querySelectorAll('.visualizer-bar');
    bars.forEach((bar, i) => {
        // Simulate audio visualization
        const height = Math.random() * 50 + 5;
        bar.style.height = height + 'px';
    });
}

function printToTerminal(text, className = '') {
    const lines = text.split('\n');
    lines.forEach(line => {
        const div = document.createElement('div');
        div.className = 'output-line ' + className;
        div.textContent = line;
        const terminalOutput = document.querySelector('#output');
        // Insert before the player controls
        const playerControls = document.querySelector('.player-controls');
        terminalOutput.insertBefore(div, playerControls);
    });
    terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

function clearTerminal() {
    const outputLines = document.querySelectorAll('.output-line');
    outputLines.forEach(line => line.remove());
}

// Load music library from JSON
async function loadMusicLibrary() {
    try {
        const response = await fetch('music-library.json');
        if (!response.ok) {
            throw new Error('Failed to load music library');
        }
        musicLibrary = await response.json();
        printToTerminal('✓ Music library loaded successfully!');

        // Calculate stats
        let totalTracks = 0;
        Object.values(musicLibrary).forEach(dir => {
            totalTracks += dir.files.length;
        });
        printToTerminal(`Found ${totalTracks} tracks across ${Object.keys(musicLibrary).length} directories\n`);
    } catch (error) {
        printToTerminal(`Error loading music library: ${error.message}`, 'error');
        printToTerminal('Using empty library. Please run "npm run generate-library" to scan your mp3 folder.\n', 'error');
        musicLibrary = {
            '/mp3': {
                folders: [],
                files: []
            }
        };
    }
}

// Initialize
window.onload = async () => {
    input.focus();
    printToTerminal('Welcome to RyanPC Audio Player!');
    printToTerminal('Loading music library...\n');

    await loadMusicLibrary();

    listDirectory();
    setVolume(100);
    printToTerminal('Type "help" for available commands or click on tracks to play them.\n');
};
