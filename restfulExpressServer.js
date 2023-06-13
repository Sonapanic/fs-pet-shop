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
    user: 'postgres',
    host: 'localhost',
    database: 'petshop',
    password: 'a',
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


petShopApp.post('/pets', (req, res) => {
    const { age, kind, name } = req.body
    if (age && kind && name) {
        pool.query('INSERT INTO pets (age, kind, name) VALUES ($1, $2, $3)', [age, kind, name], (err, data) => {
            if (err) {
                console.error(err)
                res.status(500)
            } else {
                res.status(201).send(`Your pet is here.`)
            }
        })
    } else {
        res.status(400).send('Awful request')
    }
})



petShopApp.put('/pets/:id', async (req, res) => {
    const { id } = req.params
    const { age, kind, name } = req.body
    if (age && kind && name) {
        try {
        let result = await pool.query('UPDATE pets SET age = $1, kind = $2, name = $3 WHERE id = $4 RETURNING *', [age, kind, name, id]) 
            if (result.rowCount === 0) {
                res.status(404).send('Pet not found')
            } else {
                res.json(result.rows[0])
            }
        } catch (err) {
            console.error
            res.status(500).send('Internal Server Error')
        }
    } else {
        res.status(400).send('Please include all fields')
    }
})


petShopApp.patch('/pets/:id', async (req, res) => {
    // destructuring the id and defining the request body as variable updates
    const { id } = req.params
    const updates = req.body
    // try catch block for async await syntax
    try {
        let query = 'UPDATE pets SET ' // defining base query string, to be updated later 
        const values = [] // defining empty array for later values
        Object.keys(updates).forEach((column, index) => { // calling a function on each element of the newly created array of keys from the request body (updates)
            query += `${column} = $${index + 1}, ` // adding the column name and index to the query string, solved for a 1 indexed database
            values.push(updates[column]) // pushing the column key into the values array
        })

        query = query.slice(0, -2) // slicing off the trailing comma and space
        query += ` WHERE id = $${Object.keys(updates).length + 1} RETURNING *` // adding the WHERE clause with the id being equal to the last index of the newly generated updates array
        values.push(id) // pushing the id into the values array

        const result = await pool.query(query, values) // setting up the pool query with the finalized query string and values array
        if (result.rowCount === 0) { // if there aren't any rows at the result, send a 404
            res.status(404).send('Pet not found')
        } else {
            res.json(result.rows[0]) // otherwise, send the updated pet data
        }
    } catch (err) { // if an error is caught, send a 500 status and log the error
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
})


petShopApp.delete('/pets/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM pets WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).send('Pet not found');
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
      


petShopApp.use((req, res) => {
    res.status(404).send('Not found')
})


petShopApp.listen(port, () => {
    console.log('Server\'s up on', port)
})


