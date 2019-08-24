<template>
  <div class="config_price_container">
    <h2>配置职级表价</h2>
    <Form class="form" ref="priceForm" :model="priceInfo" :rules="priceRules" :label-width="100">
      <Row>
        <Col span="10" offset="2">
          <FormItem label="销售主管：" prop="xszg_price">
            <div style="display: flex;justify-content: flex-start">
              <InputNumber
                style="width: 100%"
                :min="1"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
                v-model="priceInfo.xszg_price"
                placeholder="请输入权限优惠额度"></InputNumber>
              <span style="line-height: 30px;margin-left: 9px">元</span>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10" offset="2">
          <FormItem label="销售经理：" prop="xsjl_price">
            <div style="display: flex;justify-content: flex-start">
              <InputNumber
                style="width: 100%"
                :min="1"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
                v-model="priceInfo.xsjl_price"
                placeholder="请输入权限优惠额度"></InputNumber>
              <span style="line-height: 30px;margin-left: 9px">元</span>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10" offset="2">
          <FormItem label="营销总：" prop="yxz_price">
            <div style="display: flex;justify-content: flex-start">
              <InputNumber
                style="width: 100%"
                :min="1"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
                v-model="priceInfo.yxz_price"
                placeholder="请输入权限优惠额度"></InputNumber>
              <span style="line-height: 30px;margin-left: 9px">元</span>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10" offset="2">
          <FormItem label="总经理：" prop="zjl_price">
            <div style="display: flex;justify-content: flex-start">
              <InputNumber
                style="width: 100%"
                :min="1"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
                v-model="priceInfo.zjl_price"
                placeholder="请输入权限优惠额度"></InputNumber>
              <span style="line-height: 30px;margin-left: 9px">元</span>
            </div>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="btn_wrap">
      <Button type="info" @click="submitForm('priceForm')">确认</Button>
      <Button style="margin-left: 20px" @click="cancelConfigPrice">返回</Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "configPrice",
    data() {
      return {
        // 价格表单信息
        priceInfo: {
          house_id: this.houseInfo.id,
          // 销售主管
          xszg_price: null,
          // 销售经理
          xsjl_price: null,
          // 营销总
          yxz_price: null,
          // 总经理
          zjl_price: null,
        },
        // 验证价格表单规则,暂时不需要验证，如需验证，把required 取消注释
        priceRules: {
          xszg_price: [{
            // required: true,
            type: 'number',
            message: '金额不能为空',
            trigger: 'blur'
          }],
          xsjl_price: [{
            // required: true,
            type: 'number',
            message: '金额不能为空',
            trigger: 'blur'
          }],
          yxz_price: [{
            // required: true,
            type: 'number',
            message: '金额不能为空',
            trigger: 'blur'
          }],
          zjl_price: [{
            // required: true,
            type: 'number',
            message: '金额不能为空',
            trigger: 'blur'
          }]
        },
      }
    },
    props: ['houseInfo'],
    created() {
			console.log('12313515313',this.houseInfo)
      var house_price = this.houseInfo
      this.priceInfo = {
        house_id: house_price.house_id,
        xszg_price:house_price.xszg_price || null,
        xsjl_price:house_price.xsjl_price || null,
        yxz_price:house_price.yxz_price || null,
        zjl_price:house_price.zjl_price || null,
      }
    },
    methods: {
      submitForm(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) return this.$Message.error('请完善信息~')
          this.$post('/house/housePrice', this.priceInfo).then(res => {
            if (res.status_code !== 200) return this.$Message.error('编辑资金配置表失败！')
            if (res.data === '请完善信息') return this.$Message.error('请完善信息！')
            this.$Message.success('配置成功！')
            this.$emit('configPriceSuccess',this.priceInfo)
          }).catch(err => {
            this.$Message.error('编辑资金配置表失败！')
          })
        })
      },
      cancelConfigPrice() {
        this.$emit('cancelConfigPrice')
      },
    }
  }
</script>

<style lang="less" scoped>
  .config_price_container {
    position: relative;
    /*height: 600px;*/
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    h2 {
      text-indent: 1em;
      margin-bottom: 40px;
      font-size: 20px;
    }

    .btn_wrap {
      width: 100%;
      display: flex;
      justify-content: center;
      /*position: absolute;*/
      /*left: 0;*/
      /*bottom: 30px;*/
    }
  }

</style>
