export type CodeEditorLanguage = "javascript" | "c";

export type CodeEditorProps = {
    value: string;
    onChange: (value: string) => void;
    language: CodeEditorLanguage;
    readOnly?: boolean;
    height?: string;
};

// Mirrors the backend heuristic in taskRunner.service.js: presence of an
// #include directive means C, otherwise JavaScript.
export function detectLanguage(starterCode: string): CodeEditorLanguage {
    return /#include\s*[<"]/.test(starterCode) ? "c" : "javascript";
}
