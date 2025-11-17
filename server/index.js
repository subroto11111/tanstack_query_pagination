// index.js (ESM) - corrected nextCursor logic
import express from "express";
import cors from "cors";
import students from "./studentsData.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/students", (req, res) => {
  const cursor = Number(req.query.cursor) || 0;
  const limit = Math.min(Number(req.query.limit) || 20, 50);

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

  // Determine nextCursor correctly — only set it if there *is* another item after this page
  let nextCursor = null;
  if (pageData.length > 0) {
    const lastIndex = startIndex + pageData.length - 1;
    if (lastIndex < students.length - 1) {
      // there are still items after this page
      nextCursor = students[lastIndex].id;
    } else {
      // this page includes the final items, no next cursor
      nextCursor = null;
    }
  } else {
    // no items returned (e.g., client asked after end) -> nextCursor null
    nextCursor = null;
  }

  const hasMore = nextCursor !== null;

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
