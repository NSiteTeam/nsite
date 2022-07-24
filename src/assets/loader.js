const loaderHTML = `
<div class="loader" style="display: none">
  <div class="loader_ring"></div>
  <div class="loader_ring"></div>
  <div class="loader_ring"></div>
  <div class="letters">
    <span class="letter">C</span>
    <span class="letter">H</span>
    <span class="letter">A</span>
    <span class="letter">R</span>
    <span class="letter">G</span>
    <span class="letter">E</span>
    <span class="letter">M</span>
    <span class="letter">E</span>
    <span class="letter">N</span>
    <span class="letter">T</span>
    <span class="letter">.</span>
    <span class="letter">.</span>
    <span class="letter">.</span>
  </div>
  <div class="img_container">
    <img src="src/assets/sjh.png">
  </div>
</div>`

document.getElementById('loader').innerHTML = loaderHTML

const loader = document.querySelector('.loader')

function time() {
  setTimeout(() => {
    if (loader != null) {
      loader.classList.add('transition')
      // When transition is complete, remove the elements
      setTimeout(() => loader.classList.remove('loader'), 400)
    }
  }, 3000)
}
time()
