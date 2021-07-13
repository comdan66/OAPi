/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Display = require('../Display')
const Print   = require('../Print')

module.exports = closure =>
  Display.title('開啟完成') &&
  Print(' '.repeat(3) + '🎉 Yes! Server 已經啟動惹！' + Display.LN) &&
  Display.title('以下為連線紀錄') &&
  require('../Bus').emit('readied', true) &&
  typeof closure == 'function' &&
  closure()
