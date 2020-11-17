
const fs = require('fs');

const moment = require('moment');
moment.locale('pl');

exports.moment = moment;

exports.dump = (obj) => JSON.stringify(obj, null, 2);


exports.icon = (name) => fs.readFileSync(`./public/img/icons/${name}.svg`);


exports.siteName = 'Foodie 🥑';

exports.menu = [{
    slug: '/przepisy',
    title: 'Przepisy',
    icon: 'przepisy',
},
{
    slug: '/top',
    title: 'Top',
    icon: 'top',
},

{
    slug: '/dodaj',
    title: 'Dodaj',
    icon: 'dodaj',
},
];

exports.tags = ['Wymyślne', 'Kolacja', 'Obiad', 'Śniadanie', 'Deser', 'Ciasta', 'Lody', 'Keto', 'FoodPorn', 'Wege', 'Bezglutenowe',
    'Zupy', 'Makarony', 'Ryby', 'Mięsne', 'Napój', 'Fit', 'Przekąska'
];