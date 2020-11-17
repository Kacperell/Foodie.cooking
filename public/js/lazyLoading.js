function lazyLoading() {

    if ('loading' in HTMLImageElement.prototype) {
        console.log("t");
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        console.log("m");
        // Dynamically import the LazySizes library
        const script = document.createElement('script');
        script.src =
            'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.1.8/lazysizes.min.js';
        document.body.appendChild(script);
    }
}


export default lazyLoading