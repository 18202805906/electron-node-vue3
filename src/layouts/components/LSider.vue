<template>
  <div>
    <div class="x-sider">
      <a-menu class="menu-box" theme="light" mode="inline" :inline-collapsed="collapse" :selected-keys="selectedKeys" :openKeys="openKeys">
        <template v-for="item in menus">
          <template v-if="!item.hide">
            <a-sub-menu :key="item.path" v-if="item.children && item.children.length >= 1">
              <template #title>
                <!-- <a-icon :type="item.icon" class="menu-ico" v-if="item.icon" /> -->
                <component :is="item.icon" class="menu-ico" v-if="item.icon"></component>
                <span>{{ item.name }}</span>
              </template>
              <template v-for="subItem in item.children">
                <a-menu-item :key="subItem.url" v-if="!subItem.hide">
                  <router-link :to="subItem.url">
                    <!-- <a-icon :type="subItem.icon" class="menu-ico" v-if="subItem.icon" /> -->
                    <component :is="subItem.icon" class="menu-ico" v-if="subItem.icon"></component>
                    <span>{{ subItem.name }}</span>
                  </router-link>
                </a-menu-item>
              </template>
            </a-sub-menu>
            <a-menu-item :key="item.path" v-else>
              <router-link :to="item.path">
                <component :is="item.icon" class="menu-ico" v-if="item.icon"></component>
                <!-- <a-icon :type="item.icon" class="menu-ico" v-if="item.icon" /> -->
                <span>{{ item.name }}</span>
              </router-link>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </div>
    <div class="sider-trigger" @click="handleCollapse">
      <right-outlined v-if="collapse" />
      <left-outlined v-else />
    </div>
  </div>
</template>
<script>
import { defineComponent, watchEffect, ref } from 'vue';

export default defineComponent({
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    menus: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    selectedKeys: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    let localOpeneds = ref([]);
    const handleCollapse = () => {
      emit('updateCollapse', !props.collapse);
    };
    watchEffect(() => {
      localOpeneds.value = props.openKeys;
    });
    return {
      handleCollapse,
      localOpeneds
    };
  }
});
</script>
<style lang="less" scoped>
.x-sider {
  width: 100%;
  /* height: 100vh; */
  overflow: hidden;
  background: url('../../assets/images/sider_bg.png') center bottom no-repeat;
  &:deep(.ant-menu) {
    background: transparent;
  }
}

.menu-box {
  overflow-x: hidden;
  overflow-y: scroll;
  height: calc(100vh - 10px);
  width: calc(100% + 17px);
  // transition: width 0.5s ease;
}
// .menu-ico:not(:empty) {
//   color: $primary-color;
//   border: 1px solid $primary-color;
//   padding: 2px;
//   border-radius: 0 4px 4px 4px;
// }
.sider-trigger {
  position: absolute;
  width: 16px;
  height: 68px;
  line-height: 68px;
  right: -16px;
  top: 50%;
  color: @primary-color;
  background: #e6f7ff;
  cursor: pointer;
  z-index: 1;
}
</style>
<style lang="less">
.ant-menu-sub .ant-menu-item:before {
  content: '';
  display: block;
  width: 4px;
  height: 4px;
  background: #00479d;
  position: absolute;
  top: 50%;
  margin-left: -16px;
  margin-top: -2px;
}
.ant-menu-submenu-popup .ant-menu-item:before {
  display: none;
}
</style>
