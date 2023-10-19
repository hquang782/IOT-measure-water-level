import { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

export const ChatPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [message, setMessage] = useState<number>(0);
  const hasRunEffect = useRef(false);

  useEffect(() => {
    if (!hasRunEffect.current) {
      const newSocket = io("ws://localhost:3000/socket", {
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

      newSocket.on("newMessage", (data: DeviceData) => {
        // Xử lý sự kiện khi nhận được tin nhắn mới từ máy
        setChat((prevChat) => [...prevChat, data.name + ": " + data.high]);
        console.log(chat);
        console.log(data);
        window.scrollTo(0, document.body.scrollHeight);
        console.log("ok");
      });

      hasRunEffect.current = true;
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [socket]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket) {
      //test
      const deviceData: DeviceData[] = [
        {
          name: "Nguyễn trãi",
          high: 30,
          lat: 20.982378357449228,
          lng: 105.790345050698161,
        },
        {
          name: "Vũ Trọng Khánh",
          high: 34,
          lat: 20.980837544897252,
          lng: 105.78460836850482,
        },
        {
          name: "Nguyễn Khuyến",
          high: 53,
          lat: 20.978038766575796,
          lng: 105.78763012005066,
        },
        {
          name: "Ao Sen",
          high: 30,
          lat: 20.981939982625267,
          lng: 105.78847892629213,
        },
      ];

      socket.emit("iotData", deviceData);
      setMessage(0);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue); // or parseFloat, depending on your needs

    if (!isNaN(numericValue)) {
      setMessage(numericValue);
    }
  };
  return (
    <div>
      <div className="dialog-container">
        <div className="dialog-content">
          {/* Nội dung dialog */}
          <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            {chat.map((msg, index) => (
              <li
                key={index}
                style={{
                  padding: "0.5rem 1rem",
                  background: index % 2 === 0 ? "#efefef" : "none",
                }}
              >
                {msg}
              </li>
            ))}
          </ul>
          <form
            onSubmit={sendMessage}
            style={{
              background: "rgba(0, 0, 0, 0.15)",
              padding: "0.25rem",
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              height: "3rem",
              boxSizing: "border-box",
              backdropFilter: "blur(10px)",
            }}
          >
            <input
              type="text"
              id="input"
              value={message}
              onChange={handleInputChange}
              style={{
                border: "none",
                padding: "0 1rem",
                flexGrow: 1,
                borderRadius: "2rem",
                margin: "0.25rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#333",
                border: "none",
                padding: "0 1rem",
                margin: "0.25rem",
                borderRadius: "3px",
                outline: "none",
                color: "#fff",
              }}
            >
              Send
            </button>
          </form>
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
}
