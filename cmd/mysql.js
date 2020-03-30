/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const config = require('./config/mysql')
const mysql = require('mysql')

const type = process.argv.slice(2).shift()
type && ['min', 'hour', 'day', 'month'].indexOf(type) != -1 || process.exit(1)

const zero = a => a < 10 ? '0' + a : a

const close = connection => connection.end()

const select = (connection, table, timeIndex, callback) => connection.query('SELECT `temperature`, `humidity`, `pressure`, `cpuTemp`, `cpuVolt` FROM `' + table + '` WHERE `timeIndex`= ' + timeIndex + '',
  (error, results, fields) =>
    !error && typeof callback == 'function' && callback(results.length
      ? (error = results.reduce((a, b) => ({
        temperature: a.temperature + b.temperature,
        humidity:    a.humidity    + b.humidity,
        pressure:    a.pressure    + b.pressure,
        cpuTemp:     a.cpuTemp     + b.cpuTemp,
        cpuVolt:     a.cpuVolt     + b.cpuVolt,
      }))) && {
        temperature: Math.round((error.temperature / results.length) * 100) / 100,
        humidity:    Math.round((error.humidity    / results.length) * 100) / 100,
        pressure:    Math.round((error.pressure    / results.length) * 100) / 100,
        cpuTemp:     Math.round((error.cpuTemp     / results.length) * 100) / 100,
        cpuVolt:     Math.round((error.cpuVolt     / results.length) * 1000) / 1000,
      }
      : null))

const insert = (connection, table, data, callback) => data
  ? connection.query('INSERT INTO `' + table + '` SET ?', data,
    _ => typeof callback == 'function' && callback())
  : typeof callback == 'function' && callback()

const connection = mysql.createConnection({
  host: config.db1.host,
  user: config.db1.user,
  password: config.db1.password,
  database: config.db1.database,
})

connection.connect(error => {
  if (error) return close(connection)
  const now = new Date()
  let last = null

  switch (type) {
    default:
      return close(connection)

    case 'min': return last = new Date(now.getTime() - 1000 * 60), select(
      connection,
      'LogSecond',
      last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()) + zero(last.getHours()) + zero(last.getMinutes()),
      results => insert(
        connection,
        'LogMinute', 
        results && { ...results, ...{
          timeIndex: last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()) + zero(last.getHours()),
          timeValue: zero(last.getMinutes()),
        }},
        _ => close(connection)))

    case 'hour': return last = new Date(now.getTime() - 1000 * 60 * 60), select(
      connection,
      'LogMinute', 
      last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()) + zero(last.getHours()),
        results => insert(
          connection,
          'LogHour',
          results && { ...results, ... {
            timeIndex: last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()),
            timeValue: zero(last.getHours()),
          }},
          _ => close(connection)))

    case 'day': return last = new Date(now.getTime() - 1000 * 60 * 60 * 24), select(
      connection,
      'LogHour',
      last.getFullYear() + zero(last.getMonth() + 1) + zero(last.getDate()),
        results => insert(
          connection,
          'LogDay', 
          results && { ...results, ...{
            timeIndex: last.getFullYear() + zero(last.getMonth() + 1),
            timeValue: zero(last.getDate()),
          }},
          _ => close(connection)))

    case 'month': return last = new Date(now.getTime()), last.setDate(0), select(
      connection,
      'LogDay', 
      last.getFullYear() + zero(last.getMonth() + 1),
        results => insert(
          connection,
          'LogMonth', 
          results && { ...results, ...{
            timeIndex: last.getFullYear(),
            timeValue: zero(last.getMonth() + 1),
          }},
          _ => close(connection)))
  }
})
