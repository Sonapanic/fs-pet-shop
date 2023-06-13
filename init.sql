-- creating petshop db
DROP DATABASE IF EXISTS petshop;
CREATE DATABASE petshop;

-- Connecting to the petshop db
\c petshop

-- creating the pets table 
CREATE TABLE IF NOT EXISTS pets (
    id serial primary key, 
    age int, kind text, 
    name text
);

-- seeding pets with 4 sweet babies
PREPARE addPets (int, text, text) AS INSERT INTO pets (age, kind, name) VALUES ($1, $2, $3);
EXECUTE addPets(2, 'Cat', 'Sammy');
EXECUTE addPets(2, 'Chug', 'Tiabeanie');
EXECUTE addPets(7, 'Cat', 'Ollie');
EXECUTE addPets(5, 'Cat', 'Althea');

