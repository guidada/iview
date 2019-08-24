<template>
  <Carousel v-model="index" loop style="width: 100%;background-color: white">
    <CarouselItem
      v-for="(item,index) in swiperList"
      :key="index"
      style="display: flex;justify-content: center;"
    >
      <div style="width: 750px;height: 600px;display: flex;justify-content: center;align-items: center;">
        <img :src="item.avatar" style=" max-width: 750px;max-height: 600px;height:auto;">
      </div>
    </CarouselItem>
  </Carousel>
</template>

<script>
  export default {
    name: "swiper",
    data() {
      return {
        index:0
      }
    },
    props: ['swiperList', 'currentPicIndex'],
    created() {
      // console.log('轮播图列表====', this.swiperList)
      this.index = parseInt(this.currentPicIndex) || 0
    },
  }
</script>

<style lang="less">

</style>
