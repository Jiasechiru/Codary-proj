function buildContextMessages(dbMessages) {
  return dbMessages
    .filter((item) => item.role === "user" || item.role === "assistant")
    .map((item) => ({
      role: item.role,
      content: item.message,
    }));
}

async function loadRecentChatMessages(prismaMessageModel, chatId, options = {}) {
  const { contextAfterMessageId = null, windowSize = 10 } = options;
  const afterId = contextAfterMessageId ?? 0;

  const rows = await prismaMessageModel.findMany({
    where: {
      chatId,
      id: { gt: afterId },
      role: { in: ["user", "assistant"] },
    },
    orderBy: { createdAt: "asc" },
  });

  return buildContextMessages(rows.slice(-windowSize));
}

module.exports = {
  buildContextMessages,
  loadRecentChatMessages,
};
