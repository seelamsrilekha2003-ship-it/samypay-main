const operatorsService = require("../operators/operators.service");
const dthService = require("../dth/dth.service");
const electricityService = require("../electricity/electricity.service");
const gasService = require("../gas/gas.service");

exports.detectOperator = async (req, res) => {
  try {
    const { number, mobile, category } = req.body;
    const inputNumber = number || mobile || req.params.mobile;
    const serviceCategory = (category || "MOBILE").toUpperCase();

    if (!inputNumber) {
      return res.status(400).json({ success: false, message: "Input number required" });
    }

    let result = null;

    switch (serviceCategory) {
      case "MOBILE":
      case "PREPAID":
      case "POSTPAID":
        result = await operatorsService.detectOperator(inputNumber);
        break;

      case "DTH":
        const dthRes = await dthService.fetchOperator(inputNumber);
        // Normalize DTH response
        if (dthRes && (dthRes.STATUS === "1" || dthRes.STATUS === 1 || dthRes.error === "0")) {
          result = {
            operator: dthRes.DthName || dthRes.operator,
            opcode: dthRes.DthOpCode || dthRes.opcode || dthRes.OperatorCode
          };
        }
        break;

      case "ELECTRICITY":
        const elecRes = await electricityService.fetchOperator(inputNumber);
        if (elecRes && (elecRes.STATUS === "SUCCESS" || elecRes.STATUS === "1")) {
          result = {
            operator: elecRes.DATA?.OperatorName || elecRes.Operator,
            opcode: elecRes.DATA?.OperatorCode || elecRes.OpCode
          };
        }
        break;

      case "GAS":
        const gasRes = await gasService.detectOperator(inputNumber);
        if (gasRes) {
          result = {
            operator: gasRes.name,
            opcode: gasRes.id
          };
        }
        break;

      default:
        // Try a generic detection fallback if available
        result = await operatorsService.detectOperator(inputNumber);
    }

    if (!result) {
      return res.json({
        success: false,
        autoDetect: false,
        message: "No operator detected automatically"
      });
    }

    return res.json({
      success: true,
      autoDetect: true,
      data: result
    });

  } catch (error) {
    console.error(`Detect Error [${category}]:`, error.message);
    res.json({
      success: false,
      autoDetect: false,
      message: "Detection failed: " + error.message
    });
  }
};
