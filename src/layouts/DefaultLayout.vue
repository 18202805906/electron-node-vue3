<template>
  <a-layout class="layout">
    <a-layout-sider theme="light" v-model:collapsed="collapse" :trigger="null" collapsible breakpoint="lg">
      <l-sider :menus="menus" v-model:collapse.sync="collapse" @updateCollapse="updateCollapse" :open-keys="openeds" :selected-keys="curtMenuKey"></l-sider>
    </a-layout-sider>
    <a-layout class="layout-main">
      <div class="app-scroll-wrap">
        <l-bread-crumb :data="parentMenus" />
        <div class="app-main">
          <router-view v-slot="{ Component }">
            <transition mode="out-in" name="slide">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
      <!-- <l-footer></l-footer> -->
    </a-layout>
  </a-layout>
</template>
<script>
import { computed, defineComponent, reactive, toRefs } from 'vue';
import LSider from '@/layouts/components/LSider';
// import LFooter from '@/layouts/components/LFooter';
import LBreadCrumb from '@/layouts/components/LBreadCrumb';
import menus from '../../mock/common/menu.json';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'layout',
  components: {
    LSider,
    //LFooter,
    LBreadCrumb
  },
  setup() {
    const router = useRouter();
    let states = reactive({
      menus,
      collapse: false
    });

    const curtMenuKey = computed(() => {
      const currentRoute = router.currentRoute.value;
      return currentRoute.path ? [currentRoute.path] : [];
    });
    const parentMenus = computed(() => {
      const currentRoute = router.currentRoute.value;
      return currentRoute.matched
        .filter((item) => item.meta?.name)
        .map((item) => ({
          icon: item.meta.icon,
          title: item.meta.name,
          url: item.path
        }));
    });
    const openeds = computed(() => {
      return states.collapse ? [] : parentMenus.value.map((item) => item.url);
    });
    const updateCollapse = (val) => {
      states.collapse = val;
    };
    return {
      ...toRefs(states),
      openeds,
      parentMenus,
      curtMenuKey,
      updateCollapse
    };
  }
});
</script>
<style lang="less" scoped>
@import url('../assets/style/layout.less');
.app-scroll-wrap {
  //height: calc(100vh - 64px);
  overflow-y: auto;
}
.app-main {
  overflow-y: auto;
  padding: 16px;
  //margin: 20px;
  border-radius: 5px;
  //background: #fff;
}
</style>
