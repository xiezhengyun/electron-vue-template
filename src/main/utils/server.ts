import http from 'http'
import { showActive } from '../main'

let server: any = null

export const createServe = mainWindow => {
  if (server) {
    server.close()
    server = null
  }
  const hostname = 'localhost'
  const port = 7898

  server = http.createServer()

  //  处理请求
  server.on('request', function (request, response) {
    try {
      switch (request.url) {
        case '/ask':
          mainWindow.webContents.send('ask', 'ask-value')
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          response.end('success')
          break
        case '/show':
          showActive()
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          response.end('success')
          break
        case '/':
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          response.end('无响应内容')
          break
        default:
          response.statusCode = 404
          response.end()
          break
      }
    } catch (error) {
      response.statusCode = 500
      response.setHeader('Content-Type', 'text/html; charset=utf-8')
      response.end('serveError')
    }
  })

  server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })

  server.on('close', () => {
    console.log('server close')
  })

  server.on('connection', () => {
    console.log('server connection')
  })

  server.on('error', error => {
    console.log('server error,messmage is' + error)
  })
  //server.listen(port, hostname, () => {
  server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
}
