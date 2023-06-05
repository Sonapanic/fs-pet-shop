let express = require('express')
let path = require('path')
let fs = require('fs')
let petShopApp = express()
let port = 10000
let petsPath = path.join(__dirname, 'pets.json')
petShopApp.use(express.json());
petShopApp.use(express.urlencoded({ extended: false}))


petShopApp.get('/pets', (req, res) => {
    fs.readFile(petsPath, (err, data) => {
        err ? console.error : res.status(200).send(JSON.parse(data))
    })
})

petShopApp.get('/pets/:id', (req, res) => {
    let letterExp = /^[A-Za-z]*$/
    let numExp = /^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/
    let id = req.params.id
    fs.readFile(petsPath, (err, data) => {
        let parsedData = JSON.parse(data)
        if (err) {
            console.error(err)
        } else if (id < 0 || id > parsedData.length) {
            res.status(404).send('Not found')
        } else  if (id.match(letterExp) || id.match(numExp)) {
            res.status(400).send('Letters are not valid parameters')
        } else if (id.match(/\d/)){
            let parsedResponse = parsedData[id]
            res.status(200).send(parsedResponse)
        } else {
            res.status(400).send('Bad request')
        }
    })
})

petShopApp.get('/', (req, res) => {
    res.status(404).send('Bad Request')
})

petShopApp.get('', (req, res) => {
    res.status(404).send('Bad Request')
})

petShopApp.post('/pets', (req, res) => {

    fs.readFile(petsPath, (err, data) => {
        if (err) {
            res.status(404).send('Not found')
        } else {
            let pets = JSON.parse(data) 
            if (typeof req.body === 'object') {
                pets.push(req.body)
                fs.writeFile(petsPath, JSON.stringify(pets), (err) => {
                    if (err) {
                        console.error(err)
                    } else {
                        res.status(200).send(pets)
                    }
                })
            } else {
                res.status(400).send('Not an object')
            }
        }
    })
})


petShopApp.listen(port, () => {
    console.log('Pet shop server\'s up on', port)
})
