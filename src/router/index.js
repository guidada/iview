import Vue from 'vue'
import Router from 'vue-router'
// 登录页
// import login from '@/components/login'
// 首页
import index from '@/components/index.vue'
// projectPage
import projectPage from '@/components/projectPage/projectPage'
// 内容展示区域
import contentView from '@/components/common/content/contentView'
// 项目列表
import projectIndex from '@/components/projectPage/projectList'
// 添加项目页
import addProject from '@/components/projectPage/houseLibrary/addProject'


Vue.use(Router)
export default new Router({
  routes: [
    // 登录页面
    /* {
       path: '/login',
       name: 'login',
       component: login,
       meta: {
         title: '后台登录',
         hideInMenu: true
       }
     },*/
    // 首页
    {
      path: '/',
      // name: 'index',
      component: index,
      meta: {
        title: '首页',
        hideInMenu: true
      },
      children: [{
          path: '',
          name: 'projectIndex',
          component: projectIndex,
          meta: {
            title: '首页'
          },
        },
        {
          path: 'addProject',
          name: 'addProject',
          component: addProject,
          meta: {
            title: '新增项目'
          },
        }
      ]
    },

    //单个项目
    {
      path: '/project/:id',
      name: 'projectPage',
      component: projectPage,
      meta: {
        title: '项目详情',
        isMenu: true
      },
      children: [
        // 项目主体
        {
          path: 'houseLibrary',
          name: 'houseLibrary',
          meta: {
            title: '项目主体',
            icon: 'ios-podium-outline'
          },
          component: contentView,
          children: [{
              path: 'projectDisplay',
              name: 'projectDisplay',
              meta: {
                title: "项目展示",
                icon: 'ios-flower'
              },
              component: () => import(
                '@/components/projectPage/houseLibrary/projectDisplay/projectDisplay.vue')
            },
            {
              path: 'editProject',
              name: 'editProject',
              meta: {
                title: "项目管理",
                icon: 'ios-briefcase'
              },
              component: addProject
            },
            {
              path: 'houseType',
              name: 'houseType',
              meta: {
                title: "户型库",
                icon: 'ios-apps'
              },
              component: () => import('@/components/projectPage/houseLibrary/houseType/houseType.vue')
            },
            {
              path: 'houseManagement',
              name: 'houseManagement',
              meta: {
                title: "房源管理",
                icon: 'logo-buffer'
              },
              component: () => import(
                '@/components/projectPage/houseLibrary/houseManagement/houseManagement.vue')
            },
            {
              path: 'houseManagement/:build',
              meta: {
                title: "房源管理",
                icon: 'logo-buffer',
                hideInMenu: true
              },
              component: () => import(
                '@/components/projectPage/houseLibrary/houseManagement/houseManagement.vue')
            },
          ]
        },
        // 客户库
        {
          path: 'clientLibrary',
          name: 'clientLibrary',
          meta: {
            title: '客户库',
            icon: 'ios-people'
          },
          component: contentView,
          children: [{
              path: 'clientManagement',
              name: 'clientManagement',
              meta: {
                title: "客户管理",
                icon: 'ios-person'
              },
              component: () => import('@/components/projectPage/clientLibrary/clientManagement.vue')
            },
            {
              path: 'customerReporting',
              name: 'customerReporting',
              meta: {
                title: "报备客户",
                icon: 'ios-person'
              },
              component: () => import('@/components/projectPage/clientLibrary/customerReporting.vue')
            },
            {
              path: 'clientCreate',
              name: 'clientCreate',
              meta: {
                title: "新建客户",
                icon: 'ios-person',
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/clientLibrary/clientCreate.vue')
            },
            {
              path: 'clientView',
              name: 'clientView',
              meta: {
                title: "查看客户",
                icon: 'ios-person',
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/clientLibrary/clientView.vue')
            },
            {
              path: 'clientEdit',
              name: 'clientEdit',
              meta: {
                title: "编辑客户",
                icon: 'ios-person',
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/clientLibrary/clientEdit.vue')
            }
          ]
        },
        // 房源销控
        {
          path: 'salesAndControl',
          name: 'salesAndControl',
          meta: {
            title: '房源销控',
            icon: 'ios-calculator'
          },
          component: contentView,
          children: [{
              path: 'salesManagement',
              name: 'salesManagement',
              meta: {
                title: "销售管控",
                icon: 'ios-albums'
              },
              component: () => import('@/components/projectPage/salesAndControl/salesManagement.vue')
            },
            {
              path: 'salesActive',
              name: 'salesActive',
              meta: {
                title: "销售活动",
                icon: "ios-paper-plane"
              },
              component: () => import('@/components/projectPage/salesAndControl/salesActive.vue')
            },
            {
              path: 'activeCreate',
              name: 'activeCreate',
              meta: {
                title: "销售活动",
                icon: "ios-paper-plane",
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/salesAndControl/activeCreate.vue')
            },
            {
              path: 'activeView',
              name: 'activeView',
              meta: {
                title: "查看活动",
                icon: 'ios-person',
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/salesAndControl/activeView.vue')
            },
            {
              path: 'activeEdit',
              name: 'activeEdit',
              meta: {
                title: "编辑活动",
                icon: 'ios-person',
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/salesAndControl/activeEdit.vue')
            }
          ]
        },
        // 表单审批
        {
          path: 'formApproval',
          name: 'formApproval',
          meta: {
            title: '表单审批',
            icon: 'ios-eye'
          },
          component: contentView,
          children: [{
              path: 'favorableForm',
              name: 'favorableForm',
              meta: {
                title: "优惠单",
                icon: 'md-paper'
              },
              component: () => import('@/components/projectPage/formApproval/favorableForm.vue')
            },
            {
              path: 'buyerChangeFrom',
              name: 'buyerChangeFrom',
              meta: {
                title: "买受人变更",
                icon: 'ios-repeat'
              },
              component: () => import('@/components/projectPage/formApproval/buyerChangeForm')
            },
            {
              path: 'cancelRaiseFrom',
              name: 'cancelRaiseFrom',
              meta: {
                title: "解筹申请",
                icon: 'ios-close'
              },
              component: () => import('@/components/projectPage/formApproval/cancelRaiseFrom.vue')
            },
            {
              path: 'returnMoneyFrom',
              name: 'returnMoneyFrom',
              meta: {
                title: "退认购金",
                icon: 'ios-undo'
              },
              component: () => import('@/components/projectPage/formApproval/returnMoneyFrom.vue')
            },
            {
              path: 'cancelBuyHouseFrom',
              name: 'cancelBuyHouseFrom',
              meta: {
                title: "已签约退房",
                icon: 'ios-sad'
              },
              component: () => import('@/components/projectPage/formApproval/cancelBuyHouseFrom.vue')
            },
            {
              path: 'cancelSalesFrom',
              name: 'cancelSalesFrom',
              meta: {
                title: "取消销控单",
                icon: 'ios-return-left'
              },
              component: () => import('@/components/projectPage/formApproval/cancelSalesFrom.vue')
            },
          ]
        },
        // 合同管理
        {
          path: 'contractManagement',
          name: 'contractManagement',
          meta: {
            title: '合同管理'
          },
          component: contentView,
          children: [{
              path: 'contractList',
              name: 'contractList',
              meta: {
                title: "合同列表"
              },
              component: () => import('@/components/projectPage/contractManagement/contractList.vue'),
            },
            {
              path: 'contractCreate',
              name: 'contractCreate',
              meta: {
                title: "合同新建",
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/contractManagement/contractCreate.vue'),
            },
            {
              path: 'contractEdit',
              name: 'contractEdit',
              meta: {
                title: "合同编辑",
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/contractManagement/contractEdit.vue'),
            },
            {
              path: 'contractView',
              name: 'contractView',
              meta: {
                title: "合同查看",
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/contractManagement/contractView.vue'),
            }
          ]
        },
        // 佣金管理
        {
          path: 'commission',
          name: "commission",
          meta: {
            title: '佣金管理',
            icon: 'logo-yen'
          },
          component: contentView,
          children: [{
              path: 'kaiFaCommission',
              name: "kaiFaCommission",
              meta: {
                title: "开发商佣金",
                icon: "md-list"
              },
              component: () => import('@/components/projectPage/commission/kaiFaCommission'),
            },
            {
              path: 'mingXiTable',
              name: "mingXiTable",
              meta: {
                title: "明细",
                icon: "ios-list-box-outline",
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/commission/mingXiTable'),
            },
            {
              path: 'salerCommission',
              name: "salerCommission",
              meta: {
                title: "销售结佣",
                icon: "md-list-box"
              },
              component: () => import('@/components/projectPage/commission/salerCommission'),
            }
          ]
        },
        // 销控配置
        {
          path: 'config',
          name: "config",
          meta: {
            title: '设置',
            icon: 'ios-build'
          },
          component: contentView,
          children: [{
              path: 'otherconfig',
              name: "otherconfig",
              meta: {
                title: "交房办证配置",
                icon: "ios-settings"
              },
              component: () => import('@/components/projectPage/config/otherconfig'),
            },
            {
              path: 'approve',
              name: "approve",
              meta: {
                title: "审批配置",
                icon: "ios-hammer"
              },
              component: () => import('@/components/projectPage/config/approve'),
            },
            {
              path: 'approve-edit',
              name: "approveEdit",
              meta: {
                title: "审批配置编辑",
                icon: "md-hammer",
                hideInMenu: true
              },
              component: () => import('@/components/projectPage/config/approve/edit'),
            },
            {
              path: 'commission_config',
              name: "commission_config",
              meta: {
                title: "佣金配置",
                icon: "md-hammer"
              },
              component: () => import('@/components/projectPage/config/commissionConfig'),
            },
            {
              path: 'objectSetting',
              name: "objectSetting",
              meta: {
                title: "项目配置",
                icon: "md-apps"
              },
              component: () => import('@/components/projectPage/config/objectSetting'),
            },
          ]
        },
        // 其他
        {
          path: 'other',
          name: 'other',
          meta: {
            title: '其他',
            icon: "md-wine"
          },
          component: contentView,
          children: [{
            path: 'uploadList',
            name: 'uploadList',
            meta: {
              title: "导入日志",
              icon: "ios-log-in"
            },
            component: () => import('@/components/projectPage/other/uploadList.vue'),
          }]
        },
      ]
    },

    {
      path: '/401',
      name: 'error_401',
      meta: {
        hideInMenu: true
      },
      component: () => import('@/components/error-page/401.vue')
    },
    {
      path: '/500',
      name: 'error_500',
      meta: {
        hideInMenu: true
      },
      component: () => import('@/components/error-page/500.vue')
    },
    {
      path: '*',
      name: 'error_404',
      meta: {
        hideInMenu: true
      },
      component: () => import('@/components/error-page/404.vue')
    }

  ]
})
