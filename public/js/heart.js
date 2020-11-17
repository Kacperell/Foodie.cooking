import {
    $,
    $$
} from './bling';
import axios from 'axios';
//serduszka
const heart = document.querySelector('.save svg');

function ajaxHeart(e) {
    e.preventDefault();
    axios
        .post(this.action)
        .then(res => {
            //if it is button in recipe (not recipe card)
            if (this.classList.contains('heart--inRecipe')) {
                this.childNodes[0].classList.toggle('button-inRecipeReview--active');
            }
            const isHearted = this.heart.classList.toggle('heart__button--hearted');
            // $('.heart-count').textContent = res.data.hearts.length;
            heart.style.transform = 'scale(1.2)';
            // function HeartDown() {
            //     heart.style.transform = 'scale(1)';
            // }
            // setTimeout(HeartDown, 200)
            // function HeartDown() {
            //     heart.style.transform = 'scale(1)';
            // }
            setTimeout(() => {
                heart.style.transform = 'scale(1)';
            }, 200)
            if (isHearted) {
                this.heart.classList.add("heart__button--float");
                setTimeout(() => this.heart.classList.remove("heart__button--float"), 2500);
            }

        })
        .catch(console.error);

}
export default ajaxHeart;