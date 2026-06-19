require("dotenv").config();
const app = require("./app");
const { createSubmissionWorker } = require("./workers/submission.worker");

const PORT = process.env.PORT || 4000;

createSubmissionWorker();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
