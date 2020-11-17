// import EditorJS from '@editorjs/header';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import axios from 'axios';



function deleteIngridient(e) {
    if (e.target.parentElement.classList.value == 'ingredient') {
        e.target.parentElement.remove(); //button 
    } else if (e.target.classList.value == 'pathDelete') { //bo kliklamy na svg 
        //path
        e.target.parentElement.parentElement.parentElement.remove();
    } else {
        //svg
        e.target.parentElement.parentElement.remove();
    }
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
    return true;
}


const swapNodes = (n1, n2) => {
    const p1 = n1.parentNode;
    const p2 = n2.parentNode;
    let i1, i2;
    if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) {
        return;
    }
    for (var i = 0; i < p1.children.length; i++) {
        if (p1.children[i].isEqualNode(n1)) {
            i1 = i;
        }
    }
    for (var i = 0; i < p2.children.length; i++) {
        if (p2.children[i].isEqualNode(n2)) {
            i2 = i;
        }
    }
    if (p1.isEqualNode(p2) && i1 < i2) {
        i2++;
    }
    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
}


const ButtonSwapDisableFirstAndLast = () => {
    const nodesLeft = document.querySelectorAll('.previewImages__containerPhoto--left');
    const nodesRight = document.querySelectorAll('.previewImages__containerPhoto--right');
    for (const node of nodesRight) {
        node.classList.remove("off");
    }
    for (const node of nodesLeft) {
        node.classList.remove("off");
    }

    nodesLeft[0].classList.add("off");
    nodesRight[nodesRight.length - 1].classList.add("off");

};

function editorRecipe() {
    const formRecipe = document.querySelector('.sendRecipeForm');
    if (!formRecipe) {
        return;
    }
    const addingredient = document.querySelector('.addingredient');
    const list = document.querySelector('.formIngredients__ingredients');
    //dodwanie kolejengo składnika
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
        img.src = ("/img/icons/delete.svg"); //??
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
    const inputs = document.querySelectorAll('li.ingredient input');
    for (const input of inputs) {
        input.addEventListener('keypress', disableEnter);
    }

    const inputPhoto = document.querySelector('.upladPhoto');
    inputPhoto.addEventListener('change', (event) => {
        const images = document.querySelectorAll('.previewImages .previewImages--photoFromServer'); //wczesniej dodane
        if (event.target.files.length + images.length > 8) {
            alert("Maksymalnie możesz dodac 8 zdjęc.");
            inputPhoto.value = '';
            if (!/safari/i.test(navigator.userAgent)) {
                inputPhoto.type = '';
                inputPhoto.type = 'file';
            }
        }
        const previewImagesDiv = document.querySelector('.previewNewImages');
        if (event.target.files && event.target.files.length >= 0) {
            previewImagesDiv.innerHTML = '';
            // po zmieanie input file preview musi sie czysc 
            //moze w jakis ladneijszy sposb?
            for (let i = 0; i < event.target.files.length; i++) {
                let file1 = event.target.files[i];
                let reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.width = '100';
                    img.src = event.target.result;
                    previewImagesDiv.appendChild(img);
                }
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    });

    const deletePhotoButtons = document.querySelectorAll('.deletePhotoButton');
    const listImgsToDelete = [];
    for (const button of deletePhotoButtons) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            listImgsToDelete.push(e.target.parentNode.childNodes[1].id);
            e.target.parentNode.remove();
        });
    }

    const leftButtonSwapLeft = document.querySelectorAll('.previewImages__containerPhoto--left');
    if (leftButtonSwapLeft.length != 0) {
        ButtonSwapDisableFirstAndLast();
    }
    for (const button of leftButtonSwapLeft) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            let allContainersImg = e.target.parentNode.parentNode.childNodes;
            for (let i = 0; i < allContainersImg.length; i++) {
                if (allContainersImg[i] === e.target.parentNode) {
                    swapNodes(allContainersImg[i], allContainersImg[i - 1]);
                    ButtonSwapDisableFirstAndLast();
                }
            }
        });
    }
    const rightButtonSwapRight = document.querySelectorAll('.previewImages__containerPhoto--right');;
    for (const button of rightButtonSwapRight) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            let allContainersImg = e.target.parentNode.parentNode.childNodes;
            for (let i = 0; i < allContainersImg.length; i++) {
                if (allContainersImg[i] === e.target.parentNode) {
                    swapNodes(allContainersImg[i], allContainersImg[i + 1]);
                    ButtonSwapDisableFirstAndLast();
                    break; //jak juz zmieni to koniec fora bo znuw bedzei chcail zmienaic
                }
            }
        });
    }

    const editorjs = document.getElementById('editorjs');
    const dataToEditor = JSON.parse(editorjs.getAttribute('data'));
    const editor = new EditorJS({
        holderId: 'editorjs',
        tools: {
            header: {
                class: Header,
                inlineToolbar: ['link']
            },
            list: {
                class: List,
                inlineToolbar: true
            },
            Marker: {
                class: Marker,
                shortcut: 'CMD+SHIFT+M',
            },

        },
        data: {
            blocks: dataToEditor
        }
    });
    formRecipe.addEventListener('submit', function (e) {
        e.preventDefault(); //stop form from submitting
        if (!validateMyForm()) {
            return;
        }
        editor.save().then((outputData) => {
            const bodyFormData = new FormData(this);
            //tylko gdy edycja
            //chyba trzeba reczenie brac zdjecia z input file html  i dodawc je racznie js do formularza
            // const images = document.querySelectorAll('.previewImages .previewImages--photoFromServer');
            const images = document.querySelectorAll('.previewImages .previewImages--photoFromServer');
            if (document.querySelector('.previewImages')) {
                for (let i = 0; i < images.length; i++) {
                    bodyFormData.append('photo', images[i].id);
                }
            }
            bodyFormData.set('description', JSON.stringify(outputData.blocks));
            // tu moze dodac zdjecia do photos
            const url = `/dodaj/${this.id}?q=${listImgsToDelete}`;
            document.querySelector('.loader').classList.add('loader--Active');
            document.querySelector('#swup').classList.add('off');
            axios({
                    method: 'post',
                    url: url,
                    data: bodyFormData,
                    config: {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }

                })
                .then(function (response) {
                    //handle success
                    // console.log(response);
                    // console.log(response.data);
                    window.location.href = `/recipe/${response.data}`;
                })
                .catch(function (response) {
                    //handle error 
                    console.log(response);
                });

        }).catch((error) => {
            console.log('Saving failed: ', error);
        });



    });



}
export default editorRecipe;