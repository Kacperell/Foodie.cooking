const hamburger = document.querySelector(".nav__section--pages").children[1];
const tagsDiv = document.querySelector(".mainTagsDiv");
const allTags = Array.from(document.querySelectorAll('a.tag__link.tag__link--sideBar'));

const nav = document.querySelector('nav.nav');
const searchMultiTagsButton = document.querySelector('.searchMultiTagsButton');
const links = document.querySelectorAll(".mainTagsUl li");
const linkRecipes = hamburger.children[0];
linkRecipes.addEventListener('click', (e) => {
    e.preventDefault();
});

import swup from './foodPornApp';



function fullTagsMobile() {
    const mq = window.matchMedia("(max-width: 600px)");
    if (mq.matches) {
        console.log('e');
        hamburger.removeEventListener('click', tagsDesktopOpenToggle);
        // window width is at least 500px
        // let heightLIRecipes = hamburger.clientHeight;
        //16 bo taki padding ma div z tagami
        // tagsDiv.style.height = `${window.innerHeight-heightLIRecipes-16}px`;
        const heightTags = window.innerHeight - linkRecipes.clientHeight;
        //- 12 bo padding
        tagsDiv.style.height = `${heightTags}px`;
        hamburger.addEventListener("click", fullTagsMobileToogle);
    }
}

function fullTagsMobileToogle() {
    tagsDiv.classList.toggle("open");
    // links.forEach(link => {
    //     link.classList.toggle("fade");
    // });
}

function tagsDesktopOpenToggle() {
    tagsDiv.classList.toggle("TagsDiv--open");
}

function tagsDesktopOpen() {

    const mq = window.matchMedia("(min-width: 601px)");
    if (mq.matches) {
        hamburger.removeEventListener('click', fullTagsMobileToogle);
        hamburger.addEventListener("click", tagsDesktopOpenToggle);
        hightTagsDesktop();
    };
};

function hightTagsDesktop() {
    const mq = window.matchMedia("(min-width: 601px)");
    if (mq.matches) {
        const heightTags = window.innerHeight - nav.clientHeight + 10; //co xd
        tagsDiv.style.height = `${heightTags}px`;
    }
}


function mulitSearch() {
    const checkboxMulitSearch = document.querySelector('#multitags');
    checkboxMulitSearch.addEventListener('change', function () {
        searchMultiTagsButton.classList.toggle("off");
        if (this.checked) {
            allTags.forEach(function (tag) {
                tag.removeEventListener('click', tackTagsOnlyOne, true);
                tag.addEventListener('click', tackMultiTags, true);
                tag.setAttribute('data-no-swup', '');
                tag.addEventListener('click', (e) => {
                    e.preventDefault();
                }, {
                    passive: false
                });
            });
        } else {
            allTags.forEach(function (tag) {
                tag.addEventListener('click', tackTagsOnlyOne, true);
                tag.removeAttribute('data-no-swup');
            });
        }
    });
}

function trackTags() {
    for (let i = 0; i < allTags.length; ++i) {
        allTags[i].addEventListener('click', tackTagsOnlyOne, true);
    }

}

function tackTagsOnlyOne(e) {
    allTags.forEach(function (tag) {
        tag.classList.remove('tag__link--active');
    });
    e.target.classList.add('tag__link--active');
    fullTagsMobileToogle();

}


function tackMultiTags(e) {
    // allTags.forEach(function (tag) {
    //     // tag.classList.remove('tag__link--active');
    // });
    e.target.classList.toggle('tag__link--active');
}

async function searchMultiTags() {
    let url = '/recipes/';
    await allTags.forEach(function (tag) {
        if (tag.classList.contains('tag__link--active')) {
            url = url.concat(tag.href.split("/recipes/")[1]);
            url = url.concat(',');
        };
    });
    url = url.slice(0, -1); //ucinamy ostani znak bo jednek przcienk za duzo
    swup.loadPage({
        url: url, // route of request (defaults to current url)
        method: 'GET', // method of request (defaults to "GET")
    });
    fullTagsMobileToogle();
}


function clikTagInRecipeTrackSideTags() {

    const allTagsInRecipe = Array.from(document.querySelectorAll('a.tag__link--inRecipe'));
    if (allTagsInRecipe.length == 0) {
        return;
    }
    allTagsInRecipe.forEach(function (tagInRecipe) {
        tagInRecipe.addEventListener('click', (e) => {
            allTags.forEach(function (tag) {
                tag.classList.remove('tag__link--active');
                if (e.target.href == tag.href) {
                    tag.classList.add('tag__link--active');
                }
            });
        });
    });
}


function fullTags() {
    const mq = window.matchMedia("(min-width: 1365px)");
    if (mq.matches) {
        tagsDiv.classList.add("TagsDiv--open");
    }
    fullTagsMobile();
    tagsDesktopOpen();
    mulitSearch();
    trackTags();
    window.addEventListener('resize', fullTagsMobile);
    window.addEventListener('resize', tagsDesktopOpen);
    searchMultiTagsButton.addEventListener('click', searchMultiTags);
    document.addEventListener('swup:contentReplaced', (event) => {
        //if it isnt recipe or recipes site => delete all active tag
        const reg = /recipe/;
        if (!reg.test(window.location.href)) {
            allTags.forEach(function (tag) {
                tag.classList.remove('tag__link--active');
            })
        }
    });

    document.addEventListener('swup:popState', (event) => {
        //on back forwadrd check evry tag
        allTags.forEach(function (tag) {
            tag.classList.remove('tag__link--active');
            // const reg = new RegExp(tag.textContent.substr(1));
            const reg = new RegExp(tag.textContent.substr(1).replace(/\s/g, ''));
            if (reg.test(decodeURIComponent(window.location.href))) {
                tag.classList.add('tag__link--active');
            };

        });


    });



};



export {
    fullTags,
    clikTagInRecipeTrackSideTags
};