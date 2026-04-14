const express = require('express');
// import express from 'express';

const app = express();

app.use(express.json);

app.get("/menu", (req, res) => {
    res.json({ itmes: ["non-veg thali", "biryani"] });
})

app.post("/order", (req, res) => {
    res.status(200).json({
        status: "recived",
        order: req.body
    })
})