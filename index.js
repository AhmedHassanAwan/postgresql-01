
// import express from 'express';

// import  {prisma} from  "./lib/prisma.ts";
// import studentRouter from "./Router/studentrouter.js";

// const app = express();

// app.use(express.json());    

// app.use('/api', studentRouter);
// app.get('/', (req, res) => {
//     res.send('Welcome to the Student API');
// }); 



// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// }); 

    
import express from "express";

import {prisma} from "./lib/prisma.ts";
import studentRouter from "./Router/studentrouter.js";

const app = express();

app.use(express.json());

// routes
app.use("/api", studentRouter);

// home route
app.get("/", (req, res) => {
    res.send("Welcome to the Student API");
});

// server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});