<template>
  <div v-if="houseList.length">
    <table
      style="width: 100%; min-height: 30px; line-height: 30px; text-align: center; border-collapse: collapse; padding:2px;"
      border cellspacing="0">
      <tr>
        <th>楼层</th>
        <th :colspan="item.door" v-for="item in buildingInfo.unit">{{item.unit_num}}单元</th>
      </tr>
      <tr v-for="item in houseList" :key="item.floor">
        <th>{{item.floor}}楼</th>
        <td :style="{background: house.color}" v-for="house in item.house">
          <Tooltip placement="right">
            <!--<span>{{house.unit}}-{{house.room}}</span>-->
            <span>{{house.house_num}}</span>
            <div slot="content" @click="goToEditHouse(house)" style="cursor: pointer">
              <Icon type="ios-create-outline" size="20"/>
            </div>
          </Tooltip>
        </td>
      </tr>
    </table>
  </div>
  <div v-else class="no_house">暂无数据</div>
</template>

<script>
  export default {
    name: "houseTable",
    data() {
      return {
        // houseList: []
      }
    },
    props: ['colorList', 'houseList', 'buildingInfo'],
    created() {
      console.log(this.buildingInfo)
    },
    methods: {
      /*
      * 去编辑房源信息
      * */
      goToEditHouse(a) {
        if (a.house_num==='-') return this.$Message.error('房源不存在！')
        this.$emit('goToEditHouse', a)
      },

    }
  }
</script>

<style scoped>
  .no_house {
    font-size: 16px;
    color: #aaaaaa;
    text-align: center;
    margin-top: 50px;
  }
</style>
