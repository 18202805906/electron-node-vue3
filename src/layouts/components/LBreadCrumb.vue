<template>
  <a-breadcrumb separator=">" class="breadcrumb">
    <label
      ><router-link to="/" style="float: right; width: 80px"><LogoutOutlined />退出系统</router-link></label
    >
    <a-breadcrumb-item>
      <HomeOutlined class="home-ico" />
      <router-link to="/home">首页</router-link></a-breadcrumb-item
    >
    <a-breadcrumb-item v-for="item in data" :key="item.id"
      ><router-link :to="item.url">{{ item.title }}</router-link></a-breadcrumb-item
    >
  </a-breadcrumb>
</template>
<script>
import { HomeOutlined } from '@ant-design/icons-vue';
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  components: {
    HomeOutlined
  }
};
</script>
<style lang="less" scoped>
.breadcrumb {
  padding: 0 12px;
  background-color: #fff;
  line-height: 52px;
  .home-ico {
    color: #d1e9ff;
    margin-right: 8px;
  }
}
</style>
