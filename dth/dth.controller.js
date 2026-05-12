const service = require("./dth.service");

/* ===============================
   1️⃣ AUTO OPERATOR FETCH
   POST /api/dth/auto-operator
================================ */
exports.autoOperator = async (req, res) => {
  try {
    const { consumerNo } = req.body;

    if (!consumerNo) {
      return res.status(400).json({ success: false, message: "Consumer number required" });
    }

    // 🚀 Calling REAL API
    const result = await service.fetchOperator(consumerNo);
    console.log("[DTH DEBUG] Operator Result:", result);

    // Flexible success check for PlanAPI
    const isSuccess = result && (
      result.ERROR === "0" ||
      result.error === "0" ||
      result.STATUS === "1" ||
      result.status === "1"
    );

    if (isSuccess) {
      // PlanAPI usually returns DthName or dthname or DTHNAME
      const operator = result.DthName || result.dthname || result.DTHNAME || result.Operator || result.operator || "UNKNOWN";
      const opCode = result.DthOpCode || result.dthopcode || result.DTHOPCODE || result.OpCode || result.opcode || result.OperatorCode;

      return res.json({
        success: true,
        operator: operator,
        opCode: opCode
      });
    }

    return res.status(400).json({
      success: false,
      message: result.Message || result.MESSAGE || result.remarks || "Unable to detect operator automatically"
    });

  } catch (err) {
    console.error("❌ Auto Operator Error:", err.message);
    return res.status(500).json({ success: false, message: "Operator fetch failed" });
  }
};

/* ===============================
   2️⃣ FETCH CUSTOMER DETAILS
   POST /api/dth/fetch-details
================================ */
exports.fetchDetails = async (req, res) => {
  try {
    const { consumerNo, operatorCode } = req.body;

    if (!consumerNo || !operatorCode) {
      return res.status(400).json({ success: false, message: "Consumer number and operator code required" });
    }

    const result = await service.fetchLastRecharge(consumerNo, operatorCode);
    console.log("[DTH DEBUG] Details Result:", result);

    const isSuccess = result && (
      result.error === "0" ||
      result.ERROR === "0" ||
      result.STATUS === "1" ||
      result.status === "1" ||
      result.STATUS === "SUCCESS"
    );

    if (isSuccess) {
      // Data might be in result.DATA, result.RDATA or directly in result
      const d = result.DATA || result.RDATA || result;

      return res.json({
        success: true,
        customerName: d.Name || d.CustomerName || d.customername || d.name || "NA",
        status: d.Status || d.status || d.AccountStatus || "Active",
        balance: d.Balance || d.balance || d.AccountBalance || "0.00",
        currentPlan: d.Plan || d.current_plan || d.planname || d.PlanName || "NA",
        nextRechargeDate: d["Next Recharge Date"] || d.NextRechargeDate || d.nextrechargedate || d.ExpiryDate || "NA",
        address: d.Address || d.address || "NA"
      });
    }

    return res.status(400).json({
      success: false,
      message: result.Message || result.MESSAGE || result.remarks || "Unable to fetch customer details"
    });

  } catch (err) {
    console.error("❌ Details Error:", err.message);
    return res.status(500).json({ success: false, message: "Unable to fetch customer details" });
  }
};

/* ===============================
   3️⃣ FETCH PLANS
   POST /api/dth/plans
================================ */
exports.fetchPlans = async (req, res) => {
  try {
    const { opCode } = req.body;

    if (!opCode) {
      return res.status(400).json({ success: false, message: "Operator code required" });
    }

    const result = await service.fetchPlans(opCode);
    console.log("[DTH DEBUG] Plans Result:", result);

    const isSuccess = result && (
      result.ERROR === "0" ||
      result.error === "0" ||
      result.STATUS === "1" ||
      result.status === "1" ||
      result.STATUS === "SUCCESS"
    );

    if (isSuccess) {
      let flattenedPlans = [];

      // Structure 1: result.DATA or result.RDATA or root
      const dataRoot = result.DATA || result.RDATA || result;

      // PlanAPI Structure: RDATA.Combo array
      if (dataRoot.Combo && Array.isArray(dataRoot.Combo)) {
        dataRoot.Combo.forEach((combo, cIdx) => {
          if (combo.Details && Array.isArray(combo.Details)) {
            combo.Details.forEach((detail, dIdx) => {
              if (detail.PricingList && Array.isArray(detail.PricingList)) {
                detail.PricingList.forEach((price, pIdx) => {
                  flattenedPlans.push({
                    id: `p-${cIdx}-${dIdx}-${pIdx}-${price.Amount}`,
                    amount: String(price.Amount).replace("₹", "").trim(),
                    validity: price.Month || price.validity || "NA",
                    description: `${detail.PlanName} ${detail.Channels ? `(${detail.Channels})` : ''}`
                  });
                });
              }
            });
          }
        });
      }
      // Structure 2: result.data (Direct array)
      else if (Array.isArray(result.data)) {
        flattenedPlans = result.data.map((p, idx) => ({
          id: p.id || idx,
          amount: String(p.amount || p.Amount).replace("₹", "").trim(),
          validity: p.validity || p.Validity,
          description: p.description || p.Description || p.PlanName
        }));
      }
      // Structure 3: result.DATA as array
      else if (Array.isArray(result.DATA)) {
        flattenedPlans = result.DATA.map((p, idx) => ({
          id: p.id || idx,
          amount: String(p.amount || p.Amount).replace("₹", "").trim(),
          validity: p.validity || p.Validity,
          description: p.description || p.Description || p.PlanName
        }));
      }

      return res.json({
        success: true,
        plans: flattenedPlans
      });
    }

    return res.status(400).json({
      success: false,
      message: result.MESSAGE || result.Message || result.remarks || "Unable to fetch plans"
    });

  } catch (err) {
    console.error("❌ Plans Error:", err.message);
    return res.status(500).json({ success: false, message: "Unable to fetch plans" });
  }
};
