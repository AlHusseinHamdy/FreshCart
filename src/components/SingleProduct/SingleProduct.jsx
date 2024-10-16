import { useContext, useEffect, useState } from "react";
import styles from "./SingleProduct.module.css";
import { useParams } from "react-router-dom";
import { Cartcontext } from "../../Context/cartContext";
import Slider from "react-slick";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Shopping_cart_icon } from "../../assets/images";

const SingleProduct = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    adaptiveHeight: true,
    arrows: false,
    autoplaySpeed: 3000,
    appendDots: (dots) => {
      return <ul>{dots}</ul>;
    },
  };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const { getSpecificProduct, addToCart } = useContext(Cartcontext);

  const getProduct = async () => {
    const { data } = await getSpecificProduct(params.productId);
    setProduct(data);
    setLoading(false);
  };
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

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <Helmet>
        <title>Product</title>
        <meta name="description" content="Product page" />
      </Helmet>
      {loading ? (
        <section className="position-absolute bg-main-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100 vh-100">
          <PulseLoader color="#0aad0a" size={30} />
        </section>
      ) : (
        <section className="py-5">
          <section className="container">
            <section className="row g-0 gy-5 g-md-5">
              <section className="col-md-4">
                <Slider {...settings}>
                  {product.images.map((image, index) => {
                    return (
                      <section key={index}>
                        <picture>
                          <LazyLoadImage
                            src={image}
                            alt="vegtables backed in a bag"
                            className="w-100 rounded"
                            placeholderSrc={Shopping_cart_icon}
                            effect="blur"
                          />
                        </picture>
                      </section>
                    );
                  })}
                </Slider>
              </section>
              <section className="col-md-8 d-flex align-items-center justify-content-center ">
                <section className="px-3 w-100">
                  <section>
                    <h5 className="fw-bold lh-base">{product.title}</h5>
                    <p className=" mt-3 font-sm px-2">{product.description}</p>
                  </section>
                  <section className="mt-4">
                    <p className="text-black fw-semibold fs-5">
                      {product.category.name}
                    </p>
                  </section>
                  <section className="d-flex justify-content-between align-items-center">
                    <p className="text-black fw-semibold">
                      {product.price} EGP
                    </p>
                    <p>
                      <i className="fas fa-star rating-color"></i>
                      <span className="text-black fw-semibold">
                        {product.ratingsAverage}
                      </span>
                    </p>
                  </section>
                  <section className="mt-3">
                    <button
                      className="btn bg-main cursor-pointer text-white w-100"
                      onClick={() => {
                        addToCartHandler(product._id);
                      }}
                    >
                      Add to cart
                    </button>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default SingleProduct;
