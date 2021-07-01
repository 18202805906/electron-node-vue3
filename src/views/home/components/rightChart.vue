<template>
  <div id="rightChart" style="width: 87%; min-height: 350px"></div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import * as echarts from 'echarts';
import stats from '@/api/home';
export default defineComponent({
  setup() {
    let data = [];
    let className = [];
    const colorList = ['#39B3FF', '#FF8439', '#7891D9', '#83D978', '#C7A530', '#47E0E0'];
    const defaultData = [100, 100, 100, 100, 100, 100];
    const initEcharts = () => {
      const myChart = echarts.init(document.getElementById('rightChart'));
      const option = {
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          formatter(params) {
            return (
              params[0].name +
              '<br/>' +
              "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
              // params[0].seriesName + ' : ' + Number((params[0].value.toFixed(4) / 10000).toFixed(2)).toLocaleString() + ' <br/>'
              params[0].seriesName +
              ' : ' +
              params[0].value
            );
          }
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: 'black'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: className
          },
          {
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            show: true,
            axisLabel: {
              textStyle: {
                color: '#ffffff',
                fontSize: '12'
              },
              formatter(value) {
                return value + ' %';
              }
            },
            data
          }
        ],
        series: [
          {
            name: '订购数',
            type: 'bar',
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: (params) => {
                  return colorList[params.dataIndex];
                }
              }
            },
            barWidth: 20,
            data
          },
          {
            name: '背景',
            type: 'bar',
            barWidth: 20,
            barGap: '-100%',
            data: defaultData,
            itemStyle: {
              normal: {
                color: '#1B375E',
                barBorderRadius: 0
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    };
    onMounted(() => {
      stats.countRanking().then((res) => {
        if (res.code === 200) {
          res.data.map((item) => {
            data.push(item.count);
            className.push(item.machineModel);
            initEcharts();
          });
        }
      });
    });
  }
});
</script>
