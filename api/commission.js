import api from "./index";

/**
 * ✅ CORRECT endpoint
 */
export const fetchMyCommissions = () => {
  return api.get("/commissions/my-commissions", {
    params: { user_role: "RETAILER" }
  });
};


