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

function Skill() {
  const { categories, skills } = useSelector((state) => state.admin);
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
  const {addSkill} = useAddSkill()
  const {updateSkill} = useUpdateSkill()
  const {deleteSkill} = useDeleteSkill()
  const {searchSkills} = useGetSearchSkills()
  const [activeIndex, setActiveIndex] = useState(null);

  console.log(displaySkills);

  // DisplaySkills and Error corrections
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
    (skill.name === "") | (skill.categoryId === "") &&
      setErr({
        open: true,
        msg: "Check the fields - Skill and Category!",
      });
    const { data } = await addSkill({variables: skill})
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
    setDisplaySkills(skills)
  };

  // Update
  const editSkill = async () => {
    const { data } = await updateSkill({variables: {...skill}})
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
    setDisplaySkills(skills)
  }

  // Delete
  const delSkill = async (coskillId, id) => {
    const { data } = await deleteSkill({variables: {coskillId, id}})
    dispatch(getSkills(data.deleteSkill));
    setSkill({
      open: false,
      id: "",
      name: "",
      categoryId: "",
    });
    setDisplaySkills(skills)
  };

  // Search
  const searchSkill = async () => {
    const {loading, data, error} = await searchSkills({
      variables: {word: search.word}
    })
    setSearch({...search, skills: data?.searchSkill})
    data?.searchSkill.length === 0 && setErr({
      open: true,
      msg: "No records found!"
    })
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
            <input type="text" placeholder="Search Skills..." value={search.word} onChange={(e) => setSearch({...search, word: e.target.value})} required />
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

        <div className="c-list">
          {(displaySkills?.length !== 0) &&
            displaySkills.map((s) => (
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
          {/* <p>{Object.keys(categories).length}</p> */}
        </div>
        <div style={{width: "70vw", margin: "30px 0"}} className="chart">
            <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={150} />
        </div>
        <div className="s-emps">
          {displaySkills && displaySkills?.map((ds, index) => (
            ds?.employeeSkills?.length !== 0 && <div className="sem">
            <div className="sem-head" onClick={() => index !== activeIndex ? setActiveIndex(index) : setActiveIndex(null)}>
              <span>{ds?.skill?.name}</span>
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
