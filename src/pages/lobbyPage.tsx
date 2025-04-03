import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Typography, List, ListItem, Button, Paper } from '@mui/material';
import * as codeService from '../services/code-service';
const LobbyPage: React.FC = () => {
const navigate = useNavigate();
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
  },[])

  const handleNavigate = (id: string) => {
    navigate(`/code-block/${id}`);
  };
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Choose Code Block
      </Typography>
      
      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {codeBlocks.length > 0 && codeBlocks.map((block) => (
            <ListItem key={block._id}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
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
