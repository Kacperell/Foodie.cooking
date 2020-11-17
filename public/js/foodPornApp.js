import '../css/main.scss';
import {
    $,
    $$
} from './bling';
// import fullTags from './fullScreenTags';
import {
    fullTags,
    clikTagInRecipeTrackSideTags
} from './fullScreenTags';
import checkFormName from './checkFormName.js';
import checkPassword from './checkPassword.js';
import ajaxHeart from './heart';
import addLike from './addLike';
import typeAhead from './typeAhead';
import {
    lootieNoRecipes
} from './lottie';
import {
    noWebsite
} from './lottie';
import quicklink from "quicklink/dist/quicklink.mjs";
import editorRecipe from './editorRecipe';
import previewPhotos from './previewPhotos';
import confirmDeleteRecipe from './confirmDeleteRecipe';
// import lazyLoading from './lazyLoading';


import showRecipeDescription from './showRecipeDescription';
import hideBottomNav from './hideBottomNav';
import loaderPizza from './loaderPizza';

import SwupDebugPlugin from '@swup/debug-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupFormsPlugin from '@swup/forms-plugin';
import SwupBodyClassPlugin from '@swup/body-class-plugin';
import SwupScrollPlugin from '@swup/scroll-plugin';
import Swup from 'swup';


const swup = new Swup({
    cache: false,
    animateHistoryBrowsing: true,
    scrollFriction: 0.3,
    scrollAcceleration: 0.04,
    plugins: [new SwupBodyClassPlugin(),
        new SwupFormsPlugin(), // ?
        new SwupScrollPlugin(),
        // new SwupPreloadPlugin(),
        // new SwupDebugPlugin() //
    ],
    // animationSelector: '.c-load-screen',
    // elements: ['#swup'],
    // animationSelector: '[class*="transition-"]',
    // debugMode: true,
});


let scrollValue = [];
let back = false;
document.addEventListener('swup:clickLink', event => {
    scrollValue[0] = [window.location.href, window.scrollY];
});
document.addEventListener('swup:popState', event => {
    back = true;
});
document.addEventListener('swup:animationInStart', event => {
    const reg = /recipes/;
    // const reg2 = /searchrecipes/;
    const homeUrl = `${document.location.origin}/`;
    //przy serach recipes nie ma clicka tylko submit wiec nie ma [0]
    swup.scrollTo(0);
    if (scrollValue[0] != undefined && back == true) {
        if ((reg.test(scrollValue[0][0]) && reg.test(scrollValue[0][0]) != reg.test(scrollValue[1][0])) || scrollValue[0][0] == homeUrl) {
            swup.scrollTo(scrollValue[0][1]);
        }
    }

});
document.addEventListener('swup:willReplaceContent', event => {
    if (back == false) {
        scrollValue[1] = [window.location.href, window.scrollY];
    }
    setTimeout(function () {
        back = false;
    }, 55);

    //w navie powieksze icony
    const navLikns = document.querySelectorAll(".nav__link");
    navLikns.forEach(
        function (node) {
            node.classList.remove("nav__link--active");
            if (node.href == event.target.URL) {
                node.classList.add("nav__link--active");
            }
            const text = String(event.target.URL);
            const reg = /recipe/;
            if (reg.test(text)) {
                navLikns[0].classList.add("nav__link--active"); //[0]== Przepisy
            }
        });
});

fullTags();
loaderPizza();

function init() {
    //lapiemy wsyzkie serduszka
    const heartsForm = $$('form.heart');
    heartsForm.on('submit', ajaxHeart);
    // // // przez ten blinkg js mozna wysluahc na tablicy nodow nie trzba toribc petli i addeventlistener
    checkFormName($('.formLoginElement input[name="name"]'));
    checkPassword($('.formLoginElement input[name="password-confirm"]'));
    typeAhead($('.form-search'));
    // lazyLoading();
    // lootieNoRecipes();
    // noWebsite();
    editorRecipe();
    previewPhotos($('.pswp'));
    showRecipeDescription($('.single__details  .descriptionDiv .descriptionDiv--recipe'));
    clikTagInRecipeTrackSideTags();
    confirmDeleteRecipe();
    addLike();
    // hideBottomNav();
}
init();
swup.on('contentReplaced', init);


swup.on('animationOutStart', () => {
    document.querySelector('.loader').classList.add('loader--Active');
});
swup.on('animationInStart', () => {
    document.querySelector('.loader').classList.remove('loader--Active');

});



export default swup;