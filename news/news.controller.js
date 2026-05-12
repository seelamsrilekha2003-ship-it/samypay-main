const newsService = require("./news.service");

exports.getAllNews = async (req, res) => {
    try {
        const filters = {
            category: req.query.category,
            is_featured: req.query.is_featured !== undefined ? parseInt(req.query.is_featured) : undefined,
            is_published: req.query.is_published !== undefined ? parseInt(req.query.is_published) : undefined,
            search: req.query.search,
            limit: req.query.limit ? parseInt(req.query.limit) : null
        };

        const news = await newsService.getAllNews(filters);

        res.json({
            success: true,
            data: news,
            count: news.length
        });
    } catch (err) {
        console.error("Error in getAllNews:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch news",
            error: err.message
        });
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const news = await newsService.getNewsById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found"
            });
        }

        res.json({
            success: true,
            data: news
        });
    } catch (err) {
        console.error("Error in getNewsById:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch news",
            error: err.message
        });
    }
};

exports.createNews = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            content: req.body.content,
            summary: req.body.summary,
            category: req.body.category,
            image_url: req.body.image_url,
            is_featured: req.body.is_featured,
            is_published: req.body.is_published,
            publish_date: req.body.publish_date,
            author_id: req.user ? req.user.id : null
        };

        if (!data.title || !data.content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const newNews = await newsService.createNews(data);

        res.status(201).json({
            success: true,
            message: "News created successfully",
            data: newNews
        });
    } catch (err) {
        console.error("Error in createNews:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create news",
            error: err.message
        });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            content: req.body.content,
            summary: req.body.summary,
            category: req.body.category,
            image_url: req.body.image_url,
            is_featured: req.body.is_featured,
            is_published: req.body.is_published,
            publish_date: req.body.publish_date
        };

        await newsService.updateNews(req.params.id, data);

        res.json({
            success: true,
            message: "News updated successfully"
        });
    } catch (err) {
        console.error("Error in updateNews:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update news",
            error: err.message
        });
    }
};

exports.toggleFeatured = async (req, res) => {
    try {
        await newsService.toggleFeatured(req.params.id);

        res.json({
            success: true,
            message: "Featured status toggled successfully"
        });
    } catch (err) {
        console.error("Error in toggleFeatured:", err);
        res.status(500).json({
            success: false,
            message: "Failed to toggle featured status",
            error: err.message
        });
    }
};

exports.togglePublished = async (req, res) => {
    try {
        await newsService.togglePublished(req.params.id);

        res.json({
            success: true,
            message: "Published status toggled successfully"
        });
    } catch (err) {
        console.error("Error in togglePublished:", err);
        res.status(500).json({
            success: false,
            message: "Failed to toggle published status",
            error: err.message
        });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        await newsService.deleteNews(req.params.id);

        res.json({
            success: true,
            message: "News deleted successfully"
        });
    } catch (err) {
        console.error("Error in deleteNews:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete news",
            error: err.message
        });
    }
};

exports.getNewsStats = async (req, res) => {
    try {
        const stats = await newsService.getNewsStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getNewsStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: err.message
        });
    }
};
