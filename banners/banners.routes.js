const express = require("express");
const router = express.Router();
const {
    getAllBanners,
    getBannerById,
    createBanner,
    updateBanner,
    toggleBannerStatus,
    deleteBanner,
    getBannerStats
} = require("./banners.controller");

router.get("/", getAllBanners);
router.get("/stats", getBannerStats);
router.get("/:id", getBannerById);
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.put("/:id/toggle", toggleBannerStatus);
router.delete("/:id", deleteBanner);

module.exports = router;
