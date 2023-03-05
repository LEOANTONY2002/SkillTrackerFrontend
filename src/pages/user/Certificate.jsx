import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileBase64 from "react-file-base64";
import "./Certificate.css";
import Nav from "../../components/Nav";
import { useAddCertificate } from "../../graphql/mutation/useCertificate";
import { getUser } from "../../redux/slices/userSlice";
import { useGetAllPublishers } from "../../graphql/query/useGetAllCertificates";
import { useNavigate } from "react-router-dom";
import loader from '../../assets/loader.svg'
import Error from "../../components/Error";
import { uploadToS3 } from "../../actions/uploadToS3";

function Certificate() {
    const { user } = useSelector((state) => state.user);
    const [cert, setCert] = useState({
        open: false,
        id: "",
        name: "",
        publisherId: "",
        expiry: "",
        photo: "",
        employeeId: "",
        employeeSkillId: ""
    });
    const [zoom, setZoom] = useState({
        open: false,
        cert: {}
    })
    const [load, setLoading] = useState(false)
    const [err, setErr] = useState({
        open: false,
        msg: ''
    })
    const dispatch = useDispatch();
    const [shrink, setShrink] = useState(true)
    const {addCertificate, loading: addingCertificate} = useAddCertificate()
    const navigate = useNavigate()
    const {publishers: publishers=[], error} = useGetAllPublishers()

    console.log(cert);

    useEffect(() => {
        if (!user) {
            navigate("/employee/login")
        }
    }, [])

    const getFiles = (p) => {
        setCert({ ...cert, photo: p });
        // setCert({ ...cert, photo: p.base64 });
    };

    const upload = async () => {
        if (cert.name !== ""  && cert.publisherId && cert.photo !== "") {
            let p = await uploadToS3(cert.photo)
            setCert({...cert, photo: p})
            let { data} = await addCertificate({
                variables: cert
            })
            dispatch(getUser(data?.addCertificate));
            setCert({ ...cert, open: false });
            if (data?.errors) {
                setErr({
                    open: true,
                    msg: error.message
                })
            }
        } else {
            setErr({
                open: true,
                msg: "Fill all the fields!"
            })
        }
    };

    return (
        <>
            <div className="upload">
                <div className="upl-main">
                    {user?.employeeSkills?.length !== 0 ?
                        user?.employeeSkills?.map((es) => (
                            <div key={es?.id} className="u-main">
                                <div className="u-skill">
                                    <div className="us-head">
                                        <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/light-on--v1.png" alt=""/>
                                        <div>
                                            <p>{es?.skill?.skill?.name}</p>
                                            <h4></h4>
                                            <span>{es?.skill?.category?.name}</span>
                                        </div>
                                    </div>
                                    <div className="us-body">
                                        <span></span>
                                        <img
                                            onClick={es?.certificate ? () => setCert({ ...cert, open: true, id: es.certificate.id, name: es.certificate.name, expiry: es.certificate.expiry, publisherId: es.certificate.publisher.id, photo: es.certificate.photo, employeeSkillId: es.id, employeeId: es.employeeId }) : () =>
                                                setCert({ ...cert, open: true, id: "", name: "", expiry: "", publisherId: "", photo: "", employeeSkillId: es?.id, employeeId: es.employeeId })
                                            }
                                            src={es?.certificate !== null ? "https://img.icons8.com/fluency-systems-regular/48/ffffff/pencil.png" : "https://img.icons8.com/fluency-systems-regular/48/ffffff/upload.png"}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                {es?.certificate !== null && (
                                    <div className="u-cert">
                                        <img onClick={() => setZoom({open: true, cert: es?.certificate})} src={es?.certificate?.photo} alt="" />
                                    </div>
                                )}
                            </div>
                        )) : 
                        <div>
                            <p style={{color: "red"}}>No skills found!</p>
                        </div>
                        }

                    {cert.open && (
                        <div className="u-upl">
                            <div className="l-body">
                                <img
                                    onClick={() => {
                                        setLoading(false)
                                        setCert({ ...cert, open: false });
                                    }}
                                    src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                                    alt=""
                                />
                                <div>
                                    <div className="lb-up">
                                        <img
                                            style={
                                                cert.photo !== ""
                                                    ? { padding: 0, width: "70px", height: "70px" }
                                                    : {}
                                            }
                                            src={
                                                cert.photo === ""
                                                    ? "https://img.icons8.com/fluency-systems-regular/72/ffffff/certificate.png"
                                                    : cert.photo
                                            }
                                            alt=""
                                        />
                                        <div>
                                            <FileBase64 onDone={getFiles.bind(this)} />
                                            <img src="https://img.icons8.com/fluency-systems-filled/25/fc3737/camera.png" alt=""/>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={cert.name}
                                    onChange={(e) => setCert({ ...cert, name: e.target.value })}
                                />
                                <select onChange={(e) => setCert({ ...cert, publisherId: e.target.value })}>
                                    <option selected disabled>Select Publisher</option>
                                    {publishers.length !== 0 && publishers?.map(p => (
                                        <option selected={cert.publisherId === p?.id} value={p?.id}>{p?.name}</option>
                                    ))}
                                </select>
                                <p
                                    style={{
                                        textAlign: "left",
                                        width: "100%",
                                        marginBottom: "-10px",
                                    }}
                                >
                                    Expiry <span style={{color: "#fc3737a1", fontSize: "smaller", marginLeft: "10px"}}>{cert.expiry}</span>
                                </p>
                                <input
                                    style={{
                                        textIndent: "10px",
                                        paddingRight: "10px",
                                        width: "280px",
                                    }}
                                    type="date"
                                    onChange={(e) => setCert({ ...cert, expiry: e.target.value })}
                                />
                                {addingCertificate && <div><img style={{width: "40px"}} src={loader} alt="" /></div> }
                                <button disabled={load} onClick={() => upload()}>Upload</button>
                            </div>
                        </div>
                    )}
                </div>
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

            <div className="nav-menu">
                <Nav shrink={shrink} setShrink={setShrink} />
            </div>
            <div>
                <Error err={err} setErr={setErr} />
            </div>
        </>
    );
}

export default Certificate;
