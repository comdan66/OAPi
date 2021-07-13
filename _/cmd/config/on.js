/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  logDir: '/home/pi/www/log/',
  dir: {
    entry: 'src'
  },
  dirName: { // View 內的目錄名稱
    iconDir: 'icon', // 圖示
    scssDir: 'scss', // scss
    cssDir: 'css',   // css
    imgDir: 'img',   // 圖片
    jsDir: 'js',     // js
  },
  server: {
    https: {
      enable: false,
      key: 'server.key',  // base path: cmd/config/https/
      cert: 'server.crt', // base path: cmd/config/https/
    },

    domain: '127.0.0.1',
    port: 8080,
    defaultPort: null,
    utf8Exts: ['.html', '.css', '.js', '.json', '.text'] // 採用 utf8 編碼的副檔名
  }
}
