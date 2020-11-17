import debounce from 'debounce';

function checkPassword(input) {
    if (!input) {
        return;
    }
    const PasswordModal = document.querySelector('.formLoginElement__PasswordModal span');
    const password = document.querySelector('.register .formLoginElement input[name="password"]');
    input.addEventListener("change", removeMarker);
    password.addEventListener("change", removeMarker);

    input.addEventListener("change", debounce(checkPassword, 1600));
    password.addEventListener("change", debounce(checkPassword, 1600));

    function removeMarker() {
        PasswordModal.classList.remove("active");
    }

    function checkPassword() {
        if (password.value === '') return;
        if (input.value === '') return;

        if (password.value != input.value) {
            // console.log(rpassword.value)
            different();
        }
    }

    function different() {
        PasswordModal.classList.add("active");
    }
}


export default checkPassword;