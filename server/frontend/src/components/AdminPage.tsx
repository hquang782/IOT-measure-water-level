import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Box,
  Button,
} from "@mui/material";
import { newRequest } from "../util/configApiRequest";
import axios from "axios";
import { logout } from "../services/auth.service";


const devicesData: DeviceData[] = [
  { name: "Device 1", high: 0, lat: 0, lng: 0, status: "active" },

  // ... add more devices as needed
];

export const AdminPage = () => {
  const [devices, setDevices] = useState(devicesData);
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await newRequest("http://26.25.44.115:3000/address/", {
          method: "GET",
        }).then((data) => {
          return data?.data;
        });
        setDevices(response);
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchData();
  }, []);
  const handleSwitchChange = async (name: string) => {
    try {
      const updatedDevices = devices.map((device: DeviceData) =>
        device.name === name
          ? {
              ...device,
              status: device.status === "active" ? "inactive" : "active",
            }
          : device
      );

      setDevices(updatedDevices);
      const deviceChange: any = updatedDevices.find(
        (device: DeviceData) => device.name === name
      ); //để any cho hết lỗi
      // Check if the device was found
      if (deviceChange) {
        await axios.patch(`http://localhost:3000/address/${name}`, {
          name: deviceChange.name,
          high: deviceChange.high,
          lat: deviceChange.lat,
          lng: deviceChange.lng,
          status: deviceChange.status,
        });
        //publish to device
        const mqttTopic = `/quang/782/${deviceChange.name}`;
        const mqttPayload = deviceChange.status;

        const response = await axios.post(
          "http://localhost:3000/mqtt/publish",
          {
            topic: mqttTopic,
            payload: mqttPayload,
          }
        );

        console.log(response.data);
      } else {
        console.error("Device not found");
      }
    } catch (error) {
      console.error("Error updating device status:", error);
    }
  };

  function handleLogout(): void {
    logout();
    window.location.href="/login";
  }

  return (
    <div>
      <div></div>
      {/* Sidebar and other content */}
      <div>
        {/* Toggle between device management and other sections in the sidebar */}
        {/* ... */}

        {/* Device Management Section */}
        <div>
          <h2 style={{textAlign: 'center'}}>Device Management</h2>
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>High</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device: DeviceData) => (
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
          {/* Logout button */}
          <Button variant="contained" color="primary" onClick={handleLogout} style={{ marginTop: '30px' }}>
            Logout
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
