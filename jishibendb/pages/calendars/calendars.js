//index.js
//获取应用实例
var openid1 = null;

const app=getApp()
const timedb = wx.cloud.database();
Page({
  data: {
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    today:'',
    mylists:[],
    month:'',
    today1:'',
    status:true,
    sbid:0
  },
  onLoad(options) {
    this.setNowDate();
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
  onShow()
  {
    initData(this);
  },
  add(){
    // 增加新的记事本内容
    console.log("my add");
    app.choice="1";
   this.data.today1=this.data.today;
    if(this.data.cur_month<10) 
     {this.data.month=["0"+this.data.cur_month]}
    if(this.data.today<10)
    {this.data.today1=["0"+this.data.today];}
    wx.navigateTo({
      url: '../myadd/myadd?cur_month='+this.data.month+'&cur_day='+this.data.today1+'&cur_year='+this.data.cur_year
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
  touchS(e) {
    // 获得起始坐标
    this.data.sbid=e.currentTarget.dataset.id;
    console.log(this.data.sbid)
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
  dateSelectAction: function (e) {
     var cur_day = e.currentTarget.dataset.idx;
    this.setData({
      todayIndex: cur_day,
      today:cur_day+1,
    })
    console.log(`点击的日期:${this.data.cur_year}年${this.data.cur_month}月${cur_day + 1}日`);
    initData(this);

  },
 
  setNowDate: function () {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const todayIndex = date.getDate() - 1;
    console.log(`日期：${todayIndex}`)
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch,
      todayIndex,
      today:date.getDate(),
    })
  },
 
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];
 
    const thisMonthDays = this.getThisMonthDays(year, month);
 
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
 
    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
 
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
 
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
 
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
 
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
 
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  
})
function initData(page){
  var txt1=[];
  var curdate=[page.data.cur_year+"-"+"0"+page.data.cur_month+"-"+page.data.today];
  if(page.data.today<10)
  {
   
    curdate=[page.data.cur_year+"-"+page.data.cur_month+"-"+"0"+page.data.today];
    if(page.data.cur_month<10)
    {
      curdate=[page.data.cur_year+"-"+"0"+page.data.cur_month+"-"+"0"+page.data.today];
    }
  }
  console.log(curdate)
  var txt=wx.getStorageSync("txt");
  console.log(txt)
  if(txt.length)
  {
    txt.forEach(function(item){
      //console.log(item.date)
    })
  }
  if(txt.length)
  {
    txt.forEach(function(item)
    {
      console.log(item.date)
      if(curdate.toString()===item.date.toString())
      {
        console.log("1")
        txt1.push(item)
      }
    })
  }
  console.log(txt1);
  if(txt1.length){
    txt1.forEach(function(item,i){
     //  循环每一项数据，并格式化时间戳
       //console.log(item.date)
       item.time=[item.date , item.time]
    })
 }
 page.setData({
  //  将获取到的数据绑定到本页面实例中
   mylists:txt1
 })
}