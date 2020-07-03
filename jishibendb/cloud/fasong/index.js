// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const result=await cloud.openapi.subscribeMessage.send({
      touser:event.openid,
      page:'pages/calendars/calendars',
      data:{
        date2:{
          value:event.date1
        },
        thing3:{
          value:event.content1
        },
        phrase5:{
          value:event.content1
        },
        date8:{
        value:event.date1
        }
      },
      templateId:'tFXrKwUVcEVbGBvqVjjFJVNL_f24ErvtkFdmiaME_z0'
    })
    console.log(result)
    return result
  }catch(err)
  {
    console.log(err)
    return err
  }
}