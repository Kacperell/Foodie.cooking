import axios from 'axios';

function ajaxLike(e) {
    e.preventDefault();
    axios
        .post(this.action)
        .then(res => {
            let numberOflikes = document.querySelector('.numberOfLikes span');
            if (this.childNodes[0].classList.contains('button-inRecipeReview--active')) {
                this.childNodes[0].classList.remove('button-inRecipeReview--active');
                let likes = parseInt(numberOflikes.textContent);
                likes = likes - 1;
                numberOflikes.textContent = likes;
            } else {
                this.childNodes[0].classList.add('button-inRecipeReview--active');
                let likes = parseInt(numberOflikes.textContent);
                likes = likes + 1;
                numberOflikes.textContent = likes;
            }
        })
        .catch(console.error);

}

function addLike() {
    const likeForm = document.querySelector('form.like');

    if (!likeForm) {
        return;
    }

    likeForm.addEventListener('submit', ajaxLike, true);
}

export default addLike;