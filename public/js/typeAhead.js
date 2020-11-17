//szukanie


function clearInputForm() {
    const searchInput = document.querySelector('.search__input');
    searchInput.blur();
    searchInput.value = '';
    // moze plynne ?
}


function typeAhead(search) {
    if (!search) {
        return;
    }
    search.addEventListener('submit', clearInputForm());
}



export default typeAhead;