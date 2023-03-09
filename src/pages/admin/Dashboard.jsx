import React, { useState } from 'react'
import './Dashboard.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAllEmployees } from '../../graphql/query/useGetAllEmployees'
import { useGetAllSkills } from '../../graphql/query/useGetAllSkills'
import { useGetAllCategories } from '../../graphql/query/useGetAllCategories'
import { Link, useNavigate } from 'react-router-dom'
import Nav from './Nav'
import ReactApexChart from "react-apexcharts"
import { getCategories, getCertificates, getEmployees, getSkills } from '../../redux/slices/adminSlice'
import loader from '../../assets/loader.svg'
import { useGetAllCertificates } from '../../graphql/query/useGetAllCertificates'
import { useSyncEmployeesData } from '../../graphql/mutation/useLogin'
import { useGetLastSync } from '../../graphql/query/useGetEmployee'
import { format } from 'date-fns'

function Dashboard() {

    const admin = useSelector(state => state.admin)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [load, setLoading] = useState(false)
    const {loading: gettingEmployees, employees=[]} = useGetAllEmployees()
    const {loading: gettingSkills, skills=[]} = useGetAllSkills()
    const {loading: gettingCategories, categories=[]} = useGetAllCategories()
    const {loading: gettingCertificates, certificates=[]} = useGetAllCertificates()
    const {syncEmployeesData, loading: syncing, error: syncError} = useSyncEmployeesData()
    const {getLastSync, loading: gettingLastSync, data: lastSync=""} = useGetLastSync()


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
        if (admin.certificates.length === 0) {
            dispatch(getCertificates(certificates))
        }
        console.log("done", admin)
    }, [gettingCategories, getEmployees, gettingSkills, gettingCertificates])

    useEffect(() => {
        getLastSync()
    }, [])

    const sync = async () => {
        let {data} = await syncEmployeesData()
        if (data?.syncEmployeesData?.length !== 0) {
            let {data: ls} = await getLastSync()
            console.log(ls)
            dispatch(getEmployees(data?.syncEmployeesData))
        }
        if (syncError) {
            console.log("Sync Failed", syncError)
        }
        setLoading(false)
    }

    const getDate = (date) => {
        let dateObj = format(new Date(date), 'd MMM yyyy -- HH:mm:ss')
        console.log(dateObj)
        return dateObj.toString()
    }

    const chartData = {
        series: [{
            name: "Skills",
            data: [
                ...categories?.slice(0, 5)?.map(c => (c?.skills?.length))
            ]
        }],
        options: {
          chart: {
            height: 150,
            type: 'area',
            zoom: {
              enabled: true
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
                ...categories?.slice(0, 5)?.map(c => (c?.name))
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
                ...skills?.slice(0, 5)?.map((s, index) => index < 5 && (s?.employeeSkills?.length))
            ]
        }],
        options: {
          chart: {
            height: 150,
            type: 'area',
            zoom: {
              enabled: true
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
                ...skills?.slice(0, 5)?.map(s => (s?.skill?.name))
            ],
            labels: {
                show: true,
                hideOverlappingLabels: true,
            }
          },
          yaxis: {
            labels: {
                hideOverlappingLabels: true,
            }
          }
        },
    };

    
    return (
        <>
        {gettingEmployees | gettingCategories | gettingSkills | gettingCertificates | gettingLastSync ? <div style={{display: "grid", placeContent: "center", height: "100vh", width: "100vw"}}><img src={loader} alt="" /></div> : 
            <div className="dashboard">
                <div className="d-mixed">
                    <div className='dm-cont'>
                        <div>
                            <div className='dmc-img'>
                                <span></span>
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png" alt=''/>
                            </div>
                            <div>
                                <p>Employees</p>
                                <span className='gt'>{employees.length}</span>
                            </div>
                            <Link to={"/admin/employee"}>
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                            </Link>
                        </div>
                        <div>
                            <div className="dmc-img">
                                <span></span>
                                <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/category.png" alt=''/>
                            </div>
                            <div>
                                <p>Categories</p>
                                <span className='gt'>{categories.length}</span>
                            </div>
                            <Link to={"/admin/category"}>
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                            </Link>
                        </div>
                        <div>
                            <div className="dmc-img">
                                <span></span>
                                <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/light-on--v1.png" alt=''/>
                            </div>
                            <div>
                                <p>Skills</p>
                                <span className='gt'>{skills.length}</span>
                            </div>
                            <Link to={"/admin/skill"}>
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                            </Link>
                        </div>
                        <div>
                            <div className="dmc-img">
                                <span></span>
                                <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/certificate.png" alt=''/>
                            </div>
                            <div>
                                <p>Certificates</p>
                                <span className='gt'>{certificates.length}</span>
                            </div>
                            <Link to={"/admin/certificate"}>
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                            </Link>
                        </div>
                    </div>
                    {/* <div className="d-sync">
                        <p>Sync Employees Data</p>
                        <h5>Last sync: <span>{gettingLastSync ? <img style={{width: "30px", height: "20px", boxShadow: "none", backgroundColor: "transparent", margin: 0, position: "absolute", bottom: "20px"}} src={loader} alt="" /> : lastSync !== "" ? `${getDate(lastSync?.lastSync?.lastSync)}` : ""}</span></h5>
                        <div>
                            <img onClick={() => sync()} src="https://img.icons8.com/fluency-systems-regular/48/ffffff/synchronize.png" alt='' />
                            <p>Sync now</p>
                            {syncing && <img style={{width: "30px", boxShadow: "none", backgroundColor: "transparent", margin: 0, position: "absolute", bottom: "20px"}} src={loader} alt="" /> }
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
                    <div style={{width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                        <div className='dc-cont'>
                            {skills ? skills.map((s, index) => index < 5 && (
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
                            <ReactApexChart width={"100%"} options={chartData2.options} series={chartData2.series} type="area" height={"100%"} />
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
                    <div style={{width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                        <div className='contents dc-cont'>
                            {categories ? categories.map((c, index) => index < 5 && (
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
                            <ReactApexChart options={chartData.options} series={chartData.series} type="area" width={"100%"} height={150} />
                        </div>
                    </div>
                    
                </div>
            </div>
        }
        <Nav />
        </>
    )
}

export default Dashboard