/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2019, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const sharedData = {}

function SocketConn(socket) {
  if (!(this instanceof SocketConn)) return new SocketConn(socket);
  this.socket = socket
  SocketConn.instances.push(this)
}

SocketConn.instances = []

SocketConn.prototype.reload = function() {
  this.socket.emit('action', 'reload')
}
SocketConn.prototype.send = function(data) {
  this.socket.emit('data', data)
}

SocketConn.prototype.remove = function() {
  const index = SocketConn.instances.indexOf(this)
  index === -1 || SocketConn.instances.splice(index, 1)
}
SocketConn.reloadAll = closure => (SocketConn.instances.forEach(instance => instance.reload()), typeof closure == 'function' && closure())
SocketConn.removeAll = closure => (SocketConn.instances.forEach(instance => instance.remove()), typeof closure == 'function' && closure())
SocketConn.sendAll = closure => (SocketConn.instances.forEach(instance => instance.send({connCnt: SocketConn.instances.length, ...sharedData})), typeof closure == 'function' && closure())

module.exports = {
  SocketConn: SocketConn,
  data: sharedData
}