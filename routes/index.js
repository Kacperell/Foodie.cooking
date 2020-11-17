const express = require('express');
const router = express.Router();
const passport = require('passport');
const PagesController = require('../controllers/PagesController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const {
    catchErrors
} = require('../handlers/errorHandlers');


router.get('/', catchErrors(PagesController.getRecipes));
router.get('/recipes', catchErrors(PagesController.getRecipes));
router.get('/recipes/page/:page', catchErrors(PagesController.getRecipes));

// router.get('/przepis/:slug', catchErrors(PagesController.getRecipeBySlug));
router.get('/recipe/:id', catchErrors(PagesController.getRecipeById));

router.get('/dodaj',
    authController.isLoggedIn,
    PagesController.addRecipe);

router.post('/dodaj',
    PagesController.upload,
    catchErrors(PagesController.resize),
    catchErrors(PagesController.createRecipe)
);

router.post('/dodaj/:id',
    PagesController.upload,
    catchErrors(PagesController.resize),
    catchErrors(PagesController.updateRecipe));

router.get('/przepisy/:id/edit',
    authController.isLoggedIn,
    catchErrors(PagesController.editRecipe));

router.get('/recipes/:tag', catchErrors(PagesController.getRecipes));
router.get('/recipes/:tag/page/:page', catchErrors(PagesController.getRecipes));

// router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.loginForm);
//1 validate the registration date 
//2 register the user
//3 we need to log them in 
router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login
);
router.get('/logout', authController.logout);

router.get('/accountEdit',
    authController.isLoggedIn,
    userController.accountEdit);

router.post('/accountEdit', catchErrors(userController.updateAccount));

router.post('/account/forgot', catchErrors(authController.forgot));

router.get('/account/reset/:token', catchErrors(authController.reset));

router.post('/account/reset/:token',
    // authController.confirmedPassowrds,           ?
    catchErrors(authController.update)
);
router.get('/hearts', authController.isLoggedIn,
    catchErrors(PagesController.getHearts));

//cooks
router.get('/chef/:slug', catchErrors(PagesController.getChefBySlug));
router.get('/chef/:slug/page/:page', catchErrors(PagesController.getChefBySlug));
// router.get('/chef/:id', catchErrors(PagesController.getChefById));


//reviews
router.post('/reviews/:id', authController.isLoggedIn,
    catchErrors(reviewController.addReview)
);


//delete recipe
router.get('/usun/:id',
    // authController.confirmedPassowrds,            ?
    // authController.isLoggedIn,
    catchErrors(reviewController.deleteAllReviewsByRecipeId),
    catchErrors(PagesController.deleteRecipeById)
);
router.get('/deleteReview/:id',
    // authController.confirmedPassowrds,     
    // authController.isLoggedIn,
    catchErrors(reviewController.deleteReviewById)
);




// router.get('/search', catchErrors(PagesController.typedRecipes)); //ekspremtnie
router.get('/searchrecipes/:page/searchvalue', catchErrors(PagesController.searchRecipes)); //ekspremtnie
//ekspremtnie

// router.get('/search', catchErrors(PagesController.typedRecipes)); //ekspremtnie

// API
router.get('/api/search', catchErrors(PagesController.searchRecipes));
// router.post('/api/przepisy/:id/serce', catchErrors(PagesController.heartStores));
router.post('/api/przepisy/:id/serce', catchErrors(PagesController.heartStore));
//sprawdzamy czy jest juz uzytkownim o podanym nicku
router.get('/api/checkName', catchErrors(userController.checkUserName));

// //usuwamy zdjecie z serwera
// router.post('/api/deletePhoto', catchErrors(PagesController.deletePhotoById));

//authController.isLoggedIn,  dodwac do suwuania moze i gdziesidzej?xd

//starts
router.post('/api/like/:id/:likes', catchErrors(reviewController.addLike));




module.exports = router;