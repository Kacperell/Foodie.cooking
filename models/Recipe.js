const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a recpie name!'
    },
    // slug: String,
    description: {
        type: String,
        trim: true,
        required: 'Please enter a recpie description!'
    },
    ingredients: {
        type: [String],
        required: 'Please enter a ingredients!'
    },
    tags: {
        type: [String],
        required: 'Please enter a tags!'
    },
    created: {
        type: Date,
        default: Date.now
    },
    photo: {
        type: [String],
        required: 'Please add image!'
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Musisz podac autora'
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }]
}, {
    // zeby pokazc te virualnte poalcznei ale to nie potrzbne
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});



recipeSchema.index({
    name: 'text',
    description: 'text'
});

// recipeSchema.pre('save', function (next) {
//     if (!this.isModified('name')) {
//         next(); //skip it
//         return; //stop this fn 
//     }
//     this.slug = slug(this.name);
//     next();
// });



recipeSchema.statics.getTagsList = function () {
    return this.aggregate([{
            $unwind: '$tags'
        },
        {
            $group: {
                _id: '$tags',
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);
}



//find reviews where the stores _id property=== reciews store propoerty
recipeSchema.virtual('reviews', {
    ref: 'Review', //what model to link
    localField: '_id', //which filed on the recipe
    foreignField: 'recipe' //which field on the review
});


module.exports = mongoose.model('Recipe', recipeSchema);