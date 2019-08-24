<template>
  <!--此页面已废除，稍后删除-->
  <div class="project_display_container">
    <div v-if="isConfig" class="content">
      <div class="header">XXX项目</div>
      <div class="img_wrap">
        <img src="@/assets/images/projectPage/u1104.jpg" width="100%">
        <div class="card_wrap"
             v-for="(item, index) in cardInfo"
             :key="item.name"
             :style="{left:item.left,top:item.top}"
        >
          <div class="card"
               @click="showCardInfo(item.id)"
          >{{item.name}}
          </div>
          <Card v-show="isShowCardInfo && item.id===currentCardId" class="cardInfo">
            <div class="cardInfo_header"
              @click="gotoBuildingInfoPage(item.id)">
              {{item.name}}
              <span class="tips">点击查看楼栋详情</span>
            </div>
            <div>
              <p>楼栋简介：</p>
              <div>{{item.desc}}</div>
            </div>
            <Icon type="ios-close-circle-outline" size="24"
                  style="position: absolute;right: 3px;top: 3px;"
                  @click="hideCardInfo"
            />
          </Card>
        </div>
      </div>

    </div>
    <div v-else class="content">
      <img src="@/assets/images/projectPage/u1110.png" alt="">
      <span style="margin: 20px 0">暂无数据</span>
      <Button type="info" @click="gotoConfige">前去配置</Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "projectDisplay",
    data() {
      return {
        // 是否配置了效果图
        isConfig: true,
        // 是否展示楼栋信息
        isShowCardInfo: false,
        // 被选中的楼栋id
        currentCardId: 0,
        cardInfo: [
          {
            name: '#1',
            id: 1,
            left: '15%',
            top: '10%',
            desc: '这是一号楼'
          },
          {
            name: '#2',
            id: 2,
            left: '30%',
            top: '50%',
            desc: '这是二号楼这是二号楼这是二号楼这是二号楼这是二号楼这是二号楼这是二号楼'
          }
        ],
      }
    },
    created() {

    },
    methods: {
      gotoConfige() {

      },
      showCardInfo(id) {
        if (this.isShowCardInfo && this.currentCardId === id) return this.hideCardInfo()
        this.currentCardId = id
        this.isShowCardInfo = true
      },
      hideCardInfo() {
        this.currentCardId = 0
        this.isShowCardInfo = false
      },
      gotoBuildingInfoPage(id) {
        console.log(id)
      }
    }
  }
</script>

<style lang="less" scoped>
  .project_display_container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      .header {
        font-size: 20px;
        font-weight: bolder;
        margin: 20px 0 30px;
      }

      .img_wrap {
        width: 50%;
        background-color: #348EED;
        position: relative;

        img {
          vertical-align: middle;
        }

        .card_wrap {
          width: 100px;
          height: 30px;
          border: 1px solid black;
          border-radius: 5px;
          text-align: center;
          line-height: 30px;
          background-color: #fff;
          position: absolute;
          left: 10%;
          top: 1%;

          .card {
            font-size: 16px;
            font-weight: bold;
          }

          .cardInfo {
            border: 1px solid #000;
            width: 200px;
            font-size: 14px;

            .cardInfo_header {
              cursor: pointer;

              &:hover {
                background-color: #f8f8f9;
                box-shadow: 0 0 2px rgba(0,0,0,.3);
              }
            }

            div {
              width: 100%;
              text-align: left;

              p {
                font-weight: bold;
              }
            }
          }
        }
      }
    }

    .tips {
      font-size: 12px;
      color: #ff0307;
    }
  }
</style>
