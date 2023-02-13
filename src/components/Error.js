import React, { memo } from 'react'
import './Error.css'

function Error({ err, setErr }) {

    if (err.open) return (
        <div className="error-wrap">
            <div className="error">
                <img src="https://img.icons8.com/material-sharp/24/ffffff/error-cloud.png" alt='' />
                <p>{err.msg}</p>
                <img onClick={() => setErr({ open: false })} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" alt='' />
            </div>
        </div>
    )


}

export default memo(Error)