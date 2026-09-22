import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, QrCode, CreditCard, Building2, Clock, Download, Landmark, Copy, Check } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, amount, courseName, onSubmitPayment }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [bankUserId, setBankUserId] = useState('');
  const [bankPassword, setBankPassword] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [transactionReceipt, setTransactionReceipt] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // SAFE PRICE PARSER (Prevents x100 inflation)
  const getCleanAmount = (inputFee) => {
    if (!inputFee) return '999';
    const mainPart = String(inputFee).split('.')[0];
    const digitsOnly = mainPart.replace(/[^0-9]/g, '');
    return digitsOnly || '999';
  };

  const exactAmountNumber = getCleanAmount(amount);
  const formattedDisplayAmount = `₹${Number(exactAmountNumber).toLocaleString('en-IN')}.00`;
  const holderName = 'SALLA HARSHITH REDDY';
  const targetUpiVpa = '9866176222@sbi';

  // VALID SCANNER QR CODE (Reliable Image Fallback)
  const rawUpiString = `upi://pay?pa=${targetUpiVpa}&pn=${encodeURIComponent(holderName)}&am=${exactAmountNumber}&cu=INR`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(rawUpiString)}`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(targetUpiVpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const txId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      let refDetail = '';

      if (paymentMethod === 'UPI') {
        refDetail = `UPI ID: ${upiId || 'student@upi'}`;
      } else if (paymentMethod === 'CARD') {
        refDetail = `CARD: **** **** **** ${cardNumber.slice(-4) || '8892'}`;
      } else if (paymentMethod === 'NETBANKING') {
        refDetail = `NETBANKING: ${selectedBank} (User: ${bankUserId || 'STUDENT'})`;
      }

      const receiptData = {
        txId,
        courseName: courseName || 'Academic Course',
        amount: formattedDisplayAmount,
        paymentMethod: refDetail,
        merchantName: 'AcademiaX Higher Education',
        bankHolderName: holderName,
        targetUpi: targetUpiVpa,
        date: new Date().toLocaleString(),
        status: 'Awaiting Faculty Approval'
      };

      setTransactionReceipt(receiptData);
      onSubmitPayment(refDetail, receiptData);
      setIsProcessing(false);
      setSubmitted(true);
    }, 1200);
  };

  const downloadReceipt = () => {
    if (!transactionReceipt) return;

    const receiptText = `
====================================================
           ACADEMIAX LEARNING PLATFORM
           OFFICIAL FEE PAYMENT RECEIPT
====================================================
Portal Merchant : ${transactionReceipt.merchantName}
Account Holder  : ${transactionReceipt.bankHolderName}
Payee UPI ID    : ${transactionReceipt.targetUpi}
Transaction ID  : ${transactionReceipt.txId}
Course Name     : ${transactionReceipt.courseName}
Amount Paid     : ${transactionReceipt.amount}
Payment Mode    : ${transactionReceipt.paymentMethod}
Date & Time     : ${transactionReceipt.date}
Status          : ${transactionReceipt.status}
====================================================`;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Receipt_${transactionReceipt.txId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModalClose = () => {
    setSubmitted(false);
    setIsProcessing(false);
    setUpiId('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setSelectedBank('');
    setBankUserId('');
    setBankPassword('');
    setPaymentMethod('UPI');
    setTransactionReceipt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 font-sans flex flex-col overflow-y-auto">
      {/* Header Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleModalClose} 
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Student Portal
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <h2 className="font-extrabold text-base text-white tracking-tight">AcademiaX Secure Checkout</h2>
        </div>

        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-6">
        {!submitted ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Summary Column */}
            <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Course Enrollment
                </span>
                <h3 className="text-xl font-bold text-white mt-3">{courseName}</h3>
                <p className="text-xs text-slate-400 mt-1">Official University Accredited Course</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Tuition & Course Fee</span>
                  <span className="font-bold text-white">{formattedDisplayAmount}</span>
                </div>
                <div className="h-px bg-slate-800 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Total Payable Amount</span>
                  <span className="text-2xl font-black text-emerald-400">{formattedDisplayAmount}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-2 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                <p className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-emerald-400" /> Official Merchant Information
                </p>
                <p>• <strong className="text-slate-300">Portal Name:</strong> AcademiaX Higher Education</p>
                <p>• <strong className="text-slate-300">Bank Holder:</strong> {holderName}</p>
                <p>• <strong className="text-slate-300">UPI ID:</strong> <span className="text-emerald-400 font-mono font-bold">{targetUpiVpa}</span></p>
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('UPI')} 
                    className={`py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${paymentMethod === 'UPI' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <QrCode className="w-4 h-4" /> UPI / QR
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('CARD')} 
                    className={`py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${paymentMethod === 'CARD' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <CreditCard className="w-4 h-4" /> Debit Card
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('NETBANKING')} 
                    className={`py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${paymentMethod === 'NETBANKING' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Building2 className="w-4 h-4" /> NetBanking
                  </button>
                </div>
              </div>

              <form onSubmit={handleProcessPayment} className="space-y-5">
                {paymentMethod === 'UPI' && (
                  <div className="space-y-4">
                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl text-center space-y-3">
                      <p className="text-xs font-bold text-slate-200">Scan QR Code via GPay / PhonePe / Paytm</p>
                      
                      <div className="bg-white p-3 rounded-2xl inline-block shadow-lg border-2 border-emerald-500/40">
                        <img 
                          src={qrCodeApiUrl} 
                          alt="Dynamic Payment QR Code" 
                          className="w-48 h-48 object-contain rounded-xl"
                        />
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 text-slate-300 font-sans">
                        <p className="font-extrabold text-emerald-400 text-sm">AcademiaX Higher Education</p>
                        <p className="text-[11px] text-slate-400">Bank Holder: <span className="text-white font-bold">{holderName}</span></p>
                        
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <span className="text-[11px] text-slate-300 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-700">
                            {targetUpiVpa}
                          </span>
                          <button 
                            type="button" 
                            onClick={copyUpiId}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1 rounded transition cursor-pointer"
                            title="Copy UPI ID"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <p className="text-[11px] text-emerald-400 font-extrabold pt-1">Auto-Encoded Amount: {formattedDisplayAmount}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Student UPI ID / UTR Reference Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. student@upi or 12-digit UTR No."
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'CARD' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cardholder Name</label>
                      <input type="text" required placeholder="Name on card" className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Card Number</label>
                      <input type="text" required maxLength={16} placeholder="4532 8901 2345 8921" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white outline-none font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Expiry Date</label>
                        <input type="text" required placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white outline-none font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">CVV Code</label>
                        <input type="password" required maxLength={3} placeholder="•••" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white outline-none font-mono" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NETBANKING' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Select Bank</label>
                      <select required value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white outline-none cursor-pointer">
                        <option value="">-- Choose Your Bank --</option>
                        <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                      </select>
                    </div>

                    {selectedBank && (
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">NetBanking Login</label>
                        <input type="text" required placeholder="User ID" value={bankUserId} onChange={(e) => setBankUserId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none" />
                        <input type="password" required placeholder="Password" value={bankPassword} onChange={(e) => setBankPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none" />
                      </div>
                    )}
                  </div>
                )}

                <button type="submit" disabled={isProcessing} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 rounded-2xl text-xs transition shadow-lg cursor-pointer">
                  {isProcessing ? 'Processing Transaction...' : `Complete Payment ${formattedDisplayAmount}`}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Receipt Screen */
          <div className="max-w-xl mx-auto space-y-6 pt-4">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-3 shadow-xl">
              <Clock className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
              <h3 className="text-xl font-bold text-white">Payment Submitted</h3>
              <p className="text-xs text-slate-400">Your fee payment record has been generated and sent to faculty for course verification.</p>
            </div>

            {transactionReceipt && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 text-xs font-mono text-slate-300 shadow-xl">
                <div className="flex justify-between"><span className="text-slate-500">Txn ID:</span><span className="text-white font-bold">{transactionReceipt.txId}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Merchant:</span><span className="text-white">{transactionReceipt.merchantName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Bank Holder:</span><span className="text-white">{transactionReceipt.bankHolderName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Target UPI:</span><span className="text-emerald-400">{transactionReceipt.targetUpi}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Course:</span><span className="text-white font-bold">{transactionReceipt.courseName}</span></div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-sans"><span className="font-bold text-slate-300">Amount Paid:</span><span className="font-extrabold text-emerald-400">{transactionReceipt.amount}</span></div>

                <div className="flex gap-3 pt-3 font-sans">
                  <button onClick={downloadReceipt} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition">
                    <Download className="w-4 h-4" /> Download Receipt File
                  </button>
                  <button onClick={handleModalClose} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3 rounded-xl border border-slate-700 cursor-pointer transition">
                    Return to Portal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}