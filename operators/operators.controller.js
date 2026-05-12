exports.detect = (req, res) => {

  const mobile = req.params.mobile;

  let operator = "UNKNOWN";

  if (mobile.startsWith("9") || mobile.startsWith("8")) {
    operator = "Jio";
  }
  else if (mobile.startsWith("7")) {
    operator = "Airtel";
  }
  else if (mobile.startsWith("6")) {
    operator = "VI";
  }

  res.json({
    success: true,
    operator
  });
};
