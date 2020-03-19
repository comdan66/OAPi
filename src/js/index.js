/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.css('index.css')

let serverData = null

Load.func({
  data: {
    server: serverData
  },
  mounted () {

    Load.closeLoading()
  },
  template: El(`
    main
      h1 => *text = '房間監控系統'
      template => *if=server
        label.card => title=線上人數   unit=位    *text=server.connCnt
        label.card => title=目前氣壓   unit=帕    *text=server.device2.pressure
        label.card => title=目前溫度   unit=°C   *text=server.device2.temperature
      template => *else
        div => *text='讀取中，請稍候…'

      // div#tabs
      //   label.active => *text='房間概況'
      //   div
      //     i
      //     b => *text=0   title=活躍使用者   unit=人

      // div#panels
      //   div.p0.active
      //     div.row.r1
      //       div.unit
      //         span
      //           a => *text='a'
      //         span
      //           b => *text='1234'
      //           sup
      //         div
      //           i => *text='1'
      //       div.unit
      //         span
      //           a => *text='a'
      //         span
      //           b => *text='1234'
      //           sup
      //         div
      //           i => *text='1'
      //       div.unit
      //         span
      //           a => *text='a'
      //         span
      //           b => *text='1234'
      //           sup
      //         div
      //           i => *text='1'
      //       div.unit
      //         span
      //           a => *text='a'
      //         span
      //           b => *text='1234'
      //           sup
      //         div
      //           i => *text='1'
      //     div.row.r2
      //       div.unit
      //         span
      //           a => *text='a'
      //         span
      //           b => *text='1234'
      //           sup
      //         div
      //           i => *text='1'
      //       div.unit
      //         span
      //           a => *text='a'
      //         span
      //           b => *text='1234'
      //           sup
      //         div
      //           i => *text='1'
      //       div.unit
      //         span
      //           a => *text='a'
      //         span
      //           b => *text='1234'
      //           sup
      //         div
      //           i => *text='1'
      //       div.unit
      //         span
      //           a => *text='a'
      //         span
      //           b => *text='1234'
      //           sup
      //         div
      //           i => *text='1'
      //     div.row.r3
      //       div.line-chart
      //       div.desc
      //         span => *text='每小時訂單量'
      //         div
      //           span => *text='今日'
      //           span => *text='上週同期'


  `)
})

$(_ => {

  var socket = io.connect()

  socket.on('action', data => {
    if (data === "reload")
      location.reload(true)
  });

  socket.on('data', data => Load.instances.length ? Load.instances[0].server = data : null);
})