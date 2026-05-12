const express = require("express");
const router = express.Router();
const {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    toggleFeatured,
    togglePublished,
    deleteNews,
    getNewsStats
} = require("./news.controller");

router.get("/", getAllNews);
router.get("/stats", getNewsStats);
router.get("/:id", getNewsById);
router.post("/", createNews);
router.put("/:id", updateNews);
router.put("/:id/toggle-featured", toggleFeatured);
router.put("/:id/toggle-published", togglePublished);
router.delete("/:id", deleteNews);

module.exports = router;
