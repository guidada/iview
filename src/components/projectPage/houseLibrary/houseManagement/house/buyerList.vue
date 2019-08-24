<template>
  <div class="buyer_list_container">
    <!--共同买受人列表-->
    <Table border :columns="columns" :data="currentList"></Table>
    <!-- <div class="form_item" v-if="buyerList.length" v-for="item in buyerList" :key="item.id">
       <Row>
         <Col span="5">
           <FormItem label="姓名：">
             <div>{{item.customer.name}}</div>
           </FormItem>
         </Col>
         <Col span="6" offset="1">
           <FormItem label="联系方式：">
             <div>{{item.customer.phone}}</div>
           </FormItem>
         </Col>
         <Col span="11" offset="1">
           <FormItem label="身份证号：">
             <div>{{item.customer.idcard}}</div>
           </FormItem>
         </Col>
       </Row>
       <Row>
         <Col span="8">
           <FormItem label="与主买受人关系：">
             &lt;!&ndash;<span>{{item.relationship || '未设置关系'}}</span>&ndash;&gt;
             &lt;!&ndash;  @on-change="filterByState"&ndash;&gt;
             <Select
               v-model="item.relationship"
               placeholder="与主买受人关系"
               style="width: 120px"
             >
               <Option
                 v-for="(item,index) in relationshipList"
                 :value="item"
                 :key="index"
               >{{ item }}
               </Option>
             </Select>
           </FormItem>
         </Col>
         <Col span="3" offset="1">
           <Button type="warning" @click="updateRelationship(item)">确认修改</Button>
         </Col>
         <Col span="11" offset="1">
           <FormItem label="身份证正反面：">
             <div style="display:flex;">
               <a target="_blank" :href="item.customer.positive_photo">正面</a>
               <a target="_blank" :href="item.customer.negative_photo">反面</a>
             </div>
           </FormItem>
         </Col>
       </Row>
       <Row>
         <Col span="24" offset="1">
           <FormItem label="备注：">
             <div>{{item.customer.desc || '无'}}</div>
           </FormItem>
         </Col>
       </Row>
     </div>-->
    <!-- 修改买受人与主买受人的关系-->
    <Modal
      v-model="isChangeRelationship"
      title="修改买受人与主买受人的关系"
      @on-ok="updateRelationship"
    >
      <Select
        v-model="relationship"
        placeholder="与主买受人关系"
        style="width: 200px"
      >
        <Option
          v-for="(item,index) in relationshipList"
          :value="item"
          :key="index"
        >{{ item }}
        </Option>
      </Select>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "buyerList",
    data() {
      return {
        columns: [
          {title: '姓名', key: 'name', align: 'center', width: 120,},
          {title: '联系方式', key: 'phone', align: 'center', width: 120,},
          {title: '身份证号', key: 'idcard', width: 180, align: 'center'},
          {
            title: '身份证件',
            width: 135,
            // key: 'positive_photo',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    color: '#348EED'
                  },
                  on: {
                    click: () => {
                      this.showPhoto(params.row.positive_photo, '正')
                    }
                  }
                }, '正面'),
                h('a', {
                  style: {
                    marginLeft: '20px',
                    color: 'red'
                  },
                  on: {
                    click: () => {
                      this.showPhoto(params.row.negative_photo, '反')
                    }
                  }
                }, '反面')
              ])
            }
          },
          {
            title: '与主买受人关系',
            key: 'relationship',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#348EED',
                  }
                }, params.row.relationship || "未选"),
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: 'red',
                    // marginLeft: '15px'
                  },
                  on: {
                    click: () => {
                      this.gotoUpdateRelationship(params.row)
                    }
                  }
                }, '修改')
              ])
            }
          },
          {
            title: '备注',
            key: 'desc',
            align: 'center',
            width: 80,
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    title: '备注',
                    trigger: "hover",
                    placement: 'left-start'
                  },
                  style: {
                    color: '#348EED',
                    cursor: 'pointer'
                  }
                }, [
                  '查看',
                  h('div', {
                    slot: 'content',
                    style: {whiteSpace: 'normal', wordBreak: 'break-all'}
                  }, params.row.des || '暂无备注')
                ])
              ])
            }
          },
        ],
        // 关系
        relationshipList: ['配偶', '情人', '父母', '子女', '朋友', '同事', '亲戚'],
        // 当前的所有的买受人
        currentList: [],
        // 当前要修改的买受人
        currentBuyer: {},
        // 筛选到的关系
        relationship: '',
        isChangeRelationship: false,
      }
    },
    props: ['buyerList'],
    created() {
      this.getCurrentList()
    },
    methods: {
      /*
      * 获取到当前的买受人列表
      * */
      getCurrentList() {
        var list = []
        this.buyerList.forEach((item, index) => {
          list.push({
            id: item.id,
            house_id: item.house_id,
            name: item.customer.name,
            phone: item.customer.phone,
            idcard: item.customer.idcard,
            positive_photo: item.customer.positive_photo,
            negative_photo: item.customer.negative_photo,
            relationship: item.relationship,
            desc: item.customer.desc,
          })
        })
        this.currentList = list
      },
      /*
     * 修改买受人与主买受人之间的关系
     * */
      updateRelationship() {
        var currentBuyer = this.currentBuyer
        // console.log('---------------------',this.relationship,currentBuyer)
        this.$post('/house/updateRelationship', {
          house_id: currentBuyer.house_id,
          relationship: this.relationship,
          id: currentBuyer.id
        }).then(res => {
          if (res.status_code !== 200) return this.$Message.error('修改失败！')
          this.$Message.success('修改成功！')
          var result = res.data
          this.currentList.forEach(item => {
            if (item.id === result.id) {
              item.relationship = result.relationship
            }
          })
        }).catch(err => {
          this.$Message.error('修改失败！')
        })
      },
      gotoUpdateRelationship(row) {
        this.isChangeRelationship = true
        this.currentBuyer = row
        this.relationship = row.relationship
      },
      /*
      * 展示身份证
      * */
      showPhoto(res, dir) {
        this.$Modal.info({
          title: '身份证件(' + dir + ')',
          content: `<img src="${res}" width="100%">`,
          width: 800
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .buyer_list_container {

  }
</style>
