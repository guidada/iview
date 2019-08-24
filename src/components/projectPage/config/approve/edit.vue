<template>
  <div class="project-container">
    <Form ref="form" :label-width="200">
      <FormItem label="选择表单：" prop="name">
        <Select v-model="formType" style="width:200px" @on-change="checkForm">
          <Option v-for="(item,index) in approveList" :value="index" :key="item.index">{{ item.title }}</Option>
        </Select>
      </FormItem>
      <FormItem label="审批人" prop="sex">
        <div>
          <div class="approve-client-item" v-for="(item,index) in shenhei" :key="item">
            <Tag @on-close="deleteClient(index,'shenhe')" type="dot" closable color="primary">{{idToName(item)}}</Tag>
            <Icon size="30" type="md-arrow-round-forward"/>
          </div>
          <i class="add_client_btn ivu-icon ivu-icon-ios-add-circle-outline" @click="preChoose('shenhe')"></i>
        </div>
      </FormItem>
      <FormItem label="抄送人" prop="phone">
        <div>
          <div class="approve-client-item" v-for="(item,index) in chaosong" :key="item">
            <Tag @on-close="deleteClient(index,'chaosong')" type="dot" closable color="primary">{{idToName(item)}}</Tag>
          </div>
          <i class="add_client_btn ivu-icon ivu-icon-ios-add-circle-outline" @click="preChoose('chaosong')"></i>
        </div>
      </FormItem>
      <FormItem>
        <div class="form-item">
          <Button type="primary" @click="save">保存</Button>
          <Button type="default" @click="$router.go(-1)">返回</Button>
        </div>
      </FormItem>
      <Modal
        v-model="clientChoose"
        title="选择人员"
        @on-ok="clentChose">
        <Select v-model="clientId" filterable>
          <Option v-for="item in allWorker" :value="item.id" :key="item.value">{{ item.name }}</Option>
        </Select>
      </Modal>
    </Form>
  </div>
</template>

<script>
  import areaList from '@/components/config/district.js'

  let Base64 = require('js-base64').Base64
  export default {
    name: "clientCreate",
    data() {
      return {
        formType: 0,
        allWorker: [],
        approveList: [
          {
            title: '优惠单',
            url: '/config/discountListConfig'
          },
          {
            title: '买受人变更',
            url: '/config/peopleChangeConfig'
          },
          {
            title: '解筹申请',
            url: '/config/jiechouConfig'
          },
          {
            title: '退认购金',
            url: '/config/unsubscribeConfig'
          },
          {
            title: '已签约退房',
            url: '/config/unqianyueConfig'
          },
          {
            title: '取消销控单',
            url: '/config/quxiaoConfig'
          }
        ],
        shenhei: [],
        chaosong: [],
        clientChoose: false,
        clientId: '',
        chooseType: ''
      }
    },
    created() {
      this.formType = this.$route.params.type
      this.getAllWorker()
      this.getConfig()
    },
    methods: {
      save() {
        this.$post(this.approveList[this.formType].url, {
          project_id: this.$route.params.id,
          shenhei_ids: this.shenhei,
          chaosong_ids: this.chaosong
        }).then((res) => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          this.$Message.success('审批流程修改成功')
          this.$router.push({
            name: 'approve'
          })
        })
      },
      idToName(id) {
        let name = ''
        this.allWorker.forEach((item) => {
          if (item.id == id) {
            name = item.name
          }
        })
        return name
      },
      preChoose(type) {
        this.chooseType = type
        this.clientChoose = true
      },
      deleteClient(index, type) {
        if (type == 'shenhe') {
          // console.log(type, this.shenhei, this.chaosong)
          this.shenhei.splice(index, 1)
        } else {
          this.chaosong.splice(index, 1)
        }
      },
      clentChose() {
        if (this.chooseType == 'shenhe') {
          this.shenhei.push(this.clientId)
        } else {
          this.chaosong.push(this.clientId)
        }
        this.chooseId = ''
      },
      getAllWorker() {
        this.$post('/config/allWorker').then(res => {
          this.allWorker = res.data.worker.map((item) => {
            item.name = Base64.decode(item.name) + '/' + item.job
            return item
          })
        })
      },
      getConfig() {
        this.$post(this.approveList[this.formType].url + 'Sj', {
          project_id: this.$route.params.id
        }).then(res => {
          res.data.shenhei = res.data.shenhei.map(item => {
            return item.worker.id
          })
          res.data.chaosong = res.data.chaosong.map(item => {
            return item.worker.id
          })
          this.shenhei = res.data.shenhei
          this.chaosong = res.data.chaosong
        })
      },
      checkForm() {
        this.getConfig()
      }
    }
  }
</script>

<style lang="less" scoped>
  .search-panel {
    .search-item {
      &__label {
        line-height: 32px;
        text-align: center;
      }
    }
  }

  .project-container {
    padding: 20px 30px 50px;
  }

  .client-content {
    margin: 20px 0;
  }

  .form-item {
    width: 300px;
  }

  .add_client_btn {
    color: #1999DD;
    font-size: 40px;
    margin-left: 30px;
    font-weight: bold;
    cursor: pointer;
  }

  .approve-client-item {
    display: inline-block;
    /deep/ .ivu-tag-dot-inner {
      display: none;
    }
  }
</style>
