// Component/DatePicker/Datepiker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentTime: {
      type: String
    }

  },
  observers: {
    'currentDate': function (val) {
      this.setData({
        dateNow: val.toLocaleDateString()
      })
      this.triggerEvent("updateDate", val.toLocaleDateString())
    }
  },
  lifetimes: {
    attached: function () {
      console.log(this.data.currentTime)
      let currentDate = this.data.currentTime ? new Date(this.data.currentTime) : (new Date())
      // 在组件实例进入页面节点树时执行
      this.initDays(currentDate)
      this.setData({
        currentDate: currentDate
      })
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    headers: ['一', '二', '三', '四', '五', '六', '日'],
    days: [],
    currentIndex: -1,
    currentDate: "",
    notCurrentFlag: false, //是否点了上一个月或下一个月
    dateNow: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initDays(date) {
      this.days = [];
      let days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), //月天数
        firstDayOfWeek = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).getDay(), //月第一天星期几
        firstRowLeft = firstDayOfWeek == 0 ? 6 : firstDayOfWeek - 1, //第一行剩余位置,周日是0，其余为对应数字
        day = 1, //当前月的天数
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
      this.setData({
        days: this.days
      })
      this.setCurrentByBtn();
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
    },
    setMonth(e) {
      let date = this.data.currentDate,
        type = typeof e == "string" ? e : e.currentTarget.dataset.mark;
      switch (type) {
        case "last":
          date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
          this.setData({
            notCurrentFlag: true
          })
          break;
        case "current":
          date = new Date();
          this.setData({
            notCurrentFlag: false
          })
          break;
        case "next":
          date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
          this.setData({
            notCurrentFlag: true
          })
          break;
      }
      this.setData({
        currentDate: date
      })
      this.initDays(date);
    },
    //点击按钮设置选中项
    setCurrentByBtn() {
      wx.nextTick(() => {
        if (this.data.notCurrentFlag) {
          let index = this.data.days[0].findIndex(item => item == 1);
          this.setData({
            currentIndex: 0 + "" + index
          })
        } else {
          this.setSelected(this.data.currentDate.getDate());
        }
      });
    },
    //设置选中的日期
    setSelected(day) {
      let today = day,
        flag = false,
        indexArr = [],
        startIndex = 0;
      if (today > 8) {
        startIndex = 1;
      }
      for (let i = startIndex; i < this.data.days.length; i++) {
        for (let j = 0; j < this.data.days[i].length; j++) {
          const element = this.data.days[i][j];
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
      this.setData({
        currentIndex: indexArr[0] + "" + indexArr[1]
      })
    },
    //设置选中
    setCurrent(e) {
      let rowIndex = e.currentTarget.dataset.rowindex,
        columnIndex = e.currentTarget.dataset.columnindex
      let value = this.data.days[rowIndex][columnIndex],
        date = this.data.currentDate;
      if (rowIndex == 0 && value > 7) {
        //点击了上个月
        this.setMonth("last");
        wx.nextTick(() => {
          this.setSelected(value);
          date = new Date(date.getFullYear(), date.getMonth() - 1, value);

          this.setData({
            currentDate: date
          })
        });
        return;
      }
      if (rowIndex >= 4 && value < 14) {
        //点了下个月
        this.setMonth("next");
        wx.nextTick(() => {
          this.setSelected(value);
          date = new Date(date.getFullYear(), date.getMonth() + 1, value);
          this.setData({
            currentDate: date
          })
        });
        return;
      }
      date = new Date(date.getFullYear(), date.getMonth(), value);

      this.setData({
        currentDate: date,
        currentIndex: rowIndex + "" + columnIndex
      })
    },
    bindDateChange(e) {
      console.log(e.detail.value)
      this.setData({
        currentDate: new Date(e.detail.value),
        notCurrentFlag: false
      }, () => {
        this.initDays(this.data.currentDate)
      })

    }
  }
})