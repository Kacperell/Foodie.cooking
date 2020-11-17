const mongoose = require('mongoose');

require('dotenv').config({
    path: 'variables.env'
});


mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.log(" mongoose error");
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});


require('./models/Recipe');
require('./models/User');
require('./models/Review');



const app = require('./app');


app.set('port', process.env.PORT || 8080);
const server = app.listen(app.get('port'), () => {
    console.log(`Listening on ${server.address().port}`);
});