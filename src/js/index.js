/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

window.Load.css('https://comdan66.github.io/OAPi/css/gauge.css')
window.Load.css('index.css')

const Timeline = function(data, el, settings, width, height, padding) {
  padding = padding || { top: 30, bottom: 40, left: 40, right: 40 }
  const svg = d3.select(el).append('div').append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + padding.left + ', 0)')
  this.x = d3.time.scale().range([0, width - padding.left - padding.right])
  this.y = d3.scale.linear().range([height - padding.bottom - 10, padding.top + 10]).domain([0, 100])
  this.axisX = d3.svg.axis().scale(this.x).orient('bottom').tickSize(-(height - padding.top - padding.bottom), 0).tickFormat(d3.time.format('%M'))
  this.xAxis = svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + (height - padding.bottom) + ')').attr('stroke', 'rgba(255, 255, 255, 0.10)')
  this.gPaths = settings.map(setting => {
    return {
      x: this.x, y: this.y, key: setting.key, unit: setting.unit,
      path: svg.append('g').attr('stroke-width', '2').attr('stroke', 'url(#sparkline-gradient-' + setting.key + ')').attr('fill', 'transparent').append('path'),
      color: d3.scale.linear().domain([100, 0]).range(setting.colors),
      defs: svg.append('defs').append('linearGradient').attr('id', 'sparkline-gradient-' + setting.key).attr('gradientUnits', 'userSpaceOnUse').selectAll('.gradient-stop').data(data).enter().append('stop'),
      label: settings.length == 1 && svg.append('g').classed('labels-group', true).selectAll('text').data(data).enter().append('text').classed('label', true).attr('transform', 'translate(0,5)').attr('fill', 'rgba(255, 255, 255, .5)').attr('stroke-width', '0').style('text-anchor', 'middle').style('font-size', '12px'),
      fetch (data) {
        const percentageMargin = 100 / data.length
        const percentageX = d3.scale.linear().domain([0, data.length - 1]).range([percentageMargin, 100 - percentageMargin])
        this.path.transition().attr('d', d3.svg.line().interpolate('monotone').x(d => this.x(d.now)).y(d => this.y(d[this.key].percent))(data))
        this.defs.data(data).attr('offset', (d, i) => percentageX(i) + '%').attr('style', d => 'stop-color:' + this.color(d[this.key].percent) + ';stop-opacity:1')
        this.label && this.label.data(data).attr({ x: (d, i) => this.x(d.now), y: (d, i) => this.y(d[this.key].percent) - 14 }).text((d, i) => d[this.key].value + this.unit)
      }
    }
  })
}
Timeline.prototype.fetchX = function(data) {
  this.x.domain(d3.extent(data, d => d.now))
  this.axisX.ticks(data.length)
  this.xAxis.transition().call(this.axisX).selectAll('text').style('text-anchor', 'middle').attr('transform', 'translate(0, 12)').attr('fill', 'rgba(255, 255, 255, .75)').attr('stroke-width', '0').style('font-size', '12px')
  this.gPaths.forEach(gPath => gPath.fetch(data))
}
Timeline.instance = null

window.Load.func({
  data: {
    connCnt: 0,
    nowData: null,
    dateData: null,
    index: 0,
    tabs: ['房間概況', '樹莓派概況'],
    tmp: false,
  },
  watch: {
    timeline () {
      const data = this.timeline.map(a => ({ ...a, ...{ now: new Date(a.now * 1000) } }))
      if (Timeline.instance !== null) return Timeline.fetchX(data)
      const w1 = this.$refs.temperature.clientWidth, h1 = this.$refs.temperature.clientHeight, w2 = this.$refs.humidity.clientWidth, h2 = this.$refs.humidity.clientHeight, w3 = this.$refs.pressure.clientWidth, h3 = this.$refs.pressure.clientHeight, w4 = this.$refs.all.clientWidth, h4 = this.$refs.all.clientHeight
      if (!(w1 && h1 && w2 && h2 && w3 && h3 && w4 && h4)) return
      Timeline.instance = [
        new Timeline(data, this.$refs.temperature, [{ key: 'temperature', unit: '°C', colors: ['rgba( 41, 244, 153, 1.00)', 'rgba(  0, 159, 252, 1.00)'] }], w1, h1),
        new Timeline(data, this.$refs.humidity,    [{ key: 'humidity',    unit: '%', colors:    ['rgba(250, 112, 154, 1.00)', 'rgba(254, 224,  65, 1.00)'] }], w2, h2),
        new Timeline(data, this.$refs.pressure,    [{ key: 'pressure',    unit: 'Pa', colors:    ['rgba(181, 102, 218, 1.00)', 'rgba(238,  96, 156, 1.00)'] }], w3, h3),
        new Timeline(data, this.$refs.all,         [{ key: 'temperature', unit: '°C', colors: ['rgba( 41, 244, 153, 1.00)', 'rgba(  0, 159, 252, 1.00)'] }, { key: 'humidity',    unit: '%', colors:    ['rgba(250, 112, 154, 1.00)', 'rgba(254, 224,  65, 1.00)'] }, { key: 'pressure',    unit: 'Pa', colors:    ['rgba(181, 102, 218, 1.00)', 'rgba(238,  96, 156, 1.00)'] }], w4, h4),
      ]
      Timeline.fetchX = data => Timeline.instance.forEach(t => t instanceof Timeline && t.fetchX(data))
      Timeline.fetchX(data)
    },
  },
  mounted () {
    window.Load.closeLoading()
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
      let c1 = -8.784695, c2 = 1.61139411, c3 = 2.338549, c4 = -0.14611605, c5 = -1.2308094 * 0.01, c6 = -1.6424828 * 0.01, c7 = 2.211732 * 0.001, c8 = 7.2546 * 0.0001, c9 = -3.582 * 0.000001
      return c1 + c2 * temperature + c3 * humidity + c4 * temperature * humidity + c5 * temperature * temperature + c6 * humidity * humidity + c7 * temperature * temperature * humidity + c8 * temperature * humidity * humidity + c9 * temperature * temperature * humidity * humidity
    },
    dewPoint (temperature, humidity) {
      if (temperature < 0 || temperature > 60) return temperature
      if (humidity < 0.01 || humidity > 1) return temperature
      let a = 17.27, b = 237.7, alphaTR = ((a * temperature) / (b + temperature)) + Math.log(humidity), Tr = (b * alphaTR) / (a - alphaTR)
      return Tr < 0 || Tr > 50 ? temperature : Tr
    },
    range(min, max) { let tmp = []; for (var i = min; i <= max; i++) tmp.push(i); return tmp }
  },
  computed: {
    range1025 () { return this.range(10, 35) },
    range0000 () { return this.range(0, 100) },
    range0121 () { return this.range(1, 21) },
    range20100 () { return this.range(20, 100) },
    range20220 () { return this.range(20, 220) },
    temperature () { return this.nowData && this.nowData.device1 && Math.round(this.nowData.device1.temperature * 10) / 10 },
    humidity () { return this.nowData && this.nowData.device1 && Math.round(this.nowData.device1.humidity * 10) / 10 },
    pressure () { return this.nowData && this.nowData.device2 && Math.round(this.nowData.device2.pressure * 100) / 100 },
    cpuTemperature () { return this.nowData && this.nowData.cpu && Math.round(this.nowData.cpu.temperature * 100) / 100 },
    cpuVoltage () { return this.nowData && this.nowData.cpu && Math.round(this.nowData.cpu.voltage * 1000) / 1000 },
    apparentTemperature () {
      return this.temperature && this.humidity && this.pressure
        ? this.temperature < 10
          ? Math.round(this.windChill(this.temperature, 0) * 10) / 10
          : Math.round(this.heatIndex(this.temperature, this.humidity / 100, this.pressure) * 10) / 10
        : null
    },
    temperaturePercent () { return min = 10, max = 35, this.temperature ? Math.round((this.temperature - min) / (max - min) * 100) : null },
    humidityPercent () { return min = 0, max = 100, this.humidity ? Math.round((this.humidity - min) / (max - min) * 100) : null },
    pressurePercent () { return min = 100100, max = 102100, this.pressure ? Math.round((this.pressure - min) / (max - min) * 100) : null },
    apparentTemperaturePercent () { return min = 10, max = 35, this.apparentTemperature ? Math.round((this.apparentTemperature - min) / (max - min) * 100) : null },
    cpuTemperaturePercent () { return min = 20, max = 100, this.cpuTemperature ? Math.round((this.cpuTemperature - min) / (max - min) * 100) : null },
    cpuVoltagePercent () { return min = 20/100, max = 220/100, this.cpuVoltage ? Math.round((this.cpuVoltage - min) / (max - min) * 100) : null },
    timeline () {
      if (!this.dateData) return []

      let tmp = {}
      let timeline = []

      for (var i in this.dateData) tmp[this.dateData[i].time] = this.dateData[i]
      for (var i in tmp) timeline.push(tmp[i])

      let temperatureMax = null
      let temperatureMin = null

      let humidityMax = null
      let humidityMin = null
      
      let pressureMax = null
      let pressureMin = null
      
      timeline = timeline.sort((a, b) => a.now - b.now).map(a => {
        const temperature = Math.round(a.device1.temperature * 100)
        const humidity = Math.round(a.device1.humidity * 100)
        const pressure = Math.round(a.device2.pressure * 100)
        
        if (temperatureMax === null || temperature > temperatureMax) temperatureMax = temperature
        if (temperatureMin === null || temperature < temperatureMin) temperatureMin = temperature
        
        if (humidityMax === null || humidity > humidityMax) humidityMax = humidity
        if (humidityMin === null || humidity < humidityMin) humidityMin = humidity

        if (pressureMax === null || pressure > pressureMax) pressureMax = pressure
        if (pressureMin === null || pressure < pressureMin) pressureMin = pressure

        return { now: a.now, temperature: temperature, humidity: humidity, pressure: pressure }
      }).map(a => ({
        now: a.now,
        temperature: { value: a.temperature / 100, percent: temperatureMax > temperatureMin ? Math.round(((a.temperature - temperatureMin) / (temperatureMax - temperatureMin)) * 100) : 100 },
        humidity: { value: a.humidity / 100, percent: humidityMax > humidityMin ? Math.round(((a.humidity - humidityMin) / (humidityMax - humidityMin)) * 100) : 100 },
        pressure: { value: a.pressure / 100, percent: pressureMax > pressureMin ? Math.round(((a.pressure - pressureMin) / (pressureMax - pressureMin)) * 100) : 100 },
      }))

      return timeline
    },
  },
  template: El(`
    main
      div#tabs
        label => *for=(tab, i) in tabs   *text=tab   :class={active:i==index}   @click=index=i

        div => *if=connCnt
          i
          b => *text=connCnt   title=線上人數   unit=人

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
              span => *text=Math.round(pressure)/1000   unit=千帕

          div.unit
            b => *text='體感溫度'
            div.gauge => :percent=apparentTemperaturePercent   :range=range1025.length-1
              div.border
                i => *for=(val, i) in range1025   :key=i   :title=val
                div.center
                div.pointer
              span => *text=apparentTemperature   unit=°C

          div.unit.full => ref=temperature
          div.unit.full => ref=humidity
          div.unit.full => ref=pressure
          div.unit.full => ref=all

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

  socket.on('action', data => data === 'reload' && location.reload(true))

  socket.on('data', data => {
    if (!window.Load.instances.length) return
    window.Load.instances[0].connCnt  = data.connCnt
    window.Load.instances[0].nowData  = data.nowData
    window.Load.instances[0].dateData = data.dateData
  })
})