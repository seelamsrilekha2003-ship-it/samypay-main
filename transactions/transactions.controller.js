const transactionsService = require("./transactions.service");

exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1; // Default to user 1 for testing

    const filters = {
      transaction_type: req.query.transaction_type,
      service_type: req.query.service_type,
      status: req.query.status,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      search: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : null
    };

    const transactions = await transactionsService.getUserTransactions(userId, filters);

    res.json({
      success: true,
      data: transactions,
      count: transactions.length
    });
  } catch (err) {
    console.error("Error in getUserTransactions:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.message
    });
  }
};

exports.getTransactionStats = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;

    const filters = {
      start_date: req.query.start_date,
      end_date: req.query.end_date
    };

    const stats = await transactionsService.getTransactionStats(userId, filters);

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error("Error in getTransactionStats:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: err.message
    });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const transaction = await transactionsService.getTransactionById(req.params.id, userId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (err) {
    console.error("Error in getTransactionById:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
      error: err.message
    });
  }
};

exports.getDailySummary = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const days = req.query.days ? parseInt(req.query.days) : 7;

    const summary = await transactionsService.getDailySummary(userId, days);

    res.json({
      success: true,
      data: summary
    });
  } catch (err) {
    console.error("Error in getDailySummary:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily summary",
      error: err.message
    });
  }
};

exports.getServiceBreakdown = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;

    const filters = {
      start_date: req.query.start_date,
      end_date: req.query.end_date
    };

    const breakdown = await transactionsService.getServiceBreakdown(userId, filters);

    res.json({
      success: true,
      data: breakdown
    });
  } catch (err) {
    console.error("Error in getServiceBreakdown:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service breakdown",
      error: err.message
    });
  }
};
