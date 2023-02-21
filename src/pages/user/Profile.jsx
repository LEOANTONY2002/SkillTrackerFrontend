import React from 'react'
import { useState } from 'react'
import {  useSelector } from 'react-redux'
import './Profile.css'
import Nav from '../../components/Nav';

function Profile() {
    const { user } = useSelector((state) => state.user)
    const [zoom, setZoom] = useState({
        open: false,
        cert: {}
    })
    const [shrink, setShrink] = useState(true)

    console.log(user)

    return (
        <>
            <div className='e-profile'>
                <div className="ep-head">
                    <img style={user?.photo === "" ? { padding: "20px", width: "30px !important" } : {padding: "0"}} src={!user.photo ? "https://img.icons8.com/fluency-systems-filled/90/ffffff/collaborator-male.png" : user?.photo} alt='' />
                    <h2>{user?.name}</h2>
                    <span>{user?.email}</span>
                    <h6>{user?.jobTitle}</h6>
                </div>
                <div className="ep-skills">
                    {user?.employeeSkills?.length !== 0 ?
                        user?.employeeSkills?.map(es => (
                            <div className="es-card">
                                <div className="eb-skill" style={{margin: 0}}>
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
                         )) : <p style={{color: "#fc3737a4"}}>No skills found!</p>
                        }
                    </div>

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
            <div className="nav-menu">
                <Nav shrink={shrink} setShrink={setShrink} />
            </div>
        </>
    )
}

export default Profile