/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Maple ApiDoc
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path       = require('path')
const Display    = require('../Display')
const FileSystem = require('fs')
  const Exists   = FileSystem.existsSync
  const ReadFile = FileSystem.readFileSync

const checkConfig = _ => {
  const Config = require(Path.config)
  
  Config.dir = Config.dir || {}
  Config.dirName = Config.dirName || {}
  Config.server  = Config.server  || {}

  Config.dir.entry            = Config.dir.entry            || 'src'

  Config.dirName.iconDir      = Config.dirName.iconDir      || 'icon'
  Config.dirName.scssDir      = Config.dirName.scssDir      || 'scss'
  Config.dirName.cssDir       = Config.dirName.cssDir       || 'css'
  Config.dirName.imgDir       = Config.dirName.imgDir       || 'img'
  Config.dirName.jsDir        = Config.dirName.jsDir        || 'js'

  Config.server.https         = Config.server.https         || {}
  Config.server.https.enable  = Config.server.https.enable  || false
  Config.server.https.key     = Config.server.https.key     || null
  Config.server.https.cert    = Config.server.https.cert    || null

  Config.server.domain        = Config.server.domain        || '127.0.0.1'
  Config.server.port          = Config.server.port          || 8080
  Config.server.defaultPort   = Config.server.defaultPort   || null
  Config.server.utf8Exts      = Config.server.utf8Exts      || ['.html', '.css', '.js', '.json', '.text']

  Path.entry  = Path.root + Config.dir.entry.trim(Path.sep) + Path.sep
  delete Config.dir.entry

  if (Config.server.https.enable) {
    try {
      Config.server.https.key  = Config.server.https.key  ? ReadFile(Path.cmd + 'config' + Path.sep + 'https' + Path.sep + Config.server.https.key) : null
      Config.server.https.cert = Config.server.https.cert ? ReadFile(Path.cmd + 'config' + Path.sep + 'https' + Path.sep + Config.server.https.cert) : null
      Config.server.https.enable = !!(Config.server.https.key && Config.server.https.cert)
    } catch (e) {
      Config.server.https.enable = false
    }
  }

  return true
}

module.exports = closure => {
  const CmdExists = require('command-exists').sync
  Display.title('檢查環境')

  Display.lines('檢查是否有 Python 指令', '執行動作', 'check python command')
  CmdExists('python')
    ? Display.line(true, '有')
    : Display.line(false, '找不到 Python 指令，部署過程中會使用到 Python 指令！')

  Display.lines('取得設定檔', '執行動作', 'read config/serve.js file')
  Exists(Path.config)
    ? Display.line(true)
    : Display.line(false, '尚未設定設定檔！')

  Display.lines('檢查 Python 主要檔案是否存在', '執行動作', 'check ' + Path.relative(Path.root, Path.pythonEntry) + ' is exists')
  Exists(Path.pythonEntry)
    ? Display.line(true, '存在')
    : Display.line(false, 'Python 主要檔案不存在！')

  Display.lines('檢查設定檔', '執行動作', 'check config/serve.js file')
  checkConfig()
    ? Display.line(true)
    : Display.line(false, '確認設定檔失敗！')

  Display.lines('檢查目錄是否存在', '執行動作', 'check ' + Path.relative(Path.root, Path.entry) + Path.sep + ' is exists')
  Exists(Path.entry)
    ? Display.line(true, '存在')
    : Display.line(false, '目錄不存在！')

  return typeof closure == 'function' && closure()
}
