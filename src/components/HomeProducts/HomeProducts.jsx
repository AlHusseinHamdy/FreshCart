import { useContext, useEffect, useState } from "react";
import styles from "./HomeProducts.module.css";
import { Cartcontext } from "../../Context/cartContext";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Shopping_cart_icon } from "../../assets/images";
const HomeProducts = () => {
  // const [products, setProducts] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [wishList, setWishList] = useState([]);
  const { getProducts, addToCart, addToWishlist, getWishList } =
    useContext(Cartcontext);

  // const getAllProducts = async (page) => {
  //   setLoading(true);
  //   const data = await getProducts(page);
  //   setProducts(data);
  //   setLoading(false);
  // };
  // console.log(products);

  const [page, setPage] = useState(1);
  let { data, isLoading, isError } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts(page),
    keepPreviousData: true,
  });
  let {
    data: wishListData,
    isLoading: wishListLoading,
    isError: wishListError,
  } = useQuery({
    queryKey: ["wishList"],
    queryFn: getWishList,
    keepPreviousData: true,
  });

  const wishListObject = {};
  wishListData?.data?.data?.map((item) => {
    wishListObject[item.id] = true;
  });

  const addToWishlistHandler = async (id) => {
    const index = wishList.indexOf(id);
    if (index === -1) {
      const updatedWishList = [...wishList, id];
      setWishList(updatedWishList);
    } else {
      wishList.splice(index, 1);
    }
    const data = await addToWishlist(id)
      .then((data) => {
        if (data.data.status == "success") {
          toast.success(data.data.message, {
            position: "top-right",
            duration: 1000,
            className: "text-white bg-success",
          });
          const updatedWishList = [...wishList, id];
          setWishList(updatedWishList);
        }
      })
      .catch((error) => {
        toast.error(error, {
          position: "top-right",
          duration: 1000,
          className: "text-white bg-danger",
        });
        wishList.splice(index, 1);
      });
  };

  isError
    ? toast.error(isError, {
        position: "top-right",
        duration: 1000,
        className: "text-white bg-danger",
      })
    : null;
  const addToCartHandler = async (id) => {
    const data = await addToCart(id);
    if (data.data.status == "success") {
      toast.success(data.data.message, {
        position: "top-right",
        duration: 1000,
        className: "text-white bg-success",
      });
    } else {
      toast.error(data.data.message, {
        position: "top-right",
        duration: 1000,
        className: "text-white bg-danger",
      });
    }
  };

  // useEffect(() => {
  //   getAllProducts();
  // }, []);

  return (
    <>
      <section className="row gx-3 gy-5">
        {isLoading ? (
          <section className="d-flex justify-content-center align-items-center w-100">
            <PulseLoader color="#0aad0a" size={30} />
          </section>
        ) : (
          data?.data.map((product, index) => {
            return (
              <section
                className="col-xl-3 col-lg-4 col-md-6 overflow-hidden position-relative"
                key={index}
              >
                <section
                  className={`${styles.cursor_pointer} position-absolute top-0 end-0 me-4 mt-3`}
                  onClick={() => addToWishlistHandler(product._id)}
                >
                  {wishList.includes(product._id) ||
                  wishListObject[product._id] === true ? (
                    <i
                      className={`fa-solid fa-heart fa-2xl text-success ${styles.flip}`}
                    ></i>
                  ) : (
                    <i className="fa-regular fa-heart fa-2xl"></i>
                  )}
                </section>
                <section className="px-3 py-2 product">
                  <Link
                    to={`/products/${product._id}`}
                    className="text-decoration-none"
                  >
                    <LazyLoadImage
                      src={product.imageCover}
                      alt={product.title}
                      className="w-100"
                      placeholderSrc={Shopping_cart_icon}
                      effect="blur"
                    />
                  </Link>

                  <section className="mt-3">
                    <p className="text-main fw-semibold">
                      {product.category.name}
                    </p>
                    <p className="fw-bold fs-5">
                      {product.title.split(" ").slice(0, 2).join(" ").length >
                      15
                        ? product.title.split(" ").slice(0, 1)
                        : product.title.split(" ").slice(0, 2).join("  ")}
                    </p>
                    <section className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">
                        <span>{product.price}</span>
                        <span className="ms-1">EGP</span>
                      </span>
                      <span>
                        <span>
                          <i className="fa fa-star rating-color me-1"></i>
                        </span>
                        <span>{product.ratingsAverage}</span>
                      </span>
                    </section>
                  </section>

                  <section className="mt-3 d-flex justify-content-center align-items-center">
                    <a
                      className="btn px-3 py-2 fw-bold bg-main w-100 text-white"
                      onClick={() => {
                        addToCartHandler(product._id);
                      }}
                    >
                      Add To Cart
                    </a>
                  </section>
                </section>
              </section>
            );
          })
        )}
      </section>
      {isLoading ? null : (
        <nav aria-label="..." className="d-flex justify-content-center mt-3">
          <ul className="pagination">
            <li
              className={`page-item ${
                data?.metadata.prevPage ? "" : "disabled"
              }`}
            >
              <button
                className="page-link"
                onClick={() => setPage(data?.metadata.prevPage)}
              >
                Previous
              </button>
            </li>
            {data?.metadata.prevPage ? (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setPage(data?.metadata.prevPage)}
                >
                  {data?.metadata.prevPage}
                </button>
              </li>
            ) : null}

            <li className="page-item bg-main" aria-current="page">
              <button
                className="page-link bg-main text-white"
                onClick={() => setPage(data?.metadata.currentPage)}
              >
                {data?.metadata.currentPage}
              </button>
            </li>
            {data?.metadata.nextPage ? (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setPage(data?.metadata.nextPage)}
                >
                  {data?.metadata.nextPage}
                </button>
              </li>
            ) : null}

            <li className="page-item">
              <button
                className="page-link"
                onClick={() => setPage(data?.metadata.nextPage)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default HomeProducts;
