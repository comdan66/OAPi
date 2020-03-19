/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path    = require('path')
const Display = require('../Display')
const Print   = require('../Print')
const SocketConn = require('./Shared').SocketConn
const Data       = require('./Shared').data

module.exports = closure => {
  const { PythonShell } = require('python-shell')

  Display.title('開啟 Python 監聽')
  Display.lines('執行 Python 指令', '執行指令', 'python ' + Path.pythonEntry)
  Display.line(true)
  
  const pyshell = new PythonShell(Path.pythonEntry, {
    mode: 'json',
    pythonOptions: ['-u'] })

  pyshell.on('message', data => {
    Data.humidity    = data.humidity
    Data.temperature = data.temperature
    SocketConn.sendAll()
  })

  typeof closure == 'function' && closure()
}
