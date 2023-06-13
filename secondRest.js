import express from 'express'
import pg from 'pg'
const { Pool } = pg
const port = 10001

const pool = new Pool ({
    user: 'postgres', 
    host: 'localhost',
    database: 'petshop',
    password: "a",
    Port: 5432
})


const app = express()
app.use(express.json())



app.get('/:id', async (req, res) => {
    const { id } = req.params
    if (id === 'pets' || id === 'pets/') {
        try {
            const result = await pool.query('SELECT id, age, kind, name FROM pets')
            res.status(200).send(result.rows)

        } catch (err) {
            console.error(err)
            res.status(500).send('Internal Server Error')
        }
    } else {
        res.status(400).send('Bad Request')
    }
})


app.get('/pets/:id', async (req, res) => {
    const { id } = req.params
    try { 
        const result = await pool.query('SELECT age, kind, name FROM pets WHERE id = $1', [id])
        if (result.rows.length === 0) {
            res.status(404).send('Nothing was found here try another id.')
        } else {
            res.status(200).send(result.rows[0])
        }
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
})




app.post('/pets', async (req, res) => {
    const { age, kind, name } = req.body;
    try {
      const result = await pool.query('INSERT INTO pets (age, kind, name) VALUES ($1, $2, $3) RETURNING *', [age, kind, name]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error inserting pets into database');
    }
  });

app.use((req, res) => {
    res.status(404).send('Not found')
})


app.listen(port, () => {
    console.log('Petshop is open for business on port', port)
})