import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState(null);

  const refreshWallet = async () => {
    try {
      const res = await api.get("/wallet/balance");
      setWalletBalance(res.data.balance || 0);
    } catch (err) {
      console.error("Wallet API failed", err);
      setWalletBalance(0);
    }
  };

  useEffect(() => {
    refreshWallet();
  }, []);

  return (
    <PaymentContext.Provider
      value={{
        walletBalance,
        refreshWallet,
        paymentIntent,
        setPaymentIntent
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
