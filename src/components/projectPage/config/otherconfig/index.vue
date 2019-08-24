<template>
  <div>
      <div class="title">办证配置</div>
      <credential></credential>
      <div class="title">交房配置</div>
      <deliver></deliver>
  </div>
</template>

<script>
import credential from './credential'
import deliver from './deliver'
  export default {
    name: "otherconfig",
    components: {
        credential,
        deliver
    }
  }
</script>

<style lang="less">
.title {
  font-size: 20px;
  text-align: left;
  line-height: 20px;
  padding-top: 20px;
  padding-left: 30px;
}
</style>

