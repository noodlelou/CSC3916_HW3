var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

//mongoose.connect(process.env.DB, { useNewUrlParser: true });
try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected to mongo atlas (movies)"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

// movie schema, all fields are required and actors is an array of strings
var MovieSchema = new Schema({
    Title: {type: String, required: true, index: {unique: true}, trim: true},
    'Year Released': {type: Number, required: true, trim: true},
    Genre: {type: String, required: true, trim: true},
    Actors: [String]
});


module.exports = mongoose.model('Movie', MovieSchema);