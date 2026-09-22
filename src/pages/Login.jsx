import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, User, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'faculty') {
      navigate('/faculty-dashboard', { 
        state: { role: 'FACULTY', name: 'Dr. Sarah', email } 
      });
    } else {
      navigate('/student-dashboard', { 
        state: { role: 'STUDENT', name: 'HARSHITH REDDY', email } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 justify-center text-center">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h1 className="font-extrabold text-xl text-white">AcademiaX</h1>
            <p className="text-xs text-indigo-400 font-mono">Learning & Faculty Portal</p>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-[#0a0f1d] p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              role === 'student' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student Login</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('faculty')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              role === 'faculty' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Faculty Login</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Email / User ID</label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'student' ? 'mohith@student.edu' : 'sarah@faculty.edu'}
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Access {role === 'student' ? 'Student' : 'Faculty'} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}