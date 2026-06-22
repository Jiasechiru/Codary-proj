import { Suspense, lazy } from "react";
import type { CodeEditorProps } from "./types";
import styles from "./CodeEditor.module.css";

const CodeEditorImpl = lazy(() => import("./CodeEditorImpl"));

const CodeEditor = (props: CodeEditorProps) => {
    const height = props.height ?? "20rem";

    return (
        <div className={styles.wrapper}>
            <Suspense fallback={<div className={styles.fallback} style={{ height }} />}>
                <CodeEditorImpl {...props} />
            </Suspense>
        </div>
    );
};

export default CodeEditor;
export { detectLanguage } from "./types";
export type { CodeEditorLanguage, CodeEditorProps } from "./types";
