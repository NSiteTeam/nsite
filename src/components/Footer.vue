<template>
  <div id="footer">
    <div class="wave"></div>
    <ul id="footer-links">
      <li><RouterLink to="/">Nous contacter</RouterLink></li>
      <li><RouterLink to="/">À propos de nous</RouterLink></li>
      <li>
        <a href="https://www.saint-jean-hulst.com/">Site de Saint Jean</a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '@/style/index.scss';

#footer {
  position: relative;
  bottom: 0;
  z-index: 20;

  width: 100%;

  color: white;

  #footer-links {
    display: flex;
    justify-content: space-around;

    padding: 70px 0 100px 0;
    margin: 0;

    font-weight: bold;
    background-color: #5a6c99;
    list-style-type: none;

    @media (max-width: $mobile-width) {
      flex-direction: column;
      align-items: center;

      padding: 20px 0 40px 0;
    }
  }
}
</style>
