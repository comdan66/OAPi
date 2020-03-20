/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.css('gauge.css')
Load.css('index.css')

let serverData = null

Load.func({
  data: {
    server: serverData
  },
  mounted () {
    Load.closeLoading()
  },
  methods: {
    range(min, max) {
      let tmp = []
      for (var i = min; i <= max; i++)
        tmp.push(i)
      return tmp
    }
  },
  computed: {
    range1025 () {
      return this.range(10, 35)
    },
    range0000 () {
      return this.range(0, 100)
    },
    range0621 () {
      return this.range(6, 21)
    },
    temperature () { return this.server && this.server.device2 && this.server.device2.temperature },
    humidity () { return this.server && this.server.device1 && this.server.device1.humidity },
    pressure () { return this.server && this.server.device2 && this.server.device2.pressure },
    temperaturePercent () {
      let min = 10, max = 35
      return this.temperature ? Math.round((this.temperature - min) / (max - min) * 100) : null
    },
    humidityPercent () {
      let min = 0, max = 100
      return this.humidity ? Math.round((this.humidity - min) / (max - min) * 100) : null
    },
    pressurePercent () {
      let min = 100600, max = 102100
      return this.pressure ? Math.round((this.pressure - min) / (max - min) * 100) : null
    }
  },
  template: El(`
    main
      div#tabs
        label.active => *text='房間概況'
        div => *if=server
          i
          b => *text=server.connCnt   title=活躍使用者   unit=人

      div#panels
        div.p0.active
          div.unit
            b => *text='室內溫度'
            div.gauge => :percent=temperaturePercent
              div.border => :range=range1025.length-1
                i => *for=(val, i) in range1025   :key=i   :title=val
                div.center
                div.pointer
              span => *text=temperature   unit=°C

          div.unit
            b => *text='室內濕度'
            div.gauge => :percent=humidityPercent
              div.border => :range=range0000.length-1
                i => *for=(val, i) in range0000   :key=i   :title=val
                div.center
                div.pointer
              span => *text=humidity   unit=%

          div.unit
            b => *text='室內氣壓'
            div.gauge => :percent=pressurePercent
              div.border => :range=range0621.length-1
                i => *for=(val, i) in range0621   :key=i   :title=(100000+val*100) / 1000
                div.center
                div.pointer
              span => *text=pressure   unit=千帕

          div.unit
            b => *text='體感溫度'
            div.gauge => :percent=null
              div.border => :range=range1025.length-1
                i => *for=(val, i) in range1025   :key=i   :title=val
                div.center
                div.pointer
              span => *text=null   unit=°C
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