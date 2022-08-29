import Masnory from 'masonry-layout';
window.onload = () =>{
    const grid = document.querySelector('.grid');
    const masnory = new Masnory(grid,{
        itemSelector: '.grid-item'
    });
}

