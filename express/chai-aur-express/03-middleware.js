const express = require('express');

function block_1_middleware() {
    return new Promise((resolve, reject) => {
        const app = express();
        app.use(express.json()); // middleware 33-lakhs only
        // bhai sahab mil ke jana

        // there are four parameters handler takes:
        // app.use((req, res, next, error) => {
        // });
        // but usually it takes there params for normal and four for error middleware
        // the next takes the responsiblity of passes things to next phase (can be a middleware or router)

        // req logger middleware -- our own winston
        const logs = [];

        app.use((req, res, next) => {
            // can be add to database.
            // console log everything.
            // write in some file.

            const entryLog = `${req.method}: ${req.url}, ${Date.now()}`;
            logs.push(entryLog);
            console.log(`[Logs] -- ${entryLog}`);

            // if your request is hangs forever so, u might missed next() somewhere in any middleware.
            next();
        });

        // request time tracker -- using middleware
        app.use((req, res, next) => {
            req.startTime = Date.now();

            res.on('finish', () => {
                const duration = Date.now() - req.startTime;
                console.log(`[timmer] -- ${req.method}: ${req.url} took ${duration}ms`);
            });

            next();
        });

        app.get('/route', (req, res) => {
            res.json('all thing are done here');
        });

        const server = app.listen(0, async () => {
            const port = server.address().port;
            const base = `http://127.1.1:${port}`;

            try {
                const routeReq = await fetch(`${base}/route`);
                const routeData = (await routeReq).json();
                console.log(JSON.stringify(routeReq));

                // TODO:
            }
            catch (err) {
                console.log(err.message);
            }


            server.close(() => {
                console.log('server has served it\'s purpose. konichiwa!');
                resolve();
            });
        });

    });
}

async function main() {
    await block_1_middleware();

    process.exit(0);
}

main();
