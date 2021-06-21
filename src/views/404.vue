<template>
  <div>
    <section class="message-list">
      <section class="message">
        <i class="nes-bcrikko"></i>
        <div class="nes-balloon from-left">
          <p>Took a wrong turn?</p>
        </div>
      </section>
      <section class="message">
        <div class="nes-balloon from-right">
          <p>Return to <router-link to="/">start.</router-link></p>
        </div>
        <i class="nes-bcrikko"></i>
      </section>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.nes-balloon {
  padding: 8px;
  width: 100%;
  margin-left: 8px;
}
.nes-bcrikko {
  margin-right: 24px;
}
.message {
  display: flex;
}
.message-list {
  margin: auto;
  max-width: 540px;
}
</style>
