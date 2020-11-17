const addingredient = document.querySelector('.addingredient');
const list = document.querySelector('.ingredients');
addingredient.addEventListener('click', () => {
    const li = document.createElement("LI");
    li.classList = "ingredient";
    const input = document.createElement("INPUT");
    input.setAttribute("type", "text");
    input.name = "ingredients";
    input.addEventListener('keypress', disableEnter);
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList = "deleteingredient";
    button.addEventListener('click', deleteIngridient);
    const img = document.createElement("img");
    img.src = ("/img/icons/delete.png");
    img.classList = "buttonImgDelete";
    img.setAttribute("alt", "Usuń składnik");
    button.appendChild(img);
    li.appendChild(input);
    li.appendChild(button);
    list.appendChild(li);
});

const deleteButtons = document.querySelectorAll('.deleteingredient');
for (const button of deleteButtons) {
    button.addEventListener('click', deleteIngridient);
}

function deleteIngridient(e) {
    if (e.target.parentElement.classList.value == 'ingredient') {
        e.target.parentElement.remove();
    } //bo kliklamy na li odrazu
    else {
        e.target.parentElement.parentElement.remove();
    }
}

const inputs = document.querySelectorAll('li.ingredient input');

for (const input of inputs) {
    input.addEventListener('keypress', disableEnter);
}

function disableEnter(e) {
    const eve = e || window.event;
    const keycode = eve.keyCode || eve.which || eve.charCode;
    if (keycode == 13) {
        eve.cancelBubble = true;
        eve.returnValue = false;
        if (eve.stopPropagation) {
            eve.stopPropagation();
            eve.preventDefault();
        }
        return false;
    }
}


function validateMyForm() {
    const ingredients = document.querySelectorAll('.ingredient');
    if (ingredients.length < 2) {
        alert("Dodaj przynajmniej dwa składniki!")
        return false;
    }
    let althoughTwo = 0;
    for (const product of ingredients) {
        if (product.children[0].value == '') {
            //uusn
            product.remove();
        } else {
            althoughTwo++;
        }
    }
    if (althoughTwo < 2) {
        alert("Dodaj przynajmniej dwa składniki!")
        return false;
    }

}