import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  deviceDataMap: Map<string, DeviceData> = new Map(); // Lưu trữ dữ liệu từng thiết bị

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('iotData')
  handleIotData(client: any, data: DeviceData) {
    // Xử lý dữ liệu từ thiết bị IOT ở đây
    console.log('Received data from client:', data);
    console.log(data.address);
    if (this.deviceDataMap.has(data.address)) {
      // Nếu dữ liệu từ thiết bị đã tồn tại, cập nhật nó
      this.deviceDataMap.set(data.address, data);
    } else {
      // Nếu dữ liệu từ thiết bị chưa tồn tại, thêm dữ liệu mới vào deviceDataMap
      this.deviceDataMap.set(data.address, data);
    }
    // Gửi dữ liệu tới tất cả client đang kết nối
    this.server.emit('deviceData', Array.from(this.deviceDataMap.values()));
  }
}

interface DeviceData {
  address: string;
  high: number;
}
