// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Image imports
import discover1 from "../assets/img/discover1.jpg";
import discover2 from "../assets/img/discover2.jpg";
import discover3 from "../assets/img/discover3.jpg";
import discover4 from "../assets/img/discover4.jpg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/bundle";

const Discover = () => {
    return (
        <section className="discover section" id="discover">
            <h2 className="section__title">
                Discover the most <br /> attractive places
            </h2>

            <div className="discover__container container swiper-container">
                <div className="swiper-wrapper">
                    <Swiper
                        slidesPerView={3}
                        onSlideChange={() => console.log("slide change")}
                        onSwiper={(swiper) => console.log(swiper)}
                        effect="coverflow" // Activate coverflow effect
                        grabCursor={true} // Enables cursor grabbing
                        centeredSlides={true} // Centers the slides
                        // slidesPerView="auto" // Automatic slides per view
                        loop={true} // Enables infinite looping
                        spaceBetween={32} // Space between the slides
                        coverflowEffect={{
                            rotate: 50, // Adjusts rotation angle
                            stretch: 0, // Stretch the slides (set 0 for no stretch)
                            depth: 100, // Depth of the coverflow
                            modifier: 1, // Modifier that affects depth/scale
                            slideShadows: true, // Slide shadow effect
                        }}
                        pagination={{ clickable: true }} // Pagination controls
                        className="discover__container container"
                    >
                        <SwiperSlide className="discover__card swiper-slide">
                            <img
                                src={discover1}
                                alt="Bali"
                                className="discover__img"
                            />
                            <div className="discover__data">
                                <h2 className="discover__title">Bali</h2>
                                <span className="discover__description">
                                    24 tours available
                                </span>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="discover__card">
                            <img
                                src={discover2}
                                alt="Hawaii"
                                className="discover__img"
                            />
                            <div className="discover__data">
                                <h2 className="discover__title">Hawaii</h2>
                                <span className="discover__description">
                                    15 tours available
                                </span>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="discover__card">
                            <img
                                src={discover3}
                                alt="Hvar"
                                className="discover__img"
                            />
                            <div className="discover__data">
                                <h2 className="discover__title">Hvar</h2>
                                <span className="discover__description">
                                    18 tours available
                                </span>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="discover__card">
                            <img
                                src={discover4}
                                alt="Whitehaven"
                                className="discover__img"
                            />
                            <div className="discover__data">
                                <h2 className="discover__title">Whitehaven</h2>
                                <span className="discover__description">
                                    32 tours available
                                </span>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default Discover;
