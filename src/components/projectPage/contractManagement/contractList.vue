<template>
  <div class="project-container">
    <div class="search-panel">
      <div class="search-itme">
        <Row>
          <Col span="2">
            <div class="search-item__label">
              房源筛选：
            </div>
          </Col>
          <Col span="3">
            <Select v-model="houseInfo.building" placeholder="楼栋" @on-change="getUnitList">
              <Option v-for="(item, index) in building" :value="item.id" :key="index">{{item.building_num}}幢</Option>
            </Select>
          </Col>
          <Col span="3" style="min-width: 100px">
              <Select v-model="houseInfo.unit" placeholder="单元" @on-change="getHouseList">
                <Option v-for="(item, index) in unit" :value="item.id" :key="index">{{item.unit_num}}单元</Option>
              </Select>
          </Col>
          <Col span="3" style="min-width: 100px">
              <Select v-model="houseInfo.house_id" placeholder="房源" @on-change="getData">
                <Option v-for="(item, index) in house" :value="item.id" :key="index">{{item.room}}</Option>
              </Select>
          </Col>
          <Col span="2">
            <div class="search-item__label">
              合同编号：
            </div>
          </Col>
          <Col span="8">
            <Input @on-search="getData(1)" search enter-button v-model="number" placeholder="请输入合同编号" />
          </Col>
        </Row>
      </div>
      <div class="operation-panel">
        <Button type="primary" :to="'/project/'+this.project_id+'/contractManagement/contractCreate'">新建合同</Button>
      </div>
      <div class="client-content">
        <Table border :columns="columns" :data="data" :no-data-text="noDataText"></Table>
      </div>
      <Page :total="total" :page-size="pageSize" @on-change="getData" :current.sync="current"></Page>
    </div>
  </div>
</template>

<script>
  export default {
    name: "contractList",
    data() {
      return {
        houseInfo: {
          building: null,
          unit: null,
          house_id: null,
        },
        building: [],
        building_id: null,
        // 单元列表
        unit: [],
        // 房源列表
        house: [],
        columns: [
            {
                title: '合同编号',
                key: 'number'
            },
            {
              title: '关联房源',
                key: 'house',
                width: 150,
                align: 'center',
                render: (h, params) => {
                  return h('div', params.row.house.building + '-' + params.row.house.unit + '-' + params.row.house.room);
                }
            },
            {
                title: '创建时间',
                key: 'created_at',
                render: (h, params) => {
                  return h('div', this.formatTime(params.row.created_at.date));
                }
            },
            {
                title: '操作者',
                key: 'create_name'
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px',
                                color: '#2d8cf0'
                            },
                            on: {
                                click: () => {
                                    this.contractView(params.row)
                                }
                            }
                        }, '查看'),
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                              color: '#2d8cf0'
                            },
                            on: {
                                click: () => {
                                    this.contractEdit(params.row)
                                }
                            }
                        }, '编辑')
                    ]);
                }
            }
        ],
        data: [],
        clientName: '',
        total: 0,
        pageSize: 10,
        current: 1,
        project_id: this.$route.params.id,
        project: [],
        number: '',
        noDataText: '',
      }
    },
    methods: {
      formatTime(data) {
        return new Date(data).getFullYear() + '/' + (new Date(data).getMonth()+1) + '/' + new Date(data).getDate()
      },
      /*
      *  获取到楼栋列表的基本配置
      * */
      getBuildingList(project_id) {
        this.$post('discount/discountListConfig', {project_id: project_id}).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.building = res.data.building
        }).catch(err => {
          this.$Message.error('获取房源失败！')
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
        this.$post('discount/discountListConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.houseInfo.house_id = null
          this.house = res.data.all_house
          // console.log('房源的基本信息===', this.house)
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
        this.$post('discount/discountListConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.houseInfo.unit = ''
          this.houseInfo.house_id = null
          this.unit = res.data.unit
        }).catch(err => {
          this.$Message.error('获取房源失败！')
          console.log(err)
        })
      },
      getData(page) {
        this.current = page
        this.$post('/contract/lists',{
          project_id: this.project_id,
          page: this.current,
          number: this.number,
          house_id: this.houseInfo.house_id
        }).then(res => {
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          this.total = res.data.count
          this.data = res.data.contract
        })
      },
      contractView(data) {
        let uid = data.id
        data.id = this.project_id
        data.uid = uid
        this.$router.push({
          name: 'contractView',
          params: data
        })
      },
      contractEdit(data) {
        let uid = data.id
        data.id = this.project_id
        data.uid = uid
        this.$router.push({
          name: 'contractEdit',
          params: data
        })
      },
      getContract(value) {
        this.project_id = value
        this.getData(1)
      },
      deleteContract(data) {
        this.$post('/contract/deleteContract',{
          id: data.id
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          this.$Message.success('删除成功')
          this.getData(1)
        })
      }
    },
    created() {
      this.getData()
      this.getBuildingList(parseInt(this.$route.params.id))
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
.operation-panel {
  margin-top: 20px;
}
</style>
