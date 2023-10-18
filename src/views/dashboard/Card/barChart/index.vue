<template>
  <div class="barChart" ref="barChart">

  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
        console.log(echarts)
        let lineChart = echarts.init(this.$refs.barChart)
        lineChart.setOption({
            xAxis: {
                // 隐藏x轴
                show: false,
                // 均分
                type: 'category'
            },
            yAxis: {
                // 隐藏y轴
                show: false
            },
            series: [
                {
                    type: 'bar',
                    data: [10, 7, 33, 12, 88, 9,48,9,24,32,23,8,6,5],
                    color: 'cyan'
                }
            ],
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
            tooltip:{
              
            }
        })
    }
}
</script>

<style scoped>
.barChart{
    height: 100%;
    width: 100%;
}

</style>