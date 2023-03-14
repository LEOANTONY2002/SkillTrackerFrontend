import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../components/Error";
import {
  useAddCategory,
  useDeleteCategory,
} from "../../graphql/mutation/useCategory";
import { useGetSearchCategories } from "../../graphql/query/useGetSearch";
import { getCategories } from "../../redux/slices/adminSlice";
import "./Category.css";
import Nav from "./Nav";
import ReactApexChart from "react-apexcharts";
import loader from "../../assets/loader.svg";
import { useGetAllCategories } from "../../graphql/query/useGetAllCategories";
import iDelR from "../../assets/iDelR.png";
import iEditR from "../../assets/iEditR.png";
import iCatW from "../../assets/iCatW.png";
import iCloseR from "../../assets/iCloseR.png";

function Category() {
  const [category, setCategory] = useState({
    open: false,
    id: "",
    name: "",
  });
  const [add, setAdd] = useState({
    open: false,
    name: "",
  });
  const [err, setErr] = useState({
    open: false,
    msg: "",
  });
  const [search, setSearch] = useState({
    word: "",
    categories: [],
  });
  const { categories } = useSelector((state) => state.admin);
  const [load, setLoading] = useState(false);
  const [displayCategories, setDisplayCategories] = useState([]);
  const dispatch = useDispatch();
  const {
    loading: gettingCategories,
    categories: cloudCategories = [],
    error: errorCategories,
  } = useGetAllCategories();
  const { addCategory, loading: addingCategory } = useAddCategory();
  const { deleteCategory, loading: deletingCategory } = useDeleteCategory();
  const { searchCategories, loading: searchingCategory } =
    useGetSearchCategories();

  console.log(categories);

  // DisplaySkills and Error corrections
  useEffect(() => {
    if (cloudCategories?.length !== 0) {
      setDisplayCategories(cloudCategories);
      dispatch(getCategories(cloudCategories));
      setErr({ open: false, msg: "" });
    }
  }, [cloudCategories]);

  useEffect(() => {
    if (categories?.length !== 0) {
      setDisplayCategories(categories);
      setErr({ open: false, msg: "" });
    }
  }, [categories]);

  useEffect(() => {
    if (search.categories.length !== 0) {
      setDisplayCategories(search.categories);
    }
  }, [search.categories]);

  useEffect(() => {
    if (displayCategories?.length !== 0) {
      setErr({ open: false, msg: "" });
    }
  }, [displayCategories]);

  // Category Functions
  // Upsert
  const upsertCategory = async () => {
    if (category.name !== "") {
      let { data } = await addCategory({
        variables: category,
      });
      if (data?.addCategory?.length !== 0) {
        dispatch(getCategories(data?.addCategory));
        setDisplayCategories(data?.addCategory);
        setCategory({ open: false, id: "", name: "" });
        setAdd({ open: false, name: "" });
      }
    } else {
      setErr({
        open: true,
        msg: "Enter category name!",
      });
    }
  };

  // Delete
  const deleteCat = async (id) => {
    const { data } = await deleteCategory({
      variables: { id },
    });
    if (data?.deleteCategory !== 0) {
      setDisplayCategories(data?.deleteCategory);
      setCategory({ open: false, id: "", name: "" });
    } else {
      setErr({
        open: true,
        msg: "Something went wrong!",
      });
    }
  };

  // Search
  const searchCategory = async () => {
    if (search.word !== "") {
      const { data } = await searchCategories({
        variables: { word: search.word },
      });
      if (searchingCategory) setLoading(true);
      if (data?.searchCategory?.length === 0) {
        setLoading(false);
        setDisplayCategories([]);
      } else {
        setLoading(false);
        setSearch({ ...search, categories: data?.searchCategory });
      }
    } else {
      setErr({
        open: true,
        msg: "Enter search field!",
      });
    }
  };

  // Ascending
  const ascendingCategory = async () => {
    let categories = [...displayCategories];
    let ascCategories = categories.sort((a, b) =>
      a?.name > b?.name ? 1 : b?.name > a?.name ? -1 : 0
    );
    setDisplayCategories(ascCategories);
  };

  // Descending
  const descendingCategory = async () => {
    let categories = [...displayCategories];
    let descCategories = categories.sort((a, b) =>
      a?.name < b?.name ? 1 : b?.name < a?.name ? -1 : 0
    );
    setDisplayCategories(descCategories);
  };

  const chartData = {
    series: [
      {
        name: "Skills",
        data: [...displayCategories?.map((c) => c?.skills?.length)],
      },
    ],
    options: {
      chart: {
        height: 150,
        type: "area",
        zoom: {
          enabled: false,
        },
      },
      background: "white",

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Skills on Categories",
        align: "left",
        margin: 10,
        offsetX: 4,
        offsetY: 6,
        style: {
          fontSize: "10px",
          color: "red",
          fontWeight: "normal",
        },
      },
      colors: ["#ff8888", "#ffb6b6", "red", "transparent"],
      grid: {
        show: false,
        row: {
          opacity: 0,
        },
      },
      xaxis: {
        categories: [...displayCategories?.map((c) => c?.name)],
        labels: {
          hideOverlappingLabels: true,
        },
      },
      yaxis: {
        min: 1,
        forceNiceScale: true,
        tickAmount: 2,
        labels: {
          hideOverlappingLabels: true,
        },
      },
    },
  };

  return (
    <>
      {gettingCategories ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "grid",
            placeContent: "center",
          }}
        >
          <img style={{ width: "40px" }} src={loader} alt="" />
        </div>
      ) : (
        <div className="category">
          <div className="c-title">
            <p>Categories</p>
            <span></span>
          </div>
          <div className="s-icon" onClick={() => setAdd({ open: true })}>
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
                  src={iCloseR}
                  alt=""
                />
                <p>Category</p>
                <div className="ca-inp">
                  <input
                    type="text"
                    onKeyDown={(e) => e.key === "Enter" && upsertCategory()}
                    placeholder="New Category"
                    value={category.name}
                    onChange={(e) =>
                      setCategory({ ...category, name: e.target.value })
                    }
                  />
                  <img
                    onClick={() => upsertCategory()}
                    src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png"
                    alt=""
                  />
                </div>
                {addingCategory && (
                  <div
                    style={{
                      width: "100%",
                      display: "grid",
                      placeContent: "center",
                      marginBottom: "-20px",
                      marginTop: "10px",
                    }}
                  >
                    <img style={{ width: "30px" }} src={loader} alt="" />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="search">
            <div className="sh-body">
              <input
                type="text"
                onKeyDown={(e) => e.key === "Enter" && searchCategory()}
                placeholder="Search Categories..."
                value={search.word}
                onChange={(e) => setSearch({ ...search, word: e.target.value })}
                required
              />
              <img
                onClick={() => searchCategory()}
                src="https://img.icons8.com/ios-glyphs/30/fc3737/search.png"
                alt=""
              />
            </div>
            <div className="sh-filter">
              <img
                src="https://img.icons8.com/fluency-systems-regular/48/null/empty-filter.png"
                alt=""
              />
              <span style={{ marginLeft: "-10px" }}>Filter: </span>
              <p
                onClick={() => {
                  setSearch({ ...search, word: "", categories: [] });
                  setDisplayCategories(categories);
                }}
                style={
                  displayCategories === categories
                    ? { backgroundColor: "red", color: "white" }
                    : {}
                }
              >
                All
              </p>
              <img
                onClick={() => ascendingCategory()}
                src="https://img.icons8.com/fluency-systems-regular/48/fc3737/sort-alpha-up.png"
                alt=""
              />
              <img
                onClick={() => descendingCategory()}
                src="https://img.icons8.com/fluency-systems-regular/48/fc3737/alphabetical-sorting-2.png"
                alt=""
              />
            </div>
          </div>

          {gettingCategories && (
            <img style={{ width: "40px" }} src={loader} alt="" />
          )}

          {searchingCategory ? (
            <div>
              <img
                style={{
                  width: "40px",
                  height: "200px",
                  display: "grid",
                  placeContent: "center",
                }}
                src={loader}
                alt=""
              />
            </div>
          ) : displayCategories.length !== 0 ? (
            <div className="c-list">
              {displayCategories.map((c) => (
                <div className="cl-cat" key={c?.id}>
                  <div className="cl-head">
                    <img src={iCatW} alt="" />
                    <div>
                      <p>{c?.name}</p>
                      <img
                        onClick={() =>
                          setCategory({
                            open: true,
                            id: c?.id,
                            name: c?.name,
                          })
                        }
                        src={iEditR}
                        alt=""
                      />
                      <img
                        onClick={() => deleteCat(c?.id)}
                        src={iDelR}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="cl-body">
                    {c?.skills?.length !== 0 && (
                      <span
                        style={{ color: "black", marginTop: 20, flex: 0.1 }}
                      >
                        skills
                      </span>
                    )}
                    <div
                      style={{ display: "flex", flexWrap: "wrap", flex: 0.9 }}
                    >
                      {c?.skills?.map((s) => s && <p>{s?.skill?.name}</p>)}
                    </div>
                  </div>
                </div>
              ))}
              {deletingCategory && (
                <img style={{ width: "40px" }} src={loader} alt="" />
              )}
              <div
                style={{ width: "70vw", margin: "30px 0" }}
                className="chart"
              >
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  type="area"
                  height={150}
                />
              </div>
            </div>
          ) : (
            <p style={{ color: "red", marginTop: "30px" }}>No records found!</p>
          )}
        </div>
      )}

      {category.open && (
        <div className="c-edit">
          <div>
            <div className="ce-head">
              <img
                src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png"
                alt=""
              />
              <p>Edit Category</p>
              <img
                onClick={() => setCategory({ open: false, id: "", name: "" })}
                src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                alt=""
              />
            </div>
            <div className="ce-body">
              <p>{category.name}</p>
              <input
                type="text"
                placeholder="Category"
                onKeyDown={(e) => e.key === "Enter" && upsertCategory()}
                value={category.name}
                onChange={(e) =>
                  setCategory({ ...category, name: e.target.value })
                }
              />
              {addingCategory && (
                <img
                  style={{
                    width: "30px",
                    display: "grid",
                    placeContent: "center",
                  }}
                  src={loader}
                  alt=""
                />
              )}
              <button disabled={load} onClick={() => upsertCategory()}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {err.open && <Error err={err} setErr={setErr} />}

      <Nav />
    </>
  );
}

export default Category;
