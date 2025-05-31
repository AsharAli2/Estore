import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Paper,
  Slide,
  CircularProgress,
  Fade,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { API_URL } from "../../../utils/constant";
import DOMPurify from "dompurify";
import { useLocation } from "react-router";

const Chatbot = () => {
  const location = useLocation();
  if (
    location.pathname === "/Admin/Dashboard" ||
    location.pathname === "/Administrator" ||
    location.pathname === "/Admin/Users" ||
    location.pathname === "/Admin/Products" ||
    location.pathname === "/addproduct" ||
    location.pathname === "/Product/edit/:id" ||
    location.pathname === "/Login" ||
    location.pathname === "/Signup"
  ) {
    return null;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "ai",
      text: `Hello! 👋 How can we help you with your tech accessories today?
    <br /><br />
    Here are some things you can ask:
    <ul>
      <li>🛍️ Show me the latest wireless earbuds</li>
      <li>🔍 Compare iPhone 13 and Samsung S22</li>
      <li>📈 What are the best-rated gaming keyboards?</li>
      <li>💡 Suggest a laptop under ₹50,000</li>
    </ul>`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handlechat = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", text: trimmed };
    setChatHistory((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/mcp/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await response.json();
      const aiText = data.AIresponse;

      let currentText = "";
      const aiMessage = { role: "ai", text: "" };

      // Add empty AI message first
      setChatHistory((prev) => [...prev, aiMessage]);

      // Type character by character
      aiText.split("").forEach((char, index) => {
        setTimeout(() => {
          currentText += char;
          setChatHistory((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...aiMessage, text: currentText };
            return updated;
          });
        }, index * 10); // 30ms per character
      });

      // Stop typing animation after full message is shown
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Oops! Something went wrong. Please try again later.",
        },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1500,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <IconButton
        onClick={toggleChatbot}
        sx={{
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": { backgroundColor: "#1565c0" },
          boxShadow: 4,
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </IconButton>

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            mt: 1,
            width: 320,
            height: 480,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2, bgcolor: "#1976d2", color: "#fff" }}>
            <Typography variant="h6">Chat Support</Typography>
            <Typography variant="body2">Ask us anything!</Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              bgcolor: "#f5f5f5",
            }}
          >
            {chatHistory.map((msg, index) => (
              <Fade in key={index}>
                <Box
                  sx={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    bgcolor: msg.role === "user" ? "#e3f2fd" : "#fff",
                    p: 1.2,
                    px: 2,
                    borderRadius: 3,
                    maxWidth: "80%",
                    boxShadow: 1,
                  }}
                >
                  {/* <Typography variant="body2">{msg.text}</Typography> */}
                  <Typography
                    variant="body2"
                    component="div"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(msg.text),
                    }}
                  />
                </Box>
              </Fade>
            ))}

            {isTyping && (
              <Fade in>
                <Box
                  sx={{
                    alignSelf: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "#fff",
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    boxShadow: 1,
                    maxWidth: "80%",
                    fontStyle: "italic",
                  }}
                >
                  <CircularProgress size={16} thickness={4} />
                  <Typography variant="body2">AI is typing...</Typography>
                </Box>
              </Fade>
            )}
          </Box>

          <Box
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid #eee",
            }}
          >
            <TextField
              size="small"
              placeholder="Type a message..."
              variant="outlined"
              fullWidth
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlechat()}
              disabled={isTyping}
            />
            <IconButton
              color="primary"
              sx={{ ml: 1 }}
              onClick={handlechat}
              disabled={isTyping}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default Chatbot;
