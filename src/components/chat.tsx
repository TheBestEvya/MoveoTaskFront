import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useTheme } from '../context/ThemeContex'; // Use your custom theme hook
import notificationSound from '../assets/notificationSound.wav';

interface ChatMessage {
    senderId: string | undefined;
    message: string;
    timestamp: string;
}

interface ChatProps {
    roomId?: string;
    socket: any; 
}

const Chat = ({ socket, roomId }: ChatProps) => {
  const { theme } = useTheme(); // Get current theme
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<ChatMessage>({ senderId: '', message: '', timestamp: '' });

  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };

  const currentUserId = socket.id;

  useEffect(() => {
    socket.on('newMessage', (message: ChatMessage) => {
      if (message.senderId !== currentUserId) {
        setMessages((prevMessages) => [...prevMessages, message]);
        playNotificationSound();
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, currentUserId]);

  const sendMessage = () => {
    if (newMessage.message.trim()) {
      socket.emit('sendMessage', { roomId, senderId: currentUserId, message: newMessage.message, timestamp: newMessage.timestamp });
      setMessages((prevMessages) => [...prevMessages, { ...newMessage }]);
      setNewMessage({ senderId: '', message: '', timestamp: '' });
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        bottom: 20,
        right: 20,
        width: 300,
        height: '90%',
        backgroundColor: theme === 'light' ? 'white' : '#121212',
        color: theme === 'light' ? 'black' : 'white',
        border: `1px solid ${theme === 'light' ? '#ccc' : '#444'}`,
        borderRadius: 2,
        boxShadow: 3,
        padding: 2,
        transition: 'width 0.3s, height 0.3s',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: 2,
          gap: 1,
          overflowY: 'auto',
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              padding: 1,
              borderTop: `1px solid ${theme === 'light' ? '#ccc' : '#555'}`,
              borderBottom: `1px solid ${theme === 'light' ? '#ccc' : '#555'}`,
              width: '90%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {msg.senderId === currentUserId ? 'You' : msg.senderId?.slice(0, 5)}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>
                {new Date(msg.timestamp).toLocaleString()}
              </Typography>
            </Box>
            <Typography sx={{ marginTop: 1 }}>{msg.message}</Typography>
          </Box>
        ))}
      </Box>

      <TextField
        value={newMessage.message}
        onChange={(e) => setNewMessage({ senderId: currentUserId, message: e.target.value, timestamp: new Date().toISOString() })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder="Type a message"
        fullWidth
        variant="outlined"
        sx={{
          marginBottom: 1,
          backgroundColor: theme === 'light' ? 'white' : '#1e1e1e',
          color: theme === 'light' ? 'black' : 'white',
          input: { color: theme === 'light' ? 'black' : 'white' },
        }}
      />
      <Button
        onClick={sendMessage}
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: theme === 'light' ? 'primary.main' : 'grey.800',
          '&:hover': { backgroundColor: theme === 'light' ? 'primary.dark' : 'grey.700' },
        }}
      >
        Send
      </Button>
    </Box>
  );
};

export default Chat;
