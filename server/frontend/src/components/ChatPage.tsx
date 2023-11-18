import { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

export const ChatPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [message, setMessage] = useState<number>(0);
  const hasRunEffect = useRef(false);
// đổi localhost thành ip máy 
  useEffect(() => {
    if (!hasRunEffect.current) {
      const newSocket = io("ws://26.25.44.115:3000", {
        transports: ["websocket"],
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("connected");
      });

      console.log("init");

      newSocket.on("disconnect", () => {
        setSocket(null);
      });

      newSocket.on("newMessage", (data: any) => {
        // Xử lý sự kiện khi nhận được tin nhắn mới từ máy
        setChat((prevChat) => [...prevChat, data.name + ": " + data.status]);
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

      socket.emit("iotData", deviceData);
      setMessage(0);
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
  status: string;
}
