import http from 'http'

export const createServe = mainWindow => {
  const hostname = 'localhost'
  const port = 7898

  const server = http.createServer()

  //  处理请求
  server.on('request', function (request, response) {
    try {
      switch (request.url) {
        case '/ask':
          mainWindow.webContents.send('ask', 'ask-value')
          response.end('success')
          break
        case '/show':
          mainWindow.showInactive()
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
      console.log(error)
      response.statusCode = 500
      response.end('服务器错误')
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
