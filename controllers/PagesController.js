const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');
const User = mongoose.model('User');
const multer = require('multer');
const uuid = require('uuid');

const sharp = require('sharp');
const {
    Storage
} = require('@google-cloud/storage');
const storage = new Storage({
    // keyFilename: path.join(__dirname, process.env.GCS_KEYFILE),
    keyFilename: process.env.GCS_KEYFILE,
    // keyFilename: "./Foodie-a8cc9cb4f4f5.json",
    projectId: process.env.GCLOUD_PROJECT
});
const bucket = storage.bucket(process.env.GCS_BUCKET);
const multerOptions = {
    // storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({
                message: 'That filetype isnt allowd! '
            }, false);
        }
    }
};

exports.home = (req, res) => {
    console.log(res);
    res.render('home', {
        title: 'Foodie 🥝'
    });

};
exports.addRecipe = async (req, res) => {
    const tags = await Recipe.getTagsList();
    res.render('editRecipe', {
        title: 'Dodaj przepis!🥝',
        tags
    });
};

exports.upload = multer(multerOptions).array('photo', [5]);

exports.resize = async (req, res, next) => {
    const photos = [];
    // juz wczneisej dodane
    if (req.body.photo) {
        if (typeof (req.body.photo) == 'string') {
            // jestli strin tzn ze tylko jedno zdjecie stare
            photos.push(req.body.photo);
        } else {
            for (let i = 0; i < req.body.photo.length; i++) {
                photos.push(req.body.photo[i]);
            }
        }

    }
    if (req.files.length != 0) {
        for (let i = 0; i < req.files.length; i++) {
            const extension = req.files[i].mimetype.split('/')[1];
            const image = `${uuid.v4()}.${extension}`;
            const reducedBuffer = await sharp(req.files[i].buffer).resize(800, sharp.AUTO).toBuffer();
            const blob = await bucket.file(`${image}`);
            // await photos.push(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
            await photos.push(`${blob.name}`);
            const stream = blob.createWriteStream({
                resumable: false,
                contentType: req.files[i].mimetype,
                predefinedAcl: 'publicRead',
            })
            stream.on('error', err => {
                console.log(err);
            });
            stream.end(reducedBuffer);
        }
    }
    req.body.photo = photos;
    next();
};

exports.createRecipe = async (req, res) => {
    console.log(req.body);
    const recipe = await (new Recipe({
        'name': req.body.name,
        'ingredients': req.body.ingredients,
        'description': req.body.description,
        'tags': req.body.tags,
        'photo': req.body.photo,
        'author': req.user._id,
    })).save();
    await recipe.save();
    res.json(recipe._id);
    // req.flash('succes', `Utworzono ${recipe.name}.`);
    // res.redirect(`/recipe/${recipe._id}`);
};
exports.getRecipes = async (req, res) => {
    const tag = req.params.tag;
    const page = req.params.page || 1;
    // const limit = 42;
    const limit = 30;
    const skip = (page * limit) - limit;
    if (tag) {
        const mulutTags = tag.split(',');
        // const tagsPromise = Recipe.getTagsList();
        const RecipesPromise = Recipe
            .find({
                // tags: mulutTags[0]
                tags: {
                    $all: mulutTags
                }
                // tags: {
                //     $all: [mulutTags[0]]
                // }
                // tags: {
                //     $all: ['Zupy', 'Deser']
                // }
            })
            .populate('author')
            .skip(skip)
            .limit(limit);
        const countPromise = Recipe
            .find({
                tags: {
                    $all: mulutTags
                }
            }).countDocuments();
        const [recipes, count] = await Promise.all([RecipesPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        res.render('recipes', {
            title: tag,
            recipes: recipes,
            tag,
            page: page,
            pages,
        });
    } else {
        const RecipesPromise = Recipe
            .find()
            .populate('author')
            .skip(skip)
            .limit(limit);
        const countPromise = Recipe.countDocuments();
        const [recipes, count] = await Promise.all([RecipesPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        res.render('recipes', {
            // title: 'Przepisy🥑',
            recipes: recipes,
            page: page,
            pages,
        });
    }
};

//tez przy kodamntarz
const confirmOwner = (recipe, user) => {
    if (!user._id) {
        throw Error('Musisz być twórcą.');
        return;
    } else if (!user._id == undefined) {
        throw Error('Musisz być twórcą.');
        return;

    } else if (recipe.author == undefined) {
        throw Error('Musisz być autor?.');
        return;
    } else if (!recipe.author.equals(user._id)) {
        throw Error('Musisz być twórcą.');
    }
}

exports.editRecipe = async (req, res) => {
    //1find the store given the id
    const recipe = await Recipe.findOne({
        _id: req.params.id
    });
    // const tags = await Recipe.getTagsList();
    //2confitm the are the owner of the recipe

    confirmOwner(recipe, req.user);
    //3 render out the edit from so the user can update their store
    res.render('editRecipe', {
        title: `Edytuj ${recipe.name} 👩‍🍳`,
        recipe: recipe,
        // tags
    })
}

const deletePhotosFromServerManual = (images) => {
    var fs = require('fs');
    let imgs = images.split(',');
    imgs.forEach(function (img) {
        var fs = require('fs');
        fs.unlink(`./public/uploads/${img}`, function (err) {
            if (err && err.code == 'ENOENT') {
                // file doens't exist
                console.info("File doesn't exist, won't remove it.");
            } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                console.error("1Error occurred while trying to remove file");
            } else {
                // console.info(`removed`);
            }
        });
    });
};

exports.updateRecipe = async (req, res) => {
    //find and update recipe
    // console.log(req.body);

    const recipe = await Recipe.findByIdAndUpdate({
        _id: req.params.id
    }, req.body, {
        new: true, //return the new recipe instead of the old one 
        runValidators: true
    }).exec();
    if (req.query.q) {
        deletePhotosFromServerManual(req.query.q);
    }

    // console.log(req.query.q); //zdjeica do usutwanica w stringu  z mapwoac po przeicku i uusanc ;d

    req.flash('succes', `Pomyślnie zaktualizowany przepis🥂`);
    //     req.flash('succes', `Pomyślnie zedytowany ${recipe.name}
    // <a href="/recipe/${recipe._id}" class="lookArecipe"> Zobacz Przepis </a>  
    // `);
    res.json(recipe._id);
    // res.redirect(`/recipe/${recipe._id}`);
    //redircet them the recuoe and tell it eakres
};


exports.getRecipeById = async (req, res) => {
    // const tagsPromise = Recipe.getTagsList();
    const OneRecipe = await Recipe.findOne({
        _id: req.params.id
    }).populate('author reviews');
    // const [tags, recipe] = await Promise.all([tagsPromise, OneRecipe]);
    // const recipe = await Promise(OneRecipe);
    res.render('recipe', {
        recipe: OneRecipe,
        title: OneRecipe.name,
    });
};

exports.searchRecipes = async (req, res) => {
    const page = req.params.page || 1;
    // const limit = 42;
    const limit = 30;
    const skip = (page * limit) - limit;
    const RecipesPromise = Recipe.find({
            $text: {
                $search: req.query.search
            }
        }, {
            score: {
                $meta: 'textScore'
            } //czym czesciej sie pojawia w tytule i opisie to na gorze
        })
        // the sort them
        .sort({
            score: {
                $meta: 'textScore'
            }
        }).populate('author')
        .skip(skip)
        .limit(limit);

    const countPromise = Recipe.find({
        $text: {
            $search: req.query.search
        }
    }).countDocuments();
    const [recipes, count] = await Promise.all([RecipesPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    res.render('recipes', {
        title: req.query.search,
        recipes: recipes,
        page: page,
        pages,
        search: req.query.search

    });
}

exports.typedRecipes = async (req, res) => {

    const recipes = await Recipe.find({
            $text: {
                $search: req.query.q
            }
        }, {
            score: {
                $meta: 'textScore'
            } //czym czesciej sie pojawia w tytule i opisie to na gorze
        })
        // the sort them
        .sort({
            score: {
                $meta: 'textScore'
            }
        }).populate('author')
        // limit to only 5 results
        .limit(5);
    res.render('recipes', {
        // title: 'Przepisy🥑',
        recipes: recipes
    });
}
exports.heartStore = async (req, res) => {

    const hearts = req.user.hearts.map(obj => obj.toString());

    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet'
    //jestli id serudskza jest w tablicy (schema user) to pull go uswuwa jak nie ma to dodaje
    const user = await User.findByIdAndUpdate(req.user._id, {
        [operator]: {
            hearts: req.params.id
        }
    }, {
        new: true
    })

    res.json(user); //why
    // res.redirect(`back`);

};

exports.getHearts = async (req, res) => {
    const recipesPromiseHearts = await Recipe.find({
        _id: {
            $in: req.user.hearts
        }
    }).populate('author');;
    // const tagsPromise = Recipe.getTagsList();
    // const RecipesPromise = Recipe.find();
    // const [tags, recipes] = await Promise.all([tagsPromise, recipesPromiseHearts])

    res.render('recipes', {
        title: 'Zapisane do ugotowania 💛',
        recipes: recipesPromiseHearts
    });
};


exports.getChefBySlug = async (req, res) => {

    const page = req.params.page || 1;
    // const limit = 42;
    const limit = 30;
    const skip = (page * limit) - limit;

    const user = await User.findOne({
        slug: req.params.slug
    });
    const recipesPromise = Recipe.find({
            author: user._id
        })
        .populate('author')
        .skip(skip)
        .limit(limit);

    const countPromise = Recipe.find({
        author: user._id
    }).countDocuments();

    const tagsPromise = Recipe.getTagsList();

    const [recipes, count] = await Promise.all([recipesPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    // const user = await User.findOne({
    //     _id: req.params.id
    // });
    // const recipes = await Recipe.find({
    //     author: req.params.id
    // });
    res.render('chef', {
        // title: 'Chef🔪',
        recipes: recipes,
        chef: user,
        title: user.name,
        page: page,
        pages,
    });
};

const deleteAllPhotosFromServer = async (images) => {
    // var fs = require('fs');

    // await storage
    //     .bucket(process.env.GCS_BUCKET)
    //     .file('c40b7c18-e6ce-40bd-aa48-53e5afd544bc.png')
    //     .delete();
    images.forEach(async function (img) {
        await storage
            .bucket(process.env.GCS_BUCKET)
            .file(img)
            .delete();

    });
    // images.forEach(function (img) {
    //     var fs = require('fs');
    //     fs.unlink(`./public/uploads/${img}`, function (err) {
    //         if (err && err.code == 'ENOENT') {
    //             // file doens't exist
    //             console.info("File doesn't exist, won't remove it.");
    //         } else if (err) {
    //             // other errors, e.g. maybe we don't have enough permission
    //             console.error("Error occurred while trying to remove file");
    //         } else {
    //             // console.info(`removed`);
    //         }
    //     });
    // });


};


exports.deleteRecipeById = async (req, res) => {
    //co gdy ktos ma w ulubionych?:_
    //confrim onwer
    if (req.user == undefined) {
        throw Error('Musisz być twórcą.');
        // return;
    }

    const recipe = await Recipe.findOne({
        _id: req.params.id
    });
    confirmOwner(recipe, req.user);
    deleteAllPhotosFromServer(recipe.photo);
    const recipeDelete = await Recipe.findOneAndDelete({
        _id: req.params.id
    });

    // res.json(req.params);
    req.flash('succes', `Usunięto przepis`);
    res.redirect(`back`);

    //usunac tez zdjeice z serwera?

};