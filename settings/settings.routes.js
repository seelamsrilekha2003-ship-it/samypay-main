const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
    getBanks, addBank,
    getNews, addNews,
    getBanners,
    getApis, addApi, updateApi, deleteApi,
    getGeneralSettings, updateGeneralSettings
} = require("./settings.controller");

// BANK
router.get("/bank", auth, getBanks);
router.post("/bank", auth, addBank);

// NEWS
router.get("/news", auth, getNews);
router.post("/news", auth, addNews);

// BANNERS
router.get("/banner", auth, getBanners);

// API
router.get("/api-settings", auth, getApis);
router.post("/api-settings", auth, addApi);
router.put("/api-settings/:id", auth, updateApi);
router.delete("/api-settings/:id", auth, deleteApi);

// PLANWISE API
router.get("/planwise-api", auth, require("./settings.controller").getPlanwiseApis);
router.post("/planwise-api", auth, require("./settings.controller").addPlanwiseApi);
router.delete("/planwise-api/:id", auth, require("./settings.controller").deletePlanwiseApi);

// MIGRATION
router.post("/migrate", auth, require("./settings.controller").runMigration);

// GENERAL SITE SETTINGS (SAMYPAY)
router.get("/general", auth, getGeneralSettings);
router.post("/general", auth, updateGeneralSettings);

module.exports = router;
