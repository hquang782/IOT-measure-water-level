import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Box,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { newRequest } from "../util/configApiRequest";
import { logout } from "../services/auth.service";
import { Socket } from "socket.io-client";

const API_BASE_URL = "http://26.25.44.115:3000";
const ADDRESS_API_URL = `${API_BASE_URL}/address`;
const MQTT_API_URL = `${API_BASE_URL}/mqtt/publish`;

const devicesData: DeviceData[] = [
  { name: "Device 1", high: 0, lat: 0, lng: 0, status: "active" },
];

export const AdminPage = () => {
  const [devices, setDevices] = useState(devicesData);
  const [socket, setSocket] = useState<Socket | null>(null);
  const hasRunEffect = useRef(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await newRequest(ADDRESS_API_URL, { method: "GET" });
        setDevices(response?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thiết bị:", error);
      }
    };

    fetchData();
  }, []);

  const updateDevice = async (device: DeviceData) => {
    try {
      await axios.patch(`${ADDRESS_API_URL}/${device.name}`, { ...device });
      const mqttTopic = `/C_QP/p/controller_status_devide/${device.name}`;
      const mqttPayload = device.status;
      const response = await axios.post(MQTT_API_URL, { topic: mqttTopic, payload: mqttPayload });
      //xóa khỏi home
      const response2 = await axios.post(MQTT_API_URL, { topic: '/WL_QP/p/water_level', payload: JSON.stringify(device) });

      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thiết bị:", error);
    }
  };

  const handleTurnOnAll = async () => {
    try {
      const updatedDevices = devices.map((device) => ({
        ...device,
        status: device.status === "inactive" ? "active" : device.status,
      }));

      setDevices(updatedDevices);

      await Promise.all(
        updatedDevices.map(async (device) => {
          await updateDevice(device);
        })
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thiết bị:", error);
    }
  };

  const handleSwitchChange = async (name: string) => {
    try {
      const updatedDevices = devices.map((device) =>
        device.name === name
          ? {
              ...device,
              status: device.status === "active" ? "inactive" : "active",
            }
          : device
      );

      setDevices(updatedDevices);
      const deviceChange = updatedDevices.find((device) => device.name === name);

      if (deviceChange) {
        await updateDevice(deviceChange);
      } else {
        console.error("Thiết bị không được tìm thấy");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thiết bị:", error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div>
      <div></div>
      <div>
        <div>
          <Typography variant="h2" align="center">
            Quản Lý Thiết Bị
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTurnOnAll}
            style={{ position: "absolute", top: 0, right: 0, marginTop: "10px", marginRight: "10px" }}
          >
            Bật Tất Cả
          </Button>
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Độ Cao</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.name}>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.high}</TableCell>
                    <TableCell>{device.status}</TableCell>
                    <TableCell>
                      <Switch
                        checked={device.status === "active"}
                        onChange={() => handleSwitchChange(device.name)}
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={handleLogout} style={{ marginTop: "30px" }}>
            Đăng Xuất
          </Button>
        </div>
      </div>
    </div>
  );
};

interface DeviceData {
  name: string;
  high: number;
  lat: number;
  lng: number;
  status: string;
}
