import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';



function previewPhotos(photos) {
    if (!photos) {
        return;
    }

    // parse slide data (src, size ...) from DOM elements 
    // triggers when user clicks on thumbnail |find index photo 
    let onThumbnailsClick = function (e) {
        //find index
        let allPhotos = [];
        let index;
        for (let i = 0; i < galleryElements.length; i++) {
            if (e.target === galleryElements[i]) {
                index = i;
            }
            let item = {
                src: galleryElements[i].getAttribute('src'),
                w: galleryElements[i].naturalWidth,
                h: galleryElements[i].naturalHeight,
                msrc: galleryElements[i].getAttribute('src')
            };
            allPhotos.push(item);
        }
        openPhotoSwipe(index, allPhotos); //2
    };

    let openPhotoSwipe = function (index, allPhotos) {

        let pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        // items = parseThumbnailElements();
        items = allPhotos;
        // define options (if needed)
        options = {
            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                // let thumbnail = items[index].el.getElementsByTagName('img')[0];// find thumbnail
                let thumbnail = galleryElements[index]; // find thumbnail
                let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                let rect = thumbnail.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top + pageYScroll,
                    w: rect.width
                };
            },
            index: index, // start at first slide
            shareEl: false,
            bgOpacity: 0.7,
            fullscreenEl: false,
            zoomEl: true,
            history: false,
            // closeEl: false,
            // closeOnScroll: false,

        };
        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    const galleryElements = document.querySelectorAll(".single__image");
    for (let i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].addEventListener('click', onThumbnailsClick, true);
    }

}



export default previewPhotos