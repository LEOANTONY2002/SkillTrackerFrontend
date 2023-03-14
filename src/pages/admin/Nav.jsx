import React from "react";
import "./Nav.css";
import logo from "../../assets/icon.svg";
import { useNavigate } from "react-router-dom";
import iSkillOW from "../../assets/iSkillOW.png";
import iCatOW from "../../assets/iCatOW.png";
import iDashW from "../../assets/iDashW.png";
import iCertOW from "../../assets/iCertOW.png";
import iEmpsW from "../../assets/iEmpsW.png";
import iAdminW from "../../assets/iAdminW.png";

function Nav() {
  const navigate = useNavigate();

  return (
    <div className="menu">
      <span className="cx">
        <img src={logo} alt="" />
      </span>
      <div className="nav">
        <div onClick={() => navigate("/admin")}>
          <img src={iDashW} alt="" />
          <p>Dashboard</p>
        </div>
        <div onClick={() => navigate("/admin/employee")}>
          <img src={iEmpsW} alt="" />
          <p>Employees</p>
        </div>
        <div onClick={() => navigate("/admin/category")}>
          <img src={iCatOW} alt="" />
          <p>Categories</p>
        </div>
        <div onClick={() => navigate("/admin/skill")}>
          <img src={iSkillOW} alt="" />
          <p>Skills</p>
        </div>
        <div onClick={() => navigate("/admin/certificate")}>
          <img src={iCertOW} alt="" />
          <p>Certificates</p>
        </div>
        <div onClick={() => navigate("/admin/admins")}>
          <img src={iAdminW} alt="" />
          <p>Admins</p>
        </div>
      </div>
    </div>
  );
}

export default Nav;
