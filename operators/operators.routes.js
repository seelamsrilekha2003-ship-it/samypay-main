const express = require("express");
const router = express.Router();
const operatorsService = require("./operators.service");


router.get("/detect/:mobile", async (req, res) => {

  try {

    const mobile = req.params.mobile;

    const result = await operatorsService.detectOperator(mobile);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

module.exports = router;
