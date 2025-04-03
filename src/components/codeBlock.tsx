import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Box, Button, Typography, Paper } from "@mui/material";
import Confetti from "react-confetti";
import celebrationSound from '../assets/successSound.mp3';
import { useNavigate, useParams } from "react-router-dom";
import Chat from "./chat";
import * as codeService from '../services/code-service';
import { useTheme } from "../context/ThemeContex"; // Import useTheme hook

const socket = io(import.meta.env.VITE_SOCKET_API_URL);

const CodeBlockPage: React.FC = () => {
  const navigate = useNavigate();
  const id  = useParams().id;
  const { theme } = useTheme(); // Get theme from context

  const [codeBlock , setCodeBlock] = useState<codeService.CodeBlock | null>(null);
  const [role, setRole] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [solution, setSolution] = useState<string>("console.log('Hello, World!');");
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [isSmileyVisible, setSmileyVisible] = useState<boolean>(false);
  const [isConfettiVisible, setConfettiVisible] = useState<boolean>(false);

  const resetPage = () => {
    setCode('');
    setRole('');
    setSmileyVisible(false);
    setConfettiVisible(false);
  };

  const fetchCodeBlockById = async (id:string) => {
    try {
      const { request } = codeService.getCodeBlockById(id);
      const response = await request;
      setCodeBlock(response.data);
    } catch (error) {
      console.error("Error fetching code blocks:", error);
    }
  };

  useEffect(() => {
    fetchCodeBlockById(id!);

    socket.emit("joinRoom", { roomId: id });

    socket.on("role", (role: "student" | "mentor") => {
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

    socket.on("solutionUpdateForStudents", (updatedCode: string) => {
      setSolution(updatedCode);
    });

    const handleBeforeUnload = () => {
      handleDisconnect();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id, navigate]);

  useEffect(() => {
    if (code === solution) {
      setSmileyVisible(true);
      setConfettiVisible(true);
      playCelebrationSound();
      setTimeout(() => setConfettiVisible(false), 7000);
    } else {
      setSmileyVisible(false);
      setConfettiVisible(false);
    }
  }, [code, solution]);

  const handleCodeChange = (_editor: any, _data: any, value: string) => {  
    setCode(value);
    socket.emit("codeUpdate", { roomId: id, code: value });
  };

  const handleSolutionChange = (_editor: any, _data: any, value: string) => {  
    setSolution(value);
    socket.emit("solutionUpdateByMentor", { roomId: id, code: value });
  };

  const playCelebrationSound = () => {
    const audio = new Audio(celebrationSound);
    audio.play();
  };

  const handleDisconnect = () => {
    socket.emit("disconnectFromRoom", { roomId: id });
    navigate("/");
  };

  return (
    <Box
      flex={1}
      sx={{
        p: 3,
        maxWidth: 600,
        mx: "auto",
        textAlign: "center",
        bgcolor: theme === "light" ? "white" : "#121212", // Apply theme-based background
        color: theme === "light" ? "black" : "white", // Apply theme-based text color
        minHeight: "100vh", // Ensure full height
      }}
    >
      <Typography variant="h4" gutterBottom>{`Code Block ${codeBlock?.title}`}</Typography>
      <Typography variant="subtitle1">{`Role: ${role}`}</Typography>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>{`Students in room: ${studentsCount}`}</Typography>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          border: "2px solid black", 
          borderRadius: 2,
          bgcolor: theme === "light" ? "white" : "#1e1e1e", // Theme for editor background
          color: theme === "light" ? "black" : "white", // Theme for text color
        }}
      >
        <CodeMirror
          value={code}
          extensions={[javascript()]}
          onChange={(value) => handleCodeChange(null, null, value)}
          theme={theme === "light" ? "light" : "dark"} // Apply CodeMirror theme
          basicSetup={{ lineNumbers: true }}
          readOnly={role === "mentor"}
          style={{
            minHeight: "300px",
            minWidth: "500px",
            height: "auto",
            overflowY: "auto",
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

      {role === "mentor" ? (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            border: "2px solid black", 
            borderRadius: 2,
            bgcolor: theme === "light" ? "white" : "#1e1e1e", 
            color: theme === "light" ? "black" : "white", 
          }}
        >
          <Typography variant="subtitle1">This is for changing the solution!</Typography>

          <CodeMirror
            title="Solution"
            value={solution}
            extensions={[javascript()]}
            onChange={(value) => handleSolutionChange(null, null, value)}
            theme={theme === "light" ? "light" : "dark"} 
            basicSetup={{ lineNumbers: true }}
            style={{
              minHeight: "300px",
              minWidth: "500px",
              height: "auto",
              overflowY: "auto",
            }}
          />
        </Paper>
      ) : (
        <Chat socket={socket} roomId={id} />
      )}
    </Box>
  );
};

export default CodeBlockPage;
