import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../components/Error'
import { getEmployees } from '../../redux/slices/adminSlice'
import './Category.css'
import Nav from './Nav'
import loader from '../../assets/loader.svg'
import { useManageAdmin } from '../../graphql/mutation/useLogin'
import './Admins.css'
import { UseGetAllAdmins, useGetAllEmployees } from '../../graphql/query/useGetAllEmployees'

function Category() {
  const { user } = useSelector((state) => state.admin)
  const [admin, setAdmin] = useState({
      open: false,
      email: '',
      isAdmin: null
  })
  const [err, setErr] = useState({
    open: false,
    msg: "",
  });
  const [load, setLoading] = useState(false)
  const {manageAdmin, loading} = useManageAdmin()
  const {loading: gettingAdmins, admins=[]} = UseGetAllAdmins()
  const {loading: gettingEmployees, employees=[]} = useGetAllEmployees()
  const [displayAdmins, setDisplayAdmins] = useState([])

  console.log(admins)

  useEffect(() => {
    setDisplayAdmins(admins)
  }, [admins])

  const addAdmin = async () => {
    if (admin.email !== "") {
      let {data} = await manageAdmin({
          variables: admin
      })
      if (loading) setLoading(true)
      if (data?.manageAdmin?.length !== 0) {
        setLoading(false)
        setDisplayAdmins(data?.manageAdmin)
        setAdmin({open: false, id: '', isAdmin: null})
      } else {
        setLoading(false)
      }
    } else {
      setErr({
        open: true,
        msg: "Missing Field!"
      })
    }
  }

  const deleteAdmin = async (email) => {
      let {data} = await manageAdmin({
          variables: {
            email,
            isAdmin: false
          }
      })
      if (loading) setLoading(true)
      if (data?.manageAdmin?.length !== 0) {
        setLoading(false)
        setDisplayAdmins(data?.manageAdmin)
        setAdmin({open: false, id: '', isAdmin: null})
      } else {
        setLoading(false)
      }
  }

    return (
        <>
            <div className='category'>
                <div className="c-title">
                    <p>Admins</p>
                </div>
                <div className="s-icon" onClick={() => setAdmin({...admin, open: true, email: "", isAdmin: null})}>
                    <p>Add New</p>
                    <img
                        className="sIcon"
                        src="https://img.icons8.com/ios-glyphs/50/fc3737/plus-math.png"
                        alt=""
                    />
                </div>
                
                {admin.open && (
                    <div className="c-edit">
                        <div style={{padding: 20}}>
                          <div className="ce-head" style={{marginBottom: "40px"}}>
                            <img
                              src="https://img.icons8.com/fluency-systems-filled/48/ffffff/system-administrator-male.png"
                              alt=""
                            />
                            <p>Add Admin</p>
                            <img
                                style={{marginLeft: "100px"}}
                                onClick={() => setAdmin({ open: false, email: "", isAdmin: null })}
                                src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                                alt=""
                            />
                          </div>                            
                          <div className="ce-body">
                            <input list="employees"placeholder='Select Employee' style={{borderRadius: "10px"}} onChange={e => setAdmin({...admin, email: e.target.value, isAdmin: true})} />
                              <datalist id="employees" >
                                  {employees?.map(e => !e.isAdmin && (
                                      <option value={e?.email}>{e?.name}</option>
                                  ))}
                              </datalist>
                               {loading && <img style={{width: "30px"}} src={loader} alt=''/>}
                              <button style={{marginBottom: "-60px"}} onClick={() => addAdmin()}>Add</button>
                          </div>
                        </div>
                    </div>
                )}

                {gettingAdmins || gettingEmployees ? <div style={{height: "50vh", display: "grid", placeContent: "center"}}><img style={{width: "40px"}} src={loader} alt=''/></div> :
                  (displayAdmins?.length !== 0) ? 
                    <div className="c-list" style={{margin: "50px auto", gap: "40px"}}>
                      {displayAdmins?.map(a => (
                        <div className="admin-card" key={a?.id}>
                            <img style={a?.photo ? {padding: 0, width: "40px", height: "40px"} : {padding: "10px", width: "30px", height: "30px"}} src={a?.photo ? a?.photo : "https://img.icons8.com/fluency-systems-regular/48/ffffff/system-administrator-male.png"} alt='' />
                            <div className='ac-cont'>
                                <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                    <p>{a?.name}</p>
                                    <span style={{fontSize: "smaller", color: "#ff000068"}}>{a?.email}</span>
                                </div>
                                {a?.id !== user?.id && <img onClick={() => deleteAdmin(a?.email)} src="https://img.icons8.com/fluency-systems-regular/48/ffffff/delete.png" alt='' />}
                            </div>
                        </div>
                      )
                      )}
                    </div> : <p style={{color: "red", marginTop: "30px"}}>No records found!</p>}
            </div>

            {err.open && (
                <Error err={err} setErr={setErr} />
            )}

            <Nav />
        </>
    )
}

export default Category