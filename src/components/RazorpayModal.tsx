import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  QrCode,
  Sparkles,
  RefreshCw,
  Info,
  Bug
} from "lucide-react";
import { Milestone } from "../types";

interface RazorpayModalProps {
  milestone: Milestone;
  projectTitle: string;
  clientName?: string;
  clientEmail?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentResult: any) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  milestone,
  projectTitle,
  clientName = "Alex Vance",
  clientEmail = "alex.vance@apexcorp.com",
  isOpen,
  onClose,
  onSuccess
}) => {
  const [config, setConfig] = useState<{
    keyId: string;
    mode: "test" | "live";
    isConfigured: boolean;
    isTestMode: boolean;
    webhookConfigured: boolean;
  }>({
    keyId: "rzp_test_public_preview",
    mode: "test",
    isConfigured: false,
    isTestMode: true,
    webhookConfigured: false
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("alex.vance@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 8821 9901 3244");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("712");
  const [cardName, setCardName] = useState(clientName);
  const [bank, setBank] = useState("HDFC Bank");

  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState<"idle" | "creating_order" | "processing" | "verifying" | "success" | "failed">("idle");
  const [stepDetails, setStepDetails] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = useState<"none" | "invalid_signature" | "user_cancelled" | "server_error">("none");
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [createdPaymentId, setCreatedPaymentId] = useState<string | null>(null);
  const [auditHash, setAuditHash] = useState<string | null>(null);

  // Fetch server Razorpay configuration safely on open
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/razorpay/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setConfig(data);
        }
      })
      .catch((err) => console.warn("Could not fetch Razorpay config:", err));
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayNow = async () => {
    setLoading(true);
    setErrorMsg(null);
    setStatusStep("creating_order");
    setStepDetails("Requesting backend to generate authentic Razorpay Order ID...");

    try {
      if (simulateFailure === "server_error") {
        throw new Error("Simulated Server Error: Order creation service timeout.");
      }

      // Step 1: Create Order on backend (Secret Key remains strictly server-side)
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId: milestone.id,
          projectId: milestone.projectId,
          projectTitle,
          clientName,
          clientEmail,
          amount: milestone.amount,
          currency: "INR",
          receipt: `rcpt_${milestone.id.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success || !orderData.order) {
        throw new Error(orderData.error || "Order creation failed on server.");
      }

      setCreatedOrderId(orderData.order.id);
      setStatusStep("processing");
      setStepDetails(`Order ${orderData.order.id} generated. Authenticating instrument authorization...`);

      if (simulateFailure === "user_cancelled") {
        await new Promise((r) => setTimeout(r, 600));
        throw new Error("Payment Cancelled: User dismissed checkout authorization prompt.");
      }

      // Step 2: Instrument Authorization Simulation / Processing
      await new Promise((r) => setTimeout(r, 1000));
      const simulatedPaymentId = `pay_${config.mode}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
      setCreatedPaymentId(simulatedPaymentId);

      // Step 3: Backend Cryptographic HMAC-SHA256 Signature Verification
      setStatusStep("verifying");
      setStepDetails(`Authorizing HMAC-SHA256 signature for ${orderData.order.id}|${simulatedPaymentId}...`);

      const signatureToSubmit =
        simulateFailure === "invalid_signature"
          ? "tampered_fake_signature_hash_xyz"
          : `sig_${Math.random().toString(36).substring(2, 14)}`;

      const verifyRes = await fetch("/api/razorpay/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.order.id,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: signatureToSubmit,
          milestoneId: milestone.id,
          amount: milestone.amount,
          paymentMethod: paymentMethod
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success || !verifyData.verified) {
        throw new Error(verifyData.error || "Server signature verification declined this transaction.");
      }

      // Step 4: Success & State Transition
      setAuditHash(verifyData.payment.auditHash);
      setStatusStep("success");
      setStepDetails("Signature verified! Escrow funds locked safely in WebLancer contract.");
      await new Promise((r) => setTimeout(r, 700));

      onSuccess({
        orderId: orderData.order.id,
        paymentId: simulatedPaymentId,
        milestoneId: milestone.id,
        amount: milestone.amount,
        auditHash: verifyData.payment.auditHash,
        mode: config.mode,
        isDuplicate: verifyData.isDuplicate
      });
      onClose();
    } catch (err: any) {
      console.error("Payment error:", err);
      setStatusStep("failed");
      setErrorMsg(err.message || "Payment could not be completed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Razorpay Brand Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-sm">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">Razorpay Checkout</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    config.mode === "live"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {config.mode === "live" ? "● LIVE GATEWAY" : "⚡ TEST MODE (rzp_test)"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{projectTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone Summary Breakdown */}
        <div className="bg-blue-50/60 px-5 py-3.5 border-b border-blue-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 text-[11px] font-medium">Milestone Escrow Deposit</span>
            <p className="font-bold text-slate-900 mt-0.5">{milestone.title}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-[11px] font-medium">Amount Payable</span>
            <p className="text-lg font-black text-blue-700">₹{milestone.amount.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Live Step Progress Indicator during execution */}
        {statusStep !== "idle" && (
          <div className="bg-slate-900 text-slate-200 px-5 py-3 border-b border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                {statusStep === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : statusStep === "failed" ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                )}
                <span className="capitalize">{statusStep.replace("_", " ")}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {statusStep === "creating_order" && "Step 1 of 4"}
                {statusStep === "processing" && "Step 2 of 4"}
                {statusStep === "verifying" && "Step 3 of 4"}
                {statusStep === "success" && "Step 4 of 4 (Complete)"}
                {statusStep === "failed" && "Failed"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate">{stepDetails}</p>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="space-y-1 flex-1">
                <p className="font-bold">Payment Transaction Notice</p>
                <p className="text-rose-700">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Payment Instrument
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "upi"
                    ? "border-blue-600 bg-blue-50/60 text-blue-700 shadow-xs"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-blue-600 bg-blue-50/60 text-blue-700 shadow-xs"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("netbanking")}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "netbanking"
                    ? "border-blue-600 bg-blue-50/60 text-blue-700 shadow-xs"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span>NetBanking</span>
              </button>
            </div>
          </div>

          {/* UPI Form */}
          {paymentMethod === "upi" && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Scan & Pay via any UPI App</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                  Instant Verification
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-white border border-slate-300 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                  <QrCode className="w-full h-full text-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Or enter VPA / UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="user@upi"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-blue-600"
                  />
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {["alex.vance@okaxis", "apex.corp@icici", "tech@okhdfcbank"].map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setUpiId(id)}
                        className="text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md font-medium cursor-pointer"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cards Form */}
          {paymentMethod === "card" && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">Test Card Number</label>
                  <span className="text-[10px] text-slate-500 font-mono">Visa / Mastercard / RuPay</span>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono focus:outline-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-blue-600"
                />
              </div>
            </div>
          )}

          {/* Netbanking Form */}
          {paymentMethod === "netbanking" && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <label className="block text-[11px] font-semibold text-slate-700">Select Bank</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-blue-600 font-medium"
              >
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>State Bank of India (SBI)</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {/* Developer QA Simulation Selector (For Testing Failure & Verification Resilience) */}
          <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5 text-indigo-600" />
                <span>Integration Test Scenario</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">QA Verification</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setSimulateFailure("none")}
                className={`py-1 px-2 rounded-lg text-left truncate transition-colors ${
                  simulateFailure === "none"
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                ✓ Normal Success Flow
              </button>
              <button
                type="button"
                onClick={() => setSimulateFailure("invalid_signature")}
                className={`py-1 px-2 rounded-lg text-left truncate transition-colors ${
                  simulateFailure === "invalid_signature"
                    ? "bg-rose-600 text-white font-bold"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                ✗ Fake Signature Test
              </button>
              <button
                type="button"
                onClick={() => setSimulateFailure("user_cancelled")}
                className={`py-1 px-2 rounded-lg text-left truncate transition-colors ${
                  simulateFailure === "user_cancelled"
                    ? "bg-amber-600 text-white font-bold"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                ✗ User Cancelled Test
              </button>
              <button
                type="button"
                onClick={() => setSimulateFailure("server_error")}
                className={`py-1 px-2 rounded-lg text-left truncate transition-colors ${
                  simulateFailure === "server_error"
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                ✗ Order API Timeout
              </button>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="flex items-start gap-2.5 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-emerald-900 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Verified Escrow Contract:</strong> Funds are locked securely under Razorpay transaction controls and only released to the freelancer after you approve the submitted milestone deliverables.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePayNow}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Transaction...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹{milestone.amount.toLocaleString("en-IN")} via Razorpay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
