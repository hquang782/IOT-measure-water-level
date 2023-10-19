import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import MapComponent from '../Item/GetMap/MapCompent';
import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import '../style/home.css';

interface DeviceData {
  name: string;
  high: number;
  lat: number;
  lng: number;
}
const dataChange: any[] = [];

export const HomePage = () => {
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const hasRunEffect = useRef(false);
  useEffect(() => {
    if (!hasRunEffect.current) {
      const newSocket = io('ws://localhost:3000/socket', {
        transports: ['websocket'],
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        // Xử lý sự kiện khi kết nối tới máy chủ thành công
        console.log('connected');
      });

      console.log('init');

      newSocket.on('disconnect', () => {
        // Xử lý sự kiện khi bị ngắt kết nối với máy chủ
        setSocket(null);
      });

      newSocket.on('deviceData', (dataFromServer: DeviceData[]) => {
        
        console.log(dataFromServer);
        setDeviceData(dataFromServer);
        dataChange.splice(0, dataChange.length);
        dataChange.push(dataFromServer)
      });

      hasRunEffect.current = true;
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [socket]);

  return (
    <>
      <strong>Bảng thống kê vị trí và mực nước</strong>

      <div className='table-container'>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: 'black' }}>
                <TableCell style={{ color: 'white' }}>Vị trí</TableCell>
                <TableCell style={{ color: 'white' }}>Mực nước</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deviceData.map((row, index) => (
                <TableRow
                key={index}
                style={{
                  backgroundColor: row.high > 50 ? '#FF3333' : row.high > 30 ? 'yellow' : '#33FF33',
                }}
              >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.high}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <strong>Bản đồ mực nước</strong>
      <MapComponent devicedata = {deviceData}  />
    </>
  );
};

export {dataChange};
