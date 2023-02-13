import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Error from "../../components/Error";
import { useGetAllEmployees } from "../../graphql/query/useGetAllEmployees";
import { useGetSearchEmployees, useGetSearchEmployeesBySkill } from "../../graphql/query/useGetSearch";
import Select from 'react-select';
import "./Employee.css";
import Nav from "./Nav";

function Employee() {
  const [profile, setProfile] = useState({
    open: false,
    employee: [],
  });
  const [zoom, setZoom] = useState({
    open: false,
    cert: {}
  });
  const [displayEmployees, setDisplayEmployees] = useState([])
  const [err, setErr] = useState({
    open: false,
    msg: "",
  });
  const [search, setSearch] = useState({
    word: "",
    employees: []
  })
  // const {loading: gettingEmployees, employees: employees=[], error: errorEmployees} = useGetAllEmployees()
  const {employees, skills} = useSelector(state => state.admin)
  const [selectedOption, setSelectedOption] = useState(null);
  const {searchEmployees} = useGetSearchEmployees()
  const {searchEmployeesBySkill} = useGetSearchEmployeesBySkill()
  const [activeIndex, setActiveIndex] = useState(null);

  const content = useRef(null);

  const options = [
    ...skills?.map(s => ({value: s?.skill?.name, label: s?.skill?.name}))
  ]

  console.log(selectedOption)

  // DisplayEmployees and Error corrections
  useEffect(() => {
    if (employees?.length !== 0) {
      setDisplayEmployees(employees)
      setErr({open: false, msg: ""})
    }
  }, [])

  useEffect(() => {
    if (search.employees.length !== 0) {
      setDisplayEmployees(search.employees)
    }
  }, [search.employees])

  useEffect(() => {
    if (displayEmployees?.length !== 0) {
      setErr({open: false, msg: ""})
    }
  }, [displayEmployees])

  useEffect(() => {
    if (selectedOption !== null) searchEmployeeBySkill()
  }, [selectedOption])


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
    const {loading, data, error} = await searchEmployees({
      variables: {word: search.word}
    })
    setSearch({...search, employees: data?.searchEmployee})
    data?.searchEmployee?.length === 0 && setErr({
      open: true,
      msg: "No records found!"
    })
  }

  //search by skill
  const searchEmployeeBySkill = async () => {
    const {loading, data, error} = await searchEmployeesBySkill({
      variables: {word: selectedOption?.value}
    })
    setSearch({...search, employees: data?.searchEmployeeBySkill})
    data?.searchEmployee?.length === 0 && setErr({
      open: true,
      msg: "No records found!"
    })
  }

  // Ascending
  const ascendingEmployee = async () => {
    let employees = [...displayEmployees]
    let ascEmployees = employees.sort((a,b) => (a?.name > b?.name) ? 1 : ((b?.name > a?.name) ? -1 : 0))
    setDisplayEmployees(ascEmployees)
  }

  // Descending
  const descendingEmployee = async () => {
    let employees = [...displayEmployees]
    let descEmployees = employees.sort((a,b) => (a?.name < b?.name) ? 1 : ((b?.name < a?.name) ? -1 : 0))
    setDisplayEmployees(descEmployees)
  }


  return (
    <>
    <div className="employee">
      <div className="c-title">
        <p>Employees</p>
        <span></span>
      </div>
      <div className="search">
          <div className="sh-body">
            <input type="text" placeholder="Search Employees..." value={search.word} onChange={(e) => setSearch({...search, word: e.target.value})} required />
            <img
                onClick={() => searchEmployee()}
                src="https://img.icons8.com/ios-glyphs/30/fc3737/search.png"
                alt=""
              />
          </div>
          <div className="sh-filter">
            <img src="https://img.icons8.com/fluency-systems-regular/48/null/empty-filter.png" alt=""/>
            <span style={{marginLeft: "-10px"}}>Filter:  </span>
            <p 
              onClick={() => {
                setSearch({...search, word: "", skills: []});
                setDisplayEmployees(employees);
              }}
              style={displayEmployees === employees ? {backgroundColor: "red", color: "white"} : {}}
              >All</p>
              <Select
                value={selectedOption}
                onChange={setSelectedOption}
                options={options}
                placeholder="Skills"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    height: "20px",
                    borderRadius: "5px",
                    boxShadow: "0 3px 20px rgba(250, 172, 172, 0.212)"
                  }),
                  placeholder: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: "small"
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: 'red',
                    primary: 'red',
                  },
                })}
              />
              <img onClick={() => ascendingEmployee()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/sort-alpha-up.png" alt=""/>
              <img onClick={() => descendingEmployee()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/alphabetical-sorting-2.png" alt=""/>
          </div>
        </div>
      <div className="e-main">
        {displayEmployees !== 0 &&
          displayEmployees.map((e, index) => {
            const isActive = index === activeIndex
            if (e?.email !== "admin@changecx.com")
              return (
                <div className="emp" key={e?.id}>
                  <div className="e-head">
                    <img
                      style={
                        e?.photo
                          ? { padding: "0px", width: "50px", height: "50px" }
                          : { padding: "10px" }
                      }
                      src={
                        e?.photo !== null
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
                      <img
                        onClick={() => setActiveIndex(isActive ? null : index)}
                        src="https://img.icons8.com/fluency-systems-filled/30/ffffff/forward.png"
                        alt=""
                        style={isActive ? {transform: "rotate(-90deg)"} : {}}
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
                  {index === activeIndex && <div className="eb-eskills" >
                    {e?.employeeSkills.map((es, index) => (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="eb-skill">
                          <div className="ebs-head">
                              <img
                                src="https://img.icons8.com/fluency-systems-filled/48/fc3737/light-on--v1.png"
                                alt=""
                              />
                            <div>
                              <p>{es?.skill?.skill?.name}</p>
                              <span>{es?.skill?.category?.name}</span>
                            </div>
                          </div>
                          <h5
                            style={{color: "red"}}
                          >
                            {es?.level}
                          </h5>
                          <h6>{es?.updatedAt?.split("T")[0]}</h6>
                        </div>
                        {es?.certificate && (
                          <div className="s-cert">
                            <span></span>
                            <div onClick={() => setZoom({ open: true, cert: es?.certificate })}>
                              <img src="https://img.icons8.com/fluency-systems-regular/60/fc3737/certificate.png" alt=""/>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>}
                </div>
              );
          })}
      </div>

      {/* {profile?.open && (
        <div className="u-prof">
          <div>
            <img
              onClick={() => {
                setProfile({ open: false, employee: [] });
              }}
              src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
              alt=""
            />
            <div className="up-main">
              <div className="up-head">
                <div>
                  <img
                    style={
                      profile?.employee?.photo !== ""
                        ? { padding: "0px", width: "120px", height: "120px" }
                        : { padding: "20px" }
                    }
                    src={
                      profile?.employee?.photo !== ""
                        ? profile?.employee?.photo
                        : "https://img.icons8.com/fluency-systems-filled/100/ffffff/collaborator-male.png"
                    }
                    alt=""
                  />
                </div>
                <p></p>
              </div>
              <div className="up-title">
                <p>{profile?.employee?.name}</p>
                <span>{profile?.employee?.email}</span>
              </div>
            </div>
            <div className="up-body">
              {profile?.employee?.employeeSkills.map((es) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="eb-skill">
                    <div className="ebs-head">
                        <img
                          src="https://img.icons8.com/fluency-systems-filled/48/fc3737/light-on--v1.png"
                          alt=""
                        />
                      <div>
                        <p>{es?.skill?.skill?.name}</p>
                        <span>{es?.skill?.category?.name}</span>
                      </div>
                    </div>
                    <h5
                      style={{color: "red"}}
                    >
                      {es?.level}
                    </h5>
                    <h6>{es?.updatedAt?.split("T")[0]}</h6>
                  </div>
                  {es?.certificate && (
                    <div className="s-cert">
                      <span></span>
                      <div onClick={() => setZoom({ open: true, cert: es?.certificate })}>
                        <img src="https://img.icons8.com/fluency-systems-regular/60/fc3737/certificate.png" alt=""/>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}

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
              <span>{zoom.cert?.publisher}</span>
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

    {err.open && (
      <Error err={err} setErr={setErr} />
    )}

    <Nav />
    </>
  );
}

export default Employee;
