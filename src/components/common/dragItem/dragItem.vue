<template>
  <div class="drag_item" @mousedown="move" :style="itemPosition">       <!--绑定按下事件-->
    {{dragInfo.building_num}}#
		<slot ></slot>
		
		
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'

  export default {
    name: "dragItem",
    data() {
      return {
        itemPosition: {
          top: (this.dragInfo.top || 0) + 'px',
          left: (this.dragInfo.left || 0) + 'px',
					
        },
		xyList:[]
      }
    },
    props: ['dragInfo', 'config_ing'],
    created() {

    },
    computed: {
      ...mapGetters({
        getCurrentBuildingInfo: 'getCurrentBuildingInfo'
      })
    },
    methods: {
      move(e) {
        // 在浏览时直接返回
        if (!this.config_ing) return
        if (!this.dragInfo.dragAble) return this.$Message.warning('当前元素未处于编辑状态，不可移动')

        // 配置状态时，进入下面的操作
        e.preventDefault()
        let odiv = e.target        //获取目标元素

        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft
        let disY = e.clientY - odiv.offsetTop
        document.onmousemove = (e) => {       //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX
          let top = e.clientY - disY

          // 超出界限处理
          if (left < 0 ) {
            left =0
          } else if (left > 800) {
            left = 735
          }

          if (top < 0 ) {
            top =0
          } else if (top > 500) {
            top = 460
          }

          //绑定元素位置到positionX和positionY上面
          this.itemPosition.top = top
          this.itemPosition.left = left

          //移动当前元素
          odiv.style.left = left + 'px'
          odiv.style.top = top + 'px'
        }
        document.onmouseup = (e) => {
          document.onmousemove = null
          document.onmouseup = null
          //  鼠标离开的时候把当前元素的位置存储起来，方便下次调用（vuex状态管理）
            this.dragInfo.left = parseInt(this.itemPosition.left)
            this.dragInfo.top = parseInt(this.itemPosition.top)
          console.log('鼠标离开时的状态', this.dragInfo)
		  var didata = this.dragInfo
		  this.$emit('setXY',this.dragInfo)
		  // if(this.xyList.length === 0){
			 //  this.xyList.push(didata)
		  // } else {
			 //  
			 //  for(var i=0;i<this.xyList.length;i++){
				//   if(this.xyList[i].id === didata.id){
				// 	  this.xyList[i] = didata
				//   } 
				//   if(this.xyList.length === i+1 && this.xyList[i].id !== didata.id){
				// 	  this.xyList.push(didata)
				//   }
			 //  }
		  // }
		  // console.log('xylist',this.xyList)
          this.$store.commit('setCurrentBuildingInfo',this.dragInfo)
          this.$store.commit('setCurrentBuildingInfo',this.dragInfo)
        }
      }
    },
  }
</script>

<style lang="less" scoped>

  .drag_item {
		
    position: absolute; /*定位*/
    width: 50px;
    height: 25px;
    background: rgba(173,24,31,0.8);
    color: #fff;
    border-radius: 4px;
    text-align: center;
		font-size: 16px;
		cursor:pointer;
  }
	.drag_item:after {
		top: 100%;
		left: 50%;
		border: solid transparent;
		content: " ";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
		border-color: rgba(132, 197, 213, 0);
		border-top-color: rgba(173,24,31,0.8);
		border-width: 10px;
		margin-left: -10px;
	}

</style>
