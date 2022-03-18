# http

## http.Agent

## http.ClientRequest

## http.Server

## http.ServerResponse

## http.IncomingMessage

## http.OutgoingMessage

http.createServer => http.Server

http.request => http.ClientRequest

server.on('request', (request, response) => {
  request.__proto__ === IncomingMessage
  request.__proto__ === ServerResponse 
})


http.OutgoingMessage
  http.ServerResponse
  http.ClientRequest

http.IncomingMessage

http.Sever

http.Agent