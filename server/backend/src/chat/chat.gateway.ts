import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';


@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService){}

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
  handleIotData(data: DeviceData) {//TODO: nhận data và xử lí 
    // Xử lý dữ liệu từ thiết bị IOT ở đây
    console.log('Received data from client:', data);
    // console.log(data.name);
    if (this.deviceDataMap.has(data.name)) {
      // Nếu dữ liệu từ thiết bị đã tồn tại, cập nhật nó
      data.high=Math.round(data.high) //làm tròn dữ liệu 
      this.deviceDataMap.set(data.name, data);
    } else {
      // Nếu dữ liệu từ thiết bị chưa tồn tại, thêm dữ liệu mới vào deviceDataMap
      data.high=Math.round(data.high) //làm tròn dữ liệu 
      this.deviceDataMap.set(data.name, data);
    }
    //==========v1=========
    // this.chatService.saveData(data.name, data.high,data.lat,data.lng);
    //=====================
    const data2: { name: string, status: string} = {name: 'Send data',status:data.name};
    this.server.emit('newMessage', data2);
    // Gửi dữ liệu tới tất cả client đang kết nối
    this.server.emit('deviceData', Array.from(this.deviceDataMap.values()));
    console.log('emit done');
    // this.server.emit('deviceData', data);

  }
}

interface DeviceData {
  name: string;
  high: number;
  lat: number;
  lng: number;
  status: string;
}
