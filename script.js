const output = document.getElementById('output');
const input = document.getElementById('command-input');
const terminalContainer = document.querySelector('.terminal-container');

const directories = {
    'projects': [
        { name: 'StormTag', description: 'VR Storm Chasing Game' },
        { name: 'Horizon Esports', description: 'Esports team made by my friend, Co founder of it.' },
        { name: 'Team Monster', description: 'Defunct Esports team' },
        { name: 'Cubecore', description: 'Minecraft Minigames server' }
    ],
    'skills': [
        'Python',
        'Web Development (React, HTML, JS, CSS)',
        'Lua',
        'Rust',
        'Game Development',
        'Linux',
        'Cybersecurity',
        'IT'
    ],
    'socials': [
        { name: 'github', url: 'https://github.com/tacodark' },
        { name: 'website', url: 'https://ryanpc.org' },
        { name: 'discord', url: 'ryandoesdeveloperstuff' },
        { name: 'twitter', url: 'https://twitter.com/RyanPC_Org' }
    ]
};

const commands = {
    'help': 'List all available commands',
    'about': 'Display information about me',
    'projects': 'View my projects',
    'skills': 'List my technical skills',
    'socials': 'Display social media links',
    'email': 'Get my contact email',
    'blog': 'Enter the blog system',
    'clear': 'Clear the terminal output',
    'history': 'Show command history'
};

let commandHistory = [];
let historyIndex = -1;

// Focus input on click anywhere
document.addEventListener('click', () => {
    input.focus();
});

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

    // Echo command
    printOutput(`guest@ryanpc:~$ ${cmdStr}`, 'command-echo');

    switch (cmd) {
        case 'help':
            let helpText = 'Available commands:\n';
            for (const [key, desc] of Object.entries(commands)) {
                helpText += `  ${key.padEnd(12)} - ${desc}\n`;
            }
            printOutput(helpText);
            break;

        case 'about':
            printOutput("Hi, I'm Ryan.\nI'm a person who loves to tinker with technology, I also like engineering and all that yata yata.\nI either make stuff work, or make it go kaboom.");
            break;

        case 'projects':
            let projectText = 'My Projects:\n';
            directories.projects.forEach(p => {
                projectText += `  * ${p.name.padEnd(20)} - ${p.description}\n`;
            });
            printOutput(projectText);
            break;

        case 'skills':
            printOutput('Technical Skills:\n' + directories.skills.map(s => `  * ${s}`).join('\n'));
            break;

        case 'socials':
            let socialText = 'Connect with me:\n';
            directories.socials.forEach(s => {
                socialText += `  ${s.name}: ${s.url}\n`;
            });
            printOutput(socialText);
            break;

        case 'email':
            printOutput('You can reach me at: ryan@ryanpc.org');
            break;

        case 'blog':
            window.location.href = 'blog.html';
            break;

        case 'history':
            printOutput(commandHistory.map((c, i) => `${i + 1}  ${c}`).join('\n'));
            break;

        case 'clear':
            output.innerHTML = '';
            break;

        default:
            printOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
            break;
    }

    // Scroll to bottom
    terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

function printOutput(text, className = '') {
    const div = document.createElement('div');
    div.className = 'output-line ' + className;
    div.textContent = text;
    output.appendChild(div);
}

// Initial greeting
window.onload = () => {
    input.focus();
};
