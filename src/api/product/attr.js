import request from '@/utils/request'

// 获取一级分类数据
export const getCategory1 = () => request({
    url: `/admin/product/getCategory1`,
    method: 'get',
})

// 获取二级分类数据 根据一级id获取
export const getCategory2 = (id) => request({
    url: `/admin/product/getCategory2/${id}`,
    method: 'get',
})

// 获取三级级分类数据  根据二级id获取
export const getCategory3 = (id) => request({
    url: `/admin/product/getCategory3/${id}`,
    method: 'get',
})


// 根据一级id, 二级id,三级id 获取平台属性列表
export const getAttrList = (id1,id2,id3) => request({
    url: `/admin/product/attrInfoList/${id1}/${id2}/${id3}`,
    method: 'get',
})



// 添加属性和 属性值 属性值可以有多个
export const saveAttrInfo = (data) => request({
    url: `/admin/product/saveAttrInfo`,
    method: 'post',
    data
})