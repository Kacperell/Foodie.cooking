const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const Recipe = mongoose.model('Recipe');

exports.addReview = async (req, res) => {
    req.body.author = req.user._id;
    req.body.recipe = req.params.id;
    const newReview = new Review(req.body);
    await newReview.save();
    req.flash('succes', 'Zapisano komentarz');
    res.redirect('back');
};


const confirmAuthor = (review, user) => {
    // console.log(user._id);
    // console.log(review);

    if (!user._id) {
        throw Error('Musisz być twórcą.');
        return;
    } else if (!user._id == undefined) {
        throw Error('Musisz być twórcą.');
        return;

    } else if (review.author == undefined) {
        throw Error('Musisz być autor?.');
        return;
    } else if (!review.author.equals(user._id)) {
        throw Error('Musisz być twórcą.');
    }
}

exports.deleteReviewById = async (req, res) => {
    if (req.user == undefined) {
        throw Error('Musisz być twórcą.');
        // return;
    }
    const review = await Review.findOne(({
        _id: req.params.id
    }));

    confirmAuthor(review, req.user);
    await Review.findOneAndDelete(({
        _id: req.params.id
    }));
    // res.json(req.params);
    req.flash('succes', `Usunięto komentarz`);
    res.redirect(`back`);
};

exports.deleteAllReviewsByRecipeId = async (req, res, next) => {

    await Review.deleteMany(({
        recipe: req.params.id
    }));
    next();
};


exports.addLike = async (req, res) => {
    // req.body.author = req.user._id;
    // req.body.recipe = req.params.id;
    // const newReview = new Review(req.body);
    // await newReview.save();
    // req.flash('succes', 'Zapisano komentarz');
    // res.redirect('back');

    let operator;
    if (req.params.likes == 0) {
        operator = '$addToSet';
    } else {
        operator = req.params.likes.includes(req.user._id) ? '$pull' : '$addToSet'
    }
    // const like = req.user.likes.map(obj => obj.toString());
    // const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet'

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, {
        [operator]: {
            likes: req.user._id
        }
    }, {
        new: true
    });
    res.json(recipe);

};