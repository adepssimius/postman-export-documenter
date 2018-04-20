

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Welcome to the Postman API documentation generator. This requires Postman collections with version of 2.1 with a filename format "*.postman_collection.json"');

// read out the files in our input directory and figure out which ones are actually postman
let inputFileList = fs.readdirSync('./input');

let postmanInputFiles = [];
inputFileList.forEach(function(item) {
    if (item.search(/.+(.postman_collection.json)/g) >= 0)
        postmanInputFiles.push(item);
});


if (postmanInputFiles.length == 0) return console.log('No files with the correct name structure found in the input folder. Exiting.');

console.log('Select the input file you want to create API Docs for from the following list:');

for (i = 0; i < postmanInputFiles.length; i++) {
    console.log(i + '. ' + postmanInputFiles[i]);
};

rl.question('Selection? ', (selectedFile) => {
    rl.close();
    let postmanCollection = JSON.parse(fs.readFileSync('./input/' + postmanInputFiles[selectedFile]).toString());
    let thisLevel = postmanCollection;

    let parseLevel = null;
    parseAndAsk(thisLevel);

    function parseAndAsk(level) {
        console.log('Select a tree to navigate into or press enter to make documentation recursively from this level')
        let items = level['item'];
        for (i = 0; i < items.length; i++) {
            console.log(i + '. ' + items[i].name);
        }
        rl.question('Selection?', (selectedLevel) => {
            rl.close();

            if (selectedLevel = "\n")
                parseLevel = level;
            else {
                thisLevel = level[items[selectedLevel]];
                process.nextTick(parseAndAsk, level[items[selectedLevel]]);

            }
        });
    }
});