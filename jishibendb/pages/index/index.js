//记事本页面.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto:['每一个不曾起舞的日子\n&emsp;都是对生命的辜负',
    '拖延和等待\n是这个世界上\n最容易压垮一个人斗志的东西',
    '行动是治愈恐惧的良药,\n&emsp;而犹豫、拖延将不断滋养恐惧',
    '不积跬步，无以至千里\n&emsp;不积小流，无以成江海。'
  ],
    xiabiao:Math.floor(Math.random()*4),
    motto1: '每一个不曾起舞的日子\n&emsp;都是对生命的辜负',
  },
  onShow()
  {
    this.setData(
      {
        xiabiao:Math.floor(Math.random()*4)
      }
    )
  }
})
