<template>
  <div v-if="isAddPic" class="pic_box">
    <photosBox
      style="padding: 0 20px"
      :toSelect="true"
      :count="50"
      @canclePhotos="closePicBox"
      @addPhotos="addPhotos"
    ></photosBox>
  </div>
  <div v-else-if="isShowSwiper">
    <Button @click="isShowSwiper=false">返回</Button>
    <swiper :swiperList="currentPics"></swiper>
  </div>
  <div v-else class="add_return_money_container">
    <h2>新建退认购金申请</h2>
    <Form :model="returnMoneyFormInfo" ref="form" :label-width="100" :rules="formRules">
      <!-- 状态-->
      <Row>
        <Col span="10">
          <FormItem label="管理项目：">
            <div>{{projectInfo.name}}</div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="审批状态：">
            <div>{{isAddReturnMoney?'待新建':'审核中'}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源-->
      <Row>
        <Col span="5" style="min-width: 225px">
          <FormItem label="关联房源：" prop="house_id">
            <Select v-model="returnMoneyFormInfo.building" placeholder="楼栋" @on-change="getUnitList">
              <Option v-for="(item, index) in building" :value="item.id" :key="index">{{item.building_num}}幢</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3" style="min-width: 100px">
          <FormItem :label-width="1">
            <Select v-model="returnMoneyFormInfo.unit" placeholder="单元" @on-change="getHouseList">
              <Option v-for="(item, index) in unit" :value="item.id" :key="index">{{item.unit_num}}单元</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3" style="min-width: 100px">
          <FormItem :label-width="1">
            <Select v-model="returnMoneyFormInfo.house_id" placeholder="房源" @on-change="getHouseInfo">
              <Option v-for="(item, index) in house" :value="item.id" :key="index">{{item.room}}</Option>
            </Select>
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
              <div v-if="clientInfo.id">
                <Row style="padding: 0 30px">
                  <Col :span="8">
                    房源状态：<span style="color: #348EED">{{clientInfo.state}}</span>
                  </Col>
                </Row>
                <Row>
                  <h4 style="font-size: 14px">
                    客户信息
                  </h4>
                </Row>
                <Row style="padding: 0 15px">
                  <Col :span="4" style="min-width: 130px">
                    客户姓名：{{clientInfo.customer.name}}
                  </Col>
                  <Col :span="6" style="min-width: 180px">
                    联系方式：{{clientInfo.phone}}
                  </Col>
                  <Col :span="4" style="min-width: 130px">
                    认购金：{{clientInfo.subscribe.price}}元
                  </Col>
                  <Col :span="5">
                    认购时间：{{clientInfo.time}}
                  </Col>
                </Row>
              </div>
              <Row style="padding: 0 30px;" v-else>
                <div>温馨提示：当前未选择房源(或)当前房源状态未处于 <span style="color: red">已认购</span> 状态,无法申请退认购金</div>
              </Row>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 备注-->
      <Row>
        <Col span="12">
          <FormItem label="备注：">
            <div>
              <Input type="textarea" v-model="returnMoneyFormInfo.desc" placeholder="请输入备注"></Input>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 文件上传-->
      <Row>
        <Col span="12">
          <FormItem label="文件上传：">
            <div>
              <Button type="primary" @click="gotoUploadPic">上传</Button>
              <span
                v-if="returnMoneyFormInfo.img.length"
                style="margin-left: 30px;color: #348EED;cursor: pointer;"
                @click="gotoShowImg"
              >上传了{{returnMoneyFormInfo.img.length}}份文件</span>
              <span
                v-else
                style="margin-left: 30px;color: #aaaaaa;">请上传pdf文件或者jpg图片</span>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 提交按钮-->
      <div class="btn_wrap">
        <Button type="primary" @click="submitReturnMoney">保存</Button>
        <Button type="default" style="margin-left: 30px" @click="goback">取消</Button>
      </div>
    </Form>
  </div>
</template>

<script>
  import photosBox from '@/components/common/upLoadPhotosList/photosBox'
  import swiper from '@/components/common/swiper/swiper'

  export default {
    name: "add",
    components: {
      photosBox,
      swiper,
    },
    data() {
      return {
        // 楼栋列表
        building: [],
        // 当前选择的楼栋
        building_id: null,
        // 单元列表
        unit: [],
        // 房源列表
        house: [],
        // 选中的房源信息
        houseInfo: {},
        // 选中的房源的客户信息
        clientInfo: {},

        returnMoneyFormInfo: {
          project_id: this.$route.params.id,
          desc: '',
          building: null,
          unit: null,
          house_id: null,
          img: [],
        },
        formRules: {
          house_id: [{required: true, type: 'number', message: '房源不能为空', trigger: 'blur'}],
        },
        // 是否上传图片
        isAddPic: false,
        // 是否展示轮播图
        isShowSwiper:false,
        // 格式化之后的上传的图片列表（用于轮播图查看）
        currentPics:[]
      }
    },
    props: ['projectInfo', 'isAddReturnMoney'],
    created() {
      this.getBuildingList(parseInt(this.$route.params.id))
    },
    methods: {
      goback() {
        this.$emit('cancelAdd')
      },
      /*
    *  获取到楼栋列表的基本配置
    * */
      getBuildingList(project_id) {
        this.$post('/unsubscribe/unsubscribeConfig', {project_id: project_id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.building = res.data.building
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
       *  获取到当前选择的楼栋的单元信息
       * */
      getUnitList(building_id) {
        this.building_id = building_id
        var info = {
          project_id: parseInt(this.$route.params.id),
          building_id: building_id
        }
        this.$post('/unsubscribe/unsubscribeConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.returnMoneyFormInfo.unit = ''
          this.returnMoneyFormInfo.house_id = null
          this.unit = res.data.unit
          this.clientInfo = {}
          this.houseInfo = {}
        }).catch(err => {
          this.$Message.error('获取房源失败！')
          console.log(err)
        })
      },
      /*
      * 获取到当前选择的楼栋的指定单元的房源
      * */
      getHouseList(unit_id) {
        var info = {
          project_id: parseInt(this.$route.params.id),
          building_id: this.building_id,
          unit_id: unit_id,
        }
        this.$post('/unsubscribe/unsubscribeConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.returnMoneyFormInfo.house_id = null
          this.house = res.data.house
          this.clientInfo = {}
          this.houseInfo = {}
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
      *  获取到房源信息
      * */
      getHouseInfo(house_id) {
        var houseInfo = this.house.find(item => {
          return item.id === house_id
        })
        this.houseInfo = houseInfo
        if (houseInfo && houseInfo.follow_history.length > 0) {
          this.clientInfo = houseInfo.follow_history[0]
          this.clientInfo.phone = this.clientInfo.customer.phone
          this.clientInfo.time = this.formatTime(new Date(this.clientInfo.subscribe.subscribe_time))
        } else {
          this.clientInfo = {}
        }
      },
      /*
      * 提交退认购金表单
      * */
      submitReturnMoney() {
        var info = this.returnMoneyFormInfo
        if (!info.house_id) return this.$Message.error('请选择房源！')
        if (!this.clientInfo.id) return this.$Message.error('请选择可以退认购金的房源！')
        if (!info.img.length) return this.$Message.error('请上传退认购金文件！')
        var returnMoneyFormInfo = {
          project_id: parseInt(this.$route.params.id),
          house_id: info.house_id,
          img: info.img,
          infos: info.desc
        }

        // console.log('提交退认购金表单====', returnMoneyFormInfo)
        this.$post('/unsubscribe/addUnsubscribe', returnMoneyFormInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('新建退认购金表单失败！')
          if(res.data ==='该房源已经退认购金或退认购金审核中') return this.$Message.error('该房源已经退认购金或退认购金审核中！')
          this.$Message.success('新建退认购金表单成功！')
          this.$emit('addSuccess')
        }).catch(err => {
          this.$Message.error('新建退认购金表单失败！')
          console.log(err)
        })

      },
      /*
      * 时间格式化
      * */
      formatTime(t) {
        return t.getFullYear() + '-' + this.formatNum(t.getMonth() + 1) + '-' + this.formatNum(t.getDate())
      },
      /*
      * 个位数字自动加 ‘0’
      * */
      formatNum(d) {
        return d >= 10 ? d : '0' + d
      },
      /*
      *  去上传图片
      * */
      gotoUploadPic() {
        this.isAddPic = true
      },
      /*
      * 取消添加图片
      * */
      closePicBox() {
        this.isAddPic = false
      },
      /*
      * 添加图片成功的处理
      * */
      addPhotos(res) {
        var list = []
        res.forEach(item => {
          list.push(item.url)
        })
        this.returnMoneyFormInfo.img = list
        // console.log('获取到的子组件照片', this.returnMoneyFormInfo.img)
        this.closePicBox()
      },
      /*
      * 查看上传的文件，以轮播图的方式
      * */
      gotoShowImg() {
        var currentPics = []
        this.returnMoneyFormInfo.img.forEach(item=>{
          currentPics.push({
            avatar:item
          })
        })
        this.currentPics = currentPics
        this.isShowSwiper = true
      },
    }
  }
</script>

<style lang="less" scoped>
  .add_return_money_container {
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
  }
</style>
