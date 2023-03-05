import React, { useState } from 'react'
import Nav from '../../components/Nav'
import './Home.css'

function Home() {
    const [shrink, setShrink] = useState(false)

    return (
        <div className="home">
            <Nav shrink={shrink} setShrink={setShrink} />
        </div>
    )
}

export default Home