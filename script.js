//global variables
const terminal = document.getElementById('terminal');
const input = document.getElementById('input');
const output = document.getElementById('output');
//used for tab-complete
let maxKeys = []
let autoCompleteIndex = 0
let original_input = ""

terminal.addEventListener('click', () => {
    input.focus();
});

input.addEventListener('focus', () => {
    input.select();
});

let mainDirectories = ["professional", "hobbies"]
let professionalFiles = ["resume.md", "projects.md", "aboutme.txt"];
let hobbiesFiles = ["workouts.md"]
let curDirectory = `/`;
let span = document.getElementById('mainspan');

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
    
        let userInput = input.value.trim();
        let newLine = document.createElement('div');
        newLine.textContent = `$ ${curDirectory}${userInput}`;
        output.appendChild(newLine);

        input.value = '';
        //clear function
        if (userInput.trim() === 'clear') {
            output.innerHTML = '';
        }
        //ls function
        else if (userInput.trim() === 'ls'){
            output.appendChild(document.createElement('br'));
            let lsLine = document.createElement('div');
            lsLine.textContent = ` `
            
            if (curDirectory == `/`){
                for (let i = 0; i < mainDirectories.length; i++){
                    lsLine.textContent += `${mainDirectories[i]} `
                }
            }else if (curDirectory == `/professional/`){
                for (let i = 0; i < professionalFiles.length; i++){
                    lsLine.textContent += `${professionalFiles[i]} `
                }
            }else if (curDirectory == `/hobbies/`){
                for (let i = 0; i < hobbiesFiles.length; i++){
                    lsLine.textContent += `${hobbiesFiles[i]} `
                }
            }
            output.appendChild(lsLine)
            output.appendChild(document.createElement('br'));
        }
        //cd function
        else if (userInput.startsWith('cd')) {
            let dirName = userInput.slice(3).trim();
            if (dirName === '..') {
                if (curDirectory !== '/') {
                    curDirectory = '/'
                    let changeDirOutput = document.createElement('div');
                    changeDirOutput.textContent = `Changed directory to ${curDirectory}`;
                    itemWithBr(changeDirOutput);
                    span.innerHTML = `$ ${curDirectory}`
                }else {
                    let errorOutput = document.createElement('div');
                    errorOutput.textContent = `Already at the root directory.`;
                    itemWithBr(errorOutput);
                }
            }
            else if (curDirectory == `/`){
                if (mainDirectories.includes(dirName)){
                    curDirectory = `${curDirectory}${dirName}/`;
                    let changeDirOutput = document.createElement('div');
                    changeDirOutput.textContent = `Changed directory to ${curDirectory}`;
                    itemWithBr(changeDirOutput);
                    span.innerHTML = `$ ${curDirectory}`
                }else{
                    let errorOutput = document.createElement('div');
                    errorOutput.textContent = `Directory not found. Type 'help' for list of commands.`;
                    itemWithBr(errorOutput);
                }
            }else{
                let errorOutput = document.createElement('div');
                errorOutput.textContent = `Directory not found. Type 'help' for list of commands.`;
                itemWithBr(errorOutput);
            }
        }
        //help function
        else if (userInput === "help") {
            let helpOutput = document.createElement('div');
            helpOutput.textContent = `Available commands:`;
            output.appendChild(document.createElement('br'));
            output.appendChild(helpOutput);
            
            const commands = [
                "- ls: List directories and files in current path",
                "- cd [directory]: Change to a directory",
                "- clear: Clear the terminal screen",
                "- open [file]: open this file in a new tab",
                "- help: Show this help message",
                "- cat: [file]: Open the file in terminal"
            ];
            
            commands.forEach(command => {
                let commandLine = document.createElement('div');
                commandLine.textContent = command;
                output.appendChild(commandLine);
            });
            
            output.appendChild(document.createElement('br'));
        }
        //open function
        else if (userInput.startsWith('open')){
            let fileName = userInput.slice(5).trim();
            if (curDirectory == `/professional/`){
                if (fileName === "resume.md"){
                    fetch('./Resume.md')
                        .then(response => response.text())
                        .then(markdownText => openMarkdownInNewTab(markdownText));
                    output.appendChild(document.createElement('br'));
                }
                else if (fileName === "aboutme.txt"){
                    window.open('aboutme.txt', '_blank');
                    output.appendChild(document.createElement('br'));
                }
                else if (fileName === "projects.md"){
                    fetch('./projects.md')
                        .then(response => response.text())
                        .then(markdownText => openMarkdownInNewTab(markdownText));
                    output.appendChild(document.createElement('br'));
                }
                else{
                    errorOutput();
                }
            }
            else if (curDirectory == `/hobbies/`){
                if (fileName === "workouts.md"){
                    fetch('./workouts.md')
                        .then(response => response.text())
                        .then(markdownText => openMarkdownInNewTab(markdownText));
                    output.appendChild(document.createElement('br'));
                }
                else{
                    errorOutput();
                }
            }
            else{
                errorOutput();
            }
        }
        //cat function
        else if (userInput.startsWith('cat')){
            let fileName = userInput.slice(4).trim();
            if (curDirectory == `/professional/`){
                if (fileName === "aboutme.txt"){
                    fetch('./aboutme.txt')
                    .then(response => response.text())
                    //response.text() gets passed as out short for output - same for all cat calls
                    //response.text() has the text of the file
                    .then(out => {catFunc(out, fileName);
                    });
                }
                else if (fileName === "resume.md"){
                    fetch('./Resume.md')
                    .then(response => response.text())
                    .then(out => {catFunc(out, fileName);
                    });
                }
                else if (fileName === "projects.md"){
                    fetch('./projects.md')
                    .then(response => response.text())
                    .then(out => {catFunc(out, fileName);
                    });
                }
                else{
                    errorOutput();
                }
            }else if (curDirectory == `/hobbies/`){
                if (fileName === "workouts.md"){
                    fetch('./workouts.md')
                    .then(response => response.text())
                    .then(out => {catFunc(out, fileName);
                    });
                }
                else{
                    errorOutput();
                }
            }else{
                errorOutput();
            }
        }
        else {
            let unknownCommand = document.createElement('div');
            unknownCommand.textContent = `${userInput}: command not found Type 'help' for a list of commands.`;
            itemWithBr(unknownCommand);
        }    
    }else if (event.key == "Tab"){
        event.preventDefault()

        let curInput = input.value;
        let matchingObject = {};
        let matchCount = 0;
        let listOfCommands = ["ls", "cd", "cat", "help", "open", "clear"];
        let curInputList = curInput.split(" ")
        if (maxKeys.length > 0){
            input.value = maxKeys[autoCompleteIndex];
            //mod sends it back to 0
            autoCompleteIndex = (autoCompleteIndex + 1) % maxKeys.length;
        }
        if (curInputList.length == 1){
            for (let i = 0; i < listOfCommands.length; i++){
                matchCount = 0;
                for (let j = 0; j < listOfCommands[i].length; j++){
                    if (j < curInput.length){
                        if (listOfCommands[i][j] == curInput[j]){
                            matchCount++;
                        }else {
                            break;
                        }
                    }
                }
                matchingObject[listOfCommands[i]] = matchCount;
            }
            //thank you to the person who posted this online - finds max value and gives that key
            let maxValue = Math.max(...Object.values(matchingObject));
            if (maxValue == 0){
                maxKeys = [];
                autoCompleteIndex = 0;
                return;
            }
            if (maxKeys.length > 0) {
                return;
            }
            maxKeys = Object.keys(matchingObject).filter(key => matchingObject[key] === maxValue);
            console.log(maxKeys);
            
            input.value = maxKeys[0];
            autoCompleteIndex = 1;
        }
    }
});

function catFunc(out, fileName) {
    output.appendChild(document.createElement('br'));
    let header = document.createElement('div');
    header.textContent = `This is the content of ${fileName}:`;
    output.appendChild(header);
    output.appendChild(document.createElement('br'));
    let outputtext = document.createElement('div');
    outputtext.innerText = out;
    outputtext.style.paddingLeft = "20px";
    output.appendChild(outputtext);
    output.appendChild(document.createElement('br'));
};

function openMarkdownInNewTab(markdownText) {
    let text = marked.parse(markdownText);
    let newTab = window.open();
    
    if (newTab) {
        newTab.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.css">
            <style>
                body {
                    margin: auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
            </style>
        </head>
        <body class="markdown-body">
            ${text}
        </body>
        </html>`);
        newTab.document.close();
    }
}


function itemWithBr(element){
    output.appendChild(document.createElement('br'));
    output.appendChild(element);
    output.appendChild(document.createElement('br'));
};

function errorOutput(){
    let errorText = document.createElement('div');
    errorText.innerHTML = `File not found. Type 'help' for a list of commands and 'ls' for files and directories`;
    output.appendChild(document.createElement('br'));
    output.appendChild(errorText);
    output.appendChild(document.createElement('br'));
}