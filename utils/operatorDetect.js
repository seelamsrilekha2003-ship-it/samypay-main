module.exports = function detectOperator(value) {
  if (!value) return "UNKNOWN";
  if (value.startsWith("9") || value.startsWith("8")) return "JIO";
  if (value.startsWith("7")) return "AIRTEL";
  if (value.startsWith("6")) return "VI";
  return "UNKNOWN";
};
