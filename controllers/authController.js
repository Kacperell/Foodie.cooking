const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Recipe = mongoose.model('Recipe');

const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
    failureRedirect: '/register',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'Zalogowano🍕'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('succes', 'Wylogowano🖐 ');
    res.redirect('/');
};


exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return;
    } else {
        req.flash('error', 'Musisz być zalogowany!');
        res.redirect('/register');
    }
};


exports.forgot = async (req, res) => {
    //1 see if user with that email exists
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        //zmienic!
        req.flash('error', 'No account with that email exists'); // normalnie i tak powinismy napsisac ze rest zostal wysalny zeby nitk nie sprawdzic kto ma tam konta
        return res.redirect('/register');
    }
    //2 set reset tokens and expiry on ther account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; //1 hour form now  
    await user.save();
    //3 send them an email with the token
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;

    // await mail.send({
    //     user: user,
    //     filename: 'password-reset',
    //     subject: 'Reset hasła',
    //     resetURL: resetURL
    // });

    console.log('Token:', user.resetPasswordToken);

    req.flash('succes', `You have been email a password reset link. ${resetURL} `);
    // req.flash('succes', `Wysłano e-mail z linkiem do zaktualizowania hasła.`);
    //4 reditcet to login page
    res.redirect(`/register`);
};
exports.reset = async (req, res) => {



    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    });
    if (!user) {
        req.flash('error', 'Reset hasła jest nie prawidłaowy lub wygasł😕');
        return res.redirect('/register');
    }
    //if there is user,show the reset password form
    //console.log(user);
    const tags = await Recipe.getTagsList();
    res.render('reset', {
        title: 'Reset your Password',
        tags
    });
};


exports.confirmedPassowrds = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        next(); //keepit going!
        return;
    }
    req.flash('error', 'Hasła się różnią!');
    res.redirect('back');
};

exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    });
    if (!user) {
        req.flash('error', 'Reset hasła jest nie prawidłaowy lub wygasł😕');
        return res.redirect('/login');
    }
    user.setPassword(req.body.password, async (err, user) => {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        const updatedUser = await user.save();
        await req.login(updatedUser);
        req.flash('succes', 'Hasło zostało zresetowane!🤗');
        res.redirect('/');
    });
};