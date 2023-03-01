import { AddressInfo, WebSocketServer, WebSocket } from 'ws'

import { IncomingHttpHeaders, type IncomingMessage } from "http"
import { Socket } from 'node:net'
import { createServer as createHttpsServer } from 'https'
import { readFileSync } from 'node:fs'

const PORT = process.env.PORT
console.log('listen on PORT', PORT)

const httpsServer = createHttpsServer({
  cert: readFileSync(__dirname + '/../public/server.cert'),
  key: readFileSync(__dirname + '/../public/server.key'),
});

const wsServer = new WebSocketServer({
  server: httpsServer
})


type RoomID = string
type Client = {
  id: IncomingHttpHeaders['sec-websocket-key'],
  ws: WebSocket
}
type Clients = {
  [key: RoomID]: Client[]
}
// type Clients = Socket[]

// 保存所有连接的客户端
let clients: Clients = {}

wsServer.on('error', console.error)

wsServer.on('listening', function open() {
  console.log('listening')
})


wsServer.on('message', function message(data) {
  console.log('received: %s', data)
})

wsServer.on('connection', function connection(ws: WebSocket, request: IncomingMessage) {
  const addressInfo = request.socket.address() as AddressInfo
  const ip = Object.keys(addressInfo).includes('address') ? addressInfo.address : ''
  const id = request.headers['sec-websocket-key'] as string
  const roomID = request.url?.split('/')[1] as string

  console.log('request.url', request.url)
  // add client to list
  const client = {
    id,
    ws
  }
  clients.hasOwnProperty(roomID) ? clients[roomID].push(client) : clients[roomID] = [client]

  console.log(`connected from ${ip}:${request.socket.remotePort}`)

  ws.on('close', function () {
    console.log('closed ' + request.socket.remoteAddress + ' ' + id)
    const clientsInRoom = clients[roomID]
    if (!clientsInRoom) return

    clients[roomID] = clientsInRoom.filter(client => client.ws !== ws)
    broadcastOnlineCount(roomID)
  })

  broadcastOnlineCount(roomID)
})

httpsServer.listen(PORT)

// 向所有客户端广播消息
function broadcast(clients: Client[], message: string) {
  let order = 0
  clients.forEach(client => {
    if (client.ws.readyState !== WebSocket.OPEN) {
      return
    }

    console.log('broadcast to client ', order)
    client.ws.send(message)
    order++;
  })
}

function broadcastOnlineCount(roomID: RoomID) {
  broadcast(clients[roomID], JSON.stringify({
    type: 'onlineCount',
    count: clients[roomID] ? clients[roomID].length : 0
  }))
}

