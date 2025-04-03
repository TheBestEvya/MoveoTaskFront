import { useTheme } from "../context/ThemeContex";
import { Box, IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme === "light" ? "white" : "#121212",
        color: theme === "light" ? "black" : "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Theme Toggle Button Fixed at Top-Left */}
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 1000, // Ensure it's above all components
          backgroundColor: theme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(18, 18, 18, 0.8)",
          borderRadius: "50%",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        {theme === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>

      {/* Page Content */}
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
};

export default Layout;
