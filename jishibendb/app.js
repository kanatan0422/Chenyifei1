//app.js
App({
  onLaunch:function(){
    wx.cloud.init({
      env:"study-ppoiq"
    })
  },
  globalData: {
    choice:null
  }
})