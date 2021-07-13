/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path    = require('path')
const Display = require('../Display')
const SocketConn = require('./Shared').SocketConn
const Data       = require('./Shared').data
const Config     = require(Path.config)
const FileSystem  = require('fs')
  const FileRead  = FileSystem.readFileSync

const zero = n => n < 10 ? '0' + n : n

let last = null

const timer = _ => {
  const datePath = Config.logDir + new Date().getFullYear() + zero(new Date().getMonth() + 1) + zero(new Date().getDate()) + '.Sensor.log'
  const nowPath = Config.logDir + 'Sensor.log'
  
  try {
    const now = FileRead(nowPath, 'utf8')
    const date = '[' + FileRead(datePath, 'utf8').split("\n").filter(t => t.trim().length).slice(-30).join(',') + ']'

    if (now + date !== last)
      last = now + date
    else
      return

    const nowData = JSON.parse(now)
    const dateData = JSON.parse(date)

    Data.status = true
    Data.nowData = nowData
    Data.dateData = dateData
  } catch (e) {
    Data.status = false
    Data.nowData = null
    Data.dateData = null
  }

  SocketConn.sendAll()
}

module.exports = closure => {
  Display.title('監控資料')
  Display.lines('讀取資料檔案', '執行指令', 'read ' + Config.logDir)
  Display.line(true)

  setInterval(timer, 1000)

  typeof closure == 'function' && closure()
}
