import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../components/Error'
import { useAddCategory, useDeleteCategory } from '../../graphql/mutation/useCategory'
import { useGetSearchCategories } from '../../graphql/query/useGetSearch'
import { getCategories, getCertificates } from '../../redux/slices/adminSlice'
import './Category.css'
import './Certificate.css'
import Nav from './Nav'
import ReactApexChart from "react-apexcharts"
import { useAddPublisher } from '../../graphql/mutation/usePublisher'
import { useGetAllPublishers } from '../../graphql/query/useGetAllCertificates'


function Certificate() {
    const { certificates } = useSelector((state) => state.admin)
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
  const [displayCertificates, setDisplayCertificates] = useState([])
    const dispatch = useDispatch()
    const {addPublisher} = useAddPublisher()
    const {loading, publishers: publishers=[], error} = useGetAllPublishers()

    console.log(displayCertificates)

    // DisplaySkills and Error corrections
  useEffect(() => {
    if (certificates?.length !== 0) {
      setDisplayCertificates(certificates)
      setErr({open: false, msg: ""})
    }
  }, [certificates])

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

    // Category Functions
    // Upsert
    const upsertPublisher = async () => {
        let {data} = await addPublisher({
            variables: publisher
        })
        dispatch(getCertificates(data?.addCertificate))
        setPublisher({open: false, id: '', name: ''})
        setAdd({open: false, name: ''})
    }

    // Delete
    const deleteCat = async (id) => {
        // const { data } = await deleteCategory({
        //     variables: {id}
        // })
        // dispatch(getCategories(data?.deleteCategory))
        // setCategory({open: false, id: '', name: ''})
    }

    // Search
    // const searchCategory = async () => {
    //     const {loading, data, error} = await searchCategories({
    //     variables: {word: search.word}
    //     })
    //     setSearch({...search, categories: data?.searchCategory})
    //     data?.searchCategory?.length === 0 && setErr({
    //     open: true,
    //     msg: "No records found!"
    //     })
    // }

//   // Ascending
//   const ascendingCategory = async () => {
//     let categories = [...displayCertificates]
//     let ascCategories = categories.sort((a,b) => (a?.name > b?.name) ? 1 : ((b?.name > a?.name) ? -1 : 0))
//     setDisplayCertificates(ascCategories)
//   }

//   // Descending
//   const descendingCategory = async () => {
//     let categories = [...displayCertificates]
//     let descCategories = categories.sort((a,b) => (a?.name < b?.name) ? 1 : ((b?.name < a?.name) ? -1 : 0))
//     setDisplayCertificates(descCategories)
//   }

//   const chartData = {
//     series: [{
//         name: "Skills",
//         data: [
//             ...displayCertificates?.map(c => (c?.skills?.length))
//         ]
//     }],
//     options: {
//       chart: {
//         height: 150,
//         type: 'area',
//         zoom: {
//           enabled: false
//         }
//       },
//       background: 'white',
      
//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         curve: 'smooth'
//       },
//       title: {
//         text: 'Skills on Categories',
//         align: 'left',
//         margin: 10,
//         offsetX: 4,
//         offsetY: 6,
//         style: {
//             fontSize: "10px",
//             color: 'red',
//             fontWeight: 'normal'
//         }
//       },
//       colors: ['#ff8888', '#ffb6b6', 'red', 'transparent'],
//       grid: {
//         show: false,
//         row: {
//             opacity: 0
//         }
//       },
//       xaxis: {
//         categories: [
//             ...displayCertificates?.map(c => (c?.name))
//         ],
//       },
//       yaxis: {
//         min: 1,
//         forceNiceScale: true,
//         tickAmount: 2
//       }
//     },
// };

    return (
        <>
            <div className='category'>
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
                                <input type="text" placeholder='New Category' value={publisher.name} onChange={e => setPublisher({...publisher, name: e.target.value})} />
                                <img onClick={() => upsertPublisher()} src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png" alt='' />
                            </div>
                        </div>
                    </div>
                )}

                <div className="c-list">
                    {(publishers !== 0) &&
                       publishers.map(c => (
                        <div className="cl-cat" key={c?.id}>
                            <div className="cl-head">
                                <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" alt='' />
                                <div>
                                    <p>{c?.name}</p>
                                    <img onClick={() => setPublisher({
                                        open: true,
                                        id: c?.id,
                                        name: c?.name
                                    })} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/pencil.png" alt='' />
                                    <img onClick={() => deleteCat(c?.id)} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/delete.png" alt='' />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <div className="search">
                    <div className="sh-body">
                        <input type="text" placeholder="Search Categories..." value={search.word} onChange={(e) => setSearch({...search, word: e.target.value})} required />
                        <img
                            onClick={() => searchCategory()}
                            src="https://img.icons8.com/ios-glyphs/30/fc3737/search.png"
                            alt=""
                        />
                    </div>
                    <div className="sh-filter">
                        <img src="https://img.icons8.com/fluency-systems-regular/48/null/empty-filter.png" alt=""/>
                        <span style={{marginLeft: "-10px"}}>Filter:  </span>
                        <p 
                        onClick={() => {
                            setSearch({...search, word: "", categories: []});
                            setDisplayCertificates(categories);
                        }}
                        style={displayCertificates === categories ? {backgroundColor: "red", color: "white"} : {}}
                        >All</p>
                        <img onClick={() => ascendingCategory()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/sort-alpha-up.png" alt=""/>
                        <img onClick={() => descendingCategory()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/alphabetical-sorting-2.png" alt=""/>
                    </div>
                </div> */}

                <div className="certificates">
                    {
                        displayCertificates.length !== 0 && displayCertificates?.map(ds => (
                            <div className="certificate">
                                <div className="ct-emp">
                                    <img style={
                                            ds?.employeeSkill?.employee?.photo
                                            ? { padding: "0px", width: "40px", height: "40px" }
                                            : { padding: "10px" }
                                        } src={ds?.employeeSkill?.employee?.photo ? ds?.employeeSkill?.employee?.img : "https://img.icons8.com/fluency-systems-filled/90/ffffff/collaborator-male.png"} alt="" />
                                    <div>
                                        <p>{ds?.employeeSkill?.employee?.name}</p>
                                        <span>{ds?.employeeSkill?.employee?.email}</span>
                                    </div>
                                </div>
                                <div className="ct-img">
                                    <img src={ds?.photo} alt="" />
                                </div>
                                <div className="ct-cont">
                                    <p>{ds?.publisher?.name}</p>
                                    <span>{ds?.expiry}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
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
                            <button onClick={() => upsertPublisher()}>Update</button>
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