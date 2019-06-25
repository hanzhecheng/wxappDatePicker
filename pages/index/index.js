//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    dateNow: ""
  },
  updateDate(e) {
    this.setData({
      dateNow: e.detail
    })
  }
})