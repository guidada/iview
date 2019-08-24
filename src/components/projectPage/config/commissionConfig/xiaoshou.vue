<template>
  <div class="sales_commission_container">
    <!-- 销售结算配置-->
    <Card>
      <Form
        class="form_box"
        ref="xiaoShouForm"
        :model="xiaoShouInfo"
        :rules="xiaoShouRules"
        :label-width="120">
        <h2 style="margin-bottom: 20px">销售结算配置</h2>
        <Row>
          <Col span="10">
            <FormItem label="佣金率：">
              <div style="display: flex;justify-content: flex-start;">
                <InputNumber
                  style="width: 100%;min-width: 120px"
                  :min="0"
                  :max="100"
                  :precision="2"
                  v-model="xiaoShouInfo.ratio"
                  placeholder="请输入佣金率"
                ></InputNumber>
                <span style="margin-left: 5px">%</span>
              </div>
            </FormItem>
          </Col>
        </Row>
        <div class="btn_wrap">
          <Button
            :type="isEditXIaoShou?'warning':'primary'"
            @click="submitModal=true"
          >{{isEditXIaoShou?'修改配置':'确认'}}
          </Button>
          <Modal
            v-model="submitModal"
            title="请确认是否要提交该表单"
            @on-ok="submitXiaoShou"
            @on-cancel="cancelSubmit"
          >
            <p style="color: red">注意：确认后部分内容不可更改！如您已确认无误，请点击右下角确认按钮提交表单！</p>
          </Modal>
        </div>
      </Form>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "xiaoshou",
    data() {
      return {
        submitModal: false,
        // 销售结算配置信息
        xiaoShouInfo: {
          ratio: null,
          commission: null,
          uncommission: null,
        },
        xiaoShouRules: {},
        isEditXIaoShou: false,
      }
    },
    created() {
      this.getXiaoShouConfig(parseInt(this.$route.params.id))
    },
    methods: {
      /*
    *  获取到销售的佣金配置信息
    * */
      getXiaoShouConfig(id) {
        this.$post('/config/peopleCommissionRateSj', {project_id: id}).then(res => {
          // console.log('销售佣金配置===============', res)
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取佣金配置信息失败！')
          if (res.data.rates) {
            this.isEditXIaoShou = true
            var result = res.data.rates
            this.xiaoShouInfo = {
              id: result.id,
              ratio: parseFloat(result.ratio),
            }
          }
        }).catch(err => {
          this.$Message.error('获取佣金配置信息失败！')
          console.log(err)
        })
      },
      /*
      *  提交销售佣金配置
      * */
      submitXiaoShou() {
        var xiaoShouConfigInfo = this.xiaoShouInfo
        if (!xiaoShouConfigInfo.ratio) return this.$Message.error('佣金率不能为空！')
        if (xiaoShouConfigInfo.ratio > 100 || xiaoShouConfigInfo.ratio < 0) return this.$Message.error('佣金率非法！')
        xiaoShouConfigInfo.project_id = parseInt(this.$route.params.id)
        xiaoShouConfigInfo.commission_ratio = parseInt(xiaoShouConfigInfo.commission)
        // console.log('要提交的信息===', KaiFaConfigInfo)
        if (this.isEditXIaoShou) {
          this.editXiaoShouForm(xiaoShouConfigInfo)
        } else {
          this.$post('/config/addPeopleCommissionRate', xiaoShouConfigInfo).then(res => {
            // console.log('开发商佣金配置返回结果===============', res)
            if (res.data === '没有权限') {
              this.$Modal.error({
                title: '警告',
                content: '没有权限'
              })
              return false
            }
            if (res.status_code !== 200) return this.$Message.error('添加销售佣金配置信息失败！')
            if (res.data === '已存在佣金比例，请去修改') return this.$Message.error('已存在佣金比例，请去修改！')
            this.$Message.success('添加销售佣金配置信息成功！')
            this.getXiaoShouConfig(parseInt(this.$route.params.id))
          }).catch(err => {
            this.$Message.error('添加销售佣金配置信息失败！')
            console.log(err)
          })
        }
      },
      /*
      * 修改配置（销售）
      * */
      editXiaoShouForm(xiaoShouConfigInfo) {
        this.$post('/config/updatePeopleCommissionRate', xiaoShouConfigInfo).then(res => {
          // console.log('开发商佣金配置修改返回结果===============', res)
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('修改销售佣金配置信息失败！')
          this.$Message.success('修改销售佣金配置信息成功！')
        }).catch(err => {
          this.$Message.error('修改销售佣金配置信息失败！')
          console.log(err)
        })
      },
      cancelSubmit() {
        this.$Message.info('取消提交表单！')
      }
    }
  }
</script>

<style lang="less" scoped>
  .sales_commission_container {
    padding: 30px;
  }
</style>
