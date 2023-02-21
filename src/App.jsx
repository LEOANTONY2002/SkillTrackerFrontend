import './App.css';
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Home from './pages/user/Home';
import { useSelector } from 'react-redux';
import Login from './pages/user/Login';
import EmployeeCertificate from './pages/user/Certificate';
import Profile from './pages/user/Profile';
import EmployeeSkill from './pages/user/Skill';
import Employee from './pages/admin/Employee';
import Skill from './pages/admin/Skill';
import Category from './pages/admin/Category';
import Dashboard from './pages/admin/Dashboard';
import Certificate from './pages/admin/Certificate';
import Admins from './pages/admin/Admins';

function App() {
  const { user } = useSelector((state) => state.user)
  let path = window.location.pathname || ""
  const [admin, setAdmin] = useState(true)
  const navigate = useNavigate()

  console.log(user)

  useEffect(() => {
    admin ? navigate("/admin"): navigate("/employee")
  }, [admin])

  return (
    <>
        <div className="App">
          <Routes>
            {/* {user.length !== 0 ?
              user.email === "admin@changecx.com"
                ? <Route path='/' element={<Dashboard />} />
                : <Route path='/employee' element={<Home />} />
              : <Route path='/employee/login' element={<Login />} />
            } */}
            <Route path='/' element={<Home />} />
            <Route path='/admin/admins' element={<Admins />} />
            <Route path='/admin/certificate' element={<Certificate />} />
            <Route path='/admin/employee' element={<Employee />} />
            <Route path='/admin/skill' element={<Skill />} />
            <Route path='/admin/category' element={<Category />} />
            <Route path='/admin' element={<Dashboard />} />

            <Route path='/employee' element={<Home />} />
            <Route path='/employee/profile' element={<Profile />} />
            <Route path='/employee/skill' element={<EmployeeSkill />} />
            <Route path='/employee/certificate' element={<EmployeeCertificate />} />
            <Route path='/employee/login' element={<Login />} />
          </Routes>
        </div>
        {(user?.hasOwnProperty("email") && user?.isAdmin) &&
          <div className="ad-toggle">
            <img onClick={() => setAdmin(true)} style={admin ? {background: "linear-gradient(120deg, #fc3737a4, red)", boxShadow: "0 2px 15px rgba(255, 170, 170, 0.717)"} : {}} src={`https://img.icons8.com/fluency-systems-regular/48/${admin ? 'ffffff' : 'fc3737'}/system-administrator-male.png`} alt='' />
            <img onClick={() => setAdmin(false)} style={!admin ? {background: "linear-gradient(120deg, #fc3737a4, red)", boxShadow: "0 2px 15px rgba(255, 170, 170, 0.717)"} : {}} src={`https://img.icons8.com/fluency-systems-regular/48/${!admin ? 'ffffff' : 'fc3737'}/group-background-selected.png`} alt='' />                   
          </div>
        }      
    </>
  );
}

export default App;
