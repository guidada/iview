<template>
  <div class="project_list_container">
    <!--新建项目按钮-->
    <router-link :to="{name:'addProject'}" class="add_project">新建项目</router-link>
    <!--项目列表-->
    <Row :gutter="32" class="project_list">
      <Col :span="span" class="project_item" v-for="item in projectList" :key="item.id">
        <Card class="project_info">

          <img :src="item.avatar" @click="goToProjectDisplay(item)">

          <p class="project_detail">
            <span class="project_name">{{item.name}}</span>
            <span class="project_address">{{item.address}}</span>
          </p>
          <p class="more_operate">
            <span @click="editProject(item)">项目编辑</span>
            <span @click="goToProjectDisplay(item)">项目展示</span>
            <span @click="goToHouseType(item)">户型库</span>
            <span @click="deleteProject(item.id)">删除项目</span>
          </p>
        </Card>
      </Col>
    </Row>
    <div class="no_project" v-if="!projectList.length">{{noDataText?noDataText:'暂无项目'}}</div>
    <!--分页-->
    <div v-if="total>pageSize" style="display: flex;justify-content: center">
      <Page :total="total" :page-size="pageSize" @on-change="changePage"></Page>
    </div>
  </div>
</template>

<script>
  export default {
    name: "projectList",
    data() {
      return {
        // Col的span
        span: 4,
        // 当前body宽度
        screenWidth: document.body.clientWidth,
        // 项目列表
        projectList: [],
        // 总项目数
        total: 0,
        // 每页条数
        pageSize: 12,
        noDataText: '暂无项目'
      }
    },
    created() {
      this.initSpan(this.screenWidth)
      this.getAllProjectList()
    },
    methods: {
      /*
      * 获取到所有的项目列表
      * */
      getAllProjectList() {
        this.$post('/project/lists').then(res => {
          // console.log('/project/lists项目列表',res)
          if (res.status_code !== 200) return this.$Message.error('获取项目列表失败！')
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          var result = res.data.project
          result.forEach(item => {
            item.avatar = item.avatar ? item.avatar : 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3197631341,4284763271&fm=26&gp=0.jpg'
          })
          // console.log('处理后的项目列表', result)
          this.projectList = result
          this.total = result.length
          this.$store.commit('setProjectList', result)
        })
          .catch(err => {
            this.$Message.error('获取项目列表失败！')
          })
      },
      /*
      * 根据屏幕宽度screenWidth修改span的值
      * */
      initSpan(screenWidth) {
        if (screenWidth > 1560) {
          this.span = 4
        } else if (screenWidth < 1560 && screenWidth > 1280) {
          this.span = 6
        } else {
          this.span = 8
        }
      },
      /*
      * 分页功能，页面跳转
      * */
      changePage(e) {
        // console.log("当前页面==========", e)
      },
      /*
      * 跳转到项目编辑页
      * */
      editProject(data) {
        this.$store.commit('setCurrentProjectInfo', data.id)
        localStorage.setItem('projectId', data.id)
        localStorage.setItem('currentProjectInfo', JSON.stringify(data))
        this.$router.push({
          name: 'editProject',
          params: {id: data.id}
        })
      },
      /*
      * 跳转到项目展示页面 projectDisplay
      * */
      goToProjectDisplay(data) {
        this.$store.commit('setCurrentProjectInfo', data.id)
        localStorage.setItem('projectId', data.id)
        localStorage.setItem('currentProjectInfo', JSON.stringify(data))
        this.$router.push({
          name: 'projectDisplay',
          params: {id: data.id}
        })
      },
      /*
      * 跳转到户型库页面
      * */
      goToHouseType(data) {
        this.$store.commit('setCurrentProjectInfo', data.id)
        localStorage.setItem('projectId', data.id)
        localStorage.setItem('currentProjectInfo', JSON.stringify(data))
        this.$router.push({
          name: 'houseType',
          params: {id: data.id}
        })
      },
      /*
      * 删除项目
      * */
      deleteProject(id) {
        this.$post('/project/deleteProject', {id: id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('删除项目失败！')
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          this.$Message.success('删除项目成功！')
          var list = this.projectList
          list.forEach((item, index) => {
            if (item.id === id) {
              list.splice(index, 1)
            }
          })
          this.projectList = list
        })
          .catch(error => {
            this.$Message.error('删除项目失败！')
          })
      },
    },
    mounted() {
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
    },
    watch: {
      screenWidth(val) {
        if (!this.timer) {
          this.screenWidth = val
          this.timer = true
          let that = this
          setTimeout(function () {
            that.initSpan(val)
            that.timer = false
          }, 400)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .project_list_container {
    font-size: 12px;
    padding: 30px 30px 80px;

    .add_project {
      background-color: #169BD5;
      color: #ffffff;
      font-size: 16px;
      padding: 10px 30px;
      border-radius: 5px;

      &:hover,
      &:active {
        background-color: #318cd5;
        color: #F0F0F0;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, .3);
      }
    }

    /*项目列表*/
    .project_list {
      padding: 30px 0;
      .project_item {
        width: 300px;
        height: 400px;

        .ivu-card {
          font-size: 12px !important;
        }

        .project_info {
          box-sizing: border-box;
          box-shadow: 1px 0 2px 1px rgba(0, 0, 0, .3);

          &:hover {
            box-shadow: 2px 1px 3px 2px rgba(0, 0, 0, .4);
            transform: scale(1.05);
          }
          img {
            width: 100%;
            height: 250px;
            cursor: pointer;
          }

          .project_detail {
            display: flex;
            justify-content: space-between;
            line-height: 40px;
            border-bottom: 1px solid #c3c3c3;

            .project_name {
              flex: 2;
              font-size: 16px;
              font-weight: 700;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .project_address {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: right;
            }

          }

          .more_operate {
            display: flex;
            justify-content: space-between;
            line-height: 20px;
            margin-top: 10px;

            span {
              color: #348EED;
              cursor: pointer;
            }
          }

        }

      }

    }

    .no_project {
      width: 100%;
      font-size: 20px;
      color: #aaa;
      text-align: center;
      margin-top: 100px;
    }
  }
</style>
