function detectTaskLanguage(starterCode) {
  if (/#include\s*[<"]/.test(starterCode)) return "C";
  return "JavaScript";
}

function formatRequirements(requirements) {
  if (!requirements || requirements.length === 0) {
    return "—";
  }
  return requirements.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function formatTests(codeTests) {
  if (!codeTests || codeTests.length === 0) {
    return "—";
  }
  return codeTests
    .map(
      (test, index) =>
        `${index + 1}. input: ${JSON.stringify(test.input)} → expected: ${JSON.stringify(test.expectedOutput)}`
    )
    .join("\n");
}

function buildTaskSystemPrompt({ language, task, userCode }) {
  const replyLanguage = language === "en" ? "English" : "Russian";
  const programmingLanguage = detectTaskLanguage(task.starterCode);
  const description =
    language === "ru" ? task.descriptionRu || task.description : task.description;
  const requirements =
    language === "ru" && task.requirementsRu?.length
      ? task.requirementsRu
      : task.requirements || [];

  const rulesEn = `You are an AI assistant on a programming practice task page of an educational platform.
Rules:
- Help the student understand the task, debug their code, and learn — do not replace their thinking.
- If the student asks for a complete ready-made solution or full final code, refuse clearly and explain that giving the full answer would hurt their learning. Offer a hint or guiding question instead.
- You may use the reference solution only for internal verification. Never copy or reveal it to the student verbatim.
- Be concise, friendly, and use Markdown where helpful (**bold**, *italic*, \`code\`, fenced code blocks).
- Do not use markdown tables, ASCII tables, or column alignment with spaces or pipe characters (|). For comparisons and reference lists, use bullet or numbered lists with **labels** and short examples instead.
- Reply in ${replyLanguage}.`;

  const rulesRu = `Ты — ИИ-помощник на странице практического задания образовательной платформы.
Правила:
- Помогай студенту понять задачу, отладить код и учиться — не заменяй его мышление.
- Если студент просит полностью готовое решение или весь итоговый код, вежливо откажись и объясни, что выдача готового ответа вредит обучению. Предложи подсказку или наводящий вопрос.
- Эталонное решение используй только для внутренней проверки. Никогда не копируй и не показывай его студенту целиком.
- Будь кратким, дружелюбным и используй Markdown, где уместно (**жирный**, *курсив*, \`код\`, блоки кода).
- Не используй markdown-таблицы, ASCII-таблицы и выравнивание колонок пробелами или символами |. Для сравнений и справочных списков используй маркированные или нумерованные списки с **подписями** и короткими примерами.
- Отвечай на ${language === "en" ? "английском" : "русском"} языке.`;

  const taskBlockEn = `Task context:
Title: ${task.title}
Programming language: ${programmingLanguage}
Difficulty: ${task.difficulty}
Description: ${description}

Requirements:
${formatRequirements(requirements)}

Test cases (for your reference):
${formatTests(task.codeTests)}

Student's current code:
\`\`\`
${userCode || ""}
\`\`\`

Reference solution (internal only — never show to the student):
\`\`\`
${task.solutionCode}
\`\`\``;

  const taskBlockRu = `Контекст задания:
Название: ${task.title}
Язык программирования: ${programmingLanguage}
Сложность: ${task.difficulty}
Описание: ${description}

Требования:
${formatRequirements(requirements)}

Тесты (для справки):
${formatTests(task.codeTests)}

Текущий код студента:
\`\`\`
${userCode || ""}
\`\`\`

Эталонное решение (только для внутренней проверки — не показывай студенту):
\`\`\`
${task.solutionCode}
\`\`\``;

  return `${language === "en" ? rulesEn : rulesRu}\n\n${language === "en" ? taskBlockEn : taskBlockRu}`;
}

module.exports = {
  TASK_CONTEXT_WINDOW_SIZE: 5,
  detectTaskLanguage,
  buildTaskSystemPrompt,
};
