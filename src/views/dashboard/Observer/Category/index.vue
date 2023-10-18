<template>
    <el-card>
        <div slot="header" class="header">
            <div class="catogory-header">
                <span>销售额类别占比</span>
                <el-radio-group v-model="radio1">
                    <el-radio-button label="全部渠道"></el-radio-button>
                    <el-radio-button label="线上"></el-radio-button>
                    <el-radio-button label="门店"></el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div>
            <div class="pieChart" ref="pieChart"></div>
        </div>
    </el-card>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: 'Category',
    data() {
        return {
            radio1: '全部渠道'
        }
    },
    mounted() {
        let lineChart = echarts.init(this.$refs.pieChart)
        lineChart.setOption({
            title:{
                text: '视频',
                subtext: 1048,
                left: 'center',
                top: 'center',
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'outside'
                    },
                    labelLine: {
                        show: true
                    },
                    data: [
                        { value: 1048, name: '视频' },
                        { value: 735, name: '图片' },
                        { value: 580, name: '音频' },
                        { value: 484, name: '广告' },
                        { value: 300, name: '邮件' }
                    ]
                }
            ]
        })
        lineChart.on('mouseover',(params)=>{
            const {name,value} = params.data
            lineChart.setOption({
                title:{
                text: name,
                subtext: value,
                left: 'center',
                top: 'center',
            },
            })
        })
    }
}
</script>

<style scoped>
.catogory-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header {
    border-bottom: 1px solid #eee;
    padding: 5px;
}

.pieChart {
    width: 100%;
    height: 300px;
}
</style>