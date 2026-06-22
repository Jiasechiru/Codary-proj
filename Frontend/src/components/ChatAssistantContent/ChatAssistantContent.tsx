import Aistar from "../../assets/Icons/aistar.svg?react";
import { useDebouncedStreamingContent } from "../../hooks/useDebouncedStreamingContent";
import ChatMarkdown from "../ChatMarkdown/ChatMarkdown";
import styles from "./ChatAssistantContent.module.css";

type ChatAssistantContentProps = {
  content: string;
  isStreaming?: boolean;
  showHeader?: boolean;
  headerLabel?: string;
  textClassName?: string;
};

const ChatAssistantContent = ({
  content,
  isStreaming = false,
  showHeader = false,
  headerLabel,
  textClassName,
}: ChatAssistantContentProps) => {
  const displayContent = useDebouncedStreamingContent(content, isStreaming);

  return (
    <>
      {showHeader ? (
        <div className={styles.header}>
          <Aistar className={styles.headerIcon} />
          <span className={styles.headerLabel}>{headerLabel}</span>
        </div>
      ) : null}
      <div className={styles.body}>
        <ChatMarkdown content={displayContent} className={textClassName} />
        {isStreaming ? <span className={styles.cursor} aria-hidden="true" /> : null}
      </div>
    </>
  );
};

export default ChatAssistantContent;
