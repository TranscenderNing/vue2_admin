import mockRequest from '@/utils/mockRequest'
const state = {
 data:{}
}
const actions = {
    async getData({commit},){
        let res = await mockRequest.get('/home/list')
        console.log('mock',res)
        if(res.code == 20000){
            commit('GETDATA',res.data)
        }
    }
}
const mutations = {
    GETDATA(state,data){
        state.data = data
    }
}
const getters = {

}


export default {
    state,
    actions,
    mutations,
    getters,
}