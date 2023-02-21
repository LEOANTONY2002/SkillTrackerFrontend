import React, { useEffect } from 'react'
import { useState } from 'react'
import Error from '../../components/Error'
import './Category.css'
import './Certificate.css'
import Nav from './Nav'
import spinner from '../../assets/spinner.gif'
import loader from '../../assets/loader.svg'
import { useAddPublisher, useDeletePublisher } from '../../graphql/mutation/usePublisher'
import { useGetAllCertificates, useGetAllPublishers } from '../../graphql/query/useGetAllCertificates'
import { useGetSearchCertificates, useGetSearchCertificatesByPublisher } from '../../graphql/query/useGetSearch'


function Certificate() {
    // const { certificates } = useSelector((state) => state.admin)
    const [publisher, setPublisher] = useState({
        open: false,
        id: '',
        name: ''
    })
    const [add, setAdd] = useState({
        open: false,
        name: "",
      })
      const [err, setErr] = useState({
        open: false,
        msg: "",
      });
      const [search, setSearch] = useState({
        word: "",
        certificates: []
      })
      const [zoom, setZoom] = useState({
        open: false,
        cert: {}
    })
    const [load, setLoading] = useState(false)
    const [displayCertificates, setDisplayCertificates] = useState([])
    const [displayPublishers, setDisplayPublishers] = useState([])
    const [selectedOptionPublisher, setSelectedOptionPublisher] = useState(null);
    const {addPublisher} = useAddPublisher()
    const {deletePublisher} = useDeletePublisher()
    const {loading: gettingPublishers, publishers: publishers=[], error} = useGetAllPublishers()
    const {loading: gettingCertificates, certificates: certificates=[], error: errorCertificates} = useGetAllCertificates()
    const {searchCertificates, loading: searchingCertificate} = useGetSearchCertificates()
    const {searchCertificatesByPublisher, loading: searchingCertificateByPublisher} = useGetSearchCertificatesByPublisher()

    console.log(displayCertificates)

    // DisplaySkills and Error corrections
  useEffect(() => {
    if (certificates?.length !== 0) {
      setDisplayCertificates(certificates)
      setErr({open: false, msg: ""})
    }
  }, [certificates])

  useEffect(() => {
    if (publishers?.length !== 0) {
      setDisplayPublishers(publishers)
      setErr({open: false, msg: ""})
    }
  }, [publishers])

  useEffect(() => {
    if (search.certificates.length !== 0) {
      setDisplayCertificates(search.certificates)
    }
  }, [search.certificates])

  useEffect(() => {
    if (displayCertificates?.length !== 0) {
      setErr({open: false, msg: ""})
    }
  }, [displayCertificates])

  useEffect(() => {
    if (selectedOptionPublisher !== null) searchCertificateByPublisher()
  }, [selectedOptionPublisher])

    // Category Functions
    // Upsert
    const upsertPublisher = async () => {
        if (publisher.name !== "") {
            let {loading: adding, data, errors} = await addPublisher({
                variables: publisher
            })
            adding && setLoading(true)
            if(errors) { 
                setLoading(false)
                setErr({
                    open: true,
                    msg: errors
                })
            }
            if (data?.addPublisher?.length !== 0) {
                setLoading(false)
                setDisplayPublishers(data?.addPublisher)
                setPublisher({open: false, id: '', name: ''})
                setAdd({open: false, name: ''})
            }
        } else {
            setErr({
                open: true,
                msg: "Enter a publisher name"
            })
            setLoading(false)
        }
    }

    // Delete
    const delPublisher = async (id) => {
        const { loading: deleting, data, error } = await deletePublisher({
            variables: {id}
        })
        setDisplayPublishers(data?.deletePublisher)
        error && setErr({
            open: true,
            msg: error
        })
    }

    // Search
    const searchCertificate = async () => {
        const {loading, data, error} = await searchCertificates({
        variables: {word: search.word}
        })
        
        if (data?.searchCertificate?.length === 0) {
            setSelectedOptionPublisher(null)
            setDisplayCertificates([])
        } else {
            setSearch({...search, certificates: data?.searchCertificate})
        }
    }

    // Search by Publisher
    const searchCertificateByPublisher = async () => {
        const {loading, data, error} = await searchCertificatesByPublisher({
        variables: {word: selectedOptionPublisher}
        })
        if (data?.searchCertificateByPublisher?.length === 0) {
            setSelectedOptionPublisher(null)
            setDisplayCertificates([])
        } else {
            setSearch({...search, certificates: data?.searchCertificateByPublisher})
        }
    }

    // Ascending
    const ascendingCategory = async () => {
        let certificates = [...displayCertificates]
        let ascCertificates = certificates.sort((a,b) => (a?.name > b?.name) ? 1 : ((b?.name > a?.name) ? -1 : 0))
        setDisplayCertificates(ascCertificates)
    }

    // Descending
    const descendingCategory = async () => {
        let certificates = [...displayCertificates]
        let descCertificates = certificates.sort((a,b) => (a?.name < b?.name) ? 1 : ((b?.name < a?.name) ? -1 : 0))
        setDisplayCertificates(descCertificates)
    }


    return (
        <>
            <div className='category'>
              {gettingPublishers ? <div style={{height: "200px", display: "grid", placeContent: "center"}}><img style={{width: "40px"}} src={loader} alt=''/></div> :
                <>
                    <div className="c-title">
                        <p>Publishers</p>
                        <span></span>
                    </div>
                    <div className="s-icon" onClick={() => setAdd({open: true})}>
                        <p>Add New</p>
                        <img
                            className="sIcon"
                            src="https://img.icons8.com/ios-glyphs/50/fc3737/plus-math.png"
                            alt=""
                        />
                    </div>
                
                
                {add.open && (
                    <div className="add">
                        <div className="c-add">
                            <img
                                onClick={() => setAdd({ open: false, name: "" })}
                                src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                                alt=""
                            />
                            <p>Publisher</p>
                            <div className="ca-inp">
                                <input type="text" onKeyDown={e => e.key === 'Enter' && upsertPublisher()} placeholder='New Category' value={publisher.name} onChange={e => setPublisher({...publisher, name: e.target.value})} />
                                <img onClick={() => upsertPublisher()} src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png" alt='' />
                            </div>
                            {load && <div><img style={{width: "30px"}} src={spinner} alt=''/></div>}
                        </div>
                    </div>
                )}

                <div className="c-list">
                    {(displayPublishers !== 0) &&
                       displayPublishers.map(p => (
                        <div className="cl-cat" key={p?.id}>
                            <div className="cl-head">
                                <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/certificate.png" alt='' />
                                <div>
                                    <p>{p?.name}</p>
                                    <img onClick={() => setPublisher({
                                        open: true,
                                        id: p?.id,
                                        name: p?.name
                                    })} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/pencil.png" alt='' />
                                    <img onClick={() => delPublisher(p?.id)} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/delete.png" alt='' />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                </>
                }

                <div style={{marginTop: "50px"}} className="search">
                    <div className="sh-body">
                        <input type="text" onKeyDown={e => e.key === 'Enter' && searchCertificate()} placeholder="Search Categories..." value={search.word} onChange={(e) => setSearch({...search, word: e.target.value})} required />
                        <img
                            onClick={() => searchCertificate()}
                            src="https://img.icons8.com/ios-glyphs/30/fc3737/search.png"
                            alt=""
                        />
                    </div>
                    <div className="sh-filter">
                        <img src="https://img.icons8.com/fluency-systems-regular/48/null/empty-filter.png" alt=""/>
                        <span style={{marginLeft: "-10px"}}>Filter:  </span>
                        <p 
                        onClick={() => {
                            setSelectedOptionPublisher(null)
                            setSearch({...search, word: "", certificates: []});
                            setDisplayCertificates(certificates);
                        }}
                        style={displayCertificates === certificates ? {backgroundColor: "red", color: "white"} : {}}
                        >All</p>
                        <select onChange={e => setSelectedOptionPublisher(e.target.value)}>
                            <option selected={selectedOptionPublisher === null} disabled>Publisher</option>
                            {
                            publishers?.map(p => (<option value={p?.name}>{p?.name}</option>))
                            }
                        </select>
                        <img onClick={() => ascendingCategory()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/sort-alpha-up.png" alt=""/>
                        <img onClick={() => descendingCategory()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/alphabetical-sorting-2.png" alt=""/>
                    </div>
                </div>

            
                {gettingCertificates || searchingCertificate || searchingCertificateByPublisher ? <div style={{height: "50vh", display: "grid", placeContent: "center"}}><img style={{width: "40px"}} src={loader} alt=''/></div> :
                    displayCertificates.length !== 0 ? 
                        <div className="certificates">
                            {displayCertificates?.map(ds => (
                                <div className="certificate">
                                    <div className="ct-emp">
                                        <img style={
                                                ds?.employeeSkill?.employee?.photo === ""
                                                ? { padding: "10px", width: "40px", height: "40px" }
                                                : { padding: "0px" }
                                            } src={ds?.employeeSkill?.employee?.photo !== "" ? ds?.employeeSkill?.employee?.photo : "https://img.icons8.com/fluency-systems-filled/90/ffffff/collaborator-male.png"} alt="" />
                                        <div>
                                            <p>{ds?.employeeSkill?.employee?.name}</p>
                                            <span>{ds?.employeeSkill?.employee?.email}</span>
                                        </div>
                                    </div>
                                    <div className="ct-img">
                                        <img onClick={() => setZoom({open: true, cert: ds})} src={ds?.photo} alt="" />
                                    </div>
                                    <div className="ct-cont">
                                        <span>{ds?.name}</span>
                                        <div>
                                            <p>{ds?.publisher?.name}</p>
                                            <span>{ds?.expiry}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                        </div> : <p style={{color: "red", marginTop: "30px"}}>No records found!</p>}
            </div>
            {publisher.open && (
                <div className='c-edit'>
                    <div>
                        <div className="ce-head">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" alt='' />
                            <p>Edit Category</p>
                            <img onClick={() => setPublisher({ open: false, id: '', name: '' })} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" alt='' />
                        </div>
                        <div className="ce-body">
                            <p>{publisher.name}</p>
                            <input type="text" placeholder='Category' value={publisher.name} onChange={e => setPublisher({ ...publisher, name: e.target.value })} />
                            {load && <div><img style={{width: "30px"}} src={spinner} alt=''/></div>}
                            <button onClick={() => upsertPublisher()}>Update</button>
                        </div>
                    </div>
                </div>
            )}

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

            {err.open && (
                <Error err={err} setErr={setErr} />
            )}

            <Nav />
        </>
    )
}

export default Certificate