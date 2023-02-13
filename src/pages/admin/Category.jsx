import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../components/Error'
import { useAddCategory, useDeleteCategory } from '../../graphql/mutation/useCategory'
import { useGetSearchCategories } from '../../graphql/query/useGetSearch'
import { getCategories } from '../../redux/slices/adminSlice'
import './Category.css'
import Nav from './Nav'
import ReactApexChart from "react-apexcharts"


function Category() {
    const { categories } = useSelector((state) => state.admin)
    const [category, setCategory] = useState({
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
        categories: []
      })
  const [displayCategories, setDisplayCategories] = useState([])
    const dispatch = useDispatch()
    const {addCategory} = useAddCategory()
    const {deleteCategory} = useDeleteCategory()
  const {searchCategories} = useGetSearchCategories()

    console.log(categories)

    // DisplaySkills and Error corrections
  useEffect(() => {
    if (categories?.length !== 0) {
      setDisplayCategories(categories)
      setErr({open: false, msg: ""})
    }
  }, [categories])

  useEffect(() => {
    if (search.categories.length !== 0) {
      setDisplayCategories(search.categories)
    }
  }, [search.categories])

  useEffect(() => {
    if (displayCategories?.length !== 0) {
      setErr({open: false, msg: ""})
    }
  }, [displayCategories])

    // Category Functions
    // Upsert
    const upsertCategory = async () => {
        let {data} = await addCategory({
            variables: category
        })
        dispatch(getCategories(data?.addCategory))
        setCategory({open: false, id: '', name: ''})
        setAdd({open: false, name: ''})
    }

    // Delete
    const deleteCat = async (id) => {
        const { data } = await deleteCategory({
            variables: {id}
        })
        dispatch(getCategories(data?.deleteCategory))
        setCategory({open: false, id: '', name: ''})
    }

    // Search
  const searchCategory = async () => {
    const {loading, data, error} = await searchCategories({
      variables: {word: search.word}
    })
    setSearch({...search, categories: data?.searchCategory})
    data?.searchCategory?.length === 0 && setErr({
      open: true,
      msg: "No records found!"
    })
  }

  // Ascending
  const ascendingCategory = async () => {
    let categories = [...displayCategories]
    let ascCategories = categories.sort((a,b) => (a?.name > b?.name) ? 1 : ((b?.name > a?.name) ? -1 : 0))
    setDisplayCategories(ascCategories)
  }

  // Descending
  const descendingCategory = async () => {
    let categories = [...displayCategories]
    let descCategories = categories.sort((a,b) => (a?.name < b?.name) ? 1 : ((b?.name < a?.name) ? -1 : 0))
    setDisplayCategories(descCategories)
  }

  const chartData = {
    series: [{
        name: "Skills",
        data: [
            ...displayCategories?.map(c => (c?.skills?.length))
        ]
    }],
    options: {
      chart: {
        height: 150,
        type: 'area',
        zoom: {
          enabled: false
        }
      },
      background: 'white',
      
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Skills on Categories',
        align: 'left',
        margin: 10,
        offsetX: 4,
        offsetY: 6,
        style: {
            fontSize: "10px",
            color: 'red',
            fontWeight: 'normal'
        }
      },
      colors: ['#ff8888', '#ffb6b6', 'red', 'transparent'],
      grid: {
        show: false,
        row: {
            opacity: 0
        }
      },
      xaxis: {
        categories: [
            ...displayCategories?.map(c => (c?.name))
        ],
      },
      yaxis: {
        min: 1,
        forceNiceScale: true,
        tickAmount: 2
      }
    },
};

    return (
        <>
            <div className='category'>
                <div className="c-title">
                    <p>Categories</p>
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
                            <p>Category</p>
                            <div className="ca-inp">
                                <input type="text" placeholder='New Category' value={category.name} onChange={e => setCategory({...category, name: e.target.value})} />
                                <img onClick={() => upsertCategory()} src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png" alt='' />
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="search">
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
                            setDisplayCategories(categories);
                        }}
                        style={displayCategories === categories ? {backgroundColor: "red", color: "white"} : {}}
                        >All</p>
                        <img onClick={() => ascendingCategory()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/sort-alpha-up.png" alt=""/>
                        <img onClick={() => descendingCategory()} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/alphabetical-sorting-2.png" alt=""/>
                    </div>
                </div>

                <div className="c-list">
                    {(displayCategories !== 0) &&
                       displayCategories.map(c => (
                        <div className="cl-cat" key={c?.id}>
                            <div className="cl-head">
                                <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" alt='' />
                                <div>
                                    <p>{c?.name}</p>
                                    <img onClick={() => setCategory({
                                        open: true,
                                        id: c?.id,
                                        name: c?.name
                                    })} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/pencil.png" alt='' />
                                    <img onClick={() => deleteCat(c?.id)} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/delete.png" alt='' />
                                </div>
                            </div>
                            <div className="cl-body">
                                <span style={{color: "black"}}>skills</span>
                                {c?.skills?.map(s => (
                                    s && <p>{s?.skill?.name}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                    {/* <p>{Object.keys(categories).length}</p> */}
                </div>
                <div style={{width: "70vw", margin: "30px 0"}} className="chart">
                    <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={150} />
                </div>
                
            </div>
            {category.open && (
                <div className='c-edit'>
                    <div>
                        <div className="ce-head">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" alt='' />
                            <p>Edit Category</p>
                            <img onClick={() => setCategory({ open: false, id: '', name: '' })} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" alt='' />
                        </div>
                        <div className="ce-body">
                            <p>{category.name}</p>
                            <input type="text" placeholder='Category' value={category.name} onChange={e => setCategory({ ...category, name: e.target.value })} />
                            <button onClick={() => upsertCategory()}>Update</button>
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

export default Category