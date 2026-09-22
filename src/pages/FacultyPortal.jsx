import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  LogOut, 
  FileText, 
  Video, 
  Book, 
  Check, 
  X, 
  ShieldCheck, 
  Plus,
  MessageSquare,
  Send,
  User
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';

export default function FacultyPortal() {
  const navigate = useNavigate();
  const { 
    payments = [], 
    courses = [], 
    doubts = [], 
    addCourse, 
    approveEnrollment, 
    rejectEnrollment, 
    uploadNote, 
    uploadVideo,
    replyDoubt 
  } = useAcademic();

  const [activeTab, setActiveTab] = useState('Verify Payments');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  const [newCourseId, setNewCourseId] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science');
  const [newPrice, setNewPrice] = useState('');
  const [newSeats, setNewSeats] = useState('');

  const [selectedCourseForNote, setSelectedCourseForNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteFileName, setNoteFileName] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [replyTextMap, setReplyTextMap] = useState({});

  const pendingPayments = payments.filter(p => p.status === 'Pending Approval');

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseId || !newCourseTitle || !newPrice) return;

    const formattedPrice = newPrice.startsWith('₹') ? newPrice : `₹${newPrice}`;

    addCourse({
      id: newCourseId.toUpperCase(),
      title: newCourseTitle,
      category: newCategory,
      instructor: 'Arepalli Gopi',
      tuition: `${formattedPrice} Tuition`,
      numericPrice: `${formattedPrice}.00`,
      amountVal: newPrice.replace(/[^0-9]/g, ''),
      seats: `${newSeats || '10'} Seats Left`,
      enrolled: false,
      status: 'Not Enrolled',
      modules: 3,
      topics: ['Introduction & Core Syntax', 'System Architecture & Integration', 'Practical Hands-on Projects']
    });

    setNewCourseId('');
    setNewCourseTitle('');
    setNewPrice('');
    setNewSeats('');
    setShowAddCourseModal(false);
    alert('New academic course published across both Student & Faculty portals!');
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteTitle || !noteFileName) return;

    uploadNote({
      id: Date.now(),
      title: noteTitle,
      course: selectedCourseForNote || courses[0]?.title,
      instructor: 'Arepalli Gopi',
      date: new Date().toISOString().split('T')[0],
      fileSize: '2.4 MB',
      fileName: noteFileName
    });

    setNoteTitle('');
    setNoteFileName('');
    alert('Study note published successfully!');
  };

  const handleVideoUpload = (e) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl) return;

    let embedUrl = videoUrl;
    if (videoUrl.includes('watch?v=')) {
      embedUrl = videoUrl.replace('watch?v=', 'embed/').split('&')[0];
    } else if (videoUrl.includes('youtu.be/')) {
      embedUrl = `https://www.youtube.com/embed/${videoUrl.split('youtu.be/')[1]?.split('?')[0]}`;
    }

    uploadVideo({
      id: Date.now(),
      title: videoTitle,
      course: selectedCourseForNote || courses[0]?.title,
      duration: '45 mins',
      url: embedUrl
    });

    setVideoTitle('');
    setVideoUrl('');
    alert('Video lecture published successfully!');
  };

  const handleSendReply = (doubtId) => {
    const reply = replyTextMap[doubtId];
    if (!reply || !reply.trim()) return;

    replyDoubt(doubtId, reply);
    setReplyTextMap(prev => ({ ...prev, [doubtId]: '' }));
    alert('Clarification reply sent to student portal!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="font-extrabold text-lg text-white">AcademiaX Platform</h1>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase">Faculty Control Center</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            • Arepalli Gopi
          </div>
          <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-1">
          {[
            { name: 'Verify Payments', icon: ShieldCheck },
            { name: 'Student Clarifications', icon: MessageSquare },
            { name: 'Faculty Profile', icon: User },
            { name: 'Assigned Courses', icon: Book },
            { name: 'Upload Course Notes', icon: FileText },
            { name: 'Upload Video Lectures', icon: Video }
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
          {activeTab === 'Verify Payments' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Student Enrollment Verification</h2>
              {pendingPayments.length === 0 ? (
                <div className="bg-slate-800/40 border border-slate-700/60 p-8 rounded-2xl text-center text-xs text-slate-400">
                  No pending student payment requests.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map(p => (
                    <div key={p.id} className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white text-base">{p.course}</h4>
                        <p className="text-xs text-slate-300">Payment Reference: <span className="text-emerald-400 font-mono font-bold">{p.upiId}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approveEnrollment(p.courseId)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => rejectEnrollment(p.courseId)} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Faculty Profile' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-2xl font-bold text-white">Faculty Info & Profile</h2>
              <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700/60 pb-6">
                  <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white">A</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Arepalli Gopi</h3>
                    <p className="text-xs text-emerald-400 font-mono">Senior Professor • Department of Computer Science</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Designation</span>
                    <span className="text-white font-bold mt-1 block">Head of Curriculum</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Faculty Email</span>
                    <span className="text-white font-bold mt-1 block">gopiarepalli99@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Assigned Courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Higher Education Courses Overview</h2>
                <button onClick={() => setShowAddCourseModal(true)} className="bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer">
                  <Plus className="w-4 h-4" /> Add New Course
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-md">{course.id}</span>
                      <span className="text-xs font-bold text-slate-300">{course.numericPrice}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{course.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Category: {course.category}</p>

                      {course.topics && (
                        <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">{course.modules || course.topics.length} Modules</span>
                          <ul className="space-y-1">
                            {course.topics.map((t, i) => (
                              <li key={i} className="text-[11px] text-slate-300">• {t}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Upload Course Notes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Upload Course Notes Document</h2>
              <form onSubmit={handleNoteSubmit} className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl space-y-4 max-w-xl">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Course</label>
                  <select 
                    value={selectedCourseForNote} 
                    onChange={(e) => setSelectedCourseForNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-white outline-none"
                  >
                    {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Note Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Unit 1 Architecture" 
                    value={noteTitle} 
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Document File Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Course_Notes.pdf" 
                    value={noteFileName} 
                    onChange={(e) => setNoteFileName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <button type="submit" className="w-full bg-emerald-600 font-bold py-3.5 rounded-xl text-xs text-white cursor-pointer">
                  Publish Note
                </button>
              </form>
            </div>
          )}

          {activeTab === 'Upload Video Lectures' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Upload Video Lecture</h2>
              <form onSubmit={handleVideoUpload} className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl space-y-4 max-w-xl">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Course</label>
                  <select 
                    value={selectedCourseForNote} 
                    onChange={(e) => setSelectedCourseForNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-white outline-none"
                  >
                    {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Video Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Lecture 1: Algorithms Intro" 
                    value={videoTitle} 
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">YouTube Video Link</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. https://www.youtube.com/watch?v=..." 
                    value={videoUrl} 
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <button type="submit" className="w-full bg-emerald-600 font-bold py-3.5 rounded-xl text-xs text-white cursor-pointer">
                  Publish Video
                </button>
              </form>
            </div>
          )}

          {activeTab === 'Student Clarifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Student Questions & Clarifications</h2>
              <div className="space-y-4 max-w-3xl">
                {doubts.map(d => (
                  <div key={d.id} className="bg-slate-800/50 border border-slate-700/60 p-5 rounded-2xl space-y-3 text-xs">
                    <p className="font-bold text-white">Q: {d.question}</p>
                    {d.reply ? (
                      <p className="text-emerald-300 bg-emerald-950 p-3 rounded-xl border border-emerald-500/30">Clarification: {d.reply}</p>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Type reply..." 
                          value={replyTextMap[d.id] || ''} 
                          onChange={(e) => setReplyTextMap({ ...replyTextMap, [d.id]: e.target.value })} 
                          className="flex-1 bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none"
                        />
                        <button onClick={() => handleSendReply(d.id)} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer">
                          <Send className="w-3.5 h-3.5" /> Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-lg">Add New Academic Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white outline-none">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Business & Finance">Business & Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Course Code</label>
                <input type="text" required value={newCourseId} onChange={(e) => setNewCourseId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Course Title</label>
                <input type="text" required value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Price (₹)</label>
                <input type="text" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white outline-none" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl cursor-pointer">Publish Course</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}