import React from 'react'
import './Dashboard.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAllEmployees } from '../../graphql/query/useGetAllEmployees'
import { useGetAllSkills } from '../../graphql/query/useGetAllSkills'
import { useGetAllCategories } from '../../graphql/query/useGetAllCategories'
import { Link, useNavigate } from 'react-router-dom'
import Nav from './Nav'
import ReactApexChart from "react-apexcharts"
import { getCategories, getEmployees, getSkills } from '../../redux/slices/adminSlice'
import loader from '../../assets/loader.svg'

function Dashboard() {

    const admin = useSelector(state => state.admin)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {loading: gettingEmployees, employees: employees=[], error: errorEmployees} = useGetAllEmployees()
    const {loading: gettingSkills, skills: skills=[], error: errorSkills} = useGetAllSkills()
    const {loading: gettingCategories, categories: categories=[], error: errorCategories} = useGetAllCategories()

    console.log(categories)


    useEffect(() => {
        if (admin.categories.length === 0) {
            dispatch(getCategories(categories))
        }
        if (admin.skills.length === 0) {
            dispatch(getSkills(skills))
        }
        if (admin.employees.length === 0) {
            dispatch(getEmployees(employees))
        }
        console.log("done", admin)
    }, [gettingCategories, getEmployees, gettingSkills])

    const chartData = {
        series: [{
            name: "Skills",
            data: [
                ...categories?.map(c => (c?.skills?.length))
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
            text: 'Categories on Skills',
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
                ...categories?.map(c => (c?.name))
            ],
          },
          yaxis: {
            min: 1,
            forceNiceScale: true,
            tickAmount: 2
          }
        },
    };

    const chartData2 = {
        series: [{
            name: "Employees",
            data: [
                ...skills?.map(c => (c?.employeeSkills?.length))
            ]
        }],
        options: {
          chart: {
            height: 50,
            type: 'area',
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Skills on Employees',
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
                ...skills?.map(s => (s?.skill?.name))
            ],
          }
        },
    };

    

    return (
        <>
        {gettingEmployees | gettingCategories | gettingSkills ? <div style={{display: "grid", placeContent: "center", height: "100vh", width: "100vw"}}><img src={loader} alt="" /></div> : 
            <div className="dashboard">
                <div className="d-left">
                    <div className="d-mixed">
                        <div className='contents dm-cont'>
                            <div>
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png" alt=''/>
                                <div>
                                    <p>Employees</p>
                                    <span className='gt'>{employees.length}</span>
                                </div>
                                <Link to={"/admin/employee"}>
                                    <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                                </Link>
                            </div>
                            <div>
                                <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/category.png" alt=''/>
                                <div>
                                    <p>Categories</p>
                                    <span className='gt'>{categories.length}</span>
                                </div>
                                <Link to={"/admin/category"}>
                                    <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                                </Link>
                            </div>
                            <div>
                                <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/light-on--v1.png" alt=''/>
                                <div>
                                    <p>Skills</p>
                                    <span className='gt'>{skills.length}</span>
                                </div>
                                <Link to={"/admin/skill"}>
                                    <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                                </Link>
                            </div>
                        </div>
                        {/* <div className="chart">
                            <div className='ad-head'>
                                <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" alt=''/>
                                <p>Admin</p>
                            </div>
                            <div className='ad-body'>
                                <p style={{ fontSize: 'small' }}>{user.email}</p>
                                <button onClick={() => setEdit({ ...edit, open: true })}>Update</button>
                            </div>
                        </div> */}
                    </div>
                    
                    <div className="d-cats">
                        <div className='d-title'>
                            <p>Skills</p>
                            <span></span>
                            <img onClick={() => navigate("/admin/skill")} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                        </div>
                        <p style={{marginTop: "40px", marginLeft: "20px", color: "red"}}>Skills on Employees</p>
                        <div style={{width: "100%", display: "flex", flexWrap: "wrap"}}>
                            <div className='contents dc-cont'>
                                {skills ? skills.map(s => (
                                    <div key={s?.id} className="sk-body">
                                        <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/light-on--v1.png" alt=''/>
                                        <div className='sb-cont'>
                                            <p>{s?.skill?.name}</p>
                                            <span><h6></h6>{s?.category.name}</span>
                                        </div>
                                        <div className="dc-count">
                                            <h6>emp</h6>
                                            <span>{s?.employeeSkills?.length}</span>
                                        </div>
                                    </div>
                                )) : <div></div>}
                            </div>
                            <div className="chart">
                                <ReactApexChart options={chartData2.options} series={chartData2.series} type="area" height={150} />
                            </div>
                        </div>
                    </div>

                    <div className="d-cats">
                        <div className='d-title'>
                            <p>Categories</p>
                            <span></span>
                            <img onClick={() => navigate("/admin/category")} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt='' />
                        </div>
                        <p style={{marginTop: "40px", marginLeft: "20px", color: "red"}}>Categories on Skills</p>
                        <div style={{width: "100%", display: "flex", flexWrap: "wrap"}}>
                            <div className='contents dc-cont'>
                                {categories ? categories.map(c => (
                                    <div key={c?.id}>
                                        <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/category.png" alt='' />
                                        <p>{c?.name}</p>
                                        <div className="dc-count">
                                            <h6>skills</h6>
                                            <span>{c?.skills?.length}</span>
                                        </div>
                                    </div>
                                )) : <div></div>}
                            </div>
                            <div className="chart">
                                <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={150} />
                            </div>
                        </div>
                        
                    </div>

                </div>
                {/* <div className="users" >
                    <div className='d-title' style={{ position: "relative", fontSize: "small", fontWeight: "bold", marginLeft: "-10px", marginBottom: "20px", marginTop: "-10px" }}>
                        <p>Employees</p>
                        <span></span>
                        <img onClick={() => navigate("/admin/employee")} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                    </div>
                    {employees ? employees.map(e => {
                        if (e?.email !== "admin@changecx.com") return (
                            <div key={e?.id} className='u-cont'>
                                <img src={e?.photo !== null ? e?.photo : "https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png"} alt='' />
                                <div>
                                    <p>{e?.name}</p>
                                    <span>{e?.email}</span>
                                </div>
                            </div>
                        )
                    }) : <div>No empoyees found</div>}
                </div> */}
            </div>
        }
        <Nav />
        </>
    )
}

export default Dashboard