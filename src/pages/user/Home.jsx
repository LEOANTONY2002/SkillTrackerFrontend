import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Nav from '../../components/Nav'
import './Home.css'

function Home() {
    const [shrink, setShrink] = useState(false)
    const { user, accessToken } = useSelector((state) => state.user);

    return (
        <div className="home">
            <Nav shrink={shrink} setShrink={setShrink} />
        </div>
    )
}

export default Home