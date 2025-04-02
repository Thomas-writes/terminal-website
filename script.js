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
let hobbiesFiles = ["workouts.txt", "music.txt", "projects.txt"]
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
                "- help: Show this help message"
            ];
            
            commands.forEach(command => {
                let commandLine = document.createElement('div');
                commandLine.textContent = command;
                output.appendChild(commandLine);
            });
            
            output.appendChild(document.createElement('br'));
        }
        else if (userInput.trim() === 'open resume.pdf' && curDirectory == `/professional/`) {
            window.open('resume.pdf', '_blank');
            output.appendChild(document.createElement('br'));
        }
        else if (userInput.trim() === 'open workouts.txt' && curDirectory == `/hobbies/`) {
            window.open('workouts.txt', '_blank');
            output.appendChild(document.createElement('br'));
        } 
        else if (userInput.trim() === 'open aboutme.txt' && curDirectory == `/professional/`) {
            fetch('./aboutme.txt')
                .then(response => response.text())
                //response.text() gets passed as aboutme
                //response.text() has the text of the file
                .then(aboutme => {
                    output.appendChild(document.createElement('br'));
                    let header = document.createElement('div');
                    header.textContent = `This is the content of aboutme.txt:`;
                    output.appendChild(header);
                    output.appendChild(document.createElement('br'));
                    let aboutmetext = document.createElement('div');
                    aboutmetext.textContent = aboutme;
                    aboutmetext.style.paddingLeft = "20px";
                    output.appendChild(aboutmetext);
                    output.appendChild(document.createElement('br'));
                });
            
        }
        else {
            let unknownCommand = document.createElement('div');
            unknownCommand.textContent = `${userInput}: command not found Type 'help' for list of commands.`;
            output.appendChild(document.createElement('br'));
            output.appendChild(unknownCommand);
            output.appendChild(document.createElement('br'));
        }
        
    }
});