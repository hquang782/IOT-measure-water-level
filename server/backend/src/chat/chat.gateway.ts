import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    // Xử lý khi một client kết nối đến
    const clientId = client.id;
    this.connectedClients.set(clientId, client);
    console.log(`Client connected: ${clientId}`);
  }

  handleDisconnect(client: Socket) {
    // Xử lý khi một client ngắt kết nối
    const clientId = client.id;
    this.connectedClients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, message: any) {
    // Xử lý khi client gửi một tin nhắn
    console.log(message);
    this.server.emit('newMessage', { message: message, client: client.id });
  }
}
