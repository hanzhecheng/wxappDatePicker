//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    dateNow: "2018/10/14"
  },
  updateDate(e) {
    this.setData({
      dateNow: e.detail
    })
  }
})