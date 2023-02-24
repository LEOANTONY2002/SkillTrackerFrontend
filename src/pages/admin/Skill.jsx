import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../components/Error";
import { useAddSkill, useDeleteSkill, useUpdateSkill } from "../../graphql/mutation/useSkill";
import { useGetSearchSkills } from "../../graphql/query/useGetSearch";
import { getSkills } from "../../redux/slices/adminSlice";
import "./Category.css";
import Nav from "./Nav";
import "./Skill.css";
import ReactApexChart from "react-apexcharts"
import loader from '../../assets/loader.svg'
import { useGetAllSkills } from "../../graphql/query/useGetAllSkills";
import { useGetAllCategories } from "../../graphql/query/useGetAllCategories";


function Skill() {
  const {loading: gettingCategories, categories=[]} = useGetAllCategories()
  const {skills} = useSelector(state => state.admin)
  const [displaySkills, setDisplaySkills] = useState([])
  const [skill, setSkill] = useState({
    open: false,
    id: "",
    name: "",
    skillId: "",
    categoryId: "",
  });
  const [add, setAdd] = useState({
    open: false,
    name: "",
    categoryId: ""
  })
  const [err, setErr] = useState({
    open: false,
    msg: "",
  });
  const [search, setSearch] = useState({
    word: "",
    skills: []
  })
  const dispatch = useDispatch();
  const {loading: gettingSkills, cloudSkills=[], error: errorSkills} = useGetAllSkills()
  const {addSkill, loading: addingSkill, error: errorAdd} = useAddSkill()
  const {updateSkill, loading: updatingSkill, error: errorUpdate} = useUpdateSkill()
  const {deleteSkill, loading: deletingSkill, error: errorDelete} = useDeleteSkill()
  const {searchSkills, loading: searchingSkills, error: errorSearch} = useGetSearchSkills()
  const [activeIndex, setActiveIndex] = useState(null);
  const [load, setLoading] = useState(false)

  console.log(skills);

  // DisplaySkills and Error corrections
  useEffect(() => {
    if (cloudSkills?.length !== 0) {
      setDisplaySkills(cloudSkills)
      dispatch(getSkills(cloudSkills))
      setErr({open: false, msg: ""})
    }
  }, [cloudSkills])

  useEffect(() => {
    if (skills?.length !== 0) {
      setDisplaySkills(skills)
      setErr({open: false, msg: ""})
    }
  }, [skills])

  useEffect(() => {
    if (search.skills.length !== 0) {
      setDisplaySkills(search.skills)
    }
  }, [search.skills])

  useEffect(() => {
    if (displaySkills?.length !== 0) {
      setErr({open: false, msg: ""})
    }
  }, [displaySkills])

  // Skill Functions

  // Add
  const addNewSkill = async () => {
    if (skill.name !== "" || skill.categoryId !== "") {
      const { data } = await addSkill({variables: skill})
      if (addingSkill) setLoading(true)
      if (data?.addSkill?.length !== 0) {
        dispatch(getSkills(data.addSkill));
        setSkill({
          open: false,
          id: "",
          name: "",
          skillId: "",
          categoryId: ""
        });
        setAdd({
          open: false,
          name: "",
          categoryId: ""
        });
        setDisplaySkills(data?.addSkill)
        setLoading(false)
      }
      if (errorAdd) {
        setLoading(false)
        setErr({
          open: true,
          msg: errorAdd,
        });
      }
    } else {
      setLoading(false)
      setErr({
        open: true,
        msg: "Fill all the fields!",
      });
    }
  };

  // Update
  const editSkill = async () => {
    const { data } = await updateSkill({variables: {...skill}})
    if (updatingSkill) setLoading(true)
    if (data?.editSkill?.length !== 0) {
      dispatch(getSkills(data.editSkill));
      setSkill({
        open: false,
        id: "",
        name: "",
        skillId: "",
        categoryId: ""
      });
      setAdd({
        open: false,
        name: "",
        categoryId: ""
      });
      setDisplaySkills(data?.editSkill)
      setLoading(false)
    }
    if (errorUpdate) {
      setLoading(false)
        setErr({
          open: true,
          msg: errorUpdate,
        });
    }
  }

  // Delete
  const delSkill = async (coskillId, id) => {
    const { data } = await deleteSkill({variables: {coskillId, id}})
    if (deletingSkill) setLoading(true)
    if (data?.deleteSkill?.length !== 0) {
      dispatch(getSkills(data.deleteSkill));
      setSkill({
        open: false,
        id: "",
        name: "",
        categoryId: "",
      });
      setDisplaySkills(skills)
      setLoading(false)
    }
    if (errorDelete) {
      setLoading(false)
        setErr({
          open: true,
          msg: errorDelete,
        });
    }
  };

  // Search
  const searchSkill = async () => {
    if (search.word !== "") {
      const { data } = await searchSkills({
        variables: {word: search.word}
      })
      if (searchingSkills) setLoading(true)
      if (data?.searchSkill?.length === 0) {
        setLoading(false)
        setDisplaySkills([])
      } else {
        setLoading(false)
        setSearch({...search, skills: data?.searchSkill})
      }
      if (errorSearch) {
        setLoading(false)
        setErr({
          open: true,
          msg: errorSearch,
        });
      }
    } else {
      setLoading(false)
      setErr({
        open: true,
        msg: "Enter skill to search!"
      })
    }
    
  }

  // Ascending
  const ascendingSkill = async () => {
    let skills = [...displaySkills]
    let ascSkills = skills.sort((a,b) => (a.skill.name > b.skill.name) ? 1 : ((b.skill.name > a.skill.name) ? -1 : 0))
    setDisplaySkills(ascSkills)
  }

  // Descending
  const descendingSkill = async () => {
    let skills = [...displaySkills]
    let descSkills = skills.sort((a,b) => (a.skill.name < b.skill.name) ? 1 : ((b.skill.name < a.skill.name) ? -1 : 0))
    setDisplaySkills(descSkills)
  }

  console.log("DISP", displaySkills)

  const chartData = {
    series: [{
        name: "Employees",
        data: [
            ...displaySkills?.map(c => (c?.employeeSkills?.length))
        ]
    }],
    options: {
      chart: {
        height: 100,
        type: 'area',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Skills on Employees',
        align: 'left',
        margin: 10,
        offsetX: 4,
        offsetY: 6,
        style: {
            fontSize: "10px",
            color: 'red',
            fontWeight: 'normal'
        }
      },
      colors: ['#ff8888', '#ffb6b6', 'red', 'transparent'],
      grid: {
        show: false,
        row: {
            opacity: 0
        }
      },
      xaxis: {
        categories: [
            ...displaySkills?.map(s => (s?.skill?.name))
        ],
        labels: {
          hideOverlappingLabels: true,
        }
      },
      yaxis: {
        labels: {
            hideOverlappingLabels: true,
        }
      }
    },
};

  return (
    <>
      <div className="category">
        <div className="c-title">
          <p>Skills</p>
          <span></span>
        </div>
        <div className="s-icon" onClick={() => setAdd({open: true})}>
          <p>Add New</p>
          <img
            className="sIcon"
            src="https://img.icons8.com/ios-glyphs/50/fc3737/plus-math.png"
            alt=""
          />
        </div>
        {add.open && (
          <div className="add">
            <div className="c-add">
              <img
                onClick={() => setAdd({ open: false, name: "", categoryId: "" })}
                src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                alt=""
              />
              <p>Skill</p>
              <div className="ca-main">
                <input
                  type="text"
                  placeholder="New Skill"
                  value={skill.name}
                  onChange={(e) => setSkill({ ...skill, name: e.target.value })}
                />
                <p>Category</p>
                <div className="ce-cat">
                  {categories.map((c) => (
                    <span
                      style={
                        c.id === skill.categoryId
                          ? { backgroundColor: "#fc3737", color: "white" }
                          : {}
                      }
                      onClick={() => setSkill({ ...skill, categoryId: c.id })}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
                {addingSkill && <div style={{width: "100%", display: "grid", placeContent: "center"}}><img style={{width: "30px"}} src={loader} alt=''/></div>}
                <div className="ce-sub" onClick={() => addNewSkill()}>
                  <img
                      src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png"
                      alt=""
                    />
                    <span>Add Skill</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="search">
          <div className="sh-body">
            <input type="text" onKeyDown={(e) => e.key === 'Enter' && searchSkill()} placeholder="Search Skills..." value={search.word} onChange={(e) => setSearch({...search, word: e.target.value})} required />
            <img
                onClick={() => searchSkill()}
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
                setDisplaySkills(skills);
              }}
              style={displaySkills === skills ? {backgroundColor: "red", color: "white"} : {}}
              >All</p>
              <img onClick={() => ascendingSkill()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/sort-alpha-up.png" alt=""/>
              <img onClick={() => descendingSkill()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/alphabetical-sorting-2.png" alt=""/>
          </div>
        </div>

        {searchingSkills || gettingSkills || deletingSkill ? <div style={{height: "200px"}}><img style={{width: "40px", display: "grid", placeContent: "center"}} src={loader} alt=''/></div>     :
          
          (displaySkills?.length !== 0) ? <div className="c-list">
            {displaySkills.map((s) => (
                <div className="sl-skill" key={s?.id}>
                  <div className="sl-head">
                    <img
                      src="https://img.icons8.com/fluency-systems-filled/48/ffffff/light-on--v1.png"
                      alt=""
                    />
                    <div>
                      <p className="sl-body-p">{s?.skill?.name} <h5></h5> <span>{s?.category?.name}</span></p>
                      <img
                        onClick={() =>
                          setSkill({
                            open: true,
                            id: s?.id,
                            name: s?.skill?.name,
                            skillId: s?.skillId,
                            categoryId: s?.categoryId,
                          })
                        }
                        src="https://img.icons8.com/fluency-systems-regular/48/fc3737/pencil.png"
                        alt=""
                      />
                      <img
                        onClick={() => delSkill(s.id, s?.skill?.id)}
                        src="https://img.icons8.com/fluency-systems-regular/48/fc3737/delete.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="s-emps">
                <p style={{textAlign: "left", width: "100%", color: "red"}}>Skills on Employees</p>
                {displaySkills && displaySkills?.map((ds, index) => (
                  ds?.employeeSkills?.length !== 0 && <div className="sem">
                  <div className="sem-head" onClick={() => index !== activeIndex ? setActiveIndex(index) : setActiveIndex(null)}>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                      <span>{ds?.skill?.name}</span>
                      <h5 style={{color: "#ffb1b1"}}>({ds?.employeeSkills?.length})</h5>
                    </div>
                    <img
                      src="https://img.icons8.com/fluency-systems-regular/25/fc3737/expand-arrow--v1.png"
                      alt=""
                    />
                  </div>
                  {index === activeIndex && 
                    <div className="sem-body">
                      {ds?.employeeSkills?.map(es => (
                        <div className="sem-emp">
                          <img src={es?.employee?.photo ? es?.employee?.photo : "https://img.icons8.com/fluency-systems-filled/70/fc3737/collaborator-male?.png"} style={es?.employee?.photo ? {padding: "0px", width: "25px", height: "25px"} : {padding: "7px", width: "18px", height: "18px"}} alt="" />
                          <div>
                            <p>{es?.employee?.name}</p>
                            <span>{es?.employee?.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                </div>
                ))}
              </div>
              <div style={{width: "70vw", marginBottom: "30px"}} className="chart">
                <div>
                  <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={150} />
                </div>
              </div>
          </div> : 
          <p style={{color: "red", marginTop: "30px"}}>No records found!</p>
        }
        
      </div>

      {skill.open && (
        <div className="c-edit">
          <div>
            <div className="ce-head">
              <img
                src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png"
                alt=""
              />
              <p>Edit Skill</p>
              <img
                onClick={() => setSkill({ open: false, id: "", name: "", skillId: "", categoryId: "" })}
                src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                alt=""
              />
            </div>
            <div className="ce-body">
              <p>{skill.name}</p>
              <input
                type="text"
                placeholder="Category"
                value={skill.name}
                onChange={(e) => setSkill({ ...skill, name: e.target.value })}
              />
              <div className="ce-cat">
                {categories.map((c) => (
                  <span
                    style={
                      c.id === skill.categoryId
                        ? { backgroundColor: "#fc3737", color: "white" }
                        : {}
                    }
                    onClick={() => setSkill({ ...skill, categoryId: c.id })}
                  >
                    {c.name}
                  </span>
                ))}
              </div>
              <button onClick={() => editSkill()}>Update</button>
            </div>
          </div>
        </div>
      )}

      {err.open && (
        <Error err={err} setErr={setErr} />
      )}

      <Nav />
    </>
  );
}

export default Skill;
