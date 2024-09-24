//
// dirREeader.js - A simple command line utility to display the contents of a directory using Node.js
// Usage: node dirReader.js [options] [directory]
// Options:
// -a  Show all files including hidden
// -s  Show file sizes
// -d  Show file dates
// Example:
// node dirReader.js /path/to/directory
// node dirReader.js -a
// node dirReader.js -s
// node dirReader.js -d
// node dirReader.js -asd /path/to/directory
// Author: Terry D'Silva   2024  LC-FSJS
// Edited by: Sushil Thapa

const fs = require('fs');
const path = require('path');

function displayDirectoryContents(dirPath, options, indent = '') {
    try {
        const files = fs.readdirSync(dirPath);
        
        console.log(`${indent}Directory of ${path.resolve(dirPath)}\n`);
        
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            
            if (options.all || !file.startsWith('.')) {
                let output = '';
                
                if (options.size) {
                    output += `${stats.size.toString().padStart(10)} `;
                }
                
                if (options.date) {
                    output += `${stats.mtime.toISOString().slice(0, 10)} `;
                }
                
                output += `${file}${stats.isDirectory() ? '\\' : ''}`;
                
                console.log(indent + output);
                
                // If recursion is enabled and it's a directory, recurse into it
                if (options.recursive && stats.isDirectory()) {
                    displayDirectoryContents(filePath, options, indent + '    ');
                }
            }
        });
        
        if (!options.recursive || indent === '') {
            console.log(`\n${files.length} File(s)\n`);
        }
        
    } catch (err) {
        console.error(`Error reading directory: ${err.message}`);
    }
}

function parseArguments(args) {
    const options = {
        all: false,
        size: false,
        date: false,
        recursive: false
    };
    
    let dirPath = '.';
    
    args.slice(2).forEach(arg => {
        if (arg.startsWith('-')) {
            if (arg.includes('a')) options.all = true;
            if (arg.includes('s')) options.size = true;
            if (arg.includes('d')) options.date = true;
            if (arg.includes('r')) options.recursive = true;
        } else {
            dirPath = arg;
        }
    });
    
    return { dirPath, options };
}

const { dirPath, options } = parseArguments(process.argv);
displayDirectoryContents(dirPath, options);

console.log("\nUsage examples:");
console.log("node dirReader.js /path/to/directory");
console.log("node dirReader.js -a  # Show all files including hidden");
console.log("node dirReader.js -s  # Show file sizes");
console.log("node dirReader.js -d  # Show file dates");
console.log("node dirReader.js -r  # Recursively list directories and subdirectories");
console.log("node dirReader.js -asdr /path/to/directory  # Combine switches");
