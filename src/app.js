const express = require("express");
const cors = require("cors");
const { auditUrl } = require("./services/auditService");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "Page Pulse API is running",
  });
});

app.post("/audit", async (req, res) => {
  try {
    const report = await auditUrl(req.body.url);
    res.json(report);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: {
        code: error.code || "SERVER_ERROR",
        message: error.message || "Something went wrong",
      },
    });
  }
});

module.exports = { app };