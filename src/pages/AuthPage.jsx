import React, { useState } from 'react';
import { 
  Home, BookOpen, FileText, CreditCard, Search, 
  Award, BarChart3, CheckCircle2, ArrowRight, UserCheck, 
  QrCode, Building, Lock, Download, X, Eye 
} from 'lucide-react';

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('Course Notes');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isPaid, setIsPaid] = useState(false);
  const [activeNotesCourse, setActiveNotesCourse] = useState(null);

  const [upiId, setUpiId] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('SBI');

  const [courses, setCourses] = useState([
    { 
      id: 'CS801', 
      name: 'Distributed Microservices Design', 
      fee: 4500, 
      status: 'Open', 
      credits: 4, 
      instructor: 'Dr. Vance',
      notes: [
        { title: 'Module 1: Service Mesh Architecture', file: 'Microservices_M1.txt', content: 'Overview of API Gateways, Service Discovery, and Resilience patterns.' },
        { title: 'Module 2: Distributed Tracing & Logging', file: 'Microservices_M2.txt', content: 'Implementation of OpenTelemetry, Jaeger, and Centralized Logging.' }
      ]
    },
    { 
      id: 'CS802', 
      name: 'Cloud Native Spring Boot & Kafka', 
      fee: 5200, 
      status: 'Open', 
      credits: 3, 
      instructor: 'Prof. Miller',
      notes: [
        { title: 'Module 1: Kafka Event Streams', file: 'Kafka_Streams_M1.txt', content: 'Producers, Consumers, Consumer Groups, and Partitioning strategy.' }
      ]
    },
    { 
      id: 'CS803', 
      name: 'High-Performance JPA Architecture', 
      fee: 3800, 
      status: 'Registered', 
      credits: 3, 
      instructor: 'Dr. Sarah',
      notes: [
        { title: 'Unit 1: Entity Lifecycle & Persistence Context', file: 'JPA_Architecture_Unit1.txt', content: 'Detailed analysis of Transient, Managed, Detached, and Removed entity states in Hibernate.' },
        { title: 'Unit 2: L1 & L2 Cache Tuning Strategies', file: 'JPA_Caching_Unit2.txt', content: 'Configuring Redis/Ehcache with Hibernate second-level cache to reduce DB load.' },
        { title: 'Unit 3: Query Optimization & N+1 Problem Fixes', file: 'JPA_Optimization_Unit3.txt', content: 'Using JPQL JOIN FETCH, Entity Graphs, and DTO projection queries.' }
      ]
    },
    { 
      id: 'CS804', 
      name: 'Reactive Web Application Security', 
      fee: 4900, 
      status: 'Open', 
      credits: 4, 
      instructor: 'Prof. Chen',
      notes: [
        { title: 'Module 1: OAuth2 & JWT Implementation', file: 'Security_M1.txt', content: 'Token generation, RBAC middleware, and stateless authentication.' }
      ]
    },
  ]);

  const sidebarItems = [
    { name: 'Home', icon: Home },
    { name: 'Course Registration', icon: BookOpen },
    { name: 'Course Notes', icon: FileText },
    { name: 'Payment History', icon: CreditCard },
  ];

  const handleInstructorChange = (id, newName) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, instructor: newName } : c));
  };

  const handlePayAndRegister = () => {
    if (!selectedCourse) return;
    setCourses(prev => prev.map(c => 
      c.id === selectedCourse.id ? { ...c, status: 'Registered' } : c
    ));
    setIsPaid(true);
  };

  // Fixed Download Handler: Generates valid readable text documents
  const handleDownloadNote = (fileName, title, content) => {
    const formattedText = `==================================================\nACADEMIAX PLATFORM - OFFICIAL COURSE NOTES\n==================================================\n\nTitle: ${title}\nFile: ${fileName}\nDate: ${new Date().toLocaleDateString()}\n\n--------------------------------------------------\nCONTENT OUTLINE\n--------------------------------------------------\n\n${content}\n\n--------------------------------------------------\nEnd of Document\n==================================================`;
    
    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = fileName.endsWith('.txt') ? fileName : `${fileName.split('.')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-[#0a0f1d] border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white">AcademiaX Platform</h1>
            <p className="text-xs text-indigo-400 font-mono">Student Learning Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-72 hidden md:block">
            <input 
              type="text" 
              placeholder="Search portal..." 
              className="w-full bg-[#111827] border border-slate-800 rounded-xl py-1.5 pl-3 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2 bg-[#111827] border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-200">Authenticated Student</span>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="flex flex-1">
        <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col py-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setSelectedCourse(null);
                  setIsPaid(false);
                  setShowQr(false);
                  setActiveNotesCourse(null);
                }}
                className={`flex items-center gap-3 px-5 py-3 text-xs font-medium transition ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border-r-2 border-indigo-500 font-bold' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {/* TAB: HOME */}
          {activeTab === 'Home' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Enrolled Courses</p>
                    <h3 className="text-2xl font-bold text-white mt-1">1</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Available Registrations</p>
                    <h3 className="text-2xl font-bold text-white mt-1">3</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Payment Records</p>
                    <h3 className="text-2xl font-bold text-white mt-1">2</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COURSE REGISTRATION */}
          {activeTab === 'Course Registration' && (
            <div className="space-y-6">
              <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white tracking-tight">Course Registration & Fee Payment</h2>
                <p className="text-xs text-slate-400 mt-1">Select courses, verify faculty details, and transfer payment in Indian Rupees (₹).</p>
              </div>

              {!selectedCourse ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/30">{course.id}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-md font-bold ${
                            course.status === 'Registered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {course.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-base">{course.name}</h3>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Faculty Assigned</label>
                          <input 
                            type="text" 
                            value={course.instructor}
                            onChange={(e) => handleInstructorChange(course.id, e.target.value)}
                            placeholder="Enter Faculty Name..."
                            className="w-full bg-[#0a0f1d] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-500 block">Registration Fee</span>
                          <span className="text-xl font-black text-white">₹{course.fee.toLocaleString('en-IN')}</span>
                        </div>
                        {course.status === 'Registered' ? (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" /> Access Granted
                          </span>
                        ) : (
                          <button 
                            onClick={() => setSelectedCourse(course)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
                          >
                            <span>Pay & Register</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#111827] border border-slate-800 p-8 rounded-3xl max-w-xl mx-auto space-y-6 shadow-2xl">
                  {!isPaid ? (
                    <>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <div>
                          <h3 className="font-bold text-white text-base">Course Fee Payment</h3>
                          <p className="text-xs text-slate-400">{selectedCourse.name} ({selectedCourse.id})</p>
                        </div>
                        <button onClick={() => { setSelectedCourse(null); setShowQr(false); }} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                      </div>

                      <div className="bg-[#0a0f1d] p-4 rounded-xl flex justify-between items-center border border-slate-800">
                        <div>
                          <span className="text-xs font-semibold text-slate-400 block">Recipient Faculty: <span className="text-indigo-400 font-bold">{selectedCourse.instructor}</span></span>
                          <span className="text-xs font-semibold text-slate-400">Total Transfer Amount</span>
                        </div>
                        <span className="text-2xl font-black text-white">₹{selectedCourse.fee.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Payment Method</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['upi', 'card', 'netbanking'].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => { setPaymentMethod(mode); setShowQr(false); }}
                              className={`p-3 rounded-xl text-xs font-bold border capitalize transition ${
                                paymentMethod === mode 
                                  ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300' 
                                  : 'border-slate-800 bg-[#0a0f1d] text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      {paymentMethod === 'upi' && (
                        <div className="bg-[#0a0f1d] p-5 rounded-xl border border-slate-800 space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">UPI VPA / ID</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="e.g. student@upi / phonepe" 
                                className="flex-1 bg-[#111827] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                              />
                              <button 
                                onClick={() => setShowQr(true)}
                                className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1"
                              >
                                <QrCode className="w-3.5 h-3.5" /> Generate Scanner
                              </button>
                            </div>
                          </div>

                          {showQr && (
                            <div className="p-4 bg-white rounded-xl text-center space-y-2 max-w-[200px] mx-auto border-2 border-indigo-500">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${upiId || 'faculty@upi'}&pn=${encodeURIComponent(selectedCourse.instructor)}&am=${selectedCourse.fee}&cu=INR`} 
                                alt="UPI Scanner" 
                                className="mx-auto rounded"
                              />
                              <p className="text-[10px] font-bold text-slate-800">Scan to Pay ₹{selectedCourse.fee.toLocaleString('en-IN')}</p>
                              <p className="text-[9px] text-slate-500">Recipient: {selectedCourse.instructor}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div className="bg-[#0a0f1d] p-5 rounded-xl border border-slate-800 space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">Card Number</label>
                            <input 
                              type="text" 
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                              placeholder="4532 •••• •••• 8921" 
                              className="w-full bg-[#111827] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-bold">Expiry Date</label>
                              <input 
                                type="text" 
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                placeholder="MM/YY" 
                                className="w-full bg-[#111827] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-bold">CVV Code</label>
                              <input 
                                type="password" 
                                maxLength={3}
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                                placeholder="•••" 
                                className="w-full bg-[#111827] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'netbanking' && (
                        <div className="bg-[#0a0f1d] p-5 rounded-xl border border-slate-800 space-y-3">
                          <label className="text-[10px] text-slate-400 uppercase font-bold block">Select Bank Account</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                              <button
                                key={bank}
                                onClick={() => setSelectedBank(bank)}
                                className={`p-2.5 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition ${
                                  selectedBank === bank 
                                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300' 
                                    : 'border-slate-800 bg-[#111827] text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <span>{bank}</span>
                                <Building className="w-3.5 h-3.5 text-slate-500" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={handlePayAndRegister}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Transfer ₹{selectedCourse.fee.toLocaleString('en-IN')} & Grant Access</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Payment Transferred & Access Granted!</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Transferred <span className="text-white font-bold">₹{selectedCourse.fee.toLocaleString('en-IN')}</span> to <span className="text-indigo-400 font-bold">{selectedCourse.instructor}</span>.
                      </p>
                      <button 
                        onClick={() => {
                          setSelectedCourse(null);
                          setIsPaid(false);
                          setShowQr(false);
                          setActiveTab('Course Notes');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
                      >
                        Go to Course Notes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: COURSE NOTES */}
          {activeTab === 'Course Notes' && (
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Course Notes & Resources Access</h2>
                <p className="text-xs text-slate-400 mt-1">Access lecture materials and downloadable study notes for your registered courses.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {courses.filter(c => c.status === 'Registered').map(c => (
                  <div key={c.id} className="p-5 bg-[#0a0f1d] border border-slate-800 rounded-2xl flex justify-between items-center shadow-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">{c.id}</span>
                        <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      </div>
                      <p className="text-xs text-slate-400">Faculty: <span className="text-slate-200 font-semibold">{c.instructor}</span> • Unlocked Lecture Notes ({c.notes ? c.notes.length : 0} Modules)</p>
                    </div>
                    
                    <button 
                      onClick={() => setActiveNotesCourse(c)}
                      className="text-xs font-bold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md shadow-indigo-600/10"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Notes</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Notes Reader Modal */}
              {activeNotesCourse && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{activeNotesCourse.id}</span>
                          <h3 className="font-bold text-white text-base">{activeNotesCourse.name}</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Faculty: {activeNotesCourse.instructor}</p>
                      </div>
                      <button 
                        onClick={() => setActiveNotesCourse(null)}
                        className="p-1 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                      {activeNotesCourse.notes && activeNotesCourse.notes.map((note, idx) => (
                        <div key={idx} className="bg-[#0a0f1d] border border-slate-800 p-4 rounded-xl space-y-3">
                          <div>
                            <h4 className="font-bold text-white text-xs">{note.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{note.content}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-indigo-400">{note.file}</span>
                            <button 
                              onClick={() => handleDownloadNote(note.file, note.title, note.content)}
                              className="text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download File</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-end">
                      <button 
                        onClick={() => setActiveNotesCourse(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-5 py-2 rounded-xl transition"
                      >
                        Close Reader
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: PAYMENT HISTORY */}
          {activeTab === 'Payment History' && (
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">Payment History Ledger</h2>
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0a0f1d] text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Receipt No</th>
                    <th className="p-3">Course / Faculty</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr>
                    <td className="p-3 font-mono text-slate-400">RCP-2026-001</td>
                    <td className="p-3 text-white">Semester Academic Fee</td>
                    <td className="p-3 font-bold text-white">₹24,000.00</td>
                    <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">Paid</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-slate-400">RCP-2026-002</td>
                    <td className="p-3 text-white">High-Performance JPA Architecture (Dr. Sarah)</td>
                    <td className="p-3 font-bold text-white">₹3,800.00</td>
                    <td className="p-3"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">Paid</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}