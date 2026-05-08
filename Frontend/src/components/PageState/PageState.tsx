import styles from "./PageState.module.css";

type PageStateProps = {
  kind: "loading" | "error" | "empty";
  title: string;
  description?: string;
};

const PageState = ({ kind, title, description }: PageStateProps) => {
  return (
    <div className={`${styles.wrap} ${kind === "error" ? styles.error : ""}`}>
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
};

export default PageState;
