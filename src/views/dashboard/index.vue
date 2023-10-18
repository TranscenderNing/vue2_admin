<template>
  <div class="dashboard-container">
    <Card />
    <Sale />
    <Observer />
  </div>
</template>

<script>

import Card from './Card'
import Sale from './Sale'
import Observer from './Observer'
export default {
  name: 'Dashboard',
  components:{
    Card,
    Sale,
    Observer
  },
  mounted(){
    this.$store.dispatch('getData')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
