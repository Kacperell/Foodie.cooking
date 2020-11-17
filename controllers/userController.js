const mongoose = require('mongoose');
const User = mongoose.model('User');
const Recipe = mongoose.model('Recipe');
const {
    promisify
} = require("es6-promisify");
const slug = require('slugs');

exports.loginForm = async (req, res) => {
    const tags = await Recipe.getTagsList();
    res.render('login', {
        title: 'Zaloguj',
        tags
    });
}
exports.registerForm = async (req, res) => {
    const tags = await Recipe.getTagsList();
    res.render('register', {
        title: 'Zarejestruj się',
        tags
    });
}

exports.validateRegister = async (req, res, next) => {
    // console.log(req);
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name').notEmpty();
    req.checkBody('email', 'The email in sno valid').isEmail();
    //to jest z express-validator
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        romove_extencion: false,
        gmail_remove_subaddress: false
    });

    const OldUserEmail = await User.find({
        'email': req.body.email
    });
    if (OldUserEmail != 0) {
        req.flash('error', ['Istnieje już użytkownik o podanym e-mailu. Wyślji reset hasła.']);
        res.render('login', {
            title: 'Register',
            body: req.body,
            flashes: req.flash()
        });
        return;
    }

    const slugName = slug(req.body.name);
    const OldUserName = await User.find({
        'slug': slugName
    });
    if (OldUserName != 0) {
        req.flash('error', ['Istnieje już użytkownik o podanej nazwie']);
        res.render('login', {
            title: 'Register',
            body: req.body,
            flashes: req.flash()
        });
        return;
    }
    req.checkBody('password', 'Password Cannot be blank!').notEmpty();
    req.checkBody('password-confirm', ' Confrim Password Cannot be blank!').notEmpty();
    req.checkBody('password-confirm', ' Oops! Your passwords don not match!').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('login', {
            title: 'Register',
            body: req.body,
            flashes: req.flash()
        });
        return; //stop the fn from running
    }
    next(); //there were no errors!
};

exports.register = async (req, res, next) => {
    const user = new User({
        email: req.body.email,
        name: req.body.name
    });

    // const register=promisify(User.register,User);
    // await register(user,req.body.password);
    User.register(user, req.body.password, function (err, user) {
        next();
    });

    // next();
};

exports.accountEdit = async (req, res) => {
    const tags = await Recipe.getTagsList();
    res.render('accountEdit', {
        title: 'Edit Your Account',
        tags
    });
};

exports.updateAccount = async (req, res) => {
    const slugName = slug(req.body.name);

    const updates = {
        name: req.body.name,
        email: req.body.email,
        about: req.body.about,
        slug: slugName
    };

    const OldUserName = await User.find({
        'name': {
            $regex: req.body.name,
            $options: "i"
        }
    });
    //jestli znaleziony uzytkownik to ten ktory wyslal zadanie to pomijamy bo to jego stara nazwa
    // console.log(OldUserName);
    // console.log(req.user);
    if (OldUserName != 0 && OldUserName[0]._id.toString() != req.user._id.toString()) {
        req.flash('error', ['Istnieje już użytkownik o podanej nazwie!']);
        res.redirect('back');
        return;
    }
    const user = await User.findOneAndUpdate({
        _id: req.user._id
    }, {
        $set: updates
    }, {
        new: true,
        runValidator: true,
        context: 'query'
    });

    if (req.body.email.toString() != req.user.email.toString()) {
        req.flash('succes', 'Zaktualizowano profil. Zaloguj się podając zaktualizowany email.');
        res.redirect('/register');
    } else {
        req.flash('succes', 'Zaktualizowano profil.');
        res.redirect('back');
    }


};


exports.checkUserName = async (req, res) => {
    const slugName = slug(req.query.q);
    const user = await User.find({
        'slug': slugName
    });
    let exist;
    if (user != 0) {
        exist = true;
    } else {
        exist = false;
    }
    res.json(exist);
}