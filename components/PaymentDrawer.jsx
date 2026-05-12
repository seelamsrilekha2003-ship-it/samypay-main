import React, { useState } from "react";
import { usePayment } from "../context/PaymentContext";
import api from "../api";
import "../assets/styles/Dashboard.css";
import { FaTimes, FaWallet, FaCreditCard, FaMobileAlt, FaUser } from "react-icons/fa";

// Helper to load Razorpay SDK
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentDrawer() {
  const { paymentIntent, setPaymentIntent, refreshWallet } = usePayment();
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  if (!paymentIntent) return null;

  const {
    api: apiPath,
    service,
    mobile,
    account,
    operator,
    amount,
    onSuccess
  } = paymentIntent;

  const closeDrawer = () => {
    console.log("Closing drawer...");
    setPaymentIntent(null);
    setSuccess(false);
    setSuccessData(null);
  }


  /* 💰 WALLET PAYMENT */
  const payWallet = async () => {
    try {
      setLoading(true);
      const payload = {
        operator,
        amount,
        paymentMode: "WALLET"
      };

      // 🔥 SERVICE BASED PAYLOAD
      if (service === "MOBILE") payload.mobile = mobile;
      else payload.account = account;

      const res = await api.post(apiPath, payload);

      console.log("WALLET RESPONSE:", res.data);

      if (res.data?.success !== true) {
        alert(res.data?.message || "Payment failed ❌");
        setLoading(false);
        return;
      }

      refreshWallet();            // navbar update
      onSuccess?.(res.data);              // report update

      setSuccessData({
        message: "Recharge Successful ✅",
        refId: res.data.reference_id || res.data.referenceId || "REF" + Date.now()
      });
      setSuccess(true);

    } catch (err) {
      console.error("Wallet error:", err);
      alert(err.response?.data?.message || "Wallet payment failed ❌: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* 📲 ONLINE PAYMENT (Razorpay) */
  const payOnline = async () => {
    try {
      setLoading(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      // 1. Create Order
      const { data } = await api.post("/wallet/razorpay/order", { amount: Number(amount) });

      if (!data.success) {
        alert("Order creation failed");
        setLoading(false);
        return;
      }

      const handlerLogic = async function (response) {
        try {
          // 3. Verify Payment
          const verifyRes = await api.post("/wallet/razorpay/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: Number(amount) // 🔥 ADDED AMOUNT FOR VERIFICATION
          });

          if (verifyRes.data.success) {
            // 4. Call Recharge API
            const payload = {
              operator,
              amount: Number(amount),
              paymentMode: "RAZORPAY"
            };
            if (service === "MOBILE") payload.mobile = mobile;
            else payload.account = account;

            const rechargeRes = await api.post(apiPath, payload);

            if (rechargeRes.data.success) {
              onSuccess?.(rechargeRes.data);
              refreshWallet(); // In case balance was credited
              setSuccessData({
                message: "Payment & Recharge Successful ✅",
                refId: rechargeRes.data.reference_id || rechargeRes.data.referenceId || "REF_RZP_" + Date.now()
              });
              setSuccess(true);
            } else {
              alert("Payment verified but Recharge failed: " + (rechargeRes.data.message || "Unknown Error"));
            }
          } else {
            alert("Payment verification failed: " + (verifyRes.data.message || "Unknown Error"));
          }
        } catch (err) {
          console.error(err);
          alert("Handler Error: " + (err.response?.data?.message || err.message));
        } finally {
          setLoading(false);
        }
      };

      // 🛑 BYPASS FOR DEMO / TEST MODE
      if (data.key === "rzp_test_dummy") {
        console.log("⚠️ Using Dummy Payment Mode");
        setTimeout(() => {
          handlerLogic({
            razorpay_order_id: data.orderId,
            razorpay_payment_id: "pay_dummy_" + Date.now(),
            razorpay_signature: "dummy_signature"
          });
        }, 1500);
        return;
      }

      // 2. Open Razorpay
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "SamyPay Recharge",
        description: `Recharge for ${mobile || account}`,
        order_id: data.orderId,
        handler: handlerLogic,
        prefill: {
          name: "SamyPay User",
          email: "user@samypay.com",
          contact: mobile || "9999999999"
        },
        theme: {
          color: "#0b58d6"
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert("Razorpay Failed: " + response.error.description);
        setLoading(false);
      });
      rzp1.open();

    } catch (err) {
      console.error("Online payment error:", err);
      alert(err.response?.data?.message || "Online payment initiation failed: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="payment-overlay" onClick={closeDrawer}>
      <div className="payment-drawer" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={closeDrawer}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f3f4f6',
            border: 'none',
            fontSize: '22px',
            color: '#374151',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
        >
          <FaTimes />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '80px', height: '80px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '40px' }}>
              ✓
            </div>
            <h2 style={{ color: '#065f46', marginBottom: '12px' }}>Success!</h2>
            <p style={{ color: '#047857', fontSize: '18px', fontWeight: 'bold' }}>{successData.message}</p>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginTop: '24px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>TRANSACTION REFERENCE</p>
              <p style={{ margin: '4px 0 0', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>{successData.refId}</p>
            </div>
            <button
              className="btn success full"
              onClick={closeDrawer}
              style={{ marginTop: '30px' }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '20px', color: '#1e293b' }}>Confirm Payment</h3>

            <div className="summary-card">
              {mobile && (
                <div className="summary-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMobileAlt color="#3b82f6" /> Mobile
                  </span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{mobile}</span>
                </div>
              )}
              {account && (
                <div className="summary-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUser color="#3b82f6" /> Account
                  </span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{account}</span>
                </div>
              )}
              <div className="summary-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCreditCard color="#3b82f6" /> Operator
                </span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{operator}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span style={{ color: '#0b58d6' }}>₹{amount}</span>
              </div>
            </div>

            <button className="btn-payment wallet" onClick={payWallet} disabled={loading}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                <FaWallet size={14} />
              </div>
              {loading ? "Processing..." : "Pay with Wallet"}
            </button>

            <button className="btn-payment online" onClick={payOnline} disabled={loading}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                <FaCreditCard size={14} />
              </div>
              {loading ? "Processing..." : "Pay Online / UPI"}
            </button>

            <button
              className="btn-payment cancel"
              onClick={closeDrawer}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
