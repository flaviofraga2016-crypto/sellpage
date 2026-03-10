import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// pasta gerada pelo Vite
const distPath = path.join(process.cwd(), "dist/public");

// servir arquivos do frontend
app.use(express.static(distPath));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
