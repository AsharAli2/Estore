import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Paper,
  Slide,
  Fade,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { API_URL } from "../../../utils/constant";
import { optimizeImage } from "../../utils/image";
import { useLocation } from "react-router";

const ACCENT = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
const MAX_HISTORY = 10;
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const SUGGESTIONS = [
  "Best laptops for work",
  "Wireless headphones under $400",
  "Compare the latest phones",
  "Gift ideas under $100",
];

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: .35; }
  40% { transform: translateY(-4px); opacity: 1; }
`;

// ---------- helpers ----------

// Model replies are either JSON (optionally in a ```json fence) or plain text.
const parseReply = (raw) => {
  if (!raw) return null;
  const fence = raw.match(/```\s*json\s*([\s\S]*?)```/i);
  const candidate = (fence ? fence[1] : raw).trim();
  if (!candidate.startsWith("{")) return null;
  try {
    const obj = JSON.parse(candidate);
    return obj && typeof obj === "object" ? obj : null;
  } catch {
    return null;
  }
};

// Only allow http(s) URLs coming back from the model.
const safeUrl = (url) =>
  typeof url === "string" && /^https?:\/\//i.test(url) ? url : undefined;

const formatPrice = (price) => {
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n === 0) return String(price ?? "");
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
};

// Tiny, safe markdown-lite renderer: **bold**, "- " bullets, line breaks.
const renderInline = (text) =>
  String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    );

const RichText = ({ text }) => {
  const blocks = [];
  let bullets = [];
  const flush = () => {
    if (bullets.length) {
      blocks.push(
        <Box component="ul" key={`ul${blocks.length}`} sx={{ m: 0, my: 0.5, pl: 2.5 }}>
          {bullets.map((b, i) => (
            <li key={i}>{renderInline(b)}</li>
          ))}
        </Box>
      );
      bullets = [];
    }
  };
  String(text)
    .split("\n")
    .forEach((line, i) => {
      const m = line.match(/^\s*[-*•]\s+(.*)$/);
      if (m) return bullets.push(m[1]);
      flush();
      if (line.trim()) blocks.push(<p key={`p${i}`} style={{ margin: "0 0 8px" }}>{renderInline(line)}</p>);
    });
  flush();
  return <>{blocks}</>;
};

// ---------- small components ----------

const AssistantAvatar = () => (
  <Box
    sx={{
      width: 28,
      height: 28,
      flexShrink: 0,
      borderRadius: "50%",
      background: ACCENT,
      color: "#fff",
      display: "grid",
      placeItems: "center",
      mt: 0.25,
    }}
  >
    <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
  </Box>
);

const TypingDots = () => (
  <Box sx={{ display: "flex", gap: 0.6, py: 1.2, alignItems: "center" }} aria-label="Assistant is typing">
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          bgcolor: "#9aa0ae",
          animation: `${bounce} 1.2s infinite ease-in-out`,
          animationDelay: `${i * 0.16}s`,
        }}
      />
    ))}
  </Box>
);

const ProductCard = ({ product }) => {
  const link = safeUrl(product.link);
  const image = safeUrl(product.image);
  return (
    <Paper
      variant="outlined"
      sx={{
        width: 188,
        flexShrink: 0,
        scrollSnapAlign: "start",
        borderRadius: 2.5,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderColor: "#e6e8ee",
        transition: "box-shadow .2s, transform .2s",
        "&:hover": { boxShadow: "0 6px 18px rgba(20,24,40,.10)", transform: "translateY(-2px)" },
      }}
    >
      <Box sx={{ position: "relative", height: 120, flexShrink: 0, overflow: "hidden", bgcolor: "#f5f6f9" }}>
        {image && (
          <img
            src={optimizeImage(image, 360)}
            alt={product.name || "Product"}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              maxWidth: "none",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
      </Box>
      <Box sx={{ p: 1.25, display: "flex", flexDirection: "column", gap: 0.5, flexGrow: 1 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 13.5,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1a1d29" }}>
          {formatPrice(product.price)}
        </Typography>
        {product.reason && (
          <Typography
            sx={{
              fontSize: 12,
              color: "#5f6577",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.reason}
          </Typography>
        )}
        {link && (
          <Button
            component="a"
            href={link}
            target="_blank"
            rel="noreferrer noopener"
            size="small"
            endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 14 }} />}
            sx={{
              mt: "auto",
              pt: 0.5,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 12.5,
              justifyContent: "flex-start",
              px: 0,
              color: "#5b5fc7",
              "&:hover": { background: "transparent", textDecoration: "underline" },
            }}
          >
            View product
          </Button>
        )}
      </Box>
    </Paper>
  );
};

const AssistantMessage = ({ msg }) => {
  const data = msg.data;
  return (
    <Box sx={{ display: "flex", gap: 1.25, maxWidth: "100%" }}>
      <AssistantAvatar />
      <Box sx={{ minWidth: 0, flex: 1, fontSize: 14.5, lineHeight: 1.6, color: "#1f2330" }}>
        {data ? (
          <>
            {data.summary && <RichText text={data.summary} />}
            {Array.isArray(data.products) && data.products.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.25,
                  overflowX: "auto",
                  scrollSnapType: "x proximity",
                  py: 1,
                  mx: -0.5,
                  px: 0.5,
                  "&::-webkit-scrollbar": { height: 6 },
                  "&::-webkit-scrollbar-thumb": { background: "#d5d8e0", borderRadius: 3 },
                }}
              >
                {data.products.map((p, i) => (
                  <ProductCard key={p._id || p.link || i} product={p} />
                ))}
              </Box>
            )}
            {data.cta_message && (
              <Typography sx={{ fontSize: 13.5, color: "#5f6577", mt: 0.5 }}>
                {data.cta_message}
              </Typography>
            )}
          </>
        ) : (
          <RichText text={msg.text} />
        )}
      </Box>
    </Box>
  );
};

const UserMessage = ({ text }) => (
  <Box
    sx={{
      alignSelf: "flex-end",
      maxWidth: "82%",
      bgcolor: "#eef0f6",
      color: "#1f2330",
      px: 1.75,
      py: 1,
      borderRadius: "18px 18px 4px 18px",
      fontSize: 14.5,
      lineHeight: 1.5,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }}
  >
    {text}
  </Box>
);

// ---------- main component ----------

const HIDDEN_ROUTES = /^\/(admin|administrator|addproduct|login|signup)/i;
const HIDDEN_EDIT = /^\/product\/edit\//i;

const Chatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  // messages: { role: "user", text } | { role: "ai", raw, text, data, error? }
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 250);
  }, [isOpen]);

  // keep hooks above this early return
  if (HIDDEN_ROUTES.test(location.pathname) || HIDDEN_EDIT.test(location.pathname)) {
    return null;
  }

  const send = async (override) => {
    const text = (override ?? input).trim();
    if (!text || isTyping) return;

    // The server keeps no per-user state: send prior turns with every request.
    const history = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, text: m.role === "ai" ? m.raw || "" : m.text }))
      .filter((m) => m.text)
      .slice(-MAX_HISTORY);

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/VectorSearch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, history }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.message || "Request failed");

      const raw = json.data || "";
      const data = parseReply(raw);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          raw,
          data,
          text: raw || "Sorry, I couldn't come up with an answer. Please try again.",
        },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          error: true,
          text: "Something went wrong on my side. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const newChat = () => {
    setMessages([]);
    setInput("");
  };

  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 12, sm: 24 },
        bottom: { xs: 12, sm: 24 },
        zIndex: 1500,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1.5,
      }}
    >
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={0}
          sx={{
            width: { xs: "calc(100vw - 24px)", sm: 400 },
            height: { xs: "calc(100vh - 100px)", sm: "min(640px, calc(100vh - 120px))" },
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "#fff",
            fontFamily: FONT,
            border: "1px solid #e6e8ee",
            boxShadow: "0 24px 60px rgba(20,24,40,.18), 0 4px 14px rgba(20,24,40,.08)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              borderBottom: "1px solid #eef0f4",
              bgcolor: "#fff",
            }}
          >
            <AssistantAvatar />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                Estore Assistant
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#22c55e" }} />
                <Typography sx={{ fontSize: 12, color: "#6b7186" }}>Online</Typography>
              </Box>
            </Box>
            <Tooltip title="New chat">
              <span>
                <IconButton size="small" onClick={newChat} disabled={!messages.length} aria-label="New chat">
                  <AddCommentOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <IconButton size="small" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 2,
              py: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": { background: "#d5d8e0", borderRadius: 3 },
            }}
          >
            {messages.length === 0 ? (
              <Fade in>
                <Box
                  sx={{
                    m: "auto 0",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: ACCENT,
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <AutoAwesomeRoundedIcon />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 19 }}>
                    How can I help you shop?
                  </Typography>
                  <Typography sx={{ fontSize: 13.5, color: "#6b7186", maxWidth: 270 }}>
                    Ask me to find, compare or recommend products from our store.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 1,
                      mt: 1.5,
                    }}
                  >
                    {SUGGESTIONS.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        onClick={() => send(s)}
                        variant="outlined"
                        sx={{
                          borderColor: "#dfe2ea",
                          bgcolor: "#fff",
                          fontSize: 13,
                          "&:hover": { bgcolor: "#f5f6fb", borderColor: "#c9cde0" },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Fade>
            ) : (
              messages.map((m, i) => (
                <Fade in key={i} timeout={250}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {m.role === "user" ? (
                      <UserMessage text={m.text} />
                    ) : (
                      <AssistantMessage msg={m} />
                    )}
                  </Box>
                </Fade>
              ))
            )}

            {isTyping && (
              <Box sx={{ display: "flex", gap: 1.25 }}>
                <AssistantAvatar />
                <TypingDots />
              </Box>
            )}
            <div ref={endRef} />
          </Box>

          {/* Composer */}
          <Box sx={{ p: 1.5, pt: 0.5, bgcolor: "#fff" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 1,
                px: 1.75,
                py: 0.75,
                borderRadius: 4,
                border: "1px solid #dfe2ea",
                bgcolor: "#f8f9fc",
                transition: "border-color .15s, box-shadow .15s, background .15s",
                "&:focus-within": {
                  borderColor: "#8b93e8",
                  bgcolor: "#fff",
                  boxShadow: "0 0 0 3px rgba(102,126,234,.15)",
                },
              }}
            >
              <InputBase
                inputRef={inputRef}
                multiline
                maxRows={4}
                fullWidth
                placeholder="Message Estore Assistant…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                sx={{ fontSize: 14.5, py: 0.5 }}
                inputProps={{ "aria-label": "Message" }}
              />
              <IconButton
                onClick={() => send()}
                disabled={!canSend}
                aria-label="Send message"
                sx={{
                  width: 34,
                  height: 34,
                  mb: 0.25,
                  bgcolor: "#1a1d29",
                  color: "#fff",
                  "&:hover": { bgcolor: "#000" },
                  "&.Mui-disabled": { bgcolor: "#d9dce5", color: "#fff" },
                }}
              >
                <ArrowUpwardRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: 11, color: "#9aa0ae", textAlign: "center", mt: 0.75 }}>
              AI can make mistakes. Check product details before buying.
            </Typography>
          </Box>
        </Paper>
      </Slide>

      {/* Launcher */}
      <IconButton
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        sx={{
          width: 58,
          height: 58,
          background: ACCENT,
          color: "#fff",
          boxShadow: "0 8px 24px rgba(102,126,234,.45)",
          transition: "transform .2s, box-shadow .2s",
          "&:hover": { background: ACCENT, transform: "scale(1.06)" },
        }}
      >
        {isOpen ? <CloseRoundedIcon /> : <ChatBubbleRoundedIcon />}
      </IconButton>
    </Box>
  );
};

export default Chatbot;
