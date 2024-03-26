const http = require('http');

const hostname = '127.0.0.1';
const port = 4001;

const server = http.createServer((req: any, res: any) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hola Mundo');
});

server.listen(port, () => {
    console.log(`El servidor se está ejecutando en puerto ${port}`);
});