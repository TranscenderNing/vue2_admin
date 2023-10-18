import request from '@/utils/request'


//////////////////////////////////////spu操作sku
// 获取图片的数据
export const getrImageList = (spuId)=>{
    return request({
        url:`/admin/product/spuImageList/${spuId}`,
        method: 'get',

    })
}

// 获取销售属性的数据
export const getSaleAttrList = (spuId)=>{
    return request({
        url:`/admin/product/spuSaleAttrList/${spuId}`,
        method: 'get',

    })
}

// 获取平台属性的数据
export const getAttrInfoList = (category1Id,category2Id,category3Id)=>{
    return request({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get',

    })
}


// 保存数据
export const saveSkuInfo = (data)=>{
    return request({
        url:`/admin/product/saveSkuInfo`,
        method: 'post',
        data
    })
}



// 根据spuid 获取sku列表数据
export const getSkuListBySpuId = (spuId)=>{
    return request({
        url:`/admin/product/findBySpuId/${spuId}`,
        method: 'get',
    })
}


//////////////////////////////////////// sku 

// 根据spuid 获取sku列表数据
export const getSkuData = (page,limit)=>{
    return request({
        url:`/admin/product/list/${page}/${limit}`,
        method: 'get',
    })
}


// 上架产品
export const skuOnSale = (skuId)=>{
    return request({
        url:`/admin/product/onSale/${skuId}`,
        method: 'get',
    })
}


// 下架产品
export const skuCancelSale = (skuId)=>{
    return request({
        url:`/admin/product/cancelSale/${skuId}`,
        method: 'get',
    })
}

// 根据skuid获取sku详情
export const getSkuDetailById = (skuId)=>{
    return request({
        url:`/admin/product/getSkuById/${skuId}`,
        method: 'get',
    })
}
