# RyanPC.org - Terminal Portfolio Website

A retro-inspired terminal-style personal portfolio website with a CRT aesthetic and interactive command-line interface. Built with vanilla HTML, CSS, and JavaScript for a lightweight, fast-loading experience.

![Terminal Website](https://img.shields.io/badge/style-terminal-green?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-blue?style=flat-square)
![License](https://img.shields.io/badge/license-ISC-lightgrey?style=flat-square)

## 🌐 Live Demo

Visit the live site at **[ryanpc.org](https://ryanpc.org)**

## ✨ Features

- **Interactive Terminal Interface** - Navigate the site using command-line style inputs
- **Retro CRT Aesthetic** - Authentic terminal look with scanline effects and green monochrome styling
- **Mobile Responsive** - Optimized for both desktop and mobile devices
- **Separate Blog System** - Dedicated blog page with its own terminal interface
- **Command History** - Navigate through previous commands using arrow keys (↑/↓)
- **Dynamic Content** - View projects, skills, social links, and more through terminal commands

## 🎮 Available Commands

### Main Terminal (`index.html`)

| Command | Description |
|---------|-------------|
| `help` | List all available commands |
| `about` | Display information about me |
| `projects` | View my projects |
| `skills` | List my technical skills |
| `socials` | Display social media links |
| `email` | Get my contact email |
| `blog` | Enter the blog system |
| `clear` | Clear the terminal output |
| `history` | Show command history |

### Blog Terminal (`blog.html`)

| Command | Description |
|---------|-------------|
| `help` | List all blog commands |
| `list` | Show all blog posts |
| `read [id]` | Read a specific blog post by ID |
| `latest` | Read the most recent blog post |
| `search [keyword]` | Search blog posts by keyword |
| `home` | Return to main website |
| `clear` | Clear the terminal output |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TacoDark/ryanpcweb.git
   cd ryanpcweb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
ryanpcweb/
├── index.html          # Main terminal portfolio page
├── blog.html           # Blog terminal page
├── script.js           # Main terminal logic and commands
├── blog.js             # Blog terminal logic and post management
├── style.css           # Terminal styling and CRT effects
├── vite.config.js      # Vite configuration for GitHub Pages
├── package.json        # Project dependencies and scripts
├── CNAME               # Custom domain configuration
└── README.md           # This file
```

## 🎨 Customization

### Adding Projects

Edit the `directories.projects` array in `script.js`:

```javascript
const directories = {
    'projects': [
        { name: 'Your Project', description: 'Project description' },
        // Add more projects here
    ],
    // ...
};
```

### Adding Skills

Modify the `directories.skills` array in `script.js`:

```javascript
const directories = {
    // ...
    'skills': [
        'Your Skill',
        'Another Skill',
        // Add more skills here
    ],
    // ...
};
```

### Adding Blog Posts

Edit the `blogPosts` array in `blog.js`:

```javascript
const blogPosts = [
    {
        id: 1,
        title: 'Your Blog Title',
        date: '2025-12-01',
        content: 'Your blog content here...',
        tags: ['tag1', 'tag2']
    },
    // Add more posts here
];
```

### Styling

Customize colors, fonts, and effects in `style.css`. Key variables:

- Terminal background: `.terminal-container` background color
- Text color: `body` color property
- Highlight color: `.highlight` color property
- CRT effects: `.crt-overlay` properties

## 🌍 Deployment

This site is configured for **GitHub Pages** deployment.

### Automatic Deployment

1. Push changes to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Site will be available at your custom domain (if configured) or `username.github.io/ryanpcweb`

### Custom Domain Setup

The `CNAME` file contains the custom domain configuration:
```
ryanpc.org
```

To use your own domain:
1. Update the `CNAME` file with your domain
2. Configure DNS settings with your domain provider
3. Add a CNAME record pointing to `username.github.io`

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CRT effects
- **Vanilla JavaScript** - Interactive terminal functionality
- **Vite** - Build tool and development server
- **GitHub Pages** - Hosting and deployment

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Ryan**

- Website: [ryanpc.org](https://ryanpc.org)
- GitHub: [@TacoDark](https://github.com/tacodark)
- Twitter: [@RyanPC_Org](https://twitter.com/RyanPC_Org)
- Discord: ryandoesdeveloperstuff
- Email: ryan@ryanpc.org

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/TacoDark/ryanpcweb/issues).

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

*Made with ❤️ and a love for retro computing aesthetics*
