import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MP3_DIR = path.join(__dirname, 'mp3');
const OUTPUT_FILE = path.join(__dirname, 'music-library.json');

function scanDirectory(dirPath, basePath = '/mp3') {
    const library = {};

    function scan(currentPath, virtualPath) {
        try {
            const items = fs.readdirSync(currentPath);
            const folders = [];
            const files = [];

            items.forEach(item => {
                const fullPath = path.join(currentPath, item);
                const stats = fs.statSync(fullPath);

                if (stats.isDirectory()) {
                    folders.push(item);
                    // Recursively scan subdirectories
                    scan(fullPath, `${virtualPath}/${item}`);
                } else if (stats.isFile()) {
                    const ext = path.extname(item).toLowerCase();
                    // Only include audio files
                    if (['.mp3', '.wav', '.mp4', '.m4a', '.ogg', '.flac'].includes(ext)) {
                        files.push({
                            name: item,
                            path: `${virtualPath}/${item}`,
                            size: stats.size
                        });
                    }
                }
            });

            library[virtualPath] = {
                folders: folders.sort(),
                files: files.sort((a, b) => a.name.localeCompare(b.name))
            };
        } catch (error) {
            console.error(`Error scanning ${currentPath}:`, error.message);
        }
    }

    scan(dirPath, basePath);
    return library;
}

function generateMusicLibrary() {
    console.log('Scanning music library...');

    if (!fs.existsSync(MP3_DIR)) {
        console.error('MP3 directory not found! Creating empty library...');
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify({}, null, 2));
        return;
    }

    const library = scanDirectory(MP3_DIR);

    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(library, null, 2));

    // Calculate statistics
    let totalFolders = 0;
    let totalFiles = 0;

    Object.values(library).forEach(dir => {
        totalFolders += dir.folders.length;
        totalFiles += dir.files.length;
    });

    console.log('✓ Music library generated successfully!');
    console.log(`  - Total directories: ${Object.keys(library).length}`);
    console.log(`  - Total folders: ${totalFolders}`);
    console.log(`  - Total tracks: ${totalFiles}`);
    console.log(`  - Output: ${OUTPUT_FILE}`);
}

// Run the script
generateMusicLibrary();
