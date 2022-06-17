<template>
  <div class="nothing-adviable">
    <p>
      <span class="material-icons">
        dangerous
      </span>
      Désolé, vous n'avez pas le droit d'accéder au pannel de gestion du site
    </p>
  </div>
</template>

<style scoped lang="scss">
  @import "@/style/index.scss";

  .nothing-adviable {
    width: 100%;
  }

  .nothing-adviable, p {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;

    p {
      background-color: $space-cadet-dark;
      padding: 10px;
      border-radius: 10px;
    }

    .material-icons {
      font-size: 72px;
      color: $danger;
    }
  }
</style>
