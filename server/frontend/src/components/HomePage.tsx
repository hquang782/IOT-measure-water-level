import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface DeviceData {
  address: string;
  high: number;
}

export const HomePage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const hasRunEffect = useRef(false);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  useEffect(() => {
    if (!hasRunEffect.current) {
      const newSocket = io('ws://localhost:3000', {
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vị trí</TableCell>
              <TableCell>Mực nước</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.high}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
