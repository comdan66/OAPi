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
    server: serverData,
    index: 0,
    tabs: ['房間概況', '樹莓派概況']
  },
  mounted () {
    Load.closeLoading()
  },
  methods: {
    windChill (temperature, wind) {
      if (temperature >= 10) return temperature
      if (wind >= 4.8 && wind <= 177) return 13.12 + 0.6215 * temperature + (0.3965 * temperature - 11.37) * Math.pow(wind, 0.16)
      if (wind < 4.8) return temperature + 0.2 * (0.1345 * temperature - 1.59) * wind
      return temperature
    },
    heatIndex (temperature, humidity, pressure) {
      if (pressure < 16) return temperature
      if (temperature < 27 || humidity < 0.40 || this.dewPoint(temperature, humidity) < 12) return temperature

      let c1 = -8.784695
      let c2 = 1.61139411
      let c3 = 2.338549
      let c4 = -0.14611605
      let c5 = -1.2308094 * 0.01
      let c6 = -1.6424828 * 0.01
      let c7 = 2.211732 * 0.001
      let c8 = 7.2546 * 0.0001
      let c9 = -3.582 * 0.000001

      return c1
        + c2 * temperature
        + c3 * humidity
        + c4 * temperature * humidity
        + c5 * temperature * temperature
        + c6 * humidity * humidity
        + c7 * temperature * temperature * humidity
        + c8 * temperature * humidity * humidity
        + c9 * temperature * temperature * humidity * humidity
    },
    dewPoint (temperature, humidity) {
      if (temperature < 0 || temperature > 60) return temperature
      if (humidity < 0.01 || humidity > 1) return temperature

      let a = 17.27
      let b = 237.7
      let alphaTR = ((a * temperature) / (b + temperature)) + Math.log(humidity)
      let Tr = (b * alphaTR) / (a - alphaTR)

      return Tr < 0 || Tr > 50 ? temperature : Tr
    },
    range(min, max) {
      let tmp = []
      for (var i = min; i <= max; i++)
        tmp.push(i)
      return tmp
    }
  },
  computed: {
    range1025 () { return this.range(10, 35) },
    range0000 () { return this.range(0, 100) },
    range0121 () { return this.range(1, 21) },
    range20100 () { return this.range(20, 100) },
    range20220 () { return this.range(20, 220) },
    temperature () { return this.server && this.server.device1 && Math.round(this.server.device1.temperature * 10) / 10 },
    humidity () { return this.server && this.server.device1 && Math.round(this.server.device1.humidity * 10) / 10 },
    pressure () { return this.server && this.server.device2 && this.server.device2.pressure },
    cpuTemperature () { return this.server && this.server.cpu && this.server.cpu.temperature },
    cpuVoltage () { return this.server && this.server.cpu && this.server.cpu.voltage },
    apparentTemperature () {
      return this.temperature && this.humidity && this.pressure
        ? this.temperature < 10
          ? this.windChill(this.temperature, 0)
          : this.heatIndex(this.temperature, this.humidity / 100, this.pressure)
        : null
    },
    temperaturePercent () { return min = 10, max = 35, this.temperature ? Math.round((this.temperature - min) / (max - min) * 100) : null },
    humidityPercent () { return min = 0, max = 100, this.humidity ? Math.round((this.humidity - min) / (max - min) * 100) : null },
    pressurePercent () { return min = 100100, max = 102100, this.pressure ? Math.round((this.pressure - min) / (max - min) * 100) : null },
    apparentTemperaturePercent () { return min = 10, max = 35, this.apparentTemperature ? Math.round((this.apparentTemperature - min) / (max - min) * 100) : null },
    cpuTemperaturePercent () { return min = 20, max = 100, this.cpuTemperature ? Math.round((this.cpuTemperature - min) / (max - min) * 100) : null },
    cpuVoltagePercent () { return min = 20/100, max = 220/100, this.cpuVoltage ? Math.round((this.cpuVoltage - min) / (max - min) * 100) : null },
  },
  template: El(`
    main
      div#tabs
        label => *for=(tab, i) in tabs   *text=tab   :class={active:i==index}   @click=index=i

        div => *if=server
          i
          b => *text=server.connCnt   title=活躍使用者   unit=人

      div#panels
        div.p0 => :class={active:index==0}
          div.unit
            b => *text='室內溫度'
            div.gauge => :percent=temperaturePercent   :range=range1025.length-1
              div.border
                i => *for=(val, i) in range1025   :key=i   :title=val
                div.center
                div.pointer
              span => *text=temperature   unit=°C

          div.unit
            b => *text='室內濕度'
            div.gauge => :percent=humidityPercent   :range=range0000.length-1
              div.border
                i => *for=(val, i) in range0000   :key=i   :title=val
                div.center
                div.pointer
              span => *text=humidity   unit=%

          div.unit
            b => *text='室內氣壓'
            div.gauge => :percent=pressurePercent   :range=range0121.length-1
              div.border
                i => *for=(val, i) in range0121   :key=i   :title=(100000+val*100) / 1000
                div.center
                div.pointer
              span => *text=pressure/1000   unit=千帕

          div.unit
            b => *text='體感溫度'
            div.gauge => :percent=apparentTemperaturePercent   :range=range1025.length-1
              div.border
                i => *for=(val, i) in range1025   :key=i   :title=val
                div.center
                div.pointer
              span => *text=apparentTemperature   unit=°C
        div.p0 => :class={active:index==1}
          div.unit
            b => *text='溫度'
            div.gauge => :percent=cpuTemperaturePercent   :range=range20100.length-1
              div.border
                i => *for=(val, i) in range20100   :key=i   :title=val
                div.center
                div.pointer
              span => *text=cpuTemperature   unit=°C

          div.unit
            b => *text='電壓'
            div.gauge => :percent=cpuVoltagePercent   :range=range20220.length-1
              div.border
                i => *for=(val, i) in range20220   :key=i   :title=val/100
                div.center
                div.pointer
              span => *text=cpuVoltage   unit=V

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