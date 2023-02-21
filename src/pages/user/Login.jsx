import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Login.css'
import loader from '../../assets/loader.svg'
import { getUser, getUserAccessToken } from '../../redux/slices/userSlice';
import { memo } from 'react';
import Error from '../../components/Error';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../graphql/mutation/useLogin';
import { useSignup } from '../../graphql/mutation/useSignup';

function Login() {
    const { user } = useSelector((state) => state.user)
    const { login: onLogin, loading } = useLogin();

    const [login, setLogin] = useState({
        email: '',
    })
    const [err, setErr] = useState({
        open: false,
        msg: ''
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    console.log(user.name)

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
                            email: login.email
                        }
                    }).then(({ data, error }) => {
                        console.log("EMPLOYEE", data)
                        if (data?.employeeLogin !== null) {
                                dispatch(getUser(data?.employeeLogin))
                                if (data?.employeeLogin?.isAdmin === true) {
                                    navigate('/admin')
                                } else {
                                    navigate('/employee')
                                }
                                // dispatch(getUserAccessToken(data.accessToken))
                                setLogin({
                                    email: '',
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
                        msg: response.data
                    })
                }
            }
        }

    return (
        <>
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
                        <input type="text" placeholder='Email' value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
                        {loading && <img width={40} src={loader} alt="" /> }
                        <button disabled={loading} onClick={() => authenticate()}>Login</button>
                    </div>
                </div>
            </div>
            {err.open && <Error err={err} setErr={setErr} />}
        </>
    )
}

export default memo(Login)