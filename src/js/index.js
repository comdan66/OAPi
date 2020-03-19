/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.css('icon.css')
Load.css('index.css')

Load.func({
  data: {
  },
  mounted () {
    Load.closeLoading()
  },
  template: El(`
    main
      label.card => title=目前濕度   unit=%   *text='a'
      label.card => title=目前溫度   unit=°C   *text='a'
  `)
})

