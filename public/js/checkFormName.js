import debounce from 'debounce';
import axios from 'axios';

function checkFormName(input) {
    if (!input) {
        return;
    }
    const alreadyExistsModal = document.querySelector('.formLoginElement__alreadyExistsModal span');
    input.addEventListener("keypress", debounce(checkIsUser, 1600));

    function checkIsUser() {
        alreadyExistsModal.classList.remove("active");
        axios
            .get(`/api/checkName?q=${input.value}`)
            .then(res => {
                //res.data true or false
                if (res.data) {
                    alreadyExists();
                }
            }).catch(console.error);
    }

    function alreadyExists() {
        alreadyExistsModal.classList.add("active");
    }
}

export default checkFormName