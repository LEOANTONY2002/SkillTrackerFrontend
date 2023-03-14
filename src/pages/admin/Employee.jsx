import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Error from "../../components/Error";
import loader from "../../assets/loader.svg";
import {
  useGetSearchEmployees,
  useGetSearchEmployeesBySkill,
} from "../../graphql/query/useGetSearch";
import "./Employee.css";
import Nav from "./Nav";
import { useGetAllEmployees } from "../../graphql/query/useGetAllEmployees";
import iEmpR from "../../assets/iEmpR.png";
import iForW from "../../assets/iForW.png";
import iSkillR from "../../assets/iSkillR.png";
import iCertR from "../../assets/iCertR.png";

function Employee() {
  const [zoom, setZoom] = useState({
    open: false,
    cert: {},
  });
  const [displayEmployees, setDisplayEmployees] = useState([]);
  const [err, setErr] = useState({
    open: false,
    msg: "",
  });
  const [search, setSearch] = useState({
    word: "",
    employees: [],
  });
  const [load, setLoading] = useState(false);
  // const {loading: gettingEmployees, employees: employees=[], error: errorEmployees} = useGetAllEmployees()
  const { skills } = useSelector((state) => state.admin);
  const [selectedOption, setSelectedOption] = useState(null);
  const {
    loading: gettingEmployees,
    employees: employees = [],
    error: errorEmployees,
  } = useGetAllEmployees();
  const { loading: searchingEmployees, searchEmployees } =
    useGetSearchEmployees();
  const { loading: searchingEmployeesBySkill, searchEmployeesBySkill } =
    useGetSearchEmployeesBySkill();
  const [activeIndex, setActiveIndex] = useState(null);

  console.log(selectedOption);

  // DisplayEmployees and Error corrections
  useEffect(() => {
    if (employees?.length !== 0) {
      setDisplayEmployees(employees);
      setErr({ open: false, msg: "" });
    }
  }, [gettingEmployees]);

  useEffect(() => {
    if (search.employees.length !== 0) {
      setDisplayEmployees(search.employees);
    }
  }, [search.employees]);

  useEffect(() => {
    if (displayEmployees?.length !== 0) {
      setErr({ open: false, msg: "" });
    }
  }, [displayEmployees]);

  useEffect(() => {
    if (selectedOption !== null) searchEmployeeBySkill();
  }, [selectedOption]);

  useEffect(() => {
    if (searchingEmployeesBySkill) setLoading(true);
    else setLoading(false);

    if (searchingEmployees) setLoading(true);
    else setLoading(false);
  }, [searchingEmployeesBySkill, searchingEmployees]);

  const cat = (es) => {
    let ct = {};
    es.map((s) => {
      if (ct.hasOwnProperty(s?.skill?.category?.name))
        ct[s?.skill?.category?.name] += 1;
      else ct[s?.skill?.category?.name] = 1;
    });
    return Object.keys(ct).length;
  };

  // Search
  const searchEmployee = async () => {
    if (search.word !== "") {
      const { data } = await searchEmployees({
        variables: { word: search.word },
      });
      if (searchingEmployees) setLoading(true);
      if (data?.searchEmployee?.length === 0) {
        // setLoading(false)
        setDisplayEmployees([]);
        setSelectedOption(null);
      } else {
        setLoading(false);
        setSearch({ ...search, employees: data?.searchEmployee });
      }
    } else {
      setErr({
        open: true,
        msg: "Enter search field!",
      });
    }
  };

  // Search by skill
  const searchEmployeeBySkill = async () => {
    setSearch({ ...search, word: "" });
    const { data } = await searchEmployeesBySkill({
      variables: { word: selectedOption },
    });
    if (data?.searchEmployeeBySkill?.length === 0) {
      setDisplayEmployees([]);
      setSelectedOption(null);
      setLoading(false);
    } else {
      setSearch({
        ...search,
        word: "",
        employees: data?.searchEmployeeBySkill,
      });
      setLoading(false);
    }
  };

  // Ascending
  const ascendingEmployee = async () => {
    let employees = [...displayEmployees];
    let ascEmployees = employees.sort((a, b) =>
      a?.name > b?.name ? 1 : b?.name > a?.name ? -1 : 0
    );
    setDisplayEmployees(ascEmployees);
  };

  // Descending
  const descendingEmployee = async () => {
    let employees = [...displayEmployees];
    let descEmployees = employees.sort((a, b) =>
      a?.name < b?.name ? 1 : b?.name < a?.name ? -1 : 0
    );
    setDisplayEmployees(descEmployees);
  };

  return (
    <>
      <div className="employee">
        <div className="c-title">
          <p>Employees</p>
          <span></span>
        </div>
        <div className="search">
          <div className="sh-body">
            <input
              type="text"
              onKeyDown={(e) => e.key === "Enter" && searchEmployee()}
              placeholder="Search Employees..."
              value={search.word}
              onChange={(e) => setSearch({ ...search, word: e.target.value })}
              required
            />
            <img
              onClick={() => searchEmployee()}
              src="https://img.icons8.com/ios-glyphs/30/fc3737/search.png"
              alt=""
            />
          </div>
          <div className="sh-filter">
            <img
              src="https://img.icons8.com/fluency-systems-regular/48/null/empty-filter.png"
              alt=""
            />
            <span style={{ marginLeft: "-10px" }}>Filter: </span>
            <p
              onClick={() => {
                setSelectedOption(null);
                setSearch({ ...search, word: "", skills: [] });
                setDisplayEmployees(employees);
              }}
              style={
                displayEmployees === employees
                  ? { backgroundColor: "red", color: "white" }
                  : {}
              }
            >
              All
            </p>
            <select onChange={(e) => setSelectedOption(e.target.value)}>
              <option selected={selectedOption === null} disabled>
                Skills
              </option>
              {skills?.map((s) => (
                <option value={s?.skill?.name}>{s?.skill?.name}</option>
              ))}
            </select>
            <img
              onClick={() => ascendingEmployee()}
              src="https://img.icons8.com/fluency-systems-regular/48/fc3737/sort-alpha-up.png"
              alt=""
            />
            <img
              onClick={() => descendingEmployee()}
              src="https://img.icons8.com/fluency-systems-regular/48/fc3737/alphabetical-sorting-2.png"
              alt=""
            />
          </div>
        </div>

        {/* {load && <img style={{width: "40px"}} src={loader} alt=''/>} */}

        {searchingEmployees || searchingEmployeesBySkill || gettingEmployees ? (
          <div
            style={{ width: "100%", display: "grid", placeContent: "center" }}
          >
            <img style={{ width: "60px" }} src={loader} alt="" />
          </div>
        ) : (
          <>
            {displayEmployees.length !== 0 ? (
              <div className="e-main">
                {displayEmployees.map((e, index) => {
                  const isActive = index === activeIndex;
                  if (e?.employeeSkills?.length !== 0)
                    return (
                      <div className="emp" key={e?.id}>
                        <div className="e-head">
                          <img
                            style={
                              e?.photo !== ""
                                ? {
                                    padding: "0px",
                                    width: "60px",
                                    height: "60px",
                                  }
                                : { padding: "10px" }
                            }
                            src={e?.photo !== "" ? e?.photo : iEmpR}
                            alt=""
                          />
                          <div className="e-title">
                            <div>
                              <p>{e?.name}</p>
                              <span>{e?.email}</span>
                            </div>
                            <img
                              onClick={() =>
                                setActiveIndex(isActive ? null : index)
                              }
                              src={iForW}
                              alt=""
                              style={
                                isActive ? { transform: "rotate(-90deg)" } : {}
                              }
                            />
                          </div>
                        </div>
                        <div className="e-body">
                          <p>{cat(e?.employeeSkills)}</p>
                          <span>Categories</span>
                          <p>{e?.employeeSkills?.length}</p>
                          <span>Skills</span>
                        </div>
                        {isActive && <span>Skills</span>}
                        {index === activeIndex && (
                          <div className="eb-eskills">
                            {e?.employeeSkills.map((es, index) => (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div className="eb-skill">
                                  <div className="ebs-head">
                                    <img src={iSkillR} alt="" />
                                    <div>
                                      <p>{es?.skill?.skill?.name}</p>
                                      <span>{es?.skill?.category?.name}</span>
                                    </div>
                                  </div>
                                  <h5 style={{ color: "red" }}>{es?.level}</h5>
                                  <h6>{es?.updatedAt?.split("T")[0]}</h6>
                                </div>
                                {es?.certificate && (
                                  <div className="s-cert">
                                    <span></span>
                                    <div
                                      onClick={() =>
                                        setZoom({
                                          open: true,
                                          cert: es?.certificate,
                                        })
                                      }
                                    >
                                      <img src={iCertR} alt="" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                })}
              </div>
            ) : (
              <h6
                style={{
                  color: "red",
                  marginTop: "30px",
                  fontSize: "smaller",
                  wordBreak: "keep-all",
                  textAlign: "center",
                }}
              >
                {!gettingEmployees && "No records found!"}
              </h6>
            )}

            {displayEmployees === employees && (
              <p style={{ marginTop: "50px", color: "red", fontSize: "small" }}>
                Other Employees
              </p>
            )}

            {displayEmployees === employees && (
              <div className="e-main">
                {displayEmployees.map((e) => {
                  if (e?.employeeSkills?.length === 0)
                    return (
                      <div className="emp" key={e?.id}>
                        <div className="e-head">
                          <img
                            style={
                              e?.photo !== ""
                                ? {
                                    padding: "0px",
                                    width: "60px",
                                    height: "60px",
                                  }
                                : { padding: "10px" }
                            }
                            src={
                              e?.photo !== ""
                                ? e?.photo
                                : "https://img.icons8.com/fluency-systems-filled/70/fc3737/collaborator-male?.png"
                            }
                            alt=""
                          />
                          <div className="e-title">
                            <div>
                              <p>{e?.name}</p>
                              <span>{e?.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                })}
              </div>
            )}
          </>
        )}

        {zoom.open && (
          <div className="zoom">
            <img
              onClick={() => {
                setZoom({ open: false, cert: {} });
              }}
              src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
              alt=""
            />
            <div className="z-cert">
              <div className="zc-title">
                <p>{zoom.cert?.name}</p>
                <span>{zoom.cert?.publisher?.name}</span>
              </div>
              <img src={zoom.cert?.photo} alt="" />
              <div className="zc-exp">
                <p>expiry</p>
                <span>{zoom.cert?.expiry}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {err.open && <Error err={err} setErr={setErr} />}

      <Nav />
    </>
  );
}

export default Employee;
