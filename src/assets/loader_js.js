const loader = document.querySelector('.loader');

function time(){
    setTimeout(()=>{
        loader.classList.add('transition');
    }, 3000)
}

time()