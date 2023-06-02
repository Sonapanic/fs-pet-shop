let fs = require('fs')
let filePath = `pets.json`;
let fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

// logs an error if there's no command beyond running the file, then exits process
function displayError(){
    console.error('Usage: [read | create | update | destroy]');
    process.exit(1);
} 

// try catch block with a nested ternary that logs the file data from pets.json to the console based on subcommand
function readPets(index){
    try {
        index === undefined 
        ? console.log(fileData) 
        : index > fileData.length || index < 0
        ? console.error('Usage: read pets.js INDEX')
        : console.log(fileData[index])
    } catch (error){
        throw error;
    }
}

// creates a pet object, then pushes it into the file data from pets.json and logs the new creation 
function createPet(age, kind, name) {
    let index = process.argv.length
    let newPet = {age: Number(age), kind: kind, name: name}
    fileData.push(newPet)
    fs.writeFile(filePath, JSON.stringify(fileData), (err) => {
        err ? console.log(err) : console.log(newPet)
    })
}

// removes the pet data from pets.json at the desired index 
function destroyPet(petIndex) {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const pets = JSON.parse(fileData);
      if (petIndex >= 0 && petIndex < pets.length) {
        pets.splice(petIndex, 1);
        fs.writeFileSync(filePath, JSON.stringify(pets));
        console.log('Pet destroyed successfully.');
      } else {
        console.error('Invalid pet index.');
      }
    } catch (error) {
      throw error;
    }
  }

// switch cases for the different subcommands when running the file. Establishes the required arguments for each case.
function runCommand(){
    let command = process.argv[2];
    
    if (!command){
        displayError();
    }
    switch (command) {
        case 'read':
            let petsIndex = process.argv[3];
            readPets(petsIndex);
            break;
        case 'create':
            let age = process.argv[3]
            let kind = process.argv[4]
            let name = process.argv[5]
            age === undefined || kind === undefined || name === undefined ? console.error('Usage: pets.js create AGE KIND NAME') : createPet(age, kind, name)
            break;
        case 'destroy': 
            let index = process.argv[3]
            destroyPet(index)
            break;
        case 'update': 


            default:
                console.error(`Unknown command: ${command}`);
                displayError();
    }
}
runCommand();