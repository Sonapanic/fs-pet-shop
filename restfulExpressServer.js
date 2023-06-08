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






petShopApp.listen(port, () => {
    console.log('Server\'s up on', port)
})