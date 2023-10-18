import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,anyRoutes,asyncRoutes,constantRoutes } from '@/router'

import router from '@/router'
// import user from 'mock/user'

const computeRoutes = (asyncRoutes,serveRoutes)=>{
    return asyncRoutes.filter(item=>{
      if(serveRoutes.indexOf(item.name) != -1){
        if(item.children && item.children.length){
          item.children = computeRoutes(item.children,routes)
        }
        return true
      }
    })
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes:[],
    buttons:[],
    roles:[],
    // 异步路由
    resultAsyncRoutes: [],
    allRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state,userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  SET_ASYNCROUTES: (state,asyncRouteResult) =>{
    state.resultAsyncRoutes = asyncRouteResult
    state.allRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    router.addRoutes(state.allRoutes)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const { name, avatar } = data
        // console.log('usrinfo',data)

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)

        commit('SET_USERINFO',data)

  

        commit('SET_ASYNCROUTES',computeRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

