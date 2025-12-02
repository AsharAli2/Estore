import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Paper,
  Slide,
  CircularProgress,
  Fade,
  Divider,
  Chip,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
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
      text: `Hello! 👋 I'm your shopping assistant. How can I help you today?`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handlechat = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", text: trimmed };
    setChatHistory((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call VectorSearch endpoint on backend which returns LLM result in `data`
      const response = await fetch(`${API_URL}/VectorSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmed }),
      });

      const json = await response.json();
      // backend returns the LLM text in different keys in various places; try common ones
      const raw = json.data || json.AIresponse || json.AIresponseText || "";

      // Helper: extract JSON payload inside ```json ... ``` code fences, or parse plain JSON
      const extractJSONFromFence = (text) => {
        if (!text) return null;
        // find code fence
        const fenceMatch = text.match(/```\s*json\s*([\s\S]*?)```/i);
        const inner = fenceMatch ? fenceMatch[1] : text;
        try {
          return JSON.parse(inner.trim());
        } catch (e) {
          return null;
        }
      };

      const parsed = extractJSONFromFence(raw);

      let finalHtml = "";

      if (parsed && typeof parsed === "object") {
        // 1. Summary
        const summary = parsed.summary || "";
        finalHtml += `<div style="margin-bottom:12px; color:#333; font-size:0.95rem;"><strong>${DOMPurify.sanitize(
          summary
        )}</strong></div>`;

        // 2. Product list with name: reason (as bullet points)
        if (Array.isArray(parsed.products) && parsed.products.length) {
          finalHtml += `<div style="margin-bottom:12px;">`;
          parsed.products.forEach((p) => {
            const name = DOMPurify.sanitize(p.name || "");
            const reason = DOMPurify.sanitize(p.reason || "");
            finalHtml += `<div style="margin-bottom:6px; font-size:0.9rem; color:#333;"><strong>• ${name}:</strong> ${reason}</div>`;
          });
          finalHtml += `</div>`;
        }

        // 3. Scrollable product images in a row
        if (Array.isArray(parsed.products) && parsed.products.length) {
          finalHtml += `
            <div style="margin-bottom:12px; overflow-x:auto; padding:8px 0; display:flex; gap:12px; scroll-behavior:smooth;">
          `;
          parsed.products.forEach((p) => {
            const name = DOMPurify.sanitize(p.name || "");
            const image = DOMPurify.sanitize(p.image || "");
            const link = DOMPurify.sanitize(p.link || "#");

            finalHtml += `
              <a href="${link}" target="_blank" rel="noreferrer noopener" style="flex-shrink:0;">
                <img src="${image}" alt="${name}" title="${name}" style="width:100px; height:100px; object-fit:cover; border-radius:8px; cursor:pointer; transition:transform 0.2s; border:2px solid #f0f0f0;" />
              </a>
            `;
          });
          finalHtml += `</div>`;
        }

        // 4. CTA message
        if (parsed.cta_message) {
          finalHtml += `<div style="margin-top:8px; color:#555; font-size:0.85rem; font-style:italic;">${DOMPurify.sanitize(
            parsed.cta_message
          )}</div>`;
        }
      } else {
        // fallback: show raw text as sanitized HTML
        finalHtml = DOMPurify.sanitize(
          raw || "Sorry, I couldn't understand the response."
        );
      }

      // animate typing: push empty ai message then fill
      let currentText = "";
      const aiMessage = { role: "ai", text: "" };
      setChatHistory((prev) => [...prev, aiMessage]);

      // render HTML character by character (keeps existing UX)
      finalHtml.split("").forEach((char, index) => {
        setTimeout(() => {
          currentText += char;
          setChatHistory((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...aiMessage, text: currentText };
            return updated;
          });
        }, index * 4);
      });

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
      {/* Floating Action Button */}
      <IconButton
        onClick={toggleChatbot}
        sx={{
          backgroundColor: isOpen ? "#ef5350" : "#667eea",
          color: "#fff",
          width: 56,
          height: 56,
          "&:hover": {
            backgroundColor: isOpen ? "#e53935" : "#5568d3",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </IconButton>

      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={10}
          sx={{
            mt: 1,
            width: { xs: 320, sm: 380 },
            height: 520,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 5px 40px rgba(0, 0, 0, 0.16)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SmartToyIcon />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                Estore Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Always here to help
              </Typography>
            </Box>
          </Box>

          {/* Messages Container */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              backgroundColor: "#fafafa",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#ccc",
                borderRadius: "3px",
              },
            }}
          >
            {chatHistory.map((msg, index) => (
              <Fade in key={index}>
                <Box
                  sx={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      px: 2,
                      borderRadius: 2.5,
                      backgroundColor:
                        msg.role === "user" ? "#667eea" : "#ffffff",
                      color: msg.role === "user" ? "#fff" : "#000",
                      boxShadow:
                        msg.role === "user"
                          ? "0 2px 8px rgba(102, 126, 234, 0.2)"
                          : "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(msg.text),
                      }}
                    />
                  </Paper>
                </Box>
              </Fade>
            ))}

            {isTyping && (
              <Fade in>
                <Box sx={{ alignSelf: "flex-start" }}>
                  <Paper
                    sx={{
                      p: 1.5,
                      px: 2,
                      borderRadius: 2.5,
                      backgroundColor: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <CircularProgress size={16} thickness={4} />
                    <Typography variant="caption" color="text.secondary">
                      Typing...
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Input Area */}
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
              backgroundColor: "#fff",
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
              multiline
              maxRows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: "0.9rem",
                },
              }}
            />
            <IconButton
              color="primary"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6a3f99 100%)",
                },
                "&:disabled": {
                  background: "rgba(0, 0, 0, 0.12)",
                },
              }}
              onClick={handlechat}
              disabled={isTyping || !inputValue.trim()}
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
