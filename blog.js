const output = document.getElementById('output');
const input = document.getElementById('command-input');
const terminalContainer = document.querySelector('.terminal-container');

// Blog Data
const posts = [
    {
        id: '1',
        title: 'Hello World',
        date: '2023-11-30',
        content: 'Welcome to my new terminal-styled blog.\n\nI decided to build this because standard web designs are getting boring. This brings back the nostalgia of the command line.\n\nStay tuned for more updates!'
    },
    {
        id: '2',
        title: 'Coming Soon',
        date: '???',
        content: 'Coming soon...'
    },
    {
        id: '3',
        title: 'Coming Soon',
        date: '???',
        content: 'Coming soon...'
    }
];

const commands = {
    'help': 'List all available commands',
    'ls': 'List all blog posts',
    'list': 'List all blog posts',
    'cat': 'Read a post. Usage: cat <id>',
    'read': 'Read a post. Usage: read <id>',
    'clear': 'Clear the terminal output',
    'home': 'Return to the main site',
    'exit': 'Return to the main site'
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
    printOutput(`guest@blog:~$ ${cmdStr}`, 'command-echo');

    switch (cmd) {
        case 'help':
            let helpText = 'Available commands:\n';
            for (const [key, desc] of Object.entries(commands)) {
                helpText += `  ${key.padEnd(10)} - ${desc}\n`;
            }
            printOutput(helpText);
            break;

        case 'ls':
        case 'list':
            if (posts.length === 0) {
                printOutput('No posts found.');
            } else {
                let listText = 'ID  DATE        TITLE\n';
                listText += '--  ----------  -----\n';
                posts.forEach(post => {
                    listText += `${post.id.padEnd(3)} ${post.date}  ${post.title}\n`;
                });
                printOutput(listText);
                printOutput('Type "read <id>" to read a post.');
            }
            break;

        case 'cat':
        case 'read':
            if (args.length === 0) {
                printOutput('Usage: read <id>');
            } else {
                const postId = args[0];
                const post = posts.find(p => p.id === postId);
                if (post) {
                    printOutput(`\n--- ${post.title} ---\nDate: ${post.date}\n\n${post.content}\n\n------------------\n`);
                } else {
                    printOutput(`Post with ID ${postId} not found.`);
                }
            }
            break;

        case 'clear':
            output.innerHTML = '';
            break;

        case 'home':
        case 'exit':
            window.location.href = 'index.html';
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
    printOutput('Type "ls" to see latest posts.');
};
