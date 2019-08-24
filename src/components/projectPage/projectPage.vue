<template>
  <div class="layout">
    <Layout>
      <!--左侧导航-->
      <Sider ref="leftNav" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" style="height: 99.89vh;width: 300px">
        <left-nav :class="menuitemClasses" :isCollapsed="isCollapsed" :projectAvatar="projectAvatar" @setBreadcrumb="setBreadcrumb"></left-nav>
      </Sider>
      <!--右侧内容-->
      <Layout style="height: 98vh;">
        <!--头部-->
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
          <commonHeader></commonHeader>
        </Header>
        <!-- 面包屑-->
        <Breadcrumb :style="{margin: '16px',padding: '20px', background: '#fff'}">
          <BreadcrumbItem to="/">项目列表</BreadcrumbItem>
          <BreadcrumbItem>{{projectInfo.name}}</BreadcrumbItem>
          <BreadcrumbItem v-if="subItem">{{subItem}}</BreadcrumbItem>
        </Breadcrumb>
        <!--内容区域-->
        <Content :style="{margin: '0 20px', background: '#fff'}">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import commonHeader from '@/components/common/commonHeader'
  import leftNav from '../common/leftNav'

  export default {
    name: "projectPage",
    data() {
      return {
        isCollapsed: false,
        projectInfo: {},
        projectAvatar: '',
        subItem: ''
      }
    },
    created() {
      var id = parseInt(this.$route.params.id)
      this.getProjectInfoById(id)
    },
    components: {
      leftNav,
      commonHeader,
    },
    computed: {
      ...mapGetters({
        getCurrentProjectInfo: 'getCurrentProjectInfo'
      }),
      rotateIcon() {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ]
      },
      menuitemClasses() {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    methods: {
      collapsedSider() {
        this.$refs.leftNav.toggleCollapse()
      },
      /*
       * 通过id获取指定项目的数据
       * */
      getProjectInfoById(id) {
        this.$post('/project/lists').then(res => {
            if (res.status_code !== 200) return this.$Message.error('获取项目列表失败！')
            if (res.data === '没有权限') {
              this.$Modal.error({
                title: '警告',
                content: '没有权限'
              })
              return false
            }
            var result = res.data.project
            var projectInfo = result.find(item => {
              return item.id === id
            })
            projectInfo.type = projectInfo.type.split(' ')
            // console.log('找到的projectInfo==',projectInfo)
            this.projectInfo = projectInfo
            this.projectAvatar = projectInfo.avatar
          })
          .catch(err => {
            this.$Message.error('获取项目列表失败！')
          })
      },
      setBreadcrumb(res) {
        this.subItem = res
      }
    }
  }
</script>

<style lang="less">
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;

    .layout-header-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    }

    .menu-icon {
      transition: all .3s;
    }

    .rotate-icon {
      transform: rotate(-90deg);
    }

    .menu-item span {
      display: inline-block;
      overflow: hidden;
      width: 80px;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
      transition: width .2s ease .2s;
    }

    .menu-item i {
      transform: translateX(0px);
      transition: font-size .2s ease, transform .2s ease;
      vertical-align: middle;
      font-size: 16px;
    }

    .collapsed-menu span {
      width: 0;
      transition: width .2s ease;
    }

    .collapsed-menu i {
      transform: translateX(5px);
      transition: font-size .2s ease .2s, transform .2s ease .2s;
      vertical-align: middle;
      font-size: 22px;
    }
  }
</style>
