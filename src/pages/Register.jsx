import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, UserPlus } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('student'); // 'student' or 'faculty'
  
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    email: '',
    mobile: '',
    password: '',
    address: '',
    tenthGrade: '',
    twelfthGrade: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registration successful for ${formData.fullName} (${accountType.toUpperCase()} account)!`);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl mx-auto flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">AcademiaX</h1>
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Complete User Registration</p>
        </div>

        {/* Account Type Toggle */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setAccountType('student')}
            className={`py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              accountType === 'student' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Student Account
          </button>
          <button
            type="button"
            onClick={() => setAccountType('faculty')}
            className={`py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              accountType === 'faculty' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Faculty Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-4">1. Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  required 
                  placeholder="e.g. Mohith Sai" 
                  value={formData.fullName} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob" 
                  required 
                  value={formData.dob} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="user@domain.com" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500" 
                />
              </div>

              {/* Mobile Number - Full Width without OTP Button */}
              <div className="md:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  required 
                  placeholder="+91 9876543210" 
                  value={formData.mobile} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Account Password</label>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  placeholder="••••••••••••" 
                  value={formData.password} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">Residential Address</label>
                <textarea 
                  name="address" 
                  rows={2} 
                  required 
                  placeholder="Street name, City, State, Pincode" 
                  value={formData.address} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500" 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-4">2. Academic Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">10th Grade Percentage / CGPA</label>
                <input 
                  type="text" 
                  name="tenthGrade" 
                  placeholder="e.g. 88.5% or 9.2 CGPA" 
                  value={formData.tenthGrade} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">12th Grade / Diploma Percentage</label>
                <input 
                  type="text" 
                  name="twelfthGrade" 
                  placeholder="e.g. 91.0%" 
                  value={formData.twelfthGrade} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <UserPlus className="w-4 h-4" /> Complete {accountType === 'student' ? 'Student' : 'Faculty'} Registration
          </button>
        </form>
      </div>
    </div>
  );
}