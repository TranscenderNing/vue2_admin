<template>
    <el-card>
        <div slot="header" class="header">
            <div class="search-header">
                <span>线上热门搜索</span>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>黄金糕</el-dropdown-item>
                        <el-dropdown-item>狮子头</el-dropdown-item>
                        <el-dropdown-item>螺蛳粉</el-dropdown-item>
                        <el-dropdown-item>双皮奶</el-dropdown-item>
                        <el-dropdown-item>蚵仔煎</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div>
            <el-row :gutter="10">
                <el-col :span="12">
                    <MiddleLineChart />
                </el-col>
                <el-col :span="12">
                    <MiddleLineChart />
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table :data="[{}]" style="width: 100%" :default-sort="{ prop: 'date', order: 'descending' }" border>
                <el-table-column type="index" label="排名" width="80">
                </el-table-column>
                <el-table-column prop="name" label="搜索关键字" width="width">
                </el-table-column>
                <el-table-column prop="address" label="用户数" :formatter="formatter" sortable width="width">
                </el-table-column>
                <el-table-column prop="address" label="周涨幅" :formatter="formatter" sortable width="width">
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination layout="prev, pager, next" :total="1000" class="pagination">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
import MiddleLineChart from './middleLineChart'
export default {
    name: 'Search',
    components: {
        MiddleLineChart,
    }

}
</script>

<style scoped>
.search-header {
    display: flex;
    justify-content: space-between;
}

.header {
    border-bottom: 1px solid #eee;
    padding: 5px 0px;
}

.pagination{
    float: right;
}
</style>