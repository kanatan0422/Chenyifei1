// pages/myadd/myadd.js
let date1=null;
let content1=null;
let openid1=null;
let remind = 0;

var timeFormat=require("../../utils/util")
const app=getApp()
const timedb = wx.cloud.database();
Page({
  
  data: {
    id:"",
    date:"",
    time:"",
    cur_year:'',
    cur_day:'',
    cur_month:''
  },

//设置提醒
  getcheck(){
    remind = 1;
  },
// bindinput 事件，内容修改后绑定到本页面实例
  change(e){
    console.log(e);
    this.setData({
      content:e.detail.value
    });
    content1=e.detail.value;
  },
  delete()
  {
    var re = /^\s*$/g;
    if (!this.data.content || re.test(this.data.content)) {
      wx.navigateBack();
      console.log("delete");
    }
    else
    {
      gai(this);
    }
    timedb.collection('timeList').doc(openid1+this.data.id).remove({
      success: function(res) {
        console.log("删除成功",res)
      },
      fail: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log("删除失败",res)
      }
    })
    wx.navigateBack();
  },
  // 点击取消按钮后返回上级页面
  cancel(){
    wx.navigateBack();
    remind = 0;
  },
  // 点击确定后更新数据
  sure(){
    // 点击确定时 若内容为空格，直接返回上级
    var re = /^\s*$/g;
    if (!this.data.content || re.test(this.data.content)) {
      return;
    }
    //  点击确定时，更新时间戳，并绑定到页面实例（必须在 setValue之前调用）
    //this.setData({
     // time:e.detail.value
    //})
    // 将新内容更新到localstorage
    setValue(this);
    timedb.collection('timeList').doc(openid1+this.data.id).update({
      // data 传入需要局部更新的数据
      data: {
        date1:date1,
        content1:content1,
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log("修改成功",res)
      },
      fail: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log("修改失败",res)
      }
    })
    if(remind == 1){
      timedb.collection("timeList");
      timedb.collection('timeList').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          _id: openid1+this.data.id, // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          date1:date1,
          content1:content1,
        },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log("上传成功",res)
        },
        fail: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log("上传失败",res)
        }
      })
      wx.requestSubscribeMessage({
        tmplIds: ['tFXrKwUVcEVbGBvqVjjFJVNL_f24ErvtkFdmiaME_z0'],
        success(res){
          console.log("授权成功",res)
        },
        fail(res){
          console.log("授权失败",res)
        }
      }),
      console.log("zxcvbnm");
      console.log(date1)
      wx.cloud.callFunction({
        name:"fasong",
        data:{
          openid:openid1,
          date1:date1,
          content1:content1,
        }
      }).then(res =>{
        console.log("发送成功",res)
      }).catch(res =>{
        console.log("发送失败",res)
      })
    }
    wx.navigateBack()
    remind = 0;
  },

  changeDate: function(e) {
    console.log("riqi")
    this.setData({
          date:e.detail.value
        })
    date1=e.detail.value;
      },
  changeTime: function(e){
    console.log("shijian")
        this.setData({
          time:e.detail.value
        })
      },
  
  onLoad(e){
    // 页面加载后首先获取上级页面传来的id
    wx.cloud.callFunction({
      name:"getOpenid",
      complete:res=>{
        var openid=res.result.openid;
        openid1=openid;
      }
    })/*.then(res=>{
      console.log("获取成功",res)
    }).catch(res=>{
      console.log("获取失败",res)
    })*/
    
    var ch=app.choice;
    this.onLad(e);
    console.log(ch);
    //更新此页面的data数据
     var id=e.id;
     this.data.id1=id;
     if(id){
      //  若存在id 则为修改记事本内容
        getData(id,this);

     }else{
      //  不存在id则为新增记事本内容
       this.setData({
        //  为新增的记事本内容增加记事本id 并绑定到页面实例
         id:Date.now(),
       })
     }
     
  },
  onLad:function (options) {//上一个页面传递过来的数据都会在options里
   const curmonth=options.cur_month;
   var curday=options.cur_day;
   var curyear=options.cur_year;
   this.setData({
     cur_month:curmonth,
     cur_day:curday,
     cur_year:curyear,
   })
    console.log(this.data.cur_month,this.data.cur_day,this.data.cur_year)

    
  
  },

  onShow:function(){
    const a=app.choice;
    if(a==1)
    initData(this);
  }
})


function getData(id,page){
  // 从本地存储获取数据
     var arr=wx.getStorageSync("txt");
     arr.forEach(function(item){
         if(arr.length){
          //  遍历数据并根据id显示当前记事本内容
           if(item.id==id){
               page.setData({
                //  匹配记事本后将id与content绑定到页面实例
                id:item.id,
                content:item.content,
                date:item.date,
                time:item.time

               })
               content1=item.content;
               date1=item.date;
           }
         }
     })
}

function gai(page)
{
  var arr=wx.getStorageSync("txt");
  var id=-1;
  let temp=-1;
  if(arr.length){
    arr.forEach(function(item){
      id++;
      if(item.id==page.data.id)
      {
        temp=id;
      }
    })
  }
  arr.splice(temp,1);
  wx.clearStorageSync();
  wx.setStorageSync("txt",arr);
}

function setValue(page){
    var arr=wx.getStorageSync("txt");
    var data=[],flag=true;
    // data数组用于存储更新或新加的记事本内容
    if(arr.length){
      // 修改原有记事本内容
      arr.forEach(function(item){
        if(item.id==page.data.id){
            item.date=page.data.date;
            item.time=page.data.time;
            item.content=page.data.content;
            // flag用于控制 是修改记事本内容还是新增记事本内容
            flag=false;
        }
        data.push(item);
      })
    }
    // 新增记事本内容
    if(flag){
       data.push(page.data)
    }
    // 最后将新的内容加至localStore中
    wx.setStorageSync("txt", data)
}

function initData(page){
  const a=app.choice;
  if (a=='0') {
    var myDate = new Date();//获取系统当前时间
    var d=myDate.toLocaleDateString(); //获取当前日期
    var t=myDate.toLocaleTimeString();
    date1=d;
    page.setData({
      date:d,
      time:t,
    })
  } else {
    var day=[page.data.cur_year+"-"+page.data.cur_month+"-"+page.data.cur_day]
    date1=page.data.cur_year+"年"+page.data.cur_month+"月"+page.data.cur_day+"日";
    console.log(date1);
    page.setData({
      date:day,
      time:t,
    })
  }
 

}