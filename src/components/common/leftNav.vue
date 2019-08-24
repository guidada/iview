<template>
  <div class="left_nav_container">
    <div class="logo_wrap">
      <img
        v-if="!isCollapsed && projectAvatar"
        :src="projectAvatar"
        class="avatar_big"
      >
      <img
        v-else-if="!isCollapsed && !projectAvatar"
        src="@/assets/logo.png"
        style="padding: 1px;background-color: #ffffff;">
      <img
        v-else-if="isCollapsed && projectAvatar"
        :src="projectAvatar"
        style="background-color: #515A6E;width: 70%"
      >
      <img
        v-else
        src="@/assets/logo-min.png"
        style="background-color: #515A6E;width: 70%"
      >
    </div>
    <Menu theme="dark"
          width="auto"
          accordion
          @on-select="selectMenuItem"
    >
      <Submenu
        :name="parent.name"
        v-for="(parent, index) in menuList"
        :key="index"
        v-if="!parent.meta.hideInMenu"
      >
        <template slot="title">
          <Icon :type="parent.meta.icon? parent.meta.icon : 'ios-paper'" size="20"/>
          <span>{{parent.meta.title}}</span>
        </template>
        <MenuItem :name="item.name"
                  v-for="(item, index) in parent.children"
                  :key="index"
                  :to="{name: item.name}"
                  v-if="!item.meta.hideInMenu"
        >
          <Icon :type="item.meta.icon? item.meta.icon : 'ios-list'" size="20"/>
          <span>{{item.meta.title}}</span>
        </MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>

<script>

  export default {
    name: "left-nav",
    data() {
      return {
        // theme: 'dark',
        // menuList: menuList,
        menuList: [],
      }
    },
    props: ['isCollapsed', 'projectAvatar'],
    created() {
      // console.log(this.$router.options.routes)
      var routes = this.$router.options.routes
      routes.forEach(item => {
        if (item.meta.isMenu) {
          return this.menuList = item.children
        }
      })

    }
    ,
    methods: {
      selectMenuItem(name) {
        var menuList = this.menuList
        var currentSubItem
        menuList.forEach(item => {
          item.children.forEach(subItem => {
            if (subItem.name === name) {
              currentSubItem = subItem
            }
          })
        })
        this.$emit('setBreadcrumb', currentSubItem.meta.title)
        this.$store.commit('setCurrentSubItem', currentSubItem.meta.title)
      },
    }
  }
</script>

<style lang="less">
  .left_nav_container {

    .logo_wrap {
      width: 80%;
      margin: 15px auto;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
      }

      .avatar_big {
        padding: 1px;
        background-color: #ffffff;
        width: 50%;
        height: auto;
        border-radius: 50%;
      }
    }

    .ivu-menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 35px;
      .ivu-icon {
        /*margin-right: 30px;*/
      }
    }
  }
</style>
