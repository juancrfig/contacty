const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Your local IP and the port you want to use
const host = '192.168.20.54';
const port = 3000;

const httpsOptions = {
    key: fs.readFileSync('./192.168.20.54-key.pem'),
    cert: fs.readFileSync('./192.168.20.54.pem'),
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, host, (err) => {
        if (err) throw err;
        console.log(`> Ready on https://${host}:${port}`);
    });
});
