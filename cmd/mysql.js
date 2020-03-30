/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const config = require('./config/mysql')

const mysql = require('mysql')

const type = process.argv.slice(2).shift()

if (!(type && ['min', 'hour', 'day', 'month'].indexOf(type) != -1))
  return

const zero = a => a < 10 ? '0' + a : a
const close = connection => connection.end()

const connection = mysql.createConnection({
  host: config.db1.host,
  user: config.db1.user,
  password: config.db1.password,
  database: config.db1.database,
})

const select = (connection, timeIndex, table, callback) => connection.query('SELECT `dhtTemp`, `dhtHumidity`, `bmpTemp`, `bmpPress`, `cpuTemp`, `cpuVolt` FROM `' + table + '` WHERE `timeIndex`= ' + timeIndex + '', function (error, results, fields) {
  if (error)
    return typeof callback == 'function' && callback(null)
  
  const length = results.length
  if (!length)
    return typeof callback == 'function' && callback(null)

  results = results.map(result => ({
    dhtTemp: result.dhtTemp,
    dhtHumidity: result.dhtHumidity,
    bmpTemp: result.bmpTemp,
    bmpPress: result.bmpPress,
    cpuTemp: result.cpuTemp,
    cpuVolt: result.cpuVolt,
  })).reduce((a, b) => ({
    dhtTemp: a.dhtTemp + b.dhtTemp,
    dhtHumidity: a.dhtHumidity + b.dhtHumidity,
    bmpTemp: a.bmpTemp + b.bmpTemp,
    bmpPress: a.bmpPress + b.bmpPress,
    cpuTemp: a.cpuTemp + b.cpuTemp,
    cpuVolt: a.cpuVolt + b.cpuVolt,
  }))
  
  results = {
    dhtTemp: Math.round((results.dhtTemp / length) * 100) / 100,
    dhtHumidity: Math.round((results.dhtHumidity / length) * 100) / 100,
    bmpTemp: Math.round((results.bmpTemp / length) * 100) / 100,
    bmpPress: Math.round((results.bmpPress / length) * 100) / 100,
    cpuTemp: Math.round((results.cpuTemp / length) * 100) / 100,
    cpuVolt: Math.round((results.cpuVolt / length) * 1000) / 1000,
  }

  return typeof callback == 'function' && callback(results)
})

const insert = (connection, table, data, callback) => data
  ? connection.query('INSERT INTO `' + table + '` SET ?', data,
    _ => typeof callback == 'function' && callback())
  : typeof callback == 'function' && callback()

connection.connect(error => {
  if (error) return close(connection)
  const now = new Date()
  let last = null

  switch (type) {
    default:
      return close(connection)

    case 'min': return last = new Date(now.getTime() - 1000 * 60), select(
      connection,
      last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()) + zero(last.getHours()) + zero(last.getMinutes()),
      'LogSecond',
      results => insert(
        connection,
        'LogMinute', 
        results && { ...results, ...{
          timeIndex: 0 + last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()) + zero(last.getHours()),
          timeValue: zero(last.getMinutes()),
        }},
        _ => close(connection)))

    case 'hour': return last = new Date(now.getTime() - 1000 * 60 * 60), select(
      connection,
      last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()) + zero(last.getHours()),
      'LogMinute', 
        results => insert(
          connection,
          'LogHour',
          results && { ...results, ... {
            timeIndex: 0 + last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()),
            timeValue: zero(last.getHours()),
          }},
          _ => close(connection)))

    case 'day': return last = new Date(now.getTime() - 1000 * 60 * 60 * 24), select(
      connection,
      last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()),
      'LogHour',
        results => insert(
          connection,
          'LogDay', 
          results && { ...results, ...{
            timeIndex: 0 + last.getFullYear() + zero(last.getMonth() + 1),
            timeValue: zero(last.getDate()),
          }},
          _ => close(connection)))

    case 'month': return last = new Date(now.getTime()), last.setDate(0), select(
      connection,
      last.getFullYear() + zero(last.getMonth() + 1),
      'LogDay', 
        results => insert(
          connection,
          'LogMonth', 
          results && { ...results, ...{
            timeIndex: 0 + last.getFullYear(),
            timeValue: zero(last.getMonth() + 1),
          }},
          _ => close(connection)))
  }
})

