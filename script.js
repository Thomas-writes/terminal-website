const terminal = document.getElementById('terminal');
const input = document.getElementById('input');
const output = document.getElementById('output');

terminal.addEventListener('click', () => {
    input.focus();
});

input.addEventListener('focus', () => {
    input.select();
});

let mainDirectories = ["professional", "hobbies"]
let professionalFiles = ["resume.pdf", "aboutme.txt", "projects.txt"];
let hobbiesFiles = ["workouts.md", "music.txt", "projects.txt"]
let curDirectory = `/`;

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
    
        let userInput = input.value.trim();
        let newLine = document.createElement('div');
        newLine.textContent = `$ ${curDirectory}${userInput}`;
        output.appendChild(newLine);

        input.value = '';

        if (userInput.trim() === 'clear') {
            output.innerHTML = '';
        }
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
        else if (userInput.startsWith('cd')) {
            let dirName = userInput.slice(3).trim();
            if (dirName === '..') {
                if (curDirectory !== '/') {
                    curDirectory = '/'
                    let changeDirOutput = document.createElement('div');
                    changeDirOutput.textContent = `Changed directory to ${curDirectory}`;
                    output.appendChild(document.createElement('br'));
                    output.appendChild(changeDirOutput);
                    output.appendChild(document.createElement('br'));
                    span.innerHTML = `$ ${curDirectory}`
                }else {
                    let errorOutput = document.createElement('div');
                    errorOutput.textContent = `Already at the root directory.`;
                    output.appendChild(document.createElement('br'));
                    output.appendChild(errorOutput)
                    output.appendChild(document.createElement('br'));
                }
            }
            else if (curDirectory == `/`){
                if (mainDirectories.includes(dirName)){
                    curDirectory = `${curDirectory}${dirName}/`;
                    let changeDirOutput = document.createElement('div');
                    changeDirOutput.textContent = `Changed directory to ${curDirectory}`;
                    output.appendChild(document.createElement('br'));
                    output.appendChild(changeDirOutput);
                    output.appendChild(document.createElement('br'));
                    span = document.getElementById('mainspan');
                    span.innerHTML = `$ ${curDirectory}`
                }else{
                    let errorOutput = document.createElement('div');
                    errorOutput.textContent = `Directory not found. Type 'help' for list of commands.`;
                    output.appendChild(document.createElement('br'));
                    output.appendChild(errorOutput)
                    output.appendChild(document.createElement('br'));
                }
            }else{
                let errorOutput = document.createElement('div');
                errorOutput.textContent = `Directory not found. Type 'help' for list of commands.`;
                output.appendChild(document.createElement('br'));
                output.appendChild(errorOutput)
                output.appendChild(document.createElement('br'));
            }
        }
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
        else if (userInput.startsWith('open')){
            let fileName = userInput.slice(5).trim();
            if (curDirectory == `/professional/`){
                if (fileName === "resume.pdf"){
                    window.open('resume.pdf', '_blank');
                    output.appendChild(document.createElement('br'));
                }else if (fileName === "aboutme.txt"){
                    window.open('aboutme.txt', '_blank');
                    output.appendChild(document.createElement('br'));
                }
            }else if (curDirectory == `/hobbies/`){
                if (fileName === "workouts.md"){
                    window.open('workouts.md', '_blank');
                    output.appendChild(document.createElement('br'));
                }
            }
        }else if (userInput.startsWith('cat')){
            let fileName = userInput.slice(4).trim();
            if (curDirectory == `/professional/`){
                if (fileName === "aboutme.txt"){
                    fetch('./aboutme.txt')
                    .then(response => response.text())
                    //response.text() gets passed as aboutme
                    //response.text() has the text of the file
                    .then(out => {catFunc(out, fileName);
                    });
                } 
            }else if (curDirectory == `/hobbies/`){
                if (fileName === "workouts.md"){
                    fetch('./workouts.md')
                    .then(response => response.text())
                    //response.text() gets passed as aboutme
                    //response.text() has the text of the file
                    .then(out => {catFunc(out, fileName);
                    });
                } 
            }
        }
        
            
            
        }
        else {
            let unknownCommand = document.createElement('div');
            unknownCommand.textContent = `${userInput}: command not found Type 'help' for list of commands.`;
            output.appendChild(document.createElement('br'));
            output.appendChild(unknownCommand);
            output.appendChild(document.createElement('br'));
        }
        
    }
);

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