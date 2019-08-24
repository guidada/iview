<template>
  <div class="project-container">
    <h2>发起取消销控单申请</h2>
    <Form :model="cancelSalesFormInfo" ref="form" :label-width="135" :rules="formRules">
      <!-- 状态-->
      <Row>
        <Col span="10">
          <FormItem label="关联项目：">
            <div>{{projectInfo.name}}</div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="审批状态：">
            <div>{{isAddCancelSales?'待新建':'审核中'}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源-->
      <Row>
        <Col span="11" style="min-width: 225px">
          <FormItem label="销控ID：">
            <div style="display: flex;justify-content: flex-start;">
              <Input v-model="follow_id" placeholder="请输入销控单ID"></Input>
              <Button type="info" @click="getFollowInfo" style="margin-left: 10px">查找</Button>
            </div>
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
              <div v-if="followInfo.id">
                <Row style="padding: 0 30px">
                  <Col :span="8">
                    房源号：<span style="color: #348EED">{{followInfo.house.house_num}}</span>
                  </Col>
                  <Col :span="8" offset="1">
                    房源状态：<span style="color: #348EED">{{followInfo.state}}</span>
                  </Col>
                </Row>
              </div>
              <Row v-else style="padding: 0 30px;">
                <div>温馨提示：请选择要取消的销控单</div>
              </Row>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 备注-->
      <Row>
        <Col span="10">
          <FormItem label="备注原因：">
            <div>
              <Input type="textarea" v-model="cancelSalesFormInfo.desc" placeholder="请输入解筹原因"></Input>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 提交按钮-->
      <div class="btn_wrap">
        <Button type="primary" @click="submitCancelSales">保存</Button>
        <Button type="default" style="margin-left: 30px" @click="goback">取消</Button>
      </div>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "add",
    data() {
      return {
        follow_id: null,
        followInfo: {},

        cancelSalesFormInfo: {
          project_id: this.$route.params.id,
          desc: '',
        },
        formRules: {},
      }
    },
    props: ['projectInfo', 'isAddCancelSales'],
    created() {

    },
    methods: {
      goback() {
        this.$emit('cancelAdd')
      },
      /*
      *  获取到表单信息
      * */
      getFollowInfo() {
        var follow_id = parseInt(this.follow_id)
        if (isNaN(follow_id)) return this.$Message.error('请输入合法的销控ID')
        this.$post('/quxiao/quxiaoConfig', {follow_id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取失败！')
          if (!res.data.follow) {
            this.$Message.error('所选销控单' + follow_id + ',不可取消！')
          } else {
            this.$Message.success('获取成功！')
          }
          this.followInfo = res.data.follow ||{}
        }).catch(err => {
          this.$Message.error('获取失败！')
          console.log(err)
        })
      },
      /*
      *  提交优惠单申请
      * */
      submitCancelSales() {
        if (!this.follow_id) return this.$Message.error('请选择销控单！')
        if (!this.followInfo.id) return this.$Message.error('请选择销控单！')
        var cancelSalesFormInfo = {
          project_id: parseInt(this.$route.params.id),
          infos: this.cancelSalesFormInfo.desc,
          follow_id: this.follow_id
        }
        // console.log('提交的信息===', cancelSalesFormInfo)
         this.$post('/quxiao/addQuxiao', cancelSalesFormInfo).then(res => {
           if (res.data === '没有权限') {
             this.$Modal.error({
               title: '警告',
               content: '没有权限'
             })
             return false
           }
           if (res.status_code !== 200) return this.$Message.error('发起申请失败！')
           if (res.data === '请完善信息') return this.$Message.error('请完善信息')
           if (res.data === '该销控单已经取消或取消申请审核中') return this.$Message.error('该销控单已经取消或取消申请审核中')
           this.$Message.success('发起申请成功！')
           this.$emit('addSuccess')
         }).catch(err => {
           this.$Message.error('发起申请失败！')
           console.log(err)
         })
      },
    }
  }
</script>

<style lang="less" scoped>

  .project-container {
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

    .approve_process_wrap {
      h3 {
        font-size: 18px;
        line-height: 60px;
        border-bottom: 1px solid #aaaaaa;
        margin-bottom: 20px;
      }
    }
  }

</style>
