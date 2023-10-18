<template>
    <div class="progressChart" ref="progressChart">

    </div>
  
</template>

<script>
import * as echarts from 'echarts'
export default {
    mounted() {
        let lineChart = echarts.init(this.$refs.progressChart)
        lineChart.setOption({
            xAxis: {
                show: false,
                min: 0,
                max: 100,
            },
            yAxis: {
                show: false,
                type: 'category'
            },
            series: [
                {
                    type: 'bar',
                    data: [78],
                    color: 'yellowgreen',
                    barWidth: '10px',
                    showBackground: true,
                    backgroundStyle:{
                        color: '#eee',
                    },
                    label:{
                        show: true,
                        formatter: '|',
                        position: 'right',
                    }
                }
            ],
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            }
        })
    }
}
</script>

<style scoped>
.progressChart{
    width: 100%;
    height: 100%;
}

</style>