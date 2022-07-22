<template>
    <div class="loader">
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
        <img src="/workspace/nsite/src/assets/logo.svg">
      </div>
    </div>
</template>

<script lang="ts">
  const loader = document.querySelector('.loader');

  function time(){
      setTimeout(()=>{
          if (loader != null) {
            loader.classList.add('transition');
          }
      }, 3000)
  }

  time()
</script>
