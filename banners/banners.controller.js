const bannersService = require("./banners.service");

exports.getAllBanners = async (req, res) => {
    try {
        const filters = {
            position: req.query.position,
            is_active: req.query.is_active !== undefined ? parseInt(req.query.is_active) : undefined,
            search: req.query.search
        };

        const banners = await bannersService.getAllBanners(filters);

        res.json({
            success: true,
            data: banners,
            count: banners.length
        });
    } catch (err) {
        console.error("Error in getAllBanners:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch banners",
            error: err.message
        });
    }
};

exports.getBannerById = async (req, res) => {
    try {
        const banner = await bannersService.getBannerById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        res.json({
            success: true,
            data: banner
        });
    } catch (err) {
        console.error("Error in getBannerById:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch banner",
            error: err.message
        });
    }
};

exports.createBanner = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            description: req.body.description,
            image_url: req.body.image_url,
            link_url: req.body.link_url,
            position: req.body.position,
            display_order: req.body.display_order,
            is_active: req.body.is_active,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            created_by: req.user ? req.user.id : null
        };

        if (!data.title || !data.image_url) {
            return res.status(400).json({
                success: false,
                message: "Title and image URL are required"
            });
        }

        const newBanner = await bannersService.createBanner(data);

        res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: newBanner
        });
    } catch (err) {
        console.error("Error in createBanner:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create banner",
            error: err.message
        });
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            description: req.body.description,
            image_url: req.body.image_url,
            link_url: req.body.link_url,
            position: req.body.position,
            display_order: req.body.display_order,
            is_active: req.body.is_active,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        };

        await bannersService.updateBanner(req.params.id, data);

        res.json({
            success: true,
            message: "Banner updated successfully"
        });
    } catch (err) {
        console.error("Error in updateBanner:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update banner",
            error: err.message
        });
    }
};

exports.toggleBannerStatus = async (req, res) => {
    try {
        await bannersService.toggleBannerStatus(req.params.id);

        res.json({
            success: true,
            message: "Banner status toggled successfully"
        });
    } catch (err) {
        console.error("Error in toggleBannerStatus:", err);
        res.status(500).json({
            success: false,
            message: "Failed to toggle banner status",
            error: err.message
        });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        await bannersService.deleteBanner(req.params.id);

        res.json({
            success: true,
            message: "Banner deleted successfully"
        });
    } catch (err) {
        console.error("Error in deleteBanner:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete banner",
            error: err.message
        });
    }
};

exports.getBannerStats = async (req, res) => {
    try {
        const stats = await bannersService.getBannerStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getBannerStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: err.message
        });
    }
};
