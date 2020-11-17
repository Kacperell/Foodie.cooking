const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
// const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const slug = require('slugs');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invaild Email Adress'],
        required: 'Please Supply an email adress'
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    slug: String,
    about: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hearts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Recipe'
    }]
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});
userSchema.plugin(mongodbErrorHandler); //pokazuje ladne errory

/////////////////
userSchema.pre('save', function (next) {
    if (!this.isModified('name')) {
        next(); //skip it
        return; //stop this fn 
    }
    this.slug = slug(this.name);
    next();
});

module.exports = mongoose.model('User', userSchema);