let http = require('http');
let fs = require('fs');

let server = http.createServer((req, res) => {

  let petsData = JSON.parse(fs.readFileSync('pets.json'));
  let petRegExp = /^\/pets\/(.*)$/;
  let match = req.url.match(petRegExp);

  if (req.method === 'GET') {

    if (req.url === '/pets' || req.url === '/pets/') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(petsData));

    } else if (match) {
        const petIndex = Number(match[1]);

      if (petIndex >= 0 && petIndex < petsData.length) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(petsData[petIndex]));

      } else {
        res.setHeader('Content-Type', 'text');
        res.statusCode = 404;
        res.end('Not Found, please provide a valid index')
      } 
    } else {
      res.setHeader('Content-Type', 'text');
      res.statusCode = 404;
      res.end('Not Found, please provide a valid filepath')
    } 
  } else {
    res.setHeader('Content-Type', 'text');
    res.statusCode = 404;
    res.end('Not Found, please provide a valid filepath')
  } 
})

  server.listen(10000, () => {
    console.log('Server is running on port 10000');
  });
  