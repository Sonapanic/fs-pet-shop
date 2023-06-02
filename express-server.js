let express = require('express')
let path = require('path')
let fs = require('fs')
let petShopApp = express()
let port = 10000
let petsPath = path.join(__dirname, 'pets.json')
petShopApp.use(express.json());
let bodyParser = require('body-parser')
petShopApp.use(express.urlencoded({ extended: false}))


petShopApp.get('/pets', (req, res) => {
    fs.readFile(petsPath, (err, data) => {
        err ? console.error : res.send(data)
    })
})

petShopApp.get('/pets/:id', (req, res) => {
    let id = req.params.id
    fs.readFile(petsPath, (err, data) => {
        if (err) {
            console.error(err)
        } else {
            let parsedData = JSON.parse(data)
            let parsedResponse = parsedData[id]
            res.status(200).send(parsedResponse)
        }
    })
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
