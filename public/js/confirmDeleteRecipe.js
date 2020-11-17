import axios from 'axios';


function confrimDeleteRecipe() {
    const deletesButton = document.querySelectorAll('.recipe__action.recip__action--delete a');
    if (deletesButton.length != 0) {
        deletesButton.forEach(function (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const toDelte = confirm("Czy na pewno usunąć przepis?")
                if (toDelte) {
                    // const url = `/usun/${e.target.id}`;
                    const url = `${e.target.href}`;
                    axios({
                            method: 'get',
                            url: url,
                        }).then(function (response) {
                            e.target.parentNode.parentNode.parentNode.remove();
                            setTimeout(function () {
                                alert("Usunięto przepis");
                            }, 200);
                        })
                        .catch(function (response) {
                            //handle error 
                            console.log(response);
                        });
                }
            });
        });
    }
}

export default confrimDeleteRecipe;