// pages/jishiben/jishiben.js
//var timeFormat=require("../../utils/util")
var openid1 = null;

const app=getApp()
const timedb = wx.cloud.database();
Page({
  onload:function(){
    initData(this);
    
    
  },
  delete(e)
  {
    var arr=wx.getStorageSync("txt");
    var myid=e.currentTarget.dataset.id;
    var id=-1;
    let temp=-1;
    if(arr.length){
      arr.forEach(function(item){
        id++;
        if(item.id==myid)
        {
          temp=id;
        }
      })
    }
    wx.cloud.callFunction({
      name:"getOpenid",
      complete:res=>{
        var openid=res.result.openid;
        openid1 = openid;
      }
    })
    console.log("openid1",openid1)
    console.log("temp",temp)
    timedb.collection('timeList').doc(openid1+e.currentTarget.dataset.id).remove({
      success: function(res) {
        console.log("删除成功",res)
      },
      fail: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log("删除失败",res)
      }
    })
    arr.splice(temp,1);
    wx.clearStorageSync();
    wx.setStorageSync("txt",arr);
    this.onShow();
  },
  onShow:function(){
    initData(this);
  },
  gotocalendar(){
    wx.navigateTo({
      url: '../calendars/calendars'
    })
  },
  edit(e){
    // 修改原有的记事本内容
    console.log("myedit")
    var myid=e.currentTarget.dataset.id;
    app.choice="0";
    console.log(myid);
    wx.navigateTo({
    url: '../myadd/myadd?id='+myid,
    })
  },
  add(){
    // 增加新的记事本内容
    console.log("my add");
    app.choice="0";
    wx.navigateTo({
      url: '../myadd/myadd'
    })
  },
  touchS(e) {
    // 获得起始坐标
    this.data.sbid=e.currentTarget.dataset.id;
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }, 
  touchM(e) {
    // 获得当前坐标
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    const x = this.startX - this.currentX; //横向移动距离
    const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    if (x > 35 && y < 110) {
    //向左滑是显示删除
      this.setData({
        status: false
      })
    } else if (x < -35 && y < 110) {
    //向右滑
      this.setData({
        status: true
      })
    }
  },

  data: {
    mylists:[],
    status:true,
    sbid:0
  },

})
// 每次onload和onshow从本地存储中获取数据
function initData(page){
  var txt=wx.getStorageSync("txt");
  if(txt.length){
     txt.forEach(function(item,i){
      //  循环每一项数据，并格式化时间戳
        
        item.time=[item.date , item.time]
     })
  }
 page.setData({
  //  将获取到的数据绑定到本页面实例中
   mylists:txt
 })
}