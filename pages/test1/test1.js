 
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    riderCommentList: [{
      selected: false,
      title: '商品品质'
    }, {
      value: '眉笔质地',
      selected: false,
        title: '眉笔质地'
    }, {
      value: '最新',
      selected: false,
        title: '最新'
    }, {
      value: '正品',
      selected: false,
        title: '正品'
    }, {
      value: '包装完整',
      selected: false,
        title: '包装完整'
    }, {
      value: '是否防水',
      selected: false,
        title: '是否防水'
    }, {
      value: '其他',
      selected: false,
      title: '其他'
    }],
    week: [{
      title: '星期日',
      selected: false,
    },{
      title: '星期一',
      selected: false,
    },{
      title: '星期二',
      selected: false,
    },{
      title: '星期三',
      selected: false,
    },{
      title: '星期四',
      selected: false,
    },{
      title: '星期五',
      selected: false,
    },{
      title: '星期六',
      selected: false,
    },]
  },
  checkboxChange(e) {
  //  console.log('checkboxChange e:', e);
    let string = "riderCommentList[" + e.target.dataset.index + "].selected"
    this.setData({
      [string]: !this.data.riderCommentList[e.target.dataset.index].selected
    })
    let detailValue = this.data.riderCommentList.filter(it => it.selected).map(it => it.value)
  //  console.log('所有选中的值为：', detailValue)
  },

  weekboxChange: function (e){
  //  console.log(e.currentTarget.dataset.index)
    let string = "week[" + e.currentTarget.dataset.index + "].selected"
  //  console.log(this.data.week[e.target.dataset.index].selected)
    this.setData({
      [string]: !this.data.week[e.target.dataset.index].selected
    })
  //  console.log(this.data.week[e.target.dataset.index].selected)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },
 
})