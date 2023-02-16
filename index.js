const express = require('express');
const mongoose = require('mongoose');
const { config } = require('dotenv');

const authRoute = require('./src/routes/auth');
const userRoute = require('./src/routes/user');
const productRoute = require('./src/routes/product');

const port = 3000;

config();

class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/api/auth', authRoute);
        this.app.use('/api/users/', userRoute);
        this.app.use('/api/products/', productRoute);
    }

    run() {
        this.app.listen(port, () => {
            console.log(`http://localhost:${port}`);
        });
    }
}

mongoose
    .set('strictQuery', true)
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connection succes');
    })
    .catch((e) => {
        console.log(e, '\n\nDatabase connection failed');
    });

new App().run();
