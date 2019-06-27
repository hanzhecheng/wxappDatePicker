## 基于微信小程序的日期控件
### 主要功能
- 显示本月，上个月，下个月的日期
- 切换日期
- 选中日期状态改变
- 支持传入初始日期参数  调用方式
```
<DatePicker currentTime="{{dateNow}}" bind:onSelectDate="updateDate"></DatePicker>
```
### 参数    
| 属性         |    类型       |  默认值  |  必填      | 说明  |
| :----------  | ------------:| ---------------------------:|------------:|:---------------------------:|
| currentTime  |  string      | (new Date()).toLocaleDateString()      |    否    |当前日期|
| onSelectDate   |  eventhandle |          |     否       |       选择的日期变化时向父组件传递的选中日期

## 效果展示
<div align="center">
 <img src="https://github.com/hanzhecheng/wxappDatePicker/blob/master/img/current.jpg"  height="830" width="495">
 <img src="https://github.com/hanzhecheng/wxappDatePicker/blob/master/img/select.jpg"  height="830" width="495">
</div>
