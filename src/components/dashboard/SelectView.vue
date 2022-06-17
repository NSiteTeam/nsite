<template>
  <div class="select-view">
    <p>Sélectionnez un onglet pour commencer</p>
  </div>
</template>

<style lang="scss" scoped>
@import '@/style/index.scss';

.select-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    background-color: $space-cadet;
    padding: 10px;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
