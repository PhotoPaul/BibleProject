const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'public/content');
const dataFile = path.join(__dirname, 'src/data.js');

const categories = ['articles', 'videos', 'plans', 'posters'];

let registry = {
    articles: [],
    videos: [],
    plans: [],
    posters: []
};

categories.forEach(category => {
    const dir = path.join(contentDir, category);
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
        registry[category] = files;
        console.log(`Found ${files.length} items in ${category}`);
    }
});

const fileContent = `// Automatically generated media registry
export const mediaRegistry = ${JSON.stringify(registry, null, 2)};
`;

fs.writeFileSync(dataFile, fileContent, 'utf8');
console.log('Successfully updated src/data.js');
