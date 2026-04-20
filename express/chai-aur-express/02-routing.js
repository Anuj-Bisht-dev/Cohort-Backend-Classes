const express = require('express');

function block_1_httpMethods() {
    return new Promise((resolve, reject) => {
        const app = express();
        app.use(express.json());

        const routes = {
            1: {
                id: 1,
                name: 'Dadar Andheri Express',
                direction: 'North'
            },
            2: {
                id: 2,
                name: 'kolaPuri pariwahan',
                direction: 'East'
            }
        }

        // uses when we want to add a new payload in db
        let nextId = 3;

        // only routes values
        app.get('/routes', (req, res) => {
            res.json(Object.values(routes));
        });


        // single routes with id
        app.get('/route/:id', (req, res) => {
            // const {id} = req.params;
            // const route = routes[id];

            const route = routes[req.params.id]
            if (!route) return res.status(404).json({ error: 'there is no train in this id' }); // if id is not mentioned
            res.json({ route })
        });


        // add resource in db
        app.post('/route', (req, res) => {
            // no validation no zod
            const newRoute = { id: nextId++, ...req.body }
            routes[newRoute.id] = newRoute; // it added like route = {id: {newRoute}}
            res.status(201).json(newRoute);
        });


        // update a payload from db
        app.put('/route/:id', (req, res) => {
            const id = req.params.id;
            if (!id || !routes[id]) return res.status(404).json({ error: 'The id is invalid data add nahi hoga' });
            routes[id] = { id: Number(id), ...req.body }; // typecase the id always be a number so client can't change it and id can be explicit 
            res.status(200).json(routes[id]);
        })


        // pratially update the db values
        app.patch('/route/:id', (req, res) => {
            const id = req.params.id;
            if (!id || !routes[id]) return res.status(404).json({ error: 'bhai jaan buchkar kar raha hai naa...' });
            routes[id] = { ...routes[id], direction: req.body.direction };
            res.status(200).json(routes[id]);
        });


        // delete a resource
        app.delete('/route/:id', (req, res) => {
            const id = req.params.id;
            if (!id || !routes[id]) return res.status(404).json({ error: 'id not found or invalid' });
            delete routes[id];
            res.status(204).end() // send request is successful but i have nothing to send (good practices)
            // res.json(routes);
        });


        // this is another way to write the route
        // app
        //     .route("/schedule")
        //     .get((req,res)=>{})
        //     .post((req,res)=>{})
        //     .put((req,res)=>{})
        //     .patch((req,res)=>{})
        //     .delete((req,res)=>{})

        // app.use('/api', (req, res) => {
        // it's a prefecth match (before moving on to get, post, etc it passes through this 'app.use') prefix matching
        // whenever the api will use during creating a route then it passes through here not other one like: '/schedule' only '/api'
        // })

        const server = app.listen(0, async () => {
            const port = server.address().port;
            const base = `http://127.1.1:${port}`

            try {

                //#region  //*=========== routesValue ===========
                const routesValueRes = await fetch(`${base}/routes`);
                const routesValueData = await routesValueRes.json();
                console.log(`GET /routes data: ${JSON.stringify(routesValueData)}`);
                console.log('++++++++++++++++++++');
                //#endregion  //*======== routesValue ===========


                //#region  //*=========== singleRoute ===========
                const singleRouteRes = await fetch(`${base}/route/2`);
                const singleRouteData = await singleRouteRes.json();
                console.log(`GET /route/2 data: ${JSON.stringify(singleRouteData)}`);
                console.log('++++++++++++++++++++');
                //#endregion  //*======== singleRoute ===========


                //#region  //*=========== sendRoute ===========
                const sendRouteRes = await fetch(`${base}/route`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'channei express',
                        direction: 'south'
                    })
                });
                const sendRouteData = await sendRouteRes.json();
                console.log(`POST /route data: ${JSON.stringify(sendRouteData)}`);
                console.log('++++++++++++++++++++');
                //#endregion  //*======== sendRoute ===========


                //#region  //*=========== UpdateRoute ===========
                const updateRouteRes = await fetch(`${base}/route/2`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'Mumbai Express',
                        direction: 'west'
                    })
                })
                const updateRouteData = await updateRouteRes.json();
                console.log(`PUT /route/2 data: ${JSON.stringify(updateRouteData)}`);
                console.log('+++++++++++++++++++++++++++');
                //#endregion  //*======== UpdateRoute ===========


                //#region  //*=========== PartiallyUpdateRoute ===========
                const partiallyUpdateRes = await fetch(`${base}/route/3`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        direction: 'north-west'
                    })
                });
                const partiallyUpdateData = await partiallyUpdateRes.json();
                console.log(`PATCH route/1 data: ${JSON.stringify(partiallyUpdateData)}`);
                console.log('+++++++++++++++++++++++++++');
                //#endregion  //*======== PartiallyUpdateRoute ===========


                //#region  //*=========== DeleteRoute ===========
                const DeletedRouteRes = await fetch(`${base}/route/2`, {
                    method: 'DELETE'
                });
                // const DeletedRouteData = await DeletedRouteRes.json()
                // console.log(`DELETE /route/2 data: ${JSON.stringify(DeletedRouteData)}}`);
                console.log(`DELETE /route/2 status: ${DeletedRouteRes.status}, ${DeletedRouteRes.statusText}`);
                console.log('+++++++++++++++++++++++++++++++');
                //#endregion  //*======== DeleteRoute ===========

            } catch (error) {
                // throw new Error("server is not running right now or crashed");
                console.log(error.message);
            }

            server.close(() => {
                console.log('server has served it\'s purpose. konichiwa!')
            })
        })

    });
}

// some additional but imp. information

// files/assets/style.css // it provide style.css in array as well as assets too..
// files/docs/readme.txt // same for that

// app.get('/route/*filepath', (req, res) => {
//     const filepath = req.params.filepath;
//     res.json({ filepath, type: 'wildcard' }) // the filepath type is array (wildcard meaning everything)
// })

async function main() {
    await block_1_httpMethods();

    process.exit(0);
}

main();


