<template>
  <div class="d_price_form_container">
    <div>
      <h2>配置底价</h2>
      <Form class="form" ref="dPriceForm" :model="dPriceInfo" :rules="dPriceRules" :label-width="100">
        <Row>
          <Col span="12">
            <FormItem label="底单价：" prop="d_price">
              <div style="display: flex;justify-content: flex-start">
                <InputNumber
                  :min="1"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
                  style="width: 150px"
                  v-model="dPriceInfo.d_price"
                  placeholder="请输入金额"></InputNumber>
                <span style="line-height: 30px;margin-left: 9px">元</span>
              </div>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="底总价：" prop="d_total_price">
              <div style="display: flex;justify-content: flex-start">
                <InputNumber
                  :min="1"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
                  style="width: 150px"
                  v-model="dPriceInfo.d_total_price"
                  placeholder="请输入金额"></InputNumber>
                <span style="line-height: 30px;margin-left: 9px">元</span>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="btn_wrap">
      <Button type="info" @click="submitForm('dPriceForm')">确认</Button>
      <Button style="margin-left: 20px" @click="cancelDPrice">返回</Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "d_price",
    data() {
      return {
        dPriceInfo: {
          d_price: null,
          d_total_price: null,
        },
        dPriceRules: {
          d_price: [{
            required: true,
            type: 'number',
            message: '金额不能为空',
            trigger: 'blur'
          }],
          d_total_price: [{
            required: true,
            type: 'number',
            message: '金额不能为空',
            trigger: 'blur'
          }],
        },
      }
    },
    props: ['houseInfo'],
    created() {
      // console.log('didanjia====================',this.houseInfo)
      this.dPriceInfo = {
        d_price: this.houseInfo.d_price,
        d_total_price: this.houseInfo.d_total_price,
        house_id: this.houseInfo.id,
      }
    },
    methods: {
      submitForm(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) return this.$Message.error('请完善信息~')
          var info = {
            d_price: this.dPriceInfo.d_price,
            d_total_price: this.dPriceInfo.d_total_price,
            house_id: this.houseInfo.id,
          }
          // console.log('info==============',info)
          this.$post('/house/dHousePrice', info).then(res => {
            // console.log('配置底价结果====',res)
            if (res.status_code !== 200) return this.$Message.error('配置底价失败！')
            if (res.data === '请完善信息') return this.$Message.error('请完善信息！')
            this.$Message.success('配置底价成功！')
						console.log('1455555',res)
            this.$emit('submitDiPriceSuccess', res.data)
          }).catch(err => {
            this.$Message.error('配置底价失败！')
            console.log(err)
          })
        })
      },
      cancelDPrice() {
        this.$emit('cancelDiPrice')
      },
    }
  }
</script>

<style lang="less" scoped>
  .d_price_form_container {
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
    }
  }
</style>
