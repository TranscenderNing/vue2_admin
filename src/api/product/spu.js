import request from '@/utils/request'


// 根据第三分类id 和 当前页 每页的容量 获取spu列表
export const getSpuList = (page,limit,id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: {category3Id: id}
})


// 获取Spu信息
export const getSpuById = (id) => request({
    url: `/admin/product/getSpuById/${id}`,
    method: 'get',
})


// 获取品牌信息
export const getTradeMarkList = () => request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: 'get',
})

// 获取spu 图片 
export const getSpuImgs= (id) => request({
    url: `/admin/product/spuImageList/${id}`,
    method: 'get',
})


// 获取 平台全部销售属性  整个平台销售属性一共三个
export const getSaleAttrList = () => request({
    url: `/admin/product/baseSaleAttrList`,
    method: 'get',
})

// 修改 或者 添加 spu 
export const addOrUpdateSpu = (params) => {
    if(params.id){
        // 修改id
        return request({
            url: `/admin/product/updateSpuInfo`,
            method: 'post',
            data:params
        })
    }else{
        return request({
            url: `/admin/product/saveSpuInfo`,
            method: 'post',
            data:params
        })
    }
}



// 删除spu
export const deleteSpu = (id) => request({
    url: `/admin/product/deleteSpu/${id}`,
    method: 'delete',
})









