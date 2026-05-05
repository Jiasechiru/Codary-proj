import { useState } from "react";
import breaks from "../../assets/Icons/breaks.svg"
import light from "../../assets/Icons/light.svg"
import book from "../../assets/Icons/book.svg"
import help from "../../assets/Icons/help.svg"
import aistar from "../../assets/Icons/aistar.svg"
import reset from "../../assets/Icons/reset.svg"
import plain from "../../assets/Icons/plain.svg"
import styles from "./ChatPage.module.css";

const initialMessage = {
  role: "assistant",
  content: "Hi! I'm your AI coding mentor. I can help you with programming concepts, debugging, code reviews, and answering questions. How can I assist you today?",
};

const ChatPage = () => {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");

  const handleResetContext = () => {
    setMessages([initialMessage]);
    setInput("");
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([
      ...messages,
      { role: "user", content: userMessage },
      {
        role: "assistant",
        content: "That's a great question! Let me help you with that. I can explain concepts, provide examples, or guide you through solutions step by step.",
      },
    ]);
    setInput("");
  };

  const quickPrompts = [
    {
      icon: breaks,
      label: "Explain a concept",
      prompt: "Can you explain how JavaScript closures work?",
    },
    {
      icon: light,
      label: "Debug my code",
      prompt: "I'm getting an error in my code. Can you help me debug it?",
    },
    {
      icon: book,
      label: "Learn best practices",
      prompt: "What are the best practices for writing React components?",
    },
    {
      icon: help,
      label: "Ask anything",
      prompt: "How do I get started with TypeScript?",
    },
  ];

  const handleQuickPrompt = (prompt: string) => {
    setMessages([
      ...messages,
      { role: "user", content: prompt },
      {
        role: "assistant",
        content: "Great question! Let me break this down for you with clear examples and explanations...",
      },
    ]);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.titleWrap}>
            <div className={styles.titleIconWrap}>
              <img src={aistar} className={styles.titleIcon} />
            </div>
            <div>
              <h1 className={styles.title}>AI Chat Assistant</h1>
              <p className={styles.subtitle}>Get help with your programming questions anytime</p>
            </div>
          </div>
          <button
            onClick={handleResetContext}
            className={styles.resetButton}
          >
            <img src={reset} className={styles.smallIcon} />
            Reset Chat
          </button>
        </div>
      </div>

      <div className={styles.chatCard}>
        <div className={styles.messagesArea}>
          {messages.length === 1 && (
            <div className={styles.promptsSection}>
              <p className={styles.helperText}>Try asking me about:</p>
              <div className={styles.promptsGrid}>
                {quickPrompts.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuickPrompt(item.prompt)}
                      className={styles.promptButton}
                    >
                      <div className={styles.promptRow}>
                        <div className={styles.promptIconWrap}>
                          <img src={Icon} className={styles.smallIcon} />
                        </div>
                        <div>
                          <p className={styles.promptTitle}>{item.label}</p>
                          <p className={styles.promptText}>{item.prompt}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.messageRow} ${msg.role === "user" ? styles.messageRight : styles.messageLeft}`}
            >
              <div
                className={`${styles.bubble} ${msg.role === "user" ? styles.userBubble : styles.assistantBubble}`}
              >
                {msg.role === "assistant" && (
                  <div className={styles.bubbleHeader}>
                    <img src={aistar} className={styles.smallIcon} />
                    <span className={styles.bubbleLabel}>AI Assistant</span>
                  </div>
                )}
                <p className={styles.bubbleText}>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.inputRow}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me anything about programming..."
              className={styles.input}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className={styles.sendButton}
            >
              <img src={plain} className={styles.smallIcon} />
              <span>Send</span>
            </button>
          </div>
          <p className={styles.disclaimer}>
            AI responses are generated to assist your learning. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;