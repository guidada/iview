<template>
  <div class="shang_pu_commission_container">
    <!--开发商结算配置--商铺-->
    <Card style="margin-bottom: 15px">
      <Form class="form_box" ref="shangPuForm" :model="shangPuInfo" :rules="shangPuRules" :label-width="120">
        <h2 style="margin-bottom: 20px">开发商结算配置--商铺</h2>
        <Row>
          <Col span="10">
            <FormItem label="佣金率：">
              <div style="display: flex;justify-content: flex-start;">
                <InputNumber
                  style="width: 100%;min-width: 120px"
                  :min="0"
                  :max="100"
                  v-model="shangPuInfo.ratio"
                  placeholder="请输入佣金率"
                ></InputNumber>
                <span style="margin-left: 5px">%</span>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10">
            <FormItem label="结佣比例：">
              <div style="display: flex;justify-content: flex-start;">
                <InputNumber
                  style="width: 100%;min-width: 120px"
                  :min="0"
                  :max="100"
                  v-model="shangPuInfo.commission"
                  placeholder="请输入结佣比例"
                ></InputNumber>
                <span style="margin-left: 5px">%</span>
              </div>
            </FormItem>
          </Col>
          <Col span="10" offset="1">
            <FormItem label="扣留比例：">
              <div style="display: flex;justify-content: flex-start;">
                <InputNumber
                  style="width: 100%;min-width: 120px"
                  :min="0"
                  :max="100"
                  :precision="2"
                  v-model="100 - shangPuInfo.commission"
                  placeholder="扣留比例自动计算"
                  disabled
                ></InputNumber>
                <span style="margin-left: 5px">%</span>
              </div>
            </FormItem>
          </Col>
        </Row>
        <div class="btn_wrap">
          <Button
            :type="isEditShangPu?'warning':'primary'"
            @click="submitModal=true"
          >{{isEditShangPu?'修改配置':'确认'}}
          </Button>
          <Modal
            v-model="submitModal"
            title="请确认是否要提交该表单"
            @on-ok="submitForm"
            @on-cancel="cancelSubmit">
            <p style="color: red">注意：确认后部分内容不可更改！如您已确认无误，请点击右下角确认按钮提交表单！</p>
          </Modal>
        </div>
      </Form>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "shangpu",
    data() {
      return {
        submitModal: false,
        // 开发商结算配置信息(商铺)
        shangPuInfo: {
          ratio: null,
          commission: null,
          uncommission: null,
        },
        shangPuRules: {},
        // 是否重新编辑开发商结算配置信息
        isEditShangPu: false,
      }
    },
    created() {
      this.getShangPuConfig(parseFloat(this.$route.params.id), '商铺')
    },
    methods: {
      /*
     *  获取到开发商的佣金配置信息(住宅，商铺)
     * */
      getShangPuConfig(id, type) {
        this.$post('/config/commissionRateSj', {
          project_id: id,
          type: type,
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取佣金配置信息失败！')
          if (res.data.rates) {
            this.isEditShangPu = true
            var result = res.data.rates
            this.shangPuInfo = {
              id: result.id,
              ratio: parseFloat(result.ratio),
              commission: parseFloat(result.commission),
              uncommission: parseFloat(result.uncommission),
            }
          }
        }).catch(err => {
          this.$Message.error('获取佣金配置信息失败！')
          console.log(err)
        })
      },
      /*
      *  提交开发商佣金配置
      * */
      submitForm() {
        var configInfo = this.shangPuInfo
        if (!configInfo.ratio) return this.$Message.error('佣金率不能为空！')
        if (!configInfo.commission) return this.$Message.error('结佣比例不能为空！')
        if (configInfo.ratio > 100 || configInfo.ratio < 0) return this.$Message.error('佣金率非法！')
        if (configInfo.commission > 100 || configInfo.commission < 0) return this.$Message.error('结佣比例非法！')
        configInfo.project_id = parseFloat(this.$route.params.id)
        configInfo.uncommission = 100 - parseFloat(configInfo.commission)
        configInfo.commission_ratio = parseFloat(configInfo.commission)
        configInfo.type = '商铺'
        // console.log('要提交的信息===', configInfo)
        if (this.isEditShangPu) {
          this.editShangPuForm(configInfo)
        } else {
          this.$post('/config/addCommissionRate', configInfo).then(res => {
            // console.log('开发商佣金配置返回结果===============', res)
            if (res.data === '没有权限') {
              this.$Modal.error({
                title: '警告',
                content: '没有权限'
              })
              return false
            }
            if (res.status_code !== 200) return this.$Message.error('添加开发商佣金配置信息失败！')
            if (res.data === '已存在佣金比例，请去修改') return this.$Message.error('已存在佣金比例，请去修改！')
            this.$Message.success('添加开发商佣金配置信息成功！')
            this.getShangPuConfig(parseFloat(this.$route.params.id), '商铺')
          }).catch(err => {
            this.$Message.error('添加开发商佣金配置信息失败！')
            console.log(err)
          })
        }
      },
      /*
     *  修改配置（开发）
     * */
      editShangPuForm(configInfo) {
        this.$post('/config/updateCommissionRate', configInfo).then(res => {
          // console.log('开发商佣金配置修改返回结果===============', res)
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('修改开发商佣金配置信息失败！')
          this.$Message.success('修改开发商佣金配置信息成功！')
        }).catch(err => {
          this.$Message.error('修改开发商佣金配置信息失败！')
          console.log(err)
        })
      },
      /*
      * 取消配置
      * */
      cancelSubmit() {
        this.$Message.info('取消提交表单！')
      },

    }
  }
</script>

<style lang="less" scoped>
  .shang_pu_commission_container {
    padding: 30px;
  }
</style>
