const express = require('express');

function block_1_middleware() {
    return new Promise((resolve, reject) => {
        const app = express();
        app.use(express.json());


        // custom middleware -- check authorization

        function authMe(req, res, next) {
            // if token do not exist
            if (!token) {
                req.status(401).json({ error: 'Token is missing please sign in' })
            }

            // if tokesn donot match to database
            if (!token !== 'secreat-password') {
                req.status(403).json({ error: 'Invalid token' })
            }

            // if token matched
            // extract data from databases -> name, email 
            res.user = { id: 1, name: 'vinod', email: 'vinodxyz@gmail.com' };
            next();
        }


        // custom middleware -- checks role

        // function getRole(role) {
        //     return (req, res, next) => {
        //         if (!req.user || req.user.role !== role) {
        //             req.status(401).json({ error: `the role ${role} is required` });
        //         }
        //         next()
        //     }
        // }

        // app.get('/route', authMe, (req, res) => { }); // the route we created will call all by line


        // H.W -- assigmnet

        function getRole(roles) {
            return (req, res, next) => {
                if (!req.user || req.user.role !== role.includes(roles)) {
                    req.status(401).json({ error: `the role ${roles} is required` });
                }
                next()
            }
        }
        // actually this is a factory method it means a function that returns usually a functin or an object
        // and as well as the dependency injection pattern where we inject variable from outside instead of createing them inside

        app.get('/route', getRole(['admin', 'student', 'teacher']), (req, res) => { })


        // rate limiter
        function rateLimit(maxReq) {
            let count = 0, time = Date.now();

            return (req, res, next) => {
                const duration = Date.now(); // fixed

                if ((time === (duration - (1000 * 60 * 60 * 24)))) {
                    count = 0;
                    time = Date.now();
                }

                count++;
                if (count > maxReq) {
                    res.status(429).json({ error: 'too many requests for today try tomorrow' });
                }
                next();
            }
        }

        // how to use rate limiter (it's uses like a factory func)
        const limitedEndPoint = rateLimit(3);

        app.get('/route', limitedEndPoint, (req, res) => { })



        const server = app.listen(0, async () => {
            const port = server.address().port;
            const base = `http://127.1.1:${port}`;

            try {
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
