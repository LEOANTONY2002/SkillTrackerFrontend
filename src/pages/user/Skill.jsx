import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../components/Error";
import Nav from "../../components/Nav";
import { useAddEmployeeSkill } from "../../graphql/mutation/useAddEmployeeSkill";
import { useDeleteEmployeeSkill } from "../../graphql/mutation/useDeleteEmployeeSkill";
import { useGetAllSkills } from "../../graphql/query/useGetAllSkills";
import { getUser } from "../../redux/slices/userSlice";
import loader from '../../assets/loader.svg';
import "./Skill.css";

function Skill() {
  const { user } = useSelector((state) => state.user);
  const {skills, loading: getttingAllSkills} = useGetAllSkills()
  const [skill, setSkill] = useState({
    open: false,
    skills: user?.employeeSkills ? [...user?.employeeSkills] : []
  });
  const [err, setErr] = useState({
    open: false,
    msg: "",
  });
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const [shrink, setShrink] = useState(true)
  const {esAdd} = useAddEmployeeSkill()
  const {esDelete} = useDeleteEmployeeSkill()

  useEffect(() => {
    setSkill({
      ...skill,
      skills: user?.employeeSkills ? [...user?.employeeSkills] : []
    })
  }, [user])

  const addSkill = async (coskillId, level, cos) => {
    console.log("cos.id", cos?.id)
    setLoading(true)
    let isExisting = user?.employeeSkills?.find(s => s?.skillId === cos?.id)
    console.log("s.skillID", isExisting?.skillId)

    let {data: addES, errors} = await esAdd({
      variables: {
        employeeId: user?.id,
        coskillId,
        level,
        id: isExisting?.id || ""
      }
    })
    if (addES?.addEmployeeSkill?.length !== 0) {
      setLoading(false)
      // setErr({
      //   open: true,
      //   msg: "Updated"
      // })
      dispatch(getUser(addES?.addEmployeeSkill))
    } else {
      setLoading(false)
      setErr({
        open: true,
        msg: errors
      })
    }
    
  };

  const delSkill = async (eskillId) => {
    setLoading(true)
    let {loading, data} = await esDelete({
      variables: {
        eskillId,
        employeeId: user?.id,
      }
    })
    if (loading) setLoading(true)
    if (data?.deleteEmployeeSkill?.length !== 0) {
      setLoading(false)
      dispatch(getUser(data?.deleteEmployeeSkill))
    }
  };

  return (
    <>
      <div className="e-skill">
        <div className="s-add">
          <div className="sa-head">
            <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/light-on--v1.png" alt="" />
            <p>Manage Skills</p>
          </div>
          <div className="sa-body">
            <div style={{gap: "25px"}}>
              {skill?.skills.length !== 0 ?
                skill?.skills?.map((es) => (
                  <div
                    onClick={() => delSkill(es.id)}
                    className="delete-skill"
                  >
                    <div>
                      <div>
                        <p>{es?.skill?.skill?.name}</p>
                        <span>
                          {es?.skill?.category?.name}
                        </span>
                      </div>
                      <h6>{es?.level}</h6>
                    </div>
                    <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/delete.png" alt="" />
                  </div>
                )): (<h6 style={{margin: "30px 0", color: "lightgray"}}>Add your skills</h6>)}
            </div>
            {loading && <img width={40} src={loader} alt="" /> }
            <div>
              <p className="sel">
                Select your skills <span></span>{" "}
              </p>
              {getttingAllSkills && <img width={60} src={loader} alt="" /> }
              {skills?.length !== 0 &&
                skills?.map((cos) => (
                  <div className="sab">
                    <div className="sab-sk">
                      <p>{cos?.skill?.name}</p>
                      <span>{cos?.category?.name}</span>
                    </div>
                    <div className="sab-exp">
                      <p onClick={() => addSkill(cos?.id, "MINIMAL", cos)}>Minimal</p>
                      <p onClick={() => addSkill(cos?.id, "BEGINNER", cos)}>Beginner</p>
                      <p onClick={() => addSkill(cos?.id, "INTERMEDIATE", cos)}>
                        Intermediate
                      </p>
                      <p onClick={() => addSkill(cos?.id, "ADVANCED", cos)}>Advanced</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {err.open && (
        <div className="err" style={{zIndex: "20"}}>
          <Error err={err} setErr={setErr} />
        </div>
      )}
      <div className="nav-menu">
        <Nav shrink={shrink} setShrink={setShrink} />
      </div>
    </>
  );
}

export default Skill;
