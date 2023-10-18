<template>
    <div>
        三级联动菜单
        <el-form :inline="true"  class="demo-form-inline" :model="cForm">

            <el-form-item label="一级分类">
                <el-select  placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
                    <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id">

                    </el-option>
                </el-select>
            </el-form-item>


            <el-form-item label="二级分类">
                <el-select  placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show"> 
                    <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id">

                    </el-option>
                </el-select>
            </el-form-item>


            <el-form-item label="三级分类">
                <el-select  placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
                    <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
export default {
    name: 'CatogorySelect',
    data(){
        return {
            list1: [],
            list2: [],
            list3: [],
            // 收集分类id
            cForm:{
                category1Id: '',
                category2Id: '',
                category3Id: '',
            }
        }
    },
    props: ['show'],
    mounted(){
        this.getCategory1()
    },
    methods: {
        async getCategory1(){
            let res = await this.$API.attr.getCategory1()
            console.log('1：',res)
            if(res.code === 200){
                this.list1 = res.data
            }
        },
        async handler1(){
            // 清除数据
            this.list2 = []
            this.list3 = []
            this.cForm.category2Id = ''
            this.cForm.category3Id = ''
            // 向服务器请求 二级分类数据
            let {category1Id} = this.cForm
            this.$emit('getCategoryId',{id:category1Id,level:1})
            console.log(category1Id)
            let res = await this.$API.attr.getCategory2(category1Id)
            console.log('2',res)
            if(res.code === 200){
                this.list2 = res.data
            }
        },
        async handler2(){
            // 清除数据
            this.list3 = []
            this.cForm.category3Id = ''
            // 向服务器请求 三级分类数据
            let {category2Id} = this.cForm
            this.$emit('getCategoryId',{id:category2Id,level:2})
            console.log(category2Id)
            let res = await this.$API.attr.getCategory3(category2Id)
            console.log('3',res)
            if(res.code === 200){
                this.list3 = res.data
            }
        },
        async handler3(){
            let {category3Id} = this.cForm
            this.$emit('getCategoryId',{id:category3Id,level:3})
        }
    }
}
</script>

<style></style>