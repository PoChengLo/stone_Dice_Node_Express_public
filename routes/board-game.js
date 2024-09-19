import express from "express";
const router = express.Router();

// 路由處理器
router.get("/", (req, res) => {
  res.json({
    params: req.params,
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
  });
});

export default router;
