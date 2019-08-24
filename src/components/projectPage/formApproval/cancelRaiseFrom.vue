<template>
  <div class="cancelRaise_container">
    <Card v-if="isAddCancelRaise">
      <addCancelRaise
        :projectInfo="projectInfo"
        :isAddCancelRaise="isAddCancelRaise"
        @cancelAdd="cancelAdd"
        @addSuccess="addSuccess"
      ></addCancelRaise>
    </Card>
    <Tabs
      v-else
      type="card"
      :value="currentTap"
      @on-click="changeTap"
    >
      <TabPane label="我创建的" name="创建">
        <myCreate
          ref="myCreate"
          @gotoAddCancelRaise="gotoAddCancelRaise"
          @getShenPiCount="getShenPiCount"
          :currentTap="currentTap"
        ></myCreate>
      </TabPane>
      <TabPane :label="shen_pi_label" name="审批">
        <myShenPi
          ref="myShenPi"
          :currentTap="currentTap"
          @getShenPiCount="getShenPiCount"
        ></myShenPi>
      </TabPane>
      <TabPane :label="chao_song_label" name="抄送">
        <myChaoSong
          ref="myChaoSong"
          :currentTap="currentTap"
        ></myChaoSong>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import myCreate from './cancelRaiseFrom/myCreate'
  import myShenPi from './cancelRaiseFrom/myShenPi'
  import myChaoSong from './cancelRaiseFrom/myChaoSong'
  import addCancelRaise from './cancelRaiseFrom/addCancelRaise'
  import {mapGetters} from 'vuex'

  export default {
    name: "cancelRaiseForm",
    components: {
      myCreate,
      myShenPi,
      myChaoSong,
      addCancelRaise,
    },
    computed: {
      ...mapGetters({
        getUserInfo: 'getUserInfo'
      })
    },
    data() {
      return {
        currentTap: '创建',
        // 待审批的
        shenPiCount: 1,
        shen_pi_label: (h) => {
          return h('div', [
            h('span', '我审批的'),
            h('Badge', {
              props: {
                count: this.shenPiCount
              },
              style: {
                position: 'absolute',
                top: '10px'
              }
            })
          ])
        },
        // 抄送给我的
        chaoSongCount: 2,
        chao_song_label: (h) => {
          return h('div', [
            h('span', '抄送给我的'),
            h('Badge', {
              props: {
                count: this.chaoSongCount
              },
              style: {
                position: 'absolute',
                top: '10px'
              }
            })
          ])
        },
        // 是否是新建解筹单
        isAddCancelRaise: false,
        // 当前项目的基本信息
        projectInfo: {},
      }
    },
    created() {
      this.getProjectInfo(parseInt(this.$route.params.id))
      //console.log('getUserInfo==========',this.getUserInfo)
      this.shenPiCount = this.getUserInfo.jiechou_shenhe_count
      this.chaoSongCount = this.getUserInfo.jiechou_chaosong_count
      this.getShenPiCount()
    },
    methods: {
      /*
     *  获取到当前项目的信息
     * */
      getProjectInfo(id) {
        this.$post('/project/lists').then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取项目信息失败！')
          var result = res.data.project
          this.projectInfo = result.find(item => {
            return item.id === id
          })
          // console.log('当前项目的基本信息==========', this.projectInfo)
        }).catch(err => {
          this.$Message.error('获取项目信息失败！')
        })
      },
      /*
      *  标签切换的处理，模拟了数据已读之后不显示的效果
      *  标签切换的时候根据标签名获取到对应的数据
      * */
      changeTap(res) {
        this.currentTap = res
        if (res === '审批') {
          this.$refs.myShenPi.getCancelRaiseListByTap(res)
          this.$refs.myShenPi.cancelView()
        } else if (res === '抄送') {
          this.$refs.myChaoSong.getCancelRaiseListByTap(res)
          this.$refs.myChaoSong.cancelView()
          this.$post('/chaosong/clear', {type: 'jiechou'}).then(res => {
            // console.log('读取抄送信息的返回结果', res)
            if (res.status_code !== 200) return this.$Message.error('读取未读抄送信息失败！')
            this.chaoSongCount = 0
          }).catch(err => {
            this.$Message.error('读取未读抄送信息失败！')
            console.log(err)
          })
        } else {
          this.$refs.myCreate.getCancelRaiseListByTap(res)
          this.$refs.myCreate.cancelView()
        }
      },
      /*
      * 去新建解筹单
      * */
      gotoAddCancelRaise(res) {
        this.isAddCancelRaise = res
      },
      /*
      * 取消创建解筹单
      * */
      cancelAdd() {
        this.isAddCancelRaise = false
      },
      /*
      *  创建解筹单成功
      * */
      addSuccess() {
        this.isAddCancelRaise = false
      },
      /*
     *  审批之后的处理，获取到最新的审批数
     * */
      getShenPiCount() {
        this.$post('/shenhe/count', {type: 'jiechou'}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('更新未审核数信息失败！')
          this.shenPiCount = res.data
        }).catch(err => {
          this.$Message.error('更新未审核数信息失败！')
          console.log(err)
        })
      },
    },
  }
</script>

<style lang="less">
  .cancelRaise_container {
    padding: 20px 30px 50px;

    /*标签*/
    .ivu-tabs-nav-scroll {
      background-color: #f2f2f2;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
      height: 71px;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
      background-color: #F2F2F2;
      font-size: 18px;
      color: #797979;
      padding: 0 50px;
      border: 0;
      font-weight: 700;
      height: 70px;
      line-height: 70px;
      border-radius: 0;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
      background-color: #8CC8FF;
      color: #ffffff;
    }
    .ivu-tabs-bar {
      margin-bottom: 40px;
      border: 0;
    }
    .ivu-col {
      min-width: 165px;
    }

  }
</style>
