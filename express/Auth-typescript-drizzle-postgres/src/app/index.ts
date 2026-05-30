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

    app.get("/health", (req, res)=>{
        return res.json({
            message: "health is upto date now"
        }) 
    });

    return app;
    }

export {createExpressApplication}
