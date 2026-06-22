import { useEffect, useRef, useState } from "react";
import Breaks from "../../assets/Icons/breaks.svg?react"
import Light from "../../assets/Icons/light.svg?react"
import Book from "../../assets/Icons/book.svg?react"
import Help from "../../assets/Icons/help.svg?react"
import Aistar from "../../assets/Icons/aistar.svg?react"
import Reset from "../../assets/Icons/reset.svg?react"
import Plain from "../../assets/Icons/plain.svg?react"
import {
  appendStreamingDelta,
  finalizeStreamingMessage,
  getGlobalChatHistory,
  replaceStreamingWithError,
  resetGlobalChatContext,
  streamGlobalMessage,
  type ChatMessage,
} from "../../services/ai";
import ChatAssistantContent from "../../components/ChatAssistantContent/ChatAssistantContent";
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./ChatPage.module.css";

const ChatPage = () => {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessage: ChatMessage = {
    role: "assistant",
    content: t("chat.greeting"),
  };
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getGlobalChatHistory();
        if (history.length > 0) {
          setMessages(
            history.map((item) => ({
              id: item.id,
              role: item.role,
              content: item.message,
            }))
          );
          setHasHistory(true);
        }
      } catch (_error) {
        // Keep local initial message when history fails.
      }
    };

    loadHistory();
  }, []);

  const showPrompts =
    !hasHistory &&
    messages.length === 1 &&
    messages[0].role === "assistant" &&
    !isSending;

  const handleResetContext = async () => {
    if (isResetting || isSending) return;

    setIsResetting(true);
    try {
      const result = await resetGlobalChatContext();
      setMessages((prev) => [
        ...prev,
        {
          id: result.message.id,
          role: "system",
          content: result.message.message,
        },
      ]);
      setHasHistory(true);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: t("chat.failed") },
      ]);
    } finally {
      setIsResetting(false);
    }
  };

  const sendMessage = async (rawMessage: string) => {
    const userMessage = rawMessage.trim();
    if (!userMessage || isSending) return;

    setInput("");
    setIsSending(true);
    setHasHistory(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "", isStreaming: true },
    ]);

    try {
      await streamGlobalMessage(userMessage, {
        onDelta: (delta) => {
          setMessages((prev) => appendStreamingDelta(prev, delta));
        },
        onDone: (message) => {
          setMessages((prev) => finalizeStreamingMessage(prev, message));
          setIsSending(false);
        },
        onError: (message) => {
          const content =
            message.toLowerCase().includes("disabled") ? t("chat.aiDisabled") : t("chat.failed");
          setMessages((prev) => replaceStreamingWithError(prev, content));
          setIsSending(false);
        },
      });
    } catch (_error) {
      setMessages((prev) => replaceStreamingWithError(prev, t("chat.failed")));
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    await sendMessage(input);
  };

  const quickPrompts = [
    {
      icon: Breaks,
      label: t("chat.prompt1Label"),
      prompt: t("chat.prompt1Text"),
    },
    {
      icon: Light,
      label: t("chat.prompt2Label"),
      prompt: t("chat.prompt2Text"),
    },
    {
      icon: Book,
      label: t("chat.prompt3Label"),
      prompt: t("chat.prompt3Text"),
    },
    {
      icon: Help,
      label: t("chat.prompt4Label"),
      prompt: t("chat.prompt4Text"),
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
              <h1 className={styles.title}>{t("chat.title")}</h1>
              <p className={styles.subtitle}>{t("chat.subtitle")}</p>
            </div>
          </div>
          <button
            onClick={handleResetContext}
            disabled={isResetting || isSending}
            className={styles.resetButton}
            title={t("chat.reset")}
          >
            <Reset className={styles.smallIcon} />
            {isResetting ? t("chat.resetting") : t("chat.reset")}
          </button>
        </div>
      </div>

      <div className={styles.chatCard}>
        <div className={styles.messagesArea}>
          {showPrompts && (
            <div className={styles.promptsSection}>
              <p className={styles.helperText}>{t("chat.tryAsking")}</p>
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

          {messages.map((msg, idx) => {
            if (msg.role === "system") {
              return (
                <div key={msg.id ?? idx} className={`${styles.messageRow} ${styles.messageCenter}`}>
                  <span className={styles.systemNotice}>{msg.content}</span>
                </div>
              );
            }

            return (
              <div
                key={msg.id ?? idx}
                className={`${styles.messageRow} ${msg.role === "user" ? styles.messageRight : styles.messageLeft}`}
              >
                <div
                  className={`${styles.bubble} ${msg.role === "user" ? styles.userBubble : styles.assistantBubble}`}
                >
                  {msg.role === "assistant" ? (
                    <ChatAssistantContent
                      content={msg.content}
                      isStreaming={msg.isStreaming}
                      showHeader
                      headerLabel={t("chat.assistantLabel")}
                      textClassName={styles.bubbleText}
                    />
                  ) : (
                    <p className={styles.bubbleText}>{msg.content}</p>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        <div className={styles.footer}>
          <div className={styles.inputRow}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={t("chat.inputPlaceholder")}
              className={styles.input}
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isSending}
              className={styles.sendButton}
            >
              <Plain className={styles.smallIcon} />
              <span>{t("chat.send")}</span>
            </button>
          </div>
          <p className={styles.disclaimer}>
            {t("chat.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
