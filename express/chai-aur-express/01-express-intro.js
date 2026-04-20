const express = require('express');

function block_1_basicServer() {
    return new Promise((resolve, reject) => {
        const app = express();
        app.use(express.json()); // express by default don't work with json so, write this line for that

        app.get('/menu', (_, res) => {
            // .json does = serialization(obj to str) and Content-Type: 'application/json'
            res.json({
                items: ['veg/non-veg thali',
                    'biryani'
                ]
            });
        });

        // chaicode.com/cart?q=biryani&limit=5
        // queries starts when the question-mark is added in url -> (the right portion is query params)
        app.get('/search', (req, res) => {
            const { q, limit } = req.query;
            res.json({
                query: q,
                limit: limit || '10'
            })
        });

        // route parameters
        // :id is a placeholder (dynamic path)
        app.get('/menu/:id', (req, res) => {
            const { id } = req.params; // req.params contains all the parameter of objects as key
            res.json({
                item: id,
                price: 129
            })
        });

        app.post('/order', (req, res) => {
            const order = req.body;
            // status set the status of htttp nd json send serialized data
            res.status(201).json({
                status: 'created',
                order
            });
        });

        // handling routes - get, post if we wanna use front-end with it too..
        // here 0 will assign any random port to the server
        const server = app.listen(0, async () => {
            const port = server.address().port;
            const base = `http://127.0.0.1:${port}`;

            try {

                const menuRes = await fetch(`${base}/menu`);
                const menuData = await menuRes.json();
                console.log('GET /menu data', JSON.stringify(menuData));
                console.log('++++++++++++++++++++++++++');


                const searchRes = await fetch(`${base}/search`);
                const searchData = await searchRes.json();
                console.log('GET /search data', JSON.stringify(searchData));
                console.log('++++++++++++++++++++++++++');


                const menuItemsRes = await fetch(`${base}/menu/41`);
                const menuItemsData = await menuItemsRes.json();
                console.log('GET /menu items data', JSON.stringify(menuItemsData));
                console.log('++++++++++++++++++++++++++');


                // the object part is additional while handling post requests
                const orderRes = await fetch(`${base}/order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        body: JSON.stringify({
                            dish: 'biryani',
                            quantity: 4
                        })
                    }
                });
                const orderData = await orderRes.json();
                console.log('/order post data', JSON.stringify(orderData));
                console.log('++++++++++++++++++++++++++');

            }
            catch (err) {
                console.log(err)
            }

            // closes server gracefully with a message and resolve the promise 
            server.close(() => {
                console.log('block 1 is served....');
                resolve()
            })
        })
    });
}

function block_2_response() {
    return new Promise((resolve) => {
        const app = express()

        // if want to send a simple plane text then use
        app.get('/text', (req, res) => {
            res.send('welcome to mywebsite');
        });

        // to send json format response
        app.get('/json', (req, res) => {
            res.json({
                framework: 'expresso-shot',
                version: '12.14.2'
            });
        });


        // to create not-found or error route
        app.get('/not-found', (req, res) => {
            res.status(404).json({
                error: 'page not found lol'
            })
        });


        // to create a health route for (auto scaling group)ASG
        app.get('/health', (req, res) => {
            res.sendStatus(200);
        })
        // 200 is the ok status


        // redirectoring to another page
        app.get('/old-website', (req, res) => {
            // add entry in db to see how many peoples are still visting old route (add condition here)
            res.redirect(301, '/new-website')
        });
        // this is specia method where use both status and the redirecting route (not .methods futher)
        // 301 is the redirecting code


        // for adding custom headers
        app.get('/custom-headers', (req, res) => {
            res.set('X-Powered-By-Me', 'maje-kar-ladle');
            res.set('X-Request-Id', '123098');
            res.json();
            // used in CORS, rate limiting, caching, tracing
        });


        // for sending a non body response
        app.get('/no-content', (req, res) => {
            res.status(204).end();
        })

        const server = app.listen(0, async () => {
            const port = server.address().port;
            const base = `http://127.1.1:${port}`;

            try {
                //TODO:

                const textRes = await fetch(`${base}/text`);
                console.log(`GET /text Data: ${JSON.stringify(textRes)}`)
                console.log('++++++++++++++++++++++++++');


                const jsonRes = await fetch(`${base}/json`);
                const jsonData = await jsonRes.json();
                console.log(`GET /json Data: ${JSON.stringify(jsonData)}`);
                console.log('++++++++++++++++++++++++++');


                const notFoundRes = await fetch(`${base}/not-found`);
                const notFoundData = await notFoundRes.json()
                console.log(`GET /not-found Data: ${JSON.stringify(notFoundData)}`);
                console.log(`GET /not-found Data: ${JSON.stringify(notFoundRes.status)}`); // status code of the response
                console.log(`GET /not-found Data: ${JSON.stringify(notFoundRes.statusText)}`); // status meaning in text
                console.log('++++++++++++++++++++++++++');


                const healthRes = fetch(`${base}/health`);
                console.log(`GET /health Data: ${JSON.stringify((await healthRes).status)}`); // status code of response
                console.log('++++++++++++++++++++++++++');


                const redirectRes = fetch(`${base}/old-website`);
                console.log(`GET /redirect Data: ${JSON.stringify((await redirectRes).url)}`); // gives the url of the redirected website
                console.log(`GET /redirect Data: ${JSON.stringify((await redirectRes).redirected)}`); // is redirected in boolean
                console.log('++++++++++++++++++++++++++');


                const customHeadersRes = fetch(`${base}/custom-headers`);
                console.log(`GET /custom headers Data: ${JSON.stringify((await customHeadersRes).headers)}`);
                console.log('++++++++++++++++++++++++++');


                const noContentRes = fetch(`${base}/no-content`);
                console.log(`GET /no content Data: ${JSON.stringify((await noContentRes).status)}`);
                console.log(`GET /no content Data: ${JSON.stringify((await noContentRes).statusText)}`); // status code meaning in text
                console.log('++++++++++++++++++++++++++');



            } catch (error) {
                throw new Error("server is crashed so, can't access it");
                console.log(Error)
                console.log(error.message);
            }

            server.close(() => {
                console.log("block 2 is also served....");
                resolve();
            })
        })

    });

}


async function main() {
    await block_1_basicServer();
    await block_2_response();

    // forcefuly shutdown the process don't use it in actuall codebase
    process.exit(0);
}

main();
