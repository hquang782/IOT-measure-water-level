import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const HomePage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const hasRunEffect = useRef(false);

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

      newSocket.on('newMessage', (data) => {
        // Xử lý sự kiện khi nhận được tin nhắn mới từ máy
        setChat((prevChat) => [...prevChat, data.client + ': ' + data.message]);
        console.log(chat);
        console.log(data);
        window.scrollTo(0, document.body.scrollHeight);
        console.log('ok');
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
    if (socket && message !== '') {
      socket.emit('sendMessage', message);
      setMessage('');
      console.log(chat);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  return (
    <div>
     
        <div className='dialog-container'>
          <div className='dialog-content'>
            {/* Nội dung dialog */}
            <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
              {chat.map((msg, index) => (
                <li
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    background: index % 2 === 0 ? '#efefef' : 'none',
                  }}
                >
                  {msg}
                </li>
              ))}
            </ul>
            <form
              onSubmit={sendMessage}
              style={{
                background: 'rgba(0, 0, 0, 0.15)',
                padding: '0.25rem',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                height: '3rem',
                boxSizing: 'border-box',
                backdropFilter: 'blur(10px)',
              }}
            >
              <input
                type='text'
                id='input'
                value={message}
                onChange={handleInputChange}
                style={{
                  border: 'none',
                  padding: '0 1rem',
                  flexGrow: 1,
                  borderRadius: '2rem',
                  margin: '0.25rem',
                  outline: 'none',
                }}
              />
              <button
                type='submit'
                style={{
                  background: '#333',
                  border: 'none',
                  padding: '0 1rem',
                  margin: '0.25rem',
                  borderRadius: '3px',
                  outline: 'none',
                  color: '#fff',
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
