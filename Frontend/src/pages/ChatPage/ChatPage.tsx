import { useEffect, useState } from "react";
import Breaks from "../../assets/Icons/breaks.svg?react"
import Light from "../../assets/Icons/light.svg?react"
import Book from "../../assets/Icons/book.svg?react"
import Help from "../../assets/Icons/help.svg?react"
import Aistar from "../../assets/Icons/aistar.svg?react"
import Reset from "../../assets/Icons/reset.svg?react"
import Plain from "../../assets/Icons/plain.svg?react"
import { getGlobalChatHistory, sendGlobalMessage } from "../../services/ai";
import styles from "./ChatPage.module.css";

const initialMessage = {
  role: "assistant",
  content: "Hi! I'm your AI coding mentor. I can help you with programming concepts, debugging, code reviews, and answering questions. How can I assist you today?",
};

const ChatPage = () => {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getGlobalChatHistory();
        if (history.length > 0) {
          setMessages(history.map((item) => ({ role: item.role, content: item.message })));
        }
      } catch (_error) {
        // Keep local initial message when history fails.
      }
    };

    loadHistory();
  }, []);

  const handleResetContext = () => {
    setMessages([initialMessage]);
    setInput("");
  };

  const sendMessage = async (rawMessage: string) => {
    const userMessage = rawMessage.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await sendGlobalMessage(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: response.response }]);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to get AI response. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    await sendMessage(input);
  };

  const quickPrompts = [
    {
      icon: Breaks,
      label: "Explain a concept",
      prompt: "Can you explain how JavaScript closures work?",
    },
    {
      icon: Light,
      label: "Debug my code",
      prompt: "I'm getting an error in my code. Can you help me debug it?",
    },
    {
      icon: Book,
      label: "Learn best practices",
      prompt: "What are the best practices for writing React components?",
    },
    {
      icon: Help,
      label: "Ask anything",
      prompt: "How do I get started with TypeScript?",
    },
  ];

  const handleQuickPrompt = async (prompt: string) => {
    if (isSending) return;
    await sendMessage(prompt);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.titleWrap}>
            <div className={styles.titleIconWrap}>
              <Aistar className={styles.titleIcon} />
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
            <Reset className={styles.smallIcon} />
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
                          <Icon className={styles.smallIcon} />
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
                    <Aistar className={styles.smallIcon} />
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
              disabled={!input.trim() || isSending}
              className={styles.sendButton}
            >
              <Plain className={styles.smallIcon} />
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