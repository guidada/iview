<template>
  <div class="view_favorable_container">
    <h2>查看买受人变更单</h2>
    <Form ref="form" :label-width="135">
      <!-- 状态-->
      <Row>
        <Col span="10">
          <FormItem label="管理项目：">
            <div>{{viewInfoCopy.project.name}}</div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="审批状态：">
            <div>{{viewInfoCopy.state}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源-->
      <Row>
        <Col span="5" style="min-width: 225px">
          <FormItem label="关联房源：" prop="house_id">
            <div>{{viewInfoCopy.house.house_num}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源的信息-->
      <Row>
        <Col>
          <FormItem>
            <div class="house_info">
              <Row>
                <h4 style="font-size: 14px">
                  相关信息
                </h4>
              </Row>
              <Row style="padding: 0 30px">
                <Col :span="8">
                  房源状态：{{viewInfoCopy.house.state}}
                </Col>
              </Row>
              <Row v-if="clientInfo.id">
                <h4 style="font-size: 14px">
                  主受卖人信息
                </h4>
              </Row>
              <Row style="padding: 0 30px" v-if="clientInfo.id">
                <Col :span="8">
                  客户姓名：{{clientInfo&&clientInfo.name || ''}}
                </Col>
                <Col :span="8">
                  客户联系方式：{{clientInfo&&clientInfo.phone || ''}}
                </Col>
              </Row>
              <Row v-if="clientInfo.id && public_people.length">
                <h4 style="font-size: 14px">
                  共有受卖人信息
                </h4>
              </Row>
              <Row style="padding: 0 30px" v-for="(item,index) in public_people" :key="index">
                <Col :span="8">
                  客户姓名：{{item.name}}
                </Col>
                <Col :span="8">
                  客户联系方式：{{item.phone}}
                </Col>
              </Row>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem label="买受人变更信息：">
            <div class="house_info">
              <Row  v-for="(customer,index) in customerArr" :key="index">
                <Col :span="4">
                  <div>
                    客户姓名：{{customer.customer_name}}
                  </div>
                </Col>
                <Col :span="6">
                  <div>
                    联系方式：{{customer.customer_phone}}
                  </div>
                </Col>
                <Col :span="4">
                  <div>
                    与主受买人关系：{{customer.relationship}}
                  </div>
                </Col>
              </Row>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="!isEditFavorable">
        <Col span="5" style="min-width: 225px">
          <FormItem label="操作动作：" prop="house_id">
            <div>{{viewInfoCopy.type}}</div>
          </FormItem>
        </Col>
      </Row>
      <Row v-else>
        <Col span="8">
          <FormItem label="操作动作：">
            <div>
              <Select
                  v-model="viewInfoCopy.type">
                  <Option value="新增">新增</Option>
                  <Option value="删除">删除</Option>
              </Select>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 备注-->
      <Row>
        <Col span="10">
          <FormItem label="备注：">
            <div>
              <Input type="textarea" v-model="viewInfoCopy.infos" :disabled="!isEditFavorable"></Input>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!--审批处理-->
      <div class="approve_wrap" v-if="isShenPi">
        <h3>审批处理</h3>
        <Row>
          <Col span="16">
            <FormItem label="备注：">
              <div>
                <Input type="textarea" v-model="reject"></Input>
              </div>
            </FormItem>
          </Col>
        </Row>
        <div class="btn_wrap">
          <Button type="primary" @click="HandleAgree">通过</Button>
          <Button type="warning" style="margin-left: 30px" @click="HandleReject">驳回</Button>
          <Button type="default" style="margin-left: 30px" @click="goback">返回</Button>
        </div>
      </div>
      <!-- 提交按钮-->
      <div v-else class="btn_wrap">
        <Button type="primary" @click="editFavorableForm" :disabled="!isEditFavorable">确认修改</Button>
        <Button
          type="warning"
          @click="cancelApply()"
          :disabled="!isEditFavorable"
          style="margin-left: 30px">取消申请</Button>
        <Button type="default" style="margin-left: 30px" @click="goback">返回</Button>
      </div>
    </Form>
    <!--审批流程-->
    <div class="approve_process_wrap">
      <h3>审批流程</h3>
      <Table border :columns="columns" :data="approveList"></Table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "viewFavorable",
    data() {
      return {
        // 审批流程列表
        approveList: [],
        columns: [
          {
            title: '操作时间',
            key: 'created_at'
          },
          {
            title: '本级操作者',
            key: 'operation_up'
          },
          {
            title: '操作结果',
            key: 'infos'
          },
          {
            title: '操作说明',
            key: 'desc'
          },
          {
            title: '下级操作者',
            key: 'operation_down'
          }
        ],
        // 驳回描述（通过可以选填，驳回必填）
        reject: '',
        public_people: [],
        clientInfo: {},
        customer: {},
        customerArr: [],
        viewInfoCopyCopy: {}
      }
    },
    props: ['viewInfo', 'isShenPi','isEditFavorable'],
    created() {
      this.viewInfoCopy = Object.assign({},this.viewInfo)
      this.approveList = this.viewInfoCopy.people_change_follow
      this.customerArr = this.viewInfoCopy.public_arr
      if (this.viewInfoCopy && this.viewInfoCopy.only_people.length > 0) {
        let public_people = []
        this.viewInfoCopy.only_people.forEach((item) => {
          if(item.is_main == 1) {
            this.clientInfo = item.customer
          }else {
            public_people.push(item.customer)
          }
        })
        this.public_people = public_people
      } else {
        this.clientInfo = {}
        this.public_people = []
      }
    },
    methods: {
      cancelApply() {
        var favorableFormInfo = {
          people_id: this.viewInfoCopy.id,
          public_arr: this.viewInfoCopy.public_arr,
          house_id: this.viewInfoCopy.house_id,
          type: '取消',
          infos: this.viewInfoCopy.infos
        }
        // console.log('修改后要提交的信息===', favorableFormInfo)
        this.$post('/change/updatePeopleChange',favorableFormInfo).then(res=>{
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          // console.log('新建买受人变更单返回的结果===',res)
          if(res.status_code!==200) return this.$Message.error('取消买受人变更单失败！')
          this.$Message.success('取消买受人变更单失败！')
          this.$emit('editSuccess')
        }).catch(err=>{
          this.$Message.error('取消买受人变更单失败！')
          console.log(err)
        })
      },
      goback() {
        this.$emit('cancelView')
      },
      /*
      * 通过审批
      * */
      HandleAgree() {
        var info = {
          project_id: parseInt(this.$route.params.id),
          id: this.viewInfoCopy.id,
          type: '通过',
          reject: this.reject
        }
        this.submitForm(info)
      },
      /*
      * 拒绝审批
      * */
      HandleReject() {
        if (!this.reject) return this.$Message.error('请输入驳回理由！')
        var info = {
          project_id: parseInt(this.$route.params.id),
          id: this.viewInfoCopy.id,
          type: '驳回',
          reject: this.reject
        }
        this.submitForm(info)
      },
      /*
      * 审批处理
      * */
      submitForm(data) {
        this.$post('/change/followPeopleChange', data).then(res => {
          // console.log('审批的结果===', res)
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('提交审批失败！')
          if (res.data === '请去添加价格权限或添加的职务和房源价格权限中的职务相同') return this.$Message.error('请去添加价格权限或添加的职务和房源价格权限中的职务相同！')
          this.$Message.success('提交审批成功！')
          this.$emit('submitSuccess')
        }).catch(err => {
          this.$Message.error('提交审批失败！')
          console.log(err)
        })
      },
      /*
      *  修改买受人变更单驳回申请表单
      * */
      editFavorableForm() {
        var favorableFormInfo = {
          people_id: this.viewInfoCopy.id,
          public_arr: this.viewInfoCopy.public_arr,
          house_id: this.viewInfoCopy.house_id,
          type: '修改',
          infos: this.viewInfoCopy.infos
        }
        // console.log('修改后要提交的信息===', favorableFormInfo)
        this.$post('/change/updatePeopleChange',favorableFormInfo).then(res=>{
          // console.log('新建买受人变更单返回的结果===',res)
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if(res.status_code!==200) return this.$Message.error('新建买受人变更单失败！')
          this.$Message.success('新建买受人变更单成功！')
          this.$emit('editSuccess')
        }).catch(err=>{
          this.$Message.error('新建买受人变更单失败！')
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .view_favorable_container {
    padding: 20px 30px 50px;

    h2 {
      line-height: 30px;
      margin-bottom: 20px;
    }

    .house_info {
      padding: 20px;
      background-color: #f0f2f5;
    }

    .btn_wrap {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }

    .approve_process_wrap,
    .approve_wrap {
      h3 {
        font-size: 18px;
        line-height: 60px;
        border-bottom: 1px solid #aaaaaa;
        margin-bottom: 20px;
      }
    }
  }
</style>
