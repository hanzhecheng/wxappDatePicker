## 基于微信小程序的日期控件
### 主要功能
- 显示本月，上个月，下个月的日期
- 切换日期
- 选中日期状态改变
- 支持初始传入日期参数，有的话就是传入日期，否则就是当前日期  调用方式
```
<DatePicker currentTime="{{dateNow}}" bind:updateDate="updateDate"></DatePicker>
```
currentTime为初始日期参数，updateDate允许在选择日期后向父组件传递选中的日期

## 效果展示
<div align="center">
 <img src="https://github.com/hanzhecheng/wxappDatePicker/blob/master/img/current.jpg"  height="830" width="495">
 <img src="https://github.com/hanzhecheng/wxappDatePicker/blob/master/img/select.jpg"  height="830" width="495">
</div>