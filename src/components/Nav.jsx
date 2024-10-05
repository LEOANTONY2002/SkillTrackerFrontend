import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.svg";
import "./Nav.css";

function Nav({ shrink, setShrink }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    user.length === 0 && navigate("/employee/login");
  }, []);

  return (
    <div
      style={{ zIndex: 10 }}
      className={shrink ? "options shrink" : "options"}
      onMouseEnter={() => setShrink(false)}
      onMouseLeave={() => setShrink(true)}
    >
      <main>
        <span className="cx">
          <img src={logo} alt="" />
        </span>
        <div onClick={() => navigate("/employee/profile")} className="h-div">
          <p>Profile</p>
          <div>
            <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/group-background-selected.png" />
          </div>
        </div>
        <div onClick={() => navigate("/employee/skill")} className="h-div">
          <p>Skill</p>
          <div>
            <img src="https://img.icons8.com/material-outlined/48/ffffff/light-on--v1.png" />
          </div>
        </div>
        <div
          onClick={() => navigate("/employee/certificate")}
          className="h-div"
        >
          <p>Certificate</p>
          <div>
            <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/upload.png" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Nav;
