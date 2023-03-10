import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Nav from '../../components/Nav'
import './Home.css'

function Home() {
    const [shrink, setShrink] = useState(false)
    const { user } = useSelector((state) => state.user)
    const navigate = useNavigate()

    useEffect(() => {
        console.log(user);
        if (user?.length === 0) navigate("/employee/login")
    }, [])

    return (
        <div className="home">
            <Nav shrink={shrink} setShrink={setShrink} />
        </div>
    )
}

export default Home