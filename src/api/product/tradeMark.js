import request from '@/utils/request'

// 获取品牌列表接口
export const getTradeMarkList = (page,limit) => request({url: `/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

// 添加品牌接口  新增 不需要id  id由服务器生成
// 修改已有品牌数据  需要携带 id ，名称， 品牌logo
export const addOrUpdateTradeMark = (tradeMark) => {
    if(tradeMark.id){
        // 修改
        return request({
            url: `/admin/product/baseTrademark/update`,
            method: 'put',
            data: tradeMark
        })
    }else{
        // 新增
        return request({
            url: `/admin/product/baseTrademark/save`,
            method: 'post',
            data: tradeMark
        })
    }
}

// 删除品牌 id
export const deleteTradeMark = (id) => request({url: `/admin/product/baseTrademark/remove/${id}`,method:'delete'})



