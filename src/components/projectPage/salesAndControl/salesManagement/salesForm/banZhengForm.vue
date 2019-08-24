<template>
  <Form class="ban_zheng_form" ref="banZhengForm" :model="banZhengInfo" :rules="banZhengRules" :label-width="135">
    <Row>
      <Col>
        <FormItem label="办证事项确认：">
          <div class="case_list_wrap">
            <span v-for="item in caseList" :key="item.id">{{item.name}}</span>
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--提交交房表单按钮-->
    <div class="btn_wrap" v-if="currentStateNum===6 && !globalReadOnly">
      <Button
        type="primary"
        @click="submitModal=true"
      >办证事项完结
      </Button>
      <Modal
        v-model="submitModal"
        title="请确认是否要提交该表单"
        @on-ok="submitBanZheng"
        @on-cancel="cancelSubmit">
        <p style="color: red">注意：确认后部分内容不可更改！如您已确认无误，请点击右下角确认按钮提交表单！</p>
      </Modal>
      <Button style="margin-left: 30px" @click="goback">返回</Button>
    </div>
  </Form>
</template>

<script>
  export default {
    name: "banZhengForm",
    data() {
      return {
        submitModal: false,
        banZhengInfo: {},
        banZhengRules: {},
        caseList: [],
      }
    },
    props: ['editSalesInfo', 'currentStateNum','globalReadOnly'],
    created() {
      this.caseList = this.editSalesInfo.project.project_set_config
    },
    methods: {
      goback() {
        this.$emit('goback')
      },
      /*
      *  上传办证表单
      * */
      submitBanZheng() {
        var banZhengInfo = {
          id: this.editSalesInfo.id,
          project_id: parseInt(this.$route.params.id),
          house_id: this.editSalesInfo.house.id,
        }
        this.$emit('submitBanZheng',banZhengInfo)
      },
      cancelSubmit() {
        this.$Message.info('取消提交表单！')
      },
    }
  }
</script>

<style scoped>

</style>
