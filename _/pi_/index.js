const Path = require('path')
const Url = require('url')

Path.root = Path.resolve(__dirname, ('..' + Path.sep).repeat(0)) + Path.sep
Path.html = Path.root + 'html' + Path.sep
Path.py   = Path.root + 'py' + Path.sep


const FileSystem = require('fs')
  const Exists   = FileSystem.existsSync
  const FileRead = FileSystem.readFile

const print = str => {
  process.stdout.write('\r' + str)
  return true
}
// const showFile = (response, file, ext) => {
//   return FileRead(file, {
//     encoding: ext && Config.server.utf8Exts.indexOf('.' + ext) != -1 ? 'utf8' : null
//   }, (error, data) => {
//     if (error) return showError(response, '讀取檔案 ' + file.replace(Path.entry, '') + ' 發生錯誤！')
//     const Mime = require('mime')
//     response.writeHead(200, {'Content-Type': Mime.getType(file) + '; charset=UTF-8'})
//     response.write('.' + ext == '.html' ? addSocket(data) : data)
//     response.end()
//   })
// }

const createServer = (port, request, response) => {
//   let path = Url.parse(request.url).pathname.replace(/\/+/gm, '/').replace(new RegExp('^/+', 'gm'), '')
//   path = path || '/'
//   path[path.length - 1] !== '/' || (path += 'index')

//   const Mime = require('mime')
//   let ext = Mime.getExtension(Mime.getType(path))
//   let file = Path.entry + path.replace('/', Path.sep)

//   // if (Exists(file))
//   //   return ext !== 'php'
//   //     ? ext !== 'html'
//   //       ? showFile(response, file, ext)
//   //       : showHTML(response, file)
//   //     : showPHP(response, port, file)
//   // else if (ext)
//   //   return ext == 'html' && Exists(Path.entry + path.replace(/\.html$/, '.php'))
//   //     ? showPHP(response, port, Path.entry + path.replace(/\.html$/, '.php'))
//   //     : show404(response)
//   // else
//   //   return !Exists(file + '.php')
//   //     ? !Exists(file + '.html')
//   //       ? show404(response)
//   //       : showHTML(response, file + '.html')
//   //     : showPHP(response, port, file + '.php')

//   // return show404(response)

  response.writeHead(200, {'Content-Type': 'text' + '; charset=UTF-8'})
  response.write('a')
  response.end()
}

const port = 8080

print('請動伺服器，Port：' + port + "\n")

const server = require('http')
  .createServer(createServer.bind(null, port))

server.listen(port)
      .on('error', error => {
        console.error('錯誤！', error)
      })