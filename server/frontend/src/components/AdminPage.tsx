import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
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
  TextField,
} from "@mui/material";
import axios from "axios";
import { newRequest } from "../util/configApiRequest";
import { logout } from "../services/auth.service";

const API_BASE_URL = "http://26.25.44.115:3000";
const ADDRESS_API_URL = `${API_BASE_URL}/address`;
const MQTT_API_URL = `${API_BASE_URL}/mqtt/publish`;

const devicesData: DeviceData[] = [
  { name: "Device 1", high: 0, lat: 0, lng: 0, status: "active" },
];

export const AdminPage = () => {
  const [devices, setDevices] = useState(devicesData);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: number;
  }>({});

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
  }, [editingRow]);

  const updateDevice = async (device: DeviceData) => {
    // firmware xử lý json trả về
    try {
      await axios.patch(`${ADDRESS_API_URL}/${device.name}`, { ...device });
      const mqttTopic = `/C_QP/p/controller_status_devide/${device.name}`;
      // const mqttPayload = device.status;
      const devicev2: DeviceData = device;
      const mqttPayload = JSON.stringify(devicev2);
      const response = await axios.post(MQTT_API_URL, {
        topic: mqttTopic,
        payload: mqttPayload,
      });
      //xóa khỏi home
      await axios.post(MQTT_API_URL, {
        topic: "/WL_QP/p/water_level",
        payload: JSON.stringify(device),
      });

      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thiết bị:", error);
    }
  };
  // start process switch button
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
      const deviceChange = updatedDevices.find(
        (device) => device.name === name
      );

      if (deviceChange) {
        await updateDevice(deviceChange);
      } else {
        console.error("Thiết bị không được tìm thấy");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thiết bị:", error);
    }
  };
  //end proccess switch button
  //start change location
  const handleEditRow = (name: string) => {
    setEditingRow(name);
    setEditedValues((prevValues) => ({
      ...prevValues,
      [`${name}_lat`]: devices.find((device) => device.name === name)?.lat || 0,
      [`${name}_lng`]: devices.find((device) => device.name === name)?.lng || 0,
    }));
  };

  const handleSaveChanges = async (name: string) => {
    try {
      // Lấy giá trị lat và lng từ editedValues
      const updatedLat = editedValues[`${name}_lat`];
      const updatedLng = editedValues[`${name}_lng`];
      await updateDeviceLocation(name, updatedLat, updatedLng);
      // Đặt lại trạng thái chỉnh sửa
      setEditingRow(null);
      setEditedValues({});
    } catch (error) {
      console.error("Lỗi khi lưu thay đổi:", error);
    }
  };

  // Hàm này xử lý việc cập nhật vị trí của thiết bị thông qua cuộc gọi API
  const updateDeviceLocation = async (
    name: string,
    lat: number,
    lng: number
  ) => {
    try {
      // Thực hiện cuộc gọi API hoặc cập nhật cơ sở dữ liệu tại đây
      // Sử dụng axios hoặc fetch để gửi yêu cầu đến API
      const response = await axios.patch(`${ADDRESS_API_URL}/${name}`, {
        lat: lat,
        lng: lng,
      });

      // Xuất kết quả từ cuộc gọi API nếu cần
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi cập nhật vị trí thiết bị:", error);
      throw error; // Đặt lại lỗi để có thể xử lý ở các lớp gọi cha nếu cần
    }
  };

  const handleDeleteRow = async (deviceName: string) => {
    try {
      // Thực hiện xóa thiết bị khỏi cơ sở dữ liệu (thay thế bằng phương thức thích hợp)
      // Ví dụ:
      handleSwitchChange(deviceName);
      await axios.delete(`${ADDRESS_API_URL}/${deviceName}`);
      // Sau khi xóa thành công, cập nhật danh sách thiết bị (devices) mà không bao gồm thiết bị đã xóa
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device.name !== deviceName)
      );

      // Thêm các bước xóa khỏi database tùy thuộc vào loại cơ sở dữ liệu và API bạn đang sử dụng
    } catch (error) {
      console.error("Lỗi khi xóa thiết bị:", error);
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
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              marginTop: "10px",
              marginRight: "10px",
            }}
          >
            Bật Tất Cả
          </Button>
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Độ Cao</TableCell>
                  <TableCell>lat</TableCell>
                  <TableCell>lng</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.name}>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.high}</TableCell>
                    <TableCell>
                      {editingRow === device.name ? (
                        <TextField
                          value={editedValues[`${device.name}_lat`]}
                          onChange={(e) =>
                            setEditedValues(
                              (prevValues) =>
                                ({
                                  ...prevValues,
                                  [`${device.name}_lat`]: e.target.value,
                                } as { [key: string]: number })
                            )
                          }
                        />
                      ) : (
                        device.lat
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === device.name ? (
                        <TextField
                          value={editedValues[`${device.name}_lng`]}
                          onChange={(e) =>
                            setEditedValues(
                              (prevValues) =>
                                ({
                                  ...prevValues,
                                  [`${device.name}_lng`]: e.target.value,
                                } as { [key: string]: number })
                            )
                          }
                        />
                      ) : (
                        device.lng
                      )}
                    </TableCell>
                    <TableCell>{device.status}</TableCell>
                    <TableCell>
                      {editingRow === device.name ? (
                        <Button
                          color="primary"
                          onClick={() => handleSaveChanges(device.name)}
                        >
                          Lưu
                        </Button>
                      ) : (
                        <div>
                          <Switch
                            checked={device.status === "active"}
                            onChange={() => handleSwitchChange(device.name)}
                            color="primary"
                          />
                          <Button
                            color="primary"
                            onClick={() => handleEditRow(device.name)}
                          >
                            Chỉnh Sửa
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteRow(device.name)}
                          ></Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            style={{ marginTop: "30px" }}
          >
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
