import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Typography, List, ListItem, Button, Paper } from '@mui/material';
import { useTheme } from "../context/ThemeContex"; // Import theme hook
import * as codeService from '../services/code-service';

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get the current theme
  const [codeBlocks, setCodeBlocks] = useState<codeService.CodeBlock[]>([]);

  const fetchCodeBlocks = async () => {
    try {
      const { request } = codeService.getAllCodeBlocks();
      const response = await request;
      setCodeBlocks(response.data);
    } catch (error) {
      console.error("Error fetching code blocks:", error);
    }
  };

  useEffect(() => {
    fetchCodeBlocks();
  }, []);

  const handleNavigate = (id: string) => {
    navigate(`/code-block/${id}`);
  };

  return (
    <Container
      sx={{
        bgcolor: theme === "light" ? "white" : "#121212",
        color: theme === "light" ? "black" : "white",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Choose Code Block
      </Typography>

      <Paper
        elevation={3}
        sx={{
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          bgcolor: theme === "light" ? "white" : "#1e1e1e",
          color: theme === "light" ? "black" : "white",
          textAlign: "center",
        }}
      >
        <List sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {codeBlocks.length > 0 &&
            codeBlocks.map((block) => (
              <ListItem key={block._id} sx={{ justifyContent: "center", width: "100%" }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: theme === "light" ? "primary.main" : "grey.800",
                    maxWidth: "300px",
                    color: "white",
                    "&:hover": {
                      bgcolor: theme === "light" ? "primary.dark" : "grey.700",
                    },
                  }}
                  onClick={() => handleNavigate(block._id)}
                >
                  {block.title}
                </Button>
              </ListItem>
            ))}
        </List>
      </Paper>
    </Container>
  );
};

export default LobbyPage;
