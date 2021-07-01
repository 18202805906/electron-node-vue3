<template>
  <a-card>
    <div class="title-box r-nw-sb-c">
      <div class="r-nw-fs-c"><span class="line"></span>基础操作</div>
    </div>
    <div class="scenario-box">
      <div class="scene-card-wrap">
        <basic-card v-for="item in operationList" :key="item.id" :cover="item.iconPath" :title="item.name" :meta="item.description"></basic-card>
      </div>
    </div>
  </a-card>
</template>

<script>
import BasicCard from './BasicCard';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'BasisOperation',
  components: {
    BasicCard
  },

  setup() {
    const operationList = [
      { id: '1', name: '快速录入', description: '快速进入功放管理页面进行数据录入', iconPath: require('../../../assets/images/start.png') },
      { id: '2', name: '导入', description: '快速导入功放数据', iconPath: require('../../../assets/images/import.png') },
      { id: '3', name: '导出', description: '快速导出功放数据', iconPath: require('../../../assets/images/export.png') }
    ];
    return {
      operationList
    };
  }
});
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.title-box {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
  letter-spacing: 1px;
  margin-bottom: 30px;
  .line {
    display: block;
    width: 3px;
    height: 15px;
    background-color: #3388ff;
    margin-right: 15px;
  }
}
.scene-card-wrap {
  display: flex;
  justify-content: flex-start;
  padding: 10px 0;
  // flex-wrap: wrap;
}
.scenario-box {
  :deep .ant-card-cover {
    height: 210px;
  }
  :deep .ant-card-body {
    padding: 0;
    line-height: 40px;
  }
  .item {
    margin-right: 8%;
    &:last-child {
      margin-right: 0;
    }
    .img {
      height: 220px;
      width: 100%;
      object-fit: cover;
    }
    .description {
      display: none;
    }
  }
  .item :hover {
    position: relative;
    .description {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 253px;
      z-index: 9999;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.3);
      span {
        display: inline-block;
        width: 90%;
        margin: 0 auto;
        color: #fff;
        line-height: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
