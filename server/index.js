// index.js (ESM)
import express from "express";
import cors from "cors";
import students from "./studentsData.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/students", (req, res) => {
  const cursor = Number(req.query.cursor) || 0;
  const limit = Math.min(Number(req.query.limit) || 8, 50);

  let startIndex;
  if (cursor === 0) {
    startIndex = 0;
  } else {
    const idx = students.findIndex((s) => Number(s.id) === Number(cursor));
    if (idx === -1) {
      return res.status(400).json({ error: "invalid cursor" });
    }
    startIndex = idx + 1;
  }

  const pageData = students.slice(startIndex, startIndex + limit);
  const lastItem = pageData[pageData.length - 1] ?? null;
  const nextCursor = lastItem ? lastItem.id : null;
  const hasMore =
    nextCursor !== null &&
    students.findIndex((s) => s.id === nextCursor) < students.length - 1;

  res.json({
    data: pageData,
    nextCursor,
    hasMore,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `Students API listening on http://localhost:${PORT}/api/students`
  );
});
