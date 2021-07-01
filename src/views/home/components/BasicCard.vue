<template>
  <div class="scene-card" @click="handleOperation">
    <div class="cover">
      <img :src="coverPath" :alt="title" />
    </div>
    <div class="txt">
      <h3 class="title">{{ title }}</h3>
      <p class="info">{{ meta }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  props: {
    cover: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      dedault: ''
    },
    meta: {
      type: String,
      dedault: ''
    }
  },

  setup(props) {
    const router = useRouter();
    const coverPath = computed(() => {
      return props.cover || require('../../../assets/images/cover.jpg');
    });
    //跳转到功放新增
    const addData = () => {
      router.push({
        path: '/orderManage'
      });
    };

    //导出
    const exportData = () => {};
    //导入
    const importData = () => {};
    const handleOperation = () => {
      switch (props.title) {
        case '快速录入':
          addData();
          break;
        case '导入':
          importData();
          break;
        case '导出':
          exportData();
          break;
      }
    };
    return {
      coverPath,
      handleOperation
    };
  }
});
</script>

<style lang="less" scoped>
.scene-card {
  box-shadow: 0 0 10px 0 rgba(#000, 0.1);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(@border-color-base, 0.5);
  margin: 0 16px 20px;
  cursor: pointer;
  transition: all 0.7s ease;
  box-sizing: border-box;
  flex: 0 0 calc(33.33% - 32px);
  .cover {
    height: 160px;
    width: 100%;
    border-bottom: 1px solid rgba(@border-color-base, 0.2);
    overflow: hidden;
    img {
      transition: all 0.7s ease;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .txt {
    padding: 20px;
    text-align: center;
  }
  .title {
    font-size: 18px;
    color: #252b3a;
    margin: 0;
  }
  .info {
    font-size: 14px;
    color: #999;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    margin-bottom: 6px;
    margin-top: 6px;
  }
  .more {
    color: @primary-color;
    transition: all 0.6s ease;
    margin-left: 20px;
    opacity: 0;
    font-size: 12px;
  }
  &:hover {
    transform: translateY(-10px);
    border: 1px solid rgba(@border-color-base, 1);
    .cover img {
      transform: scale(1.1);
    }
    .more {
      margin-left: 0;
      opacity: 1;
    }
  }
}

@media only screen and (max-width: 1700px) {
  .scene-card {
    flex: 0 0 calc(33.333% - 32px);
    &:nth-of-type(4) {
      display: block;
    }
    &:nth-of-type(5) {
      display: none;
    }
  }
}
@media only screen and (max-width: 1400px) {
  .scene-card {
    flex: 0 0 calc(33.333% - 32px);
    &:nth-of-type(4),
    &:nth-of-type(5) {
      display: none;
    }
  }
}
</style>
