const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.set('useCreateIndex', true);

mongoose.connect(
    'mongodb://localhost:27017/noderest',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

app.use(cors());
app.use(express.json());

require('./controllers/authController')(app);
require('./controllers/projectController')(app);
require('./controllers/testController')(app);

app.listen(3001);