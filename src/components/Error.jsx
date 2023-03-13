import React, { memo } from 'react'
import iErrorW from '../assets/iErrorW.png'
import './Error.css'

function Error({ err, setErr }) {

    if (err.open) return (
        <div className="error-wrap">
            <div className="error">
                <img src={iErrorW} alt='' />
                <p>{err.msg}</p>
                <img onClick={() => setErr({ open: false })} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" alt='' />
            </div>
        </div>
    )


}

export default memo(Error)