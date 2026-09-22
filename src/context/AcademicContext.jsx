import React, { createContext, useContext, useState, useEffect } from 'react';

const AcademicContext = createContext();

export function AcademicProvider({ children }) {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('ax_courses');
    return saved ? JSON.parse(saved) : [
      // COMPUTER SCIENCE (2 COURSES)
      { 
        id: 'CS301', 
        title: 'Data Structures & Algorithms in Java', 
        instructor: 'Arepalli Gopi', 
        category: 'Computer Science', 
        tuition: '₹1,299 Tuition', 
        numericPrice: '₹1,299.00', 
        amountVal: '1299', 
        seats: '5 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 4, 
        topics: [
          'Arrays, Linked Lists & Double-Ended Queues', 
          'Trees & Graph Traversal Algorithms (BFS/DFS)', 
          'Dynamic Programming & Greedy Strategies', 
          'Sorting & Searching Optimization'
        ]
      },
      { 
        id: 'CS302', 
        title: 'Full-Stack Web Dev (React & Spring Boot)', 
        instructor: 'Arepalli Gopi', 
        category: 'Computer Science', 
        tuition: '₹1,899 Tuition', 
        numericPrice: '₹1,899.00', 
        amountVal: '1899', 
        seats: '3 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 4, 
        topics: [
          'React Functional Components, Hooks & State', 
          'Spring Boot REST API & Controller Design', 
          'MySQL Database Schemas & Spring Data JPA', 
          'JWT Authentication & Role-Based Access Control'
        ]
      },

      // DATA SCIENCE (2 COURSES)
      { 
        id: 'DS201', 
        title: 'Data Science & Python Data Analysis', 
        instructor: 'Arepalli Gopi', 
        category: 'Data Science', 
        tuition: '₹1,499 Tuition', 
        numericPrice: '₹1,499.00', 
        amountVal: '1499', 
        seats: '12 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 3, 
        topics: [
          'Pandas, NumPy & Vectorized Computations', 
          'Exploratory Data Analysis (EDA) Techniques', 
          'Statistical Data Visualization with Matplotlib & Seaborn'
        ]
      },
      { 
        id: 'DS202', 
        title: 'Big Data Analytics & Apache Spark', 
        instructor: 'Arepalli Gopi', 
        category: 'Data Science', 
        tuition: '₹2,199 Tuition', 
        numericPrice: '₹2,199.00', 
        amountVal: '2199', 
        seats: '8 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 4, 
        topics: [
          'Hadoop Distributed File System (HDFS) Architecture', 
          'Apache Spark RDDs & Structured DataFrames', 
          'Real-time Distributed Streaming Data Pipelines', 
          'Data Warehousing & Query Performance'
        ]
      },

      // ARTIFICIAL INTELLIGENCE (2 COURSES)
      { 
        id: 'AI401', 
        title: 'Deep Learning & Neural Networks', 
        instructor: 'Arepalli Gopi', 
        category: 'Artificial Intelligence', 
        tuition: '₹2,499 Tuition', 
        numericPrice: '₹2,499.00', 
        amountVal: '2499', 
        seats: '10 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 4, 
        topics: [
          'Perceptrons & Multilayer Artificial Neural Networks', 
          'Convolutional Neural Networks (CNNs) for Vision', 
          'Recurrent Networks (RNNs) & Transformer Models', 
          'PyTorch Framework & Model Optimization'
        ]
      },
      { 
        id: 'AI402', 
        title: 'Computer Vision & Image Processing', 
        instructor: 'Arepalli Gopi', 
        category: 'Artificial Intelligence', 
        tuition: '₹2,299 Tuition', 
        numericPrice: '₹2,299.00', 
        amountVal: '2299', 
        seats: '6 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 3, 
        topics: [
          'Image Filtering, Thresholding & Gaussian Blurring', 
          'Sobel & Canny Edge Detection Algorithms', 
          'Object Detection & OpenCV Integration'
        ]
      },

      // CYBERSECURITY (2 COURSES)
      { 
        id: 'CY501', 
        title: 'Ethical Hacking & Network Security', 
        instructor: 'Arepalli Gopi', 
        category: 'Cybersecurity', 
        tuition: '₹1,699 Tuition', 
        numericPrice: '₹1,699.00', 
        amountVal: '1699', 
        seats: '6 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 4, 
        topics: [
          'Network Footprinting & Port Scanning Techniques', 
          'System Exploitation & Privilege Escalation', 
          'OWASP Top 10 Web Application Vulnerabilities', 
          'Public Key Infrastructure (PKI) & Cryptography'
        ]
      },
      { 
        id: 'CY502', 
        title: 'Cloud Security & DevSecOps Architecture', 
        instructor: 'Arepalli Gopi', 
        category: 'Cybersecurity', 
        tuition: '₹2,099 Tuition', 
        numericPrice: '₹2,099.00', 
        amountVal: '2099', 
        seats: '9 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 3, 
        topics: [
          'AWS & Azure Cloud Identity & Access Management (IAM)', 
          'Container Security & Docker Isolation Controls', 
          'Automated CI/CD Vulnerability Scanning'
        ]
      },

      // BUSINESS & FINANCE (2 COURSES)
      { 
        id: 'BF101', 
        title: 'Corporate Finance & Investment Banking', 
        instructor: 'Arepalli Gopi', 
        category: 'Business & Finance', 
        tuition: '₹1,599 Tuition', 
        numericPrice: '₹1,599.00', 
        amountVal: '1599', 
        seats: '15 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 3, 
        topics: [
          'Financial Statement Analysis & Capital Budgeting', 
          'Discounted Cash Flow (DCF) Valuation Models', 
          'Portfolio Risk Management & Asset Valuation'
        ]
      },
      { 
        id: 'BF102', 
        title: 'Digital Marketing & Fintech Innovation', 
        instructor: 'Arepalli Gopi', 
        category: 'Business & Finance', 
        tuition: '₹1,399 Tuition', 
        numericPrice: '₹1,399.00', 
        amountVal: '1399', 
        seats: '14 Seats Left', 
        enrolled: false, 
        status: 'Not Enrolled',
        modules: 3, 
        topics: [
          'Algorithmic Trading & Blockchain Payments', 
          'Digital Marketplace B2B Growth Analytics', 
          'Customer Acquisition & Conversion Optimization'
        ]
      }
    ];
  });

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Module 1: Linear & Non-Linear Data Structures Guide',
      course: 'Data Structures & Algorithms in Java',
      instructor: 'Arepalli Gopi',
      date: '2026-08-10',
      fileSize: '3.2 MB'
    },
    {
      id: 2,
      title: 'Module 2: React State Hooks & Custom Spring Boot APIs',
      course: 'Full-Stack Web Dev (React & Spring Boot)',
      instructor: 'Arepalli Gopi',
      date: '2026-08-14',
      fileSize: '4.1 MB'
    }
  ]);

  const [videos, setVideos] = useState([
    {
      id: 101,
      title: 'Lecture 1: Introduction to Data Structures & Complexity Analysis',
      course: 'Data Structures & Algorithms in Java',
      duration: '45 mins',
      url: 'https://www.youtube.com/embed/RBSGKlAvoiM'
    },
    {
      id: 102,
      title: 'Lecture 2: Building Full-Stack Apps with React & Spring Boot',
      course: 'Full-Stack Web Dev (React & Spring Boot)',
      duration: '50 mins',
      url: 'https://www.youtube.com/embed/vtPkZShrvXQ'
    }
  ]);

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('ax_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    localStorage.setItem('ax_courses', JSON.stringify(courses));
    localStorage.setItem('ax_payments', JSON.stringify(payments));
  }, [courses, payments]);

  const addCourse = (newCourse) => setCourses(prev => [newCourse, ...prev]);

  const approveEnrollment = (courseId) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolled: true, status: 'Enrolled' } : c));
    setPayments(prev => prev.map(p => p.courseId === courseId ? { ...p, status: 'Approved' } : p));
  };

  const rejectEnrollment = (courseId) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolled: false, status: 'Not Enrolled' } : c));
    setPayments(prev => prev.map(p => p.courseId === courseId ? { ...p, status: 'Rejected' } : p));
  };

  const addPaymentRequest = (selectedCourse, refDetail) => {
    const receiptId = `RCP-${Math.floor(1000 + Math.random() * 9000)}`;
    setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, status: 'Pending Approval' } : c));
    setPayments(prev => [{
      id: receiptId, 
      courseId: selectedCourse.id, 
      course: selectedCourse.title, 
      amount: selectedCourse.numericPrice, 
      date: new Date().toLocaleDateString(), 
      upiId: refDetail, 
      status: 'Pending Approval'
    }, ...prev]);
  };

  const uploadNote = (newNote) => setNotes(prev => [newNote, ...prev]);
  const uploadVideo = (newVideo) => setVideos(prev => [newVideo, ...prev]);
  const sendDoubt = (newDoubt) => setDoubts(prev => [newDoubt, ...prev]);
  const replyDoubt = (doubtId, replyText) => {
    setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, reply: replyText } : d));
  };

  return (
    <AcademicContext.Provider value={{
      courses, notes, videos, payments, doubts,
      addCourse, approveEnrollment, rejectEnrollment, addPaymentRequest,
      uploadNote, uploadVideo, sendDoubt, replyDoubt
    }}>
      {children}
    </AcademicContext.Provider>
  );
}

export const useAcademic = () => useContext(AcademicContext);