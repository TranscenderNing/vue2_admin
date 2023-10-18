<template>
    <el-card class="box-card" style="margin: 15px 0px;">
        <!-- 头部 -->
        <div slot="header" class="clearfix">
            <!-- 左侧 -->
            <el-tabs class="tab" v-model="activeName">
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visitTraffic"></el-tab-pane>
            </el-tabs>
            <!-- 右侧 -->
            <div class="right">
                <span @click="setToday">今日</span>
                <span @click="setWeek">本周</span>
                <span @click="setMonth">本月</span>
                <span @click="setYear">本年</span>
                <el-date-picker  v-model="date" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>
        <!-- 内容 -->
        <div>
            <el-row :gutter="18">
                <el-col :span="18">
                    <div class="barChart" ref="barChart"></div>
                </el-col>
                <el-col :span="6" class="right">
                    <h3>{{ title }}</h3>
                    <ul>
                        <li>
                            <span class="rindex">1</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">2</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">3</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">4</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">5</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">6</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                        <li>
                            <span class="rindex">7</span>
                            <span>肯德基</span>
                            <span class="rvalue">123456</span>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            activeName: 'sale',
            barChart: null,
            // 收集日历的数据
            date: [],
        }
    },
    computed:{
        title(){
            return this.activeName=='sale'?'销售额':'访问量'
        },
        ...mapState({
            list: state => state.home.data
        })
    },
    watch:{
        title(newVal,oldValue){
            this.barChart.setOption({
                title:{
                    text: this.title
                },
                xAxis:{
                    data: this.title=='销售额'? this.list.orderFullYearAxis:this.list.userFullYearAxis
                },
                series:{
                    data: this.title=='销售额'? this.list.orderFullYear:this.list.userFullYear
                }
            })
        },
        list(newVal,oldValue){
            this.barChart.setOption({
            title: {
                text: '销售额趋势'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.list.orderFullYearAxis,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.list.orderFullYear,
                    color: 'greenyellow',
                }
            ]
        })
        }

    },
    mounted() {
        this.barChart = echarts.init(this.$refs.barChart)
        this.barChart.setOption({
            title: {
                text: '销售额趋势'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: [],
                    color: 'greenyellow',
                }
            ]
        })
    },
    methods:{
        setToday(){
            let day = dayjs().format('YYYY-MM-DD')
            this.date = [day,day]
        },
        setWeek(){
            let day1 = dayjs().day(1).format('YYYY-MM-DD')
            let day2 = dayjs().day(7).format('YYYY-MM-DD')
            this.date = [day1,day2]
        },
        setMonth(){
            let day1 = dayjs().startOf('month').format('YYYY-MM-DD')
            let day2 = dayjs().endOf('month').format('YYYY-MM-DD')
            this.date = [day1,day2]
        },
        setYear(){
            let day1 = dayjs().startOf('year').format('YYYY-MM-DD')
            let day2 = dayjs().endOf('year').format('YYYY-MM-DD')
            this.date = [day1,day2]
        },

    }
}
</script>

<style scoped>
ul {
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0px;
}

ul li {
    height: 8%;
    margin: 10px 0px;
}

.clearfix {
    display: flex;
    justify-content: space-between;
    position: relative;
}

.tab {
    width: 100%;
}

.right {
    position: absolute;
    right: 0px;
}

.date {
    width: 200px;
    margin: 0px 20px;
}

.right span {
    margin: 0px 10px;
}

.barChart {
    width: 100%;
    height: 300px;

}

.right {
    padding: 0px;
}

.rindex {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: greenyellow;
    color: white;
    text-align: center;
}

.rvalue {
    float: right;
}
</style>