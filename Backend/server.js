const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log("connected to DB"))
    .catch((err)=> console.log(err));


    const contactRouter = require('./Router/routers');
    app.use('/api/contact',contactRouter);

app.listen(PORT,()=> console.log(`listening on port ${PORT}`));
