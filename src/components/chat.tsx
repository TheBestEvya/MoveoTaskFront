import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import notificationSound from '../assets/notificationSound.wav';

interface ChatMessage {
    senderId: string | undefined;
    message: string;
    timestamp: string; // or Date if you're working with a Date object
}

// Define the type for the socket prop
interface ChatProps {
    roomId?: string;
    socket: any; // You can refine the socket type if you need
}

const Chat = ({ socket , roomId }: ChatProps) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<ChatMessage>({ senderId: '', message: '', timestamp: '' });
  const playnotificationSound = () => {
    const audio = new Audio(notificationSound); 
    audio.play();
  };

    const currentUserId = socket.id; 
  useEffect(() => {

    socket.on('newMessage', (message: ChatMessage) => {
      if (message.senderId !== currentUserId) {
        setMessages((prevMessages) => [...prevMessages, message]);
        playnotificationSound();
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off('newMessage');
    };
  }, [socket, currentUserId]); // Dependency array to listen for new messages only after connection

  const sendMessage = () => {
    if (newMessage.message.trim()) {
      // Emit the message to the selected user
      console.log('Sending message:', newMessage.message);
      socket.emit('sendMessage', { roomId: roomId , senderId: currentUserId, message: newMessage.message , timestamp :newMessage.timestamp  });
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
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        boxShadow: 3,
        padding: 2,
        transition: 'width 0.3s, height 0.3s',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: 2,
          gap: 1,
          overflowY: 'auto',
        //   height: 200,
        }}
      >
        {messages.map((msg, index) => (
          <Box key={index} sx={{ padding: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* TODO :: add avatar functionality? - default user or a photo user selected */}
              {/* <Avatar src={msg.senderId === currentUserId ? currentUser?.profileImage : selectedUser?.profileImage} /> */}
                <Typography sx={{ marginLeft: 1, fontWeight: 'bold' }}>{msg.senderId === currentUserId ? 'You' : msg.senderId}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography sx={{ marginLeft: 1, fontSize: '0.8rem' }}>
                  {new Date(msg.timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ marginTop: 1 }}>{msg.message}</Typography>
          </Box>
        ))}
      </Box>

      <TextField
        value={newMessage.message}
        onChange={(e) => setNewMessage({ senderId: currentUserId, message: e.target.value, timestamp: new Date().toISOString() })}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents new line in the TextField
            sendMessage(); // Call your send function
          }
        }}
        placeholder="Type a message"
        fullWidth
        variant="outlined"
        sx={{
          marginBottom: 1,
        }}
      />
      <Button
        onClick={sendMessage}
        variant="contained"
        fullWidth
      >
        Send
      </Button>
    </Box>
  );
};

export default Chat;
