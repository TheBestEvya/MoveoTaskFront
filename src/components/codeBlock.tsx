import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Box, Button, Typography, Paper } from "@mui/material";
import Confetti from "react-confetti";
import celebrationSound from '../assets/successSound.mp3';
import { useNavigate, useParams } from "react-router-dom";


const socket = io("http://localhost:5000");



const CodeBlockPage: React.FC = () => {
  const navigate = useNavigate();
  const id  = useParams().id
  const [role, setRole] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [solution, setSolution] = useState<string>("console.log('Hello, World!');");
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [isSmileyVisible, setSmileyVisible] = useState<boolean>(false);
  const [isConfettiVisible, setConfettiVisible] = useState<boolean>(false); // Track if confetti should be visible

  const resetPage = () => {
  setCode('');
  setRole('')
  setSmileyVisible(false)
  setConfettiVisible(false)
  }
  useEffect(() => {
    socket.emit("joinRoom", { roomId: id });

    socket.on("role", (role: "student" | "mentor") => {
      console.log(role)
      setRole(role);
    });

    socket.on("codeUpdate", (newCode: string) => {
      setCode(newCode);
    });

    socket.on("studentsCount", (count: number) => {
      setStudentsCount(count);
    });

    socket.on("studentLeft", () => {
      setStudentsCount((prev) => prev - 1);
    });
    socket.on("mentorLeft", (msg) => {
      resetPage();
      alert(msg);
      navigate("/"); 
    });
  }, []);

  useEffect(() => {
    if (code === solution) {
      setSmileyVisible(true);
      setConfettiVisible(true); // Show confetti when code matches the solution
      playCelebrationSound();
      setTimeout(() => setConfettiVisible(false), 7000); // Hide confetti after 5 seconds
    } else {
      setSmileyVisible(false);
      setConfettiVisible(false); // Hide confetti if code doesn't match
    }
  }, [code, solution]);

  const handleCodeChange = (_editor: any, _data: any, value: string) => {  
      setCode(value);
      socket.emit("codeUpdate", { roomId: id, code: value });
  };
  const playCelebrationSound = () => {
    const audio = new Audio(celebrationSound); // Imported sound file
    audio.play();
  };
  const handleDisconnect = () => {
    socket.emit("disconnectFromRoom", { roomId: id });
    navigate("/"); 
  
  };

  return (
    <Box flex={1} sx={{ p: 3, maxWidth: 600, mx: "auto", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>{`Code Block ${id}`}</Typography>
      <Typography variant="subtitle1">{`Role: ${role}`}</Typography>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>{`Students in room: ${studentsCount}`}</Typography>

      <Paper elevation={3} sx={{ p: 2, border: "2px solid black", borderRadius: 2 }}>
        <CodeMirror
          value={code}
          extensions={[javascript()]}
          onChange={(value) => handleCodeChange(null, null, value)}
          theme={"dark"}
          basicSetup={{ lineNumbers: true}}
          readOnly={role === "mentor"}
          style={{
            minHeight: "300px", // Initial height (roughly 10 lines)
            minWidth : "500px",
            height: "auto", // This will allow growth
            overflowY: "auto", // To handle overflow
          }}
        />
      </Paper>

      {isSmileyVisible && <Typography sx={{ fontSize: "50px", mt: 2 }}>😊</Typography>}
      {isConfettiVisible && <Confetti />}
      <Button
        variant="contained"
        color="error"
        onClick={handleDisconnect}
        sx={{ mt: 2 }}
      >
        Leave Room
      </Button>
    </Box>
  );
};

export default CodeBlockPage;
