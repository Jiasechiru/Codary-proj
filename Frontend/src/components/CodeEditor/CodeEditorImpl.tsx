import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import type { CodeEditorProps } from "./types";

function useIsDark() {
    const [isDark, setIsDark] = useState(
        () => document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const root = document.documentElement;
        const observer = new MutationObserver(() => {
            setIsDark(root.classList.contains("dark"));
        });
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

const fontTheme = EditorView.theme({
    "&": { fontSize: "0.875rem" },
    ".cm-content": {
        fontFamily: '"JetBrains Mono", "Courier New", monospace',
    },
    ".cm-gutters": {
        fontFamily: '"JetBrains Mono", "Courier New", monospace',
    },
    "&.cm-focused": { outline: "none" },
});

const CodeEditorImpl = ({
    value,
    onChange,
    language,
    readOnly = false,
    height = "20rem",
}: CodeEditorProps) => {
    const isDark = useIsDark();
    const languageExtension = language === "c" ? cpp() : javascript();

    return (
        <CodeMirror
            value={value}
            height={height}
            readOnly={readOnly}
            theme={isDark ? oneDark : "light"}
            extensions={[languageExtension, EditorView.lineWrapping, fontTheme]}
            onChange={onChange}
            basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: false,
                indentOnInput: true,
                tabSize: 2,
            }}
        />
    );
};

export default CodeEditorImpl;
