> 基于Vue开发的类似的日期控件，功能基本相同，顶部button用了element组件，自己写ul也可以实现，比较简单，自己写的组件方便修改样式增加功能。
```
<template>
  <div class='datepicker'>
    <el-button-group>
      <el-button @click='setMonth("last")'>上个月</el-button>
      <el-button @click='setMonth("current")'>今天</el-button>
      <el-button @click='setMonth("next")'>下个月</el-button>
    </el-button-group>
    <div>{{nowDate}}</div>
    <table class='dateTable'>
      <thead>
        <th>一</th>
        <th>二</th>
        <th>三</th>
        <th>四</th>
        <th>五</th>
        <th>六</th>
        <th>日</th>
      </thead>
      <tbody>
        <tr v-for='(day,index) in days' :key='index'>
          <td
            v-for='(item,inx) in day'
            :key='item'
            :class='{"isSelected":currentIndex==(index+""+inx),"notCurrent":isCurrent(index,item)}'
            @click='setCurrent(index,inx)'
          >{{item}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "DatePicker",
  mounted() {
    this.initDays(new Date());
  },
  data() {
    return {
      days: [],
      currentIndex: -1,
      currentDate: new Date(),
      notCurrentFlag: false //是否点了上一个月或下一个月
    };
  },
  methods: {
    setMonth(type = "current") {
      let date = this.currentDate;
      switch (type) {
        case "last":
          date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
          this.notCurrentFlag = true;
          break;
        case "current":
          date = new Date();
          this.notCurrentFlag = false;
          break;
        case "next":
          date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
          this.notCurrentFlag = true;
          break;
      }
      this.currentDate = date;
      this.initDays(date);
    },
    //判断是否是本月
    isCurrent(rowIndex, val) {
      if (rowIndex == 0 && val > 22) {
        return true;
      }
      if (rowIndex >= 4 && val < 14) {
        return true;
      }
      return false;
    },
    //设置选中
    setCurrent(rowIndex, columnIndex) {
      let value = this.days[rowIndex][columnIndex],
        date = this.currentDate;
      if (rowIndex == 0 && value > 7) {
        //点击了上个月
        this.setMonth("last");
        this.$nextTick(() => {
          this.setSelected(value);
          this.currentDate = new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            value
          );
        });
        return;
      }
      if (rowIndex >= 4 && value < 14) {
        //点了下个月
        this.setMonth("next");
        this.$nextTick(() => {
          this.setSelected(value);
          this.currentDate = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            value
          );
        });
        return;
      }
      this.currentDate = new Date(date.getFullYear(), date.getMonth(), value);
      this.currentIndex = rowIndex + "" + columnIndex;
    },
    //初始化日期
    initDays(date) {
      this.days = [];
      let days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), //月天数
        firstDayOfWeek = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).getDay(), //月第一天星期几
        firstRowLeft = firstDayOfWeek == 0 ? 6 : firstDayOfWeek - 1, //第一行剩余位置,周日是0，其余为对应数字
        rows = Math.floor(days / 7), //
        day = 1,
        nextDays = 0; //下个月可以显示的天数;

      for (let i = 1; i < 7; i++) {
        if (i == 1) {
          //第一行，可能包含上个月的天数
          let arr = [];
          if (firstRowLeft) {
            let lastDays = this.getMonthDays(date, "last");
            for (let j = lastDays - firstRowLeft + 1; j <= lastDays; j++) {
              arr.push(j);
            }
            for (let j = 1; j <= 7 - firstRowLeft; j++) {
              arr.push(day);
              day++;
            }
          } else {
            for (let j = 1; j <= 7; j++) {
              arr.push(day);
              day++;
            }
          }
          this.days.push(arr);
          continue;
        }
        //如果天数+6小于月总天数，填满一行
        if (day + 6 <= days) {
          let arr = [];
          for (let j = 1; j <= 7; j++) {
            arr.push(day);
            day++;
          }
          this.days.push(arr);
          continue;
        }
        //天数大于总天数，显示下个月数据
        if (day > days) {
          if (!nextDays) {
            nextDays = 1;
          }
          let arr = [];
          for (let j = 1; j <= 7; j++) {
            arr.push(nextDays);
            nextDays++;
          }
          this.days.push(arr);
          continue;
        } else {
          //本月天数占不满一行，用下个月天数补齐
          let arr = [];
          for (let j = 1; j <= 7; j++) {
            if (day > days) {
              if (!nextDays) {
                nextDays = 1;
              }
              arr.push(nextDays);
              nextDays++;
            } else {
              arr.push(day);
              day++;
            }
          }
          this.days.push(arr);
          continue;
        }
      }
      this.setCurrentByBtn();
    },
    //点击按钮设置选中项
    setCurrentByBtn() {
      this.$nextTick(() => {
        if (this.notCurrentFlag) {
          let index = this.days[0].findIndex(item => item == 1);
          this.currentIndex = 0 + "" + index;
        } else {
          this.setSelected(new Date().getDate());
        }
      });
    },
    setSelected(day) {
      let today = day,
        flag = false,
        indexArr = [],
        startIndex = 0;
      if (today > 8) {
        startIndex = 1;
      }
      for (let i = startIndex; i < this.days.length; i++) {
        for (let j = 0; j < this.days[i].length; j++) {
          const element = this.days[i][j];
          if (element == today) {
            indexArr.push(i, j);
            flag = true;
            break;
          }
        }
        if (flag) {
          break;
        }
      }
      this.currentIndex = indexArr[0] + "" + indexArr[1];
    },
    //获取月天数
    getMonthDays(date, type = "current") {
      let currentYear = date.getFullYear(),
        month = "";
      switch (type) {
        case "current":
          //当前月
          month = date.getMonth() + 1;
          break;
        case "last":
          //上个月
          month = date.getMonth();
          break;
        case "next":
          //下个月,暂时好像用不到
          month = date.getMonth() + 2;
          break;
      }
      let days = new Date(currentYear, month, 0).getDate();
      return days;
    }
  },
  computed: {
    nowDate() {
      return this.currentDate.toLocaleDateString();
    }
  }
};
</script>

<style lang="scss" scoped>
.datepicker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dateTable thead th {
  padding: 12px 0;
  color: #606266;
  font-weight: 400;
}

.dateTable td {
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  vertical-align: top;
  transition: background-color 0.2s ease;
  box-sizing: border-box;
  padding: 8px;
  height: 85px;
  width: 85px;
  cursor: pointer;
}

.dateTable td.isSelected {
  color: #1989fa;
  background-color: #f2f8fe;
}

.dateTable td:hover {
  background-color: #f2f8fe;
}

.dateTable tr td:first-child {
  border-left: 1px solid #ebeef5;
}

.dateTable tr:first-child td {
  border-top: 1px solid #ebeef5;
}

.notCurrent {
  color: #c0c4cc;
}
</style>


```