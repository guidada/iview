<template>
  <div class="edit_container">
    <h2>{{isShenPi?'审批':'查看'}}取消销控单申请</h2>
    <Form ref="form" :label-width="135">
      <!-- 状态-->
      <Row>
        <Col span="10">
          <FormItem label="关联项目：">
            <div>{{projectInfo.name}}</div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="审批状态：">
            <div>{{viewInfo.state}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源-->
      <Row>
        <Col span="5" style="min-width: 225px">
          <FormItem label="销控单ID：" prop="house_id">
            <div>{{viewInfo.follow_history_id}}</div>
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
                <Col span="8">
                  <FormItem label="关联房源：" >
                    <div>{{viewInfo.house.house_num}}</div>
                  </FormItem>
                </Col>
                <Col :span="8">
                  房源状态：{{viewInfo.house.state}}
                </Col>
              </Row>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 备注-->
      <Row>
        <Col span="10">
          <FormItem label="备注：">
            <div>
              <Input type="textarea" v-model="viewInfo.infos" :disabled="!isEditCancelSales"></Input>
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
        <Button
          type="primary"
          @click="editCancelRaiseForm('修改')"
          :disabled="!isEditCancelSales"
        >确认修改
        </Button>
        <Button
          type="warning"
          @click="editCancelRaiseForm('取消')"
          :disabled="!isEditCancelSales"
          style="margin-left: 30px"
        >取消申请
        </Button>
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
    name: "edit",
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
      }
    },
    props: ['viewInfo', 'isShenPi', 'isEditCancelSales', 'projectInfo'],
    created() {
      this.approveList = this.viewInfo.quxiao_follow
    },
    methods: {
      goback() {
        this.$emit('cancelView')
      },
      /*
      * 通过审批
      * */
      HandleAgree() {
        var info = {
          project_id: parseInt(this.$route.params.id),
          id: this.viewInfo.id,
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
          id: this.viewInfo.id,
          type: '驳回',
          reject: this.reject
        }
        this.submitForm(info)
      },
      /*
      * 审批处理
      * */
      submitForm(data) {
        this.$post('/quxiao/followQuxiao', data).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('提交审批失败！')
          this.$Message.success('提交审批成功！')
          this.$emit('submitSuccess')
        }).catch(err => {
          this.$Message.error('提交审批失败！')
          console.log(err)
        })
      },
      /*
      *  修改解筹单驳回申请表单
      * */
      editCancelRaiseForm(type) {
        var cancelRaiseFormInfo = {
          project_id: parseInt(this.$route.params.id),
          quxiao_id: this.viewInfo.id,
          type: type,
          infos: this.viewInfo.infos
        }
        // console.log('修改后要提交的信息===', cancelRaiseFormInfo)
        this.$post('/quxiao/updateQuxiao', cancelRaiseFormInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('修改失败！')
          this.$Message.success(res.data)
          this.$emit('editSuccess')
        }).catch(err => {
          this.$Message.error('修改失败！')
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .edit_container {
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
