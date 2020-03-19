/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.css('icon.css')
Load.css('index.css')

let dataA = {
  HT: null
}
Load.func({
  data: dataA,
  mounted () {

    Load.closeLoading()
  },
  template: El(`
    main
      template => *if=HT
        label.card => title=目前濕度   unit=%    *text=HT.H
        label.card => title=目前溫度   unit=°C   *text=HT.T
  `)
})

$(_ => {
  var socket = io.connect()

  socket.on('action', data => {
    if (data === "reload")
      location.reload(true)
  });

  socket.on('update', data => {
    dataA.HT = data
  });
})