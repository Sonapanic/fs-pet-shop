const express = require('express')
const fs = require('fs')
const path = require('path')
const petShopApp = express()
const port = 10000
petShopApp.use(express.urlencoded({ extended: false}))
const petsPath = path.join(__dirname, 'pets.json')
petShopApp.use(express.json())
const Pool  = require('pg').Pool



const pool = new Pool({
    user: 'benja',
    host: 'localhost',
    database: 'petshop',
    password: 'OASDIA',
    port: 5432
}) 

petShopApp.get('/:id', (req, res) => {
    let id = req.params.id
    if (id === 'pets/' || id === 'pets') {
    pool.query('SELECT * FROM pets', (err, data) => {
        if (err) {
            console.error(err)
        } 
        res.status(200).json(data.rows)
    })
} else {
    res.status(404).send('Not Found')
}
})


petShopApp.get('/pets/:id', (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('SELECT * FROM pets WHERE id = $1', [id], (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('Internal server error')
        } else if (data.rows.length === 0) {
            res.status(400).send('Bad request, try again, fool')
        } else {
           const resource = data.rows[0]
           res.status(200).send(resource)
        }
    })
})


petShopApp.patch('/pets/:id', (req, res) => {
    fs.readFile(petsPath, (err, data) => {
        let petData = JSON.parse(data)
        if (err) {
            console.error(err)
        } else {
            let newPet = req.body
            let id = req.params.id
            if (newPet.age || newPet.kind || newPet.name) {
                for (let key in petData[id]) {
                    if (newPet[key]) {
                        petData[id][key] = newPet[key]
                    }
                    
                }
                fs.writeFile(petsPath, JSON.stringify(petData), (err) => {
                    err ? console.error(err) : res.status(200).send(petData)
                })
            } else {
                res.status(400).send('Bad request')
            }
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


petShopApp.use((req, res) => {
    res.status(404).send('Not found')
})


petShopApp.listen(port, () => {
    console.log('Server\'s up on', port)
})


