import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileBase64 from 'react-file-base64';
import './Edit.css'
import { getUser } from '../../redux/slices/userSlice';
import Error from '../../components/Error';
import Nav from '../../components/Nav';
import { useUpdateEmployees } from '../../graphql/mutation/useUpdateEmployee';

function Edit() {
    const { user } = useSelector((state) => state.user)
    const [edit, setEdit] = useState({
        id: user?.id,
        name: user?.name,
        email: user?.email,
        photo: user?.photo
    })
    const [err, setErr] = useState({
        open: false,
        msg: ''
    })
    const dispatch = useDispatch()
    const [shrink, setShrink] = useState(true)
    const {updateEmployee} = useUpdateEmployees()


    const getFiles = (p) => {
        setEdit({ ...edit, photo: p.base64 })
    }

    console.log(edit)

    const update = async () => {
        try {
            let {data} = await updateEmployee({
                variables: edit
            })
            dispatch(getUser(data.editEmployee))
        } catch (error) {
            console.log(error)
            setErr({
                open: true,
                msg: error.message
            })
        }
    }

    return (
        <>
            <div className='login'>
                <div>
                    <div className="l-body">
                        <div className="lb-up">
                            <img className='ed-img' style={edit.photo === null ? { padding: "20px", width: "30px !important" } : {padding: "0"}} src={!edit.photo ? "https://img.icons8.com/fluency-systems-filled/90/ffffff/collaborator-male.png" : edit.photo} alt='' />
                            <div>
                                <FileBase64 onDone={getFiles.bind(this)} />
                                <img style={{marginLeft: "-10px"}} src="https://img.icons8.com/fluency-systems-filled/25/fc3737/camera.png" alt='' />
                            </div>
                        </div>
                        <h2>{edit.name}</h2>
                        <input type="text" placeholder='Name' value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} />
                        <button onClick={() => update()}>Update</button>
                    </div>
                </div>
            </div>
            <div className="nav-menu">
                <Nav shrink={shrink} setShrink={setShrink} />
            </div>
            <Error err={err} setErr={setErr} />
        </>
    )
}

export default Edit