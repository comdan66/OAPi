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
  
  const pyshell = new PythonShell(Path.pythonEntry, {
    mode: 'json',
    pythonPath: '/usr/bin/python',
    pythonOptions: ['-u'] })

  pyshell.on('message', data => {
    for (var k in data)
      Data[k] = data[k]
    SocketConn.sendAll()
  })
  Display.line(true)


  typeof closure == 'function' && closure()
}
