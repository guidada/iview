<template>
  <div class="header">
    <fullscreen v-model="isFullscreen"></fullscreen>
    <!-- 右侧登录信息 -->
    <div class="header_right">
      <div class="username" style="display: flex;justify-content: space-between;align-items: center">
        <img :src="userInfo.avatar" width="25" style="border-radius: 50%;margin-right: 10px">
        <span>{{userInfo.name}}</span>
      </div>
      <div class="notice model" style="display: flex;justify-content: space-between;align-items: center">
        <Icon type="ios-mail-outline" size="20"/>
        <div class="notice_text">通知</div>
      </div>
      <div class="exit model" @click="loginOut"
           style="display: flex;justify-content: space-between;align-items: center">
        <Icon type="ios-exit-outline" size="20"/>
        <div class="exit_text">退出</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import fullscreen from '@/components/common/fullscreen'

  export default {
    name: 'commonHeader',
    data() {
      return {
        userInfo: {},
        isFullscreen: false
      }
    },
    components: {
      fullscreen,
    },
    computed: {
      ...mapGetters({
        getUserInfo: 'getUserInfo'
      })
    },
    created() {
      console.log(window.homeurl)
      // console.log('用户信息：', this.getUserInfo)
      this.userInfo = this.getUserInfo
      this.isLogin()
    },
    methods: {
      loginOut() {
        this.$post('/logout')
          .then((res) => {
            if (res.status_code !== 200) return this.$Message.error('退出失败，请稍后重试~')
            this.$Message.success('退出成功~')
            this.$store.commit('setUserInfo', {action:0})
            setTimeout(() => {
              window.location.replace(window.location.origin)
            }, 1000)
          })
          .catch((err) => {
            this.$Message.error('退出失败，请稍后重试~')
            console.log(err)
          })
      },
      isLogin() {
        this.$post('/is_login').then(res => {
          var i = 5
          if (res.status_code !== 200) {
            var timeId = setInterval(() => {
              this.$Modal.error({
                title: '服务器错误',
                content: ` ${i--}秒后即将退出!`
              })
              if (i < 0) {
                this.loginOut()
                clearInterval(timeId)
              }
            }, 1000)
            return false
          }
          if (!res.data.action) {
            var timeId2 = setInterval(()=>{
              i--
              this.$Modal.error({
                title: '登录异常警告！',
                content: ` 您的账号在其他地方登录了，即将退出!`
              })
              if (i < 0) {
                this.loginOut()
                clearInterval(timeId2)
              }
            },600)
          }
        })
      }
    },
    watch: {
      $route() {
        this.isLogin()
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    border-bottom: 1px solid #ebebeb;
    height: 64px;
    line-height: 64px;
    padding-right: 40px;
    display: flex;
    justify-content: flex-end;
    position: relative;
    
    .header_right {
      font-size: 14px;
      margin-left: 30px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .model {
        margin-left: 40px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          color: red;
        }
        div {
          margin-left: 6px;
        }
      }

    }
  }

</style>
