const fs = require('fs');
const path = require('path');

// Directory containing the JSON palette files
const paletteDir = './palette/hex';

// Output directories for different formats
const outputDirs = {
    scss: './palette/scss',
    css: './palette/css',
    yaml: './palette/yaml'
};

// Ensure the output directories exist, creating them if necessary
Object.values(outputDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Function to generate files in SCSS, CSS, and YAML formats
const generateFiles = (fileName, colors) => {
    const baseName = path.basename(fileName, '.json');

    // Comment to be added at the beginning of each file
    const fileComment = `/* 
    This file is auto-generated.
    It contains the color palette for the Emberstone theme.
    For more information, visit: https://github.com/Emberstone-theme/palette 
*/\n\n`;

    const yamlComment = `# 
# This file is auto-generated.
# It contains the color palette for the Emberstone theme.
# For more information, visit: https://github.com/Emberstone-theme/palette 
#\n\n`;

    // Initialize content for each file type
    let scssContent = fileComment;
    let cssContent = `${fileComment}:root {\n`;
    let yamlContent = `${yamlComment}version: "0.0.1"\ncolors:\n`;

    // Iterate over each color category and shade
    for (const [category, shades] of Object.entries(colors)) {
        yamlContent += `  ${category}:\n`;
        for (const [shade, hex] of Object.entries(shades)) {
            const varName = `${category}-${shade}`;
            scssContent += `$${varName}: ${hex};\n`;
            cssContent += `    --${varName}: ${hex};\n`;
            yamlContent += `    ${shade}: "${hex}"\n`;
        }
    }

    cssContent += '}';

    // Write the generated content to the respective files
    fs.writeFileSync(path.join(outputDirs.scss, `${baseName}.scss`), scssContent);
    fs.writeFileSync(path.join(outputDirs.css, `${baseName}.css`), cssContent);
    fs.writeFileSync(path.join(outputDirs.yaml, `${baseName}.yaml`), yamlContent);
};

// Read all JSON files in the palette directory
const files = fs.readdirSync(paletteDir);
if (!files.length) return console.log('No palette files found.');

files.forEach(file => {
    if (path.extname(file) !== '.json') return;

    const filePath = path.join(paletteDir, file);
    const palette = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    generateFiles(file, palette.colors);
});

console.log('Palettes generated successfully!');
