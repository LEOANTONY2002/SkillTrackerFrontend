import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import './Login.css'
import loader from '../../assets/loader.svg'
import { getUser, getUserAccessToken } from '../../redux/slices/userSlice';
import { memo } from 'react';
import Error from '../../components/Error';
import { useNavigate } from 'react-router-dom';
import { useLogin, useLoginWithPassword, useResetPassword } from '../../graphql/mutation/useLogin';
import jwtDecode from 'jwt-decode'

function Login() {
    const { login: onLogin, loading, error: errorLogin } = useLogin();
    const { loginWithPassword, loading: loggingIn, error: errorLoginWithPassword } = useLoginWithPassword();
    const { employeePasswordReset, loading: resettingPassword } = useResetPassword();
    const [login, setLogin] = useState({
        email: "",
        password: ""
    })
    const [newPassword, setNewPassword] = useState({
        id: "",
        password: "",
        confirmPassword: ""
    })
    const [err, setErr] = useState({
        open: false,
        msg: ''
    })
    const [toggle, setToggle] = useState(false)
    const [msg, setMsg] = useState("")
    const [resetPassword, setResetPassword] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    console.log(newPassword)

    useEffect(() => {
        window?.google?.accounts?.id?.initialize({
            client_id: "321676839735-hhjotk4qba88iu9qeinb0g1hdo1akkq2.apps.googleusercontent.com",
            callback: handleCredentialResponse
          });
          window?.google?.accounts?.id?.renderButton(
            document.getElementById("gl"),
            { theme: "outline", size: "large" } 
          );
          window?.google?.accounts?.id?.prompt(); 
    }, [])

    const handleCredentialResponse = async (response) => {
        const decoded = await jwtDecode(response.credential)
        console.log(decoded);
        let email = decoded?.email
        if (email === '' || email === null) {
            setErr({
                open: true,
                msg: "Enter Email!"
            })
        } else if (email.slice(-13) !== "@changecx.com") setErr({
            open: true,
            msg: "Use Organization Email!"
        })
        else {
            try {
                await onLogin({
                    variables: {
                        email
                    }
                }).then(({ data, error }) => {
                    console.log("EMPLOYEE", data)
                    if (data?.employeeLogin !== null) {
                            dispatch(getUser(data?.employeeLogin))
                            dispatch(getUserAccessToken(data?.employeeLogin?.accessToken || ""))
                            if (data?.employeeLogin?.isAdmin === true) {
                                navigate('/admin')
                            } else {
                                navigate('/employee')
                            }
                            // dispatch(getUserAccessToken(data.accessToken))
                            setLogin({
                                email: "",
                                password: ""
                            })
                        
                    } else setErr({ open: true, msg: "Invalid Credentials" })

                    if (error) {
                        setErr({open: error.message})
                        console.log(error)
                    }
                }).catch(error => {
                    console.log(error)
                })
                    
            } catch ({ response }) {
                setErr({
                    open: true,
                    msg: response?.data || "Invalid Credentials"
                })
            }
        }
    }

    const activateEmployeeAccount = async () => {
        if (login.email === '' || login.email === null) {
            setErr({
                open: true,
                msg: "Enter Email!"
            })
        } else if (login.email.slice(-13) !== "@changecx.com") setErr({
            open: true,
            msg: "Enter Organization Email!"
        })
        else {
            onLogin({
                variables: {
                    email: login.email
                }
            }).then(({ data }) => {
                console.log("EMPLOYEE", data)
                if (data?.employeeLogin !== null) {
                        
                    if (data?.employeeLogin?.isNewEmployee === true) {
                        setToggle(!toggle)
                        setMsg("One Time Password has been sent your email")
                    }
                    
                }
            }).catch(() => {
                if (errorLogin.message.includes("401")) {
                    setErr({
                        open: true,
                        msg: "Account has already been activated!"
                    })
                    setToggle(!toggle)
                }
                if (errorLogin.message.includes("400")) {
                    setErr({
                        open: true,
                        msg: "Email not found!"
                    })
                }
            })
        }
    }

    const authenticate = async () => {
        if (login.email === '' || login.email === null) {
            setErr({
                open: true,
                msg: "Enter Email!"
            })
        } else if (login.email.slice(-13) !== "@changecx.com") setErr({
            open: true,
            msg: "Enter Organization Email!"
        })
        else {
            try {
                await onLogin({
                    variables: {
                        email: login?.email
                    }
                }).then(({ data, error }) => {
                    console.log("EMPLOYEE", data)
                    if (data?.employeeLogin !== null) {
                            dispatch(getUser(data?.employeeLogin))
                            dispatch(getUserAccessToken(data?.employeeLogin?.accessToken || ""))
                            if (data?.employeeLogin?.isAdmin === true) {
                                navigate('/admin')
                            } else {
                                navigate('/employee')
                            }
                            // dispatch(getUserAccessToken(data.accessToken))
                            setLogin({
                                email: "",
                                password: ""
                            })
                        
                    } else setErr({ open: true, msg: "Invalid Credentials" })

                    if (error) {
                        setErr({open: error.message})
                        console.log(error)
                    }
                }).catch(error => {
                    console.log(error)
                })
                    
            } catch ({ response }) {
                setErr({
                    open: true,
                    msg: response?.data || "Invalid Credentials"
                })
            }
        }
    }

    const authenticateWithEmailAndPassword = async () => {
        if (login.email === "" || login.password === "") {
            setErr({
                open: true,
                msg: "Enter Email!"
            })
        } else if (login.email.slice(-13) !== "@changecx.com") setErr({
            open: true,
            msg: "Enter Organization Email!"
        })
        else {
            try {
                loginWithPassword({
                    variables: login
                }).then(({ data, error }) => {
                    console.log("EMPLOYEE", data)
                    if (data?.employeeLoginWithPassword !== null) {
                        if (data?.employeeLoginWithPassword?.isNewEmployee) {
                            setNewPassword({...newPassword, id: data?.employeeLoginWithPassword?.id})
                            setResetPassword(true)
                        } else {
                            dispatch(getUser(data?.employeeLoginWithPassword))
                            dispatch(getUserAccessToken(data?.employeeLoginWithPassword?.accessToken))
                            if (data?.employeeLoginWithPassword?.isAdmin === true) {
                                navigate('/admin')
                            } else {
                                navigate('/employee')
                            }
                        }
                        
                    } else setErr({ open: true, msg: "Invalid Credentials" })

                    if (error) {
                        setErr({open: error.message})
                        console.log(error)
                    }
                }).catch(error => {
                    console.log(error)
                })
                    
            } catch ({ response }) {
                setErr({
                    open: true,
                    msg: response.data
                })
            }
        }
    }

    const updateNewPassword = async () => {
        if (newPassword.password === "" || newPassword.confirmPassword === "") {
            setErr({
                open: true,
                msg: "Fill all the fields!"
            })
        } else if (newPassword.password !== newPassword.confirmPassword) {
            setErr({
                open: true,
                msg: "Check password!"
            }) 
        } else {
            const {data} = await employeePasswordReset({variables: newPassword})
            if (data?.employeePasswordReset !== null) {
                dispatch(getUser(data?.employeePasswordReset))
                setResetPassword(false)
                if (data?.employeePasswordReset?.isAdmin === true) {
                    navigate('/admin')
                } else {
                    navigate('/employee')
                }
            } else {
                setErr({
                    open: true,
                    msg: "Something went wrong!"
                }) 
            }
        }
    }

    return (
        <>
            {resetPassword ? 
                <div className='login'>
                    <div>
                        <div className="l-head">
                            <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png" alt='' />
                            <span></span>
                            <p>Reset Password</p>
                        </div>
                        <div className="l-body">
                            <input type="password" placeholder='New Password' value={newPassword.password} onChange={e => setNewPassword({ ...newPassword, password: e.target.value })} />
                            <input type="password" placeholder='Confirm Password' value={newPassword.confirmPassword} onChange={e => setNewPassword({ ...newPassword, confirmPassword: e.target.value })} />
                            {resettingPassword && <img width={40} src={loader} alt="" /> }
                            <button disabled={resettingPassword} onClick={() => updateNewPassword()}>Login</button>
                        </div>
                    </div>
                </div> :
                <div className='login'>
                    <div>
                        <div className="l-head">
                            <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png" alt='' />
                            <span></span>
                            <p>Employee</p>
                        </div>
                        <div className="l-body">
                            <div className="lb-up">
                                <img src="https://img.icons8.com/fluency-systems-regular/90/ffffff/group-background-selected.png" alt="" />
                            </div>
                            <input type="text" placeholder='Email' onKeyDown={e => e.key === "Enter" ? !toggle ? authenticate() : '' : ''} value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
                            {!toggle && <input type="password" placeholder='Password' value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />}
                            {(loading || loggingIn) && <img width={40} src={loader} alt="" /> }
                            <button disabled={loading || loggingIn} onClick={!toggle ? () => authenticateWithEmailAndPassword() : () => activateEmployeeAccount()}>{!toggle ? 'Login' : 'Activate'}</button>
                            <h6><p></p><span>OR</span><p></p></h6>
                            <div id="gl"></div>
                            <p>{!toggle ? 'New user?': 'Already have an account?'} <span onClick={() => setToggle(!toggle)}>{toggle ? 'Login' : "Activate your account"}</span></p>
                            <p>{msg}</p>
                        </div>
                    </div>
                </div>
            }
            {err.open && <Error err={err} setErr={setErr} />}
        </>
    )
}

export default memo(Login)