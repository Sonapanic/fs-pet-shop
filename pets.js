let fs = require('fs')
let filePath = `pets.json`;
let fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

function displayError(){
    console.error('Usage: [read | create | update | destroy]');
    process.exit(1);
}

function readPets(index){
    try {
        let pets = JSON.parse(fileData)
        index === undefined 
        ? console.log(pets) 
        : index > pets.length || index < 0
        ? console.error('Usage: read pets.js INDEX')
        : console.log(pets[index])
    } catch (error){
        throw error;
    }
}

function createPet(age, kind, name) {
    let index = process.argv.length
    let newPet = {age: Number(age), kind: kind, name: name}
    fileData.push(newPet)
    fs.writeFile(filePath, JSON.stringify(fileData), (err) => {
        err ? console.log(err) : console.log(newPet)
    })
}

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