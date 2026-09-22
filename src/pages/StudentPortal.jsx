import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  LogOut, 
  CreditCard, 
  FileText, 
  Video, 
  Book, 
  CheckCircle, 
  Download, 
  Clock, 
  MessageSquare, 
  Send, 
  User 
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import PaymentModal from './PaymentModal';

export default function StudentPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const studentName = location.state?.name || 'Harshith Reddy';

  const { courses = [], notes = [], videos = [], payments = [], doubts = [], addPaymentRequest, sendDoubt } = useAcademic();

  const [activeTab, setActiveTab] = useState('Course Catalog');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [selectedCourseForDoubt, setSelectedCourseForDoubt] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  const handleOpenPayment = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = (refDetail) => {
    if (selectedCourse && addPaymentRequest) {
      addPaymentRequest(selectedCourse, refDetail);
    }
  };

  const handlePostDoubt = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    sendDoubt({
      id: Date.now(),
      studentName: studentName,
      course: selectedCourseForDoubt || courses[0]?.title,
      question: newQuestion,
      reply: null,
      date: new Date().toLocaleDateString()
    });

    setNewQuestion('');
    alert('Question sent to faculty for clarification!');
  };

  // Function to generate and download a PDF payment receipt
  const handleDownloadReceipt = (receipt) => {
    const runReceiptPdf = () => {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('ACADEMIAX PLATFORM - FEE PAYMENT RECEIPT', 20, 20);
        
        doc.setFontSize(11);
        doc.text(`Receipt ID: ${receipt.id}`, 20, 35);
        doc.text(`Student Name: ${studentName}`, 20, 45);
        doc.text(`Course Title: ${receipt.course}`, 20, 55);
        doc.text(`Payment Reference / UPI ID: ${receipt.upiId}`, 20, 65);
        doc.text(`Amount Paid: ${receipt.amount}`, 20, 75);
        doc.text(`Status: ${receipt.status}`, 20, 85);
        doc.text(`Date: ${receipt.date || new Date().toLocaleDateString()}`, 20, 95);

        doc.setFontSize(10);
        doc.text('This is a digitally generated institutional receipt for academic fee remittance.', 20, 115);

        doc.save(`Receipt_${receipt.id}.pdf`);
      } catch (err) {
        console.error('Receipt PDF generation error:', err);
      }
    };

    if (window.jspdf) {
      runReceiptPdf();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => runReceiptPdf();
      document.body.appendChild(script);
    }
  };

  const enrolledCourseTitles = courses
    .filter(c => c.enrolled || c.status === 'Enrolled')
    .map(c => c.title);

  const activePaymentHistory = payments
    .filter(p => enrolledCourseTitles.includes(p.course))
    .reduce((acc, current) => {
      if (!acc.some(item => item.course === current.course)) {
        acc.push(current);
      }
      return acc;
    }, []);

  const studentNotes = enrolledCourseTitles.length > 0 ? notes.filter(n => enrolledCourseTitles.includes(n.course)) : [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="font-extrabold text-lg text-white">AcademiaX Platform</h1>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase">Student Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            • {studentName}
          </div>
          <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-1">
          {[
            { name: 'Course Catalog', icon: Book },
            { name: 'My Enrollments', icon: BookOpen },
            { name: 'Course Notes', icon: FileText },
            { name: 'Video Lectures', icon: Video },
            { name: 'Faculty Clarifications', icon: MessageSquare },
            { name: 'Payment History', icon: CreditCard },
            { name: 'Student Profile', icon: User }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === item.name ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-8 max-w-6xl space-y-6">
          {activeTab === 'Course Catalog' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Higher Education Courses</h2>
                <p className="text-xs text-slate-400 mt-1">Explore accredited academic courses across various domains.</p>
              </div>

              <div className="text-xs text-slate-400">
                Showing <span className="font-bold text-emerald-400">{courses.length}</span> available courses
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md">{course.tuition}</span>
                        <span className="text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md">{course.seats}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-2">{course.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Instructor: {course.instructor}</p>
                      
                      {course.topics && (
                        <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block mb-2">
                            {course.modules || course.topics.length} Advanced Modules Included
                          </span>
                          <ul className="space-y-1.5">
                            {course.topics.map((topic, idx) => (
                              <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-2">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {course.enrolled || course.status === 'Enrolled' ? (
                      <div className="bg-emerald-950/80 text-emerald-400 text-center py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30">
                        <CheckCircle className="w-4 h-4" /> Enrolled
                      </div>
                    ) : course.status === 'Pending Approval' ? (
                      <div className="bg-amber-950/80 text-amber-400 text-center py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30">
                        <Clock className="w-4 h-4 animate-spin" /> Pending Faculty Approval
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleOpenPayment(course)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-md"
                      >
                        Enroll & Pay {course.numericPrice}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'My Enrollments' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Enrolled Subjects</h2>
              <div className="space-y-4">
                {courses.filter(c => c.enrolled || c.status === 'Enrolled').length === 0 ? (
                  <p className="text-xs text-slate-400">No enrolled courses yet.</p>
                ) : (
                  courses.filter(c => c.enrolled || c.status === 'Enrolled').map(c => (
                    <div key={c.id} className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl shadow-sm flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.title}</h4>
                        <p className="text-slate-400 text-[11px] mt-1">Instructor: {c.instructor}</p>
                      </div>
                      <span className="text-emerald-400 font-bold bg-emerald-950 border border-emerald-500/30 px-3 py-1 rounded-md">Enrolled</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'Course Notes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Faculty Study Notes & Modules</h2>
              {enrolledCourseTitles.length === 0 ? (
                <div className="bg-slate-800/40 border border-slate-700/60 p-8 rounded-2xl text-center text-xs text-slate-400">
                  🔒 Access Restricted: Complete enrollment and payment for a course to view notes.
                </div>
              ) : (
                <div className="space-y-3">
                  {studentNotes.map(note => (
                    <div key={note.id} className="bg-slate-800/50 border border-slate-700/60 p-5 rounded-2xl shadow-sm flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{note.title}</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5">{note.course}</p>
                      </div>
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer">
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Video Lectures' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Course Video Lectures</h2>
              {(() => {
                const approvedCourseTitles = courses.filter(c => c.enrolled || c.status === 'Enrolled').map(c => c.title);
                const authorizedVideos = videos.filter(v => approvedCourseTitles.includes(v.course));

                if (approvedCourseTitles.length === 0) {
                  return <div className="bg-slate-800/40 p-8 rounded-2xl text-center text-xs text-slate-400">🔒 Access Restricted: Complete course payment to unlock videos.</div>;
                }
                if (authorizedVideos.length === 0) {
                  return <div className="bg-slate-800/40 p-8 rounded-2xl text-center text-xs text-slate-400">No video lectures available for your enrolled courses yet.</div>;
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {authorizedVideos.map(video => (
                      <div key={video.id} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                        <div className="aspect-video w-full bg-slate-950">
                          <iframe className="w-full h-full" src={video.url} title={video.title} allowFullScreen></iframe>
                        </div>
                        <div className="p-5 space-y-2">
                          <span className="text-[10px] text-emerald-400 font-extrabold uppercase bg-emerald-950 px-2 py-0.5 rounded">{video.course}</span>
                          <h3 className="font-bold text-white text-sm">{video.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'Faculty Clarifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Ask Faculty Questions & Doubts</h2>
              <form onSubmit={handlePostDoubt} className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl space-y-4 max-w-2xl">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Select Course</label>
                  <select value={selectedCourseForDoubt} onChange={(e) => setSelectedCourseForDoubt(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-white outline-none cursor-pointer">
                    {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Question</label>
                  <textarea rows={3} required placeholder="Type doubt for faculty..." value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-white outline-none" />
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer">
                  <Send className="w-4 h-4" /> Send Question
                </button>
              </form>

              <div className="space-y-4 max-w-2xl">
                {doubts.map(d => (
                  <div key={d.id} className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-2 text-xs">
                    <p className="font-bold text-white">Q: {d.question}</p>
                    {d.reply ? (
                      <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/30 text-emerald-300">
                        <strong>Faculty Reply (Arepalli Gopi):</strong> {d.reply}
                      </div>
                    ) : (
                      <p className="text-amber-400">Awaiting Faculty Reply...</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Payment History' && (
            <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-base font-bold text-white">Active Payment Receipts</h3>
              {activePaymentHistory.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No payment receipts found for your enrolled courses.</p>
              ) : (
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-700">
                    <tr>
                      <th className="p-3">Receipt ID</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Ref Detail</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {activePaymentHistory.map(receipt => (
                      <tr key={receipt.id}>
                        <td className="p-3 font-mono text-slate-400">{receipt.id}</td>
                        <td className="p-3 text-white font-bold">{receipt.course}</td>
                        <td className="p-3 font-mono text-emerald-400">{receipt.upiId}</td>
                        <td className="p-3 font-bold text-emerald-400">{receipt.amount}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-md font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30">
                            {receipt.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleDownloadReceipt(receipt)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 ml-auto cursor-pointer transition shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'Student Profile' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-2xl font-bold text-white">Student Info & Profile</h2>
              <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700/60 pb-6">
                  <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white">
                    {studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{studentName}</h3>
                    <p className="text-xs text-emerald-400 font-mono">Roll No: 238W1A05A1 • B.Tech CS</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmitPayment={handlePaymentSubmit}
        amount={selectedCourse?.numericPrice || "₹999.00"} 
        courseName={selectedCourse?.title || "Higher Education Course"} 
      />
    </div>
  );
}