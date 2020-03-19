/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.css('icon.css')
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
        label.card => title=目前濕度   unit=%    *text=server.humidity
        label.card => title=目前溫度   unit=°C   *text=server.temperature
      template => *else
        div => *text='讀取中，請稍候…'
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