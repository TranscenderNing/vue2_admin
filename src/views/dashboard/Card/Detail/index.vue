<template>
  <div>
    <div class="card-header">
        {{ title }}
        <svg t="1695007617697" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4628" width="16" height="16"><path d="M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m0 73.142857C323.486476 170.666667 170.666667 323.486476 170.666667 512s152.81981 341.333333 341.333333 341.333333 341.333333-152.81981 341.333333-341.333333S700.513524 170.666667 512 170.666667z m36.571429 268.190476v292.571428h-73.142858V438.857143h73.142858z m0-121.904762v73.142857h-73.142858v-73.142857h73.142858z" p-id="4629" fill="#8a8a8a"></path></svg>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
        <slot name="charts"></slot>
    </div>
    <div class="card-footer">
        <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {

    props: ['title','count'],

}
</script>

<style scoped>

.card-header{
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
}
.card-content{
    font-size: 30px;
    padding: 10px 0px
}
.card-charts{
    height: 50px;
}
.card-footer{
    border: 1px solid #eee;
    padding-top: 10px;
}

</style>