const express = require('express')
const fs = require('fs')
const path = require('path')
const petShopApp = express()
const port = 10000
petShopApp.use(express.urlencoded({ extended: false}))
const petsPath = path.join(__dirname, 'pets.json')
petShopApp.use(express.json())


petShopApp.get('/pets/', (req, res) => {
    fs.readFile(petsPath, (err, data) => {
        err ? console.error(err) : res.status(200).send(JSON.parse(data))
    })
})
// CONSOLIDATE WHEN ABLE
petShopApp.get('/pets', (req, res) => {
    fs.readFile(petsPath, (err, data) => {
        err ? console.error(err) : res.status(200).send(JSON.parse(data))
    })
})

petShopApp.get('/pets/:id', (req, res) => {
    fs.readFile(petsPath, (err, data) => {
        const id = req.params.id
        const petData = JSON.parse(data)
        if (err) {
            console.error(err)
        } else if (id >= 0 && id <= petData.length - 1) {
            res.status(200).send(petData[id])
        } else {
            res.status(400).send('Bad request, try again, fool')
        }
    })
})


petShopApp.post('/pets', (req, res) => {
    fs.readFile(petsPath, (err, data) => {
        if (err) {
            console.error(err) 
        } else {
            const petData = JSON.parse(data) 
            if (typeof req.body === 'object') {
                petData.push(req.body)
                fs.writeFile(petsPath, JSON.stringify(petData), (err) => {
                    if (err) {
                        console.error(err)
                    } else {
                        res.status(200).send(petData)
                    } 
                })
            } else {
                res.status(400).send('Nice try, use an object next time')
            }
        }
    })
})


petShopApp.patch('/pets/:id', (req, res) => {
    fs.readFile(petsPath, (err, data) => {
        const petData = JSON.parse(data)
        if (err) {
            throw err
        } else {
            const newPet = req.body
            const id = req.params.id
            if (newPet.age && newPet.kind && newPet.name) {
                petData[id].age = newPet.age
                petData[id].kind = newPet.kind
                petData[id].name = newPet.name
            } else if (newPet.kind && newPet.age) {
                petData[id].kind = newPet.kind
                petData[id].age = newPet.age
            } else if (newPet.name && newPet.kind) {
                petData[id].name = newPet.name
                petData[id].kind = newPet.kind
            } else if (newPet.age && newPet.name) {
                petData[id].age = newPet.age
                petData[id].name = newPet.name
            } else if (newPet.age) { 
                petData[id].age = newPet.age
            } else if (newPet.kind) {
                petData[id].kind = newPet.kind
            } else if (newPet.name) {
                petData[id].name = newPet.name
            } else if (newPet = {}) {
                res.status(400).send('Forgot data, you silly goose')
            } else {
                res.status(400).send('IDEK what you\'re trying to do here')
            }
            fs.writeFile(petsPath, JSON.stringify(petData), (err) => {
                err ? console.error(err) : res.send(petData)
            })
        } 
    }) 
})


petShopApp.delete('/pets/:id', (req, res) => {
    fs.readFile(petsPath, (err, data) => {
        let petData = JSON.parse(data)
        if (err) {
            console.error(err) 
        } else {
            const id = req.params.id
            let formerPet = petData[id]
            petData.splice(formerPet, 1)
            fs.writeFile(petsPath, JSON.stringify(petData), (err) => {
                if (err) {
                    console.error(err)
                } else {
                    res.status(200).send('Pet is gone now.')
                }
            })
        }
    })
})


petShopApp.listen(port, () => {
    console.log('Server\'s up on', port)
})