import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import "../style/home.css";
import Test from "../Item/GetMap/test";
import SearchIcon from "@mui/icons-material/Search";

interface DeviceData {
  name: string;
  high: number;
  lat: number;
  lng: number;
  status: string;
}

export const HomePage = () => {
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [deviceDataSearch, setDeviceDataSearch] = useState<DeviceData[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const hasRunEffect = useRef(false);

  useEffect(() => {
    if (!hasRunEffect.current) {
      const newSocket = io("ws://26.25.44.115:3000", {
        transports: ["websocket"],
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        // Xử lý sự kiện khi kết nối tới máy chủ thành công
        console.log("connected");
      });

      console.log("init");

      newSocket.on("disconnect", () => {
        // Xử lý sự kiện khi bị ngắt kết nối với máy chủ
        setSocket(null);
      });

      newSocket.on("deviceData", (dataFromServer: DeviceData[]) => {
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
// fix top100Films sau khi nhận được data từ device -> deviceData
  const handleSearch = () => {
    console.log(searchValue);
    const deviceSearch = deviceData.find(
      (device) => device.name === searchValue
    );
    const resultArray = deviceSearch ? [deviceSearch] : [];
    setDeviceDataSearch(resultArray);
  };

  return (
    <div className="container">
      <div className="search-container">
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={deviceData.map((option) => option.name)}
          onChange={(e, option) => {
            setSearchValue(option);
          }}
          renderInput={(params) => (
            <div>
              <TextField
                {...params}
                label="Search input"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  endAdornment: (
                    <SearchIcon
                      onClick={handleSearch}
                      style={{ cursor: "pointer" }}
                    />
                  ),
                  onKeyPress: (e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  },
                  style:{borderRadius: "20px"},
                  
                }}
              />
            </div>
          )}
          sx={{
            borderRadius: "20px",
            width: "300px",
            backgroundColor: "#f3f3f3",
          }}
        />
      </div>
      <Test location={deviceDataSearch} />

      <strong>Bảng thống kê các vị trí và mực nước</strong>
      <div className="table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#33CCFF" }}>
                <TableCell style={{ color: "black" }}>Vị trí</TableCell>
                <TableCell style={{ color: "black" }}>Mực nước</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deviceData.map((row, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor:
                      row.high > 50
                        ? "#FF3333"
                        : row.high > 30
                        ? "yellow"
                        : "#33FF33",
                  }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.high} cm</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <strong>Bản đồ mực nước</strong>
      {/* <MapComponent devicedata = {deviceData}  /> */}
      {/* <MapWithMarker location={deviceData[0]}/> */}

      <Test location={deviceData} />
    </div>
  );
};

const top100Films: DeviceData[] = [
  {
    name: "Nguyễn trãi",
    high: 30,
    lat: 20.982378357449228,
    lng: 105.790345050698161,
    status:"active",
  },
  {
    name: "Vũ Trọng Khánh",
    high: 34,
    lat: 20.980837544897252,
    lng: 105.78460836850482,
    status:"active",
  },
  {
    name: "Nguyễn Khuyến",
    high: 53,
    lat: 20.978038766575796,
    lng: 105.78763012005066,
    status:"active",
  },
  {
    name: "Ao Sen",
    high: 30,
    lat: 20.981939982625267,
    lng: 105.78847892629213,
    status:"active",
  },
];
