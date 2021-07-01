<!--
  @author:  zj
  @date:    2021/4/27
  @file:    xx
  @require:
-->
<template>
  <div class="r-nw-sb-fs" style="margin-top: 10px">
    <a-card style="width: 48%; min-height: 350px">
      <div class="r-nw-sb-c">
        <span class="title-box"><span class="line"></span>前5名订单数统计（台）</span>
        <a-radio-group>
          <a-radio-button value="currentMonth"> 本月 </a-radio-button>
        </a-radio-group>
      </div>
      <leftCharts></leftCharts>
    </a-card>
    <div style="width: 10px"></div>
    <a-card style="flex: 1; min-height: 350px">
      <div class="r-nw-sb-c">
        <span class="title-box"><span class="line"></span>热门功放型号排行</span>
        <a-radio-group>
          <a-radio-button value="currentMonth"> 本月 </a-radio-button>
        </a-radio-group>
      </div>
      <rightCharts></rightCharts>
    </a-card>
  </div>
</template>

<script>
//import Home from '@/api/home';
import { formatTimestamp } from '@/utils/index';
import leftCharts from './leftChart.vue';
import rightCharts from './rightChart.vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'statistic',
  components: {
    leftCharts,
    rightCharts
  },
  setup() {
    let sysLoading = ref(false);
    let accountedLoading = ref(false);
    // const getAccountedList = () => {
    //   this.accountedLoading = true;
    //   stats.proportionRanking(params)
    //     .then((res) => {
    //       let data = res.data;
    //       let totalCount = data.totalCount;
    //       data.apiRankingList.forEach((item) => {
    //         item.accountdNum = Math.round((item.callCount / totalCount) * 100);
    //         item.accountd = item.accountdNum + '%';
    //       });
    //       this.accountedList = data.apiRankingList;
    //     })
    //     .finally(() => {
    //       this.accountedLoading = false;
    //     });
    // };
    // const getPersonList = () => {
    //   this.sysLoading = true;
    //   Home.countRanking(params)
    //     .then((res) => {
    //       this.systemList = res.data;
    //     })
    //     .finally(() => {
    //       this.sysLoading = false;
    //     });
    // };
    // 获取本月时间
    const getMonthTime = () => {
      let TimeNow = new Date();
      let startDay = new Date(TimeNow.getFullYear(), TimeNow.getMonth(), 1); //当月1号
      let endDay = new Date(TimeNow.getFullYear(), TimeNow.getMonth(), TimeNow.getDate(), 23, 59, 59); //23:59:59 将结束时间改成前一天
      return [formatTimestamp(startDay), formatTimestamp(endDay)];
    };
    // onMounted(() => {
    //   getAccountedList();
    //   getPersonList();
    // });
    return {
      sysLoading,
      accountedLoading
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
  .line {
    display: inline-block;
    width: 3px;
    height: 15px;
    background-color: #3388ff;
    margin-right: 15px;
  }
}
.circle {
  :deep .ant-progress-inner {
    width: 16px !important;
    height: 16px !important;
  }
}
.table-box {
  :deep .ant-table-row {
    height: 30px;
  }
}
:deep.ant-progress-text {
  display: none;
}
</style>
