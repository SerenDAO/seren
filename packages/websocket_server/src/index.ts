import { WebSocketServer } from 'ws'

import { type IncomingMessage } from "http"
import { Socket } from 'node:net'


const wss = new WebSocketServer({ port: 8080 })

// type Clients = {
//   [key: string]: Socket[]
// }
type Clients = Socket[]

// 保存所有连接的客户端
const clients: Clients = []

wss.on('error', console.error)

wss.on('open', function open() {
  console.log('open')
})

wss.on('message', function message(data) {
  console.log('received: %s', data)
})

wss.on('connection', function connection(ws: WebSocket, request: IncomingMessage) {
  const ip = request.socket.remoteAddress
  // add client to list
  clients.push(request.socket)

  console.log('connected from ' + ip)
  console.log('connected from ' + request.socket.remotePort + request.socket.remoteFamily)

  // 发送在线人数给所有客户端
  const onlineCount = clients.length
  broadcast(JSON.stringify({
    type: 'onlineCount',
    count: onlineCount
  }))
})

// 监听连接关闭事件
wss.on('close', (ws: WebSocket, request: IncomingMessage) => {
  // remove client from list
  const index = clients.indexOf(request.socket)
  if (index > -1) {
    clients.splice(index, 1)
  }

  console.log('close from ' + request.socket.remoteAddress)
  // 发送在线人数给所有客户端
  const onlineCount = clients.length
  broadcast(JSON.stringify({
    type: 'onlineCount',
    count: onlineCount
  }))

  console.log('WebSocket 连接关闭')
})

// 向所有客户端广播消息
function broadcast(message: string) {
  clients.forEach((client) => {

    wss.clients.forEach((client) => {
      client.send(message)
    })
  })
}
