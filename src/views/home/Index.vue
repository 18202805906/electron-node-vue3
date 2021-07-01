<template>
  <div>
    <!-- <basisOperation></basisOperation> -->
    <statistic></statistic>
  </div>
</template>

<script>
//import basisOperation from './components/BasisOperation.vue';
import { defineComponent, onMounted } from '@vue/runtime-core';
import statistic from './components/Statistic';
import { remote } from 'electron';
export default defineComponent({
  name: 'home',
  components: {
    // basisOperation,
    statistic
  },
  setup() {
    onMounted(() => {
      const win = remote.getCurrentWindow();
      if (win.hegith != 680) {
        win.setSize(1500, 680);
        win.center();
      }
    });
  }
});
</script>

<style rel="stylesheet/scss" lang="less" scoped></style>
