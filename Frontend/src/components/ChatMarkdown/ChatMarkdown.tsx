import Markdown from "react-markdown";
import styles from "./ChatMarkdown.module.css";

type ChatMarkdownProps = {
  content: string;
  className?: string;
};

const ChatMarkdown = ({ content, className }: ChatMarkdownProps) => {
  const rootClassName = className ? `${styles.markdown} ${className}` : styles.markdown;

  return (
    <div className={rootClassName}>
      <Markdown>{content}</Markdown>
    </div>
  );
};

export default ChatMarkdown;
