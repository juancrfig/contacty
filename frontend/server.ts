import { createServer } from 'https';
import { IncomingMessage, ServerResponse } from 'http';
import next from 'next';
import fs from 'fs';

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
    const server = createServer(httpsOptions, (req: IncomingMessage, res: ServerResponse) => {
        handle(req, res).catch((err) => {
            console.error("Error handling request:", err);
            res.statusCode = 500;
            res.end("Internal server error");
        });
    });

    server.listen({ port, host }, () => {
        console.log(`> Ready on https://${host}:${port}`);
    });
});
