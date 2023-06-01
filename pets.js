
let fs = require('fs')
const filePath = `pets.json`;

function displayError(){
    console.error('Usage: [read | create | update | destroy]');
    process.exit(1);
}

function readPets(index){
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const pets = JSON.parse(fileData)
        index === undefined ? console.log(pets) : console.log(pets[index])
    //    console.log(pets);
    } catch (error){
        throw error;
    }
}

function createPet()

function runCommand(){
    const command = process.argv[2];
    const petsIndex = process.argv[3];

    if (!command){
        displayError();
    }

    switch (command) {
        case 'read':
            readPets(petsIndex);
            break;
            default:
                console.error(`Unknown command: ${command}`);
                displayError();
        
    }
}
runCommand();