const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const auth = require('./routes/authRoutes');
const link = require('./routes/linkRoutes');
const redirect = require('./routes/redirectRoutes')
const PORT = config.get('port') || 5000;
const MONGOURI = config.get('mongoUri');

const app = express();

app.use(express.json({ extended: true }));

app.use('/api/auth', auth);
app.use('/api/link', link);
app.use('/t', redirect);

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (_req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

async function start() {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`[app has been started on port ${PORT}...]`));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();