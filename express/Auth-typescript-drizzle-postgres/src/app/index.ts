import express from "express";

function createExpressApplication (){
    const app = express();

    // Middlewares

    
    // Routes
    app.get("/", (req, res) => {
        return res.json({
            message: "welcome to my auth service"
        });
    });

    return app;
}

export {createExpressApplication}
