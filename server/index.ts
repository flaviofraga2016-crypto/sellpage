import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(process.cwd(), "dist/public");

app.use(express.static(distPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
