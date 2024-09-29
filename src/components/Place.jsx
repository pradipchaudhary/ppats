// Image imports
import { RiArrowRightLine } from "@remixicon/react";
import place1 from "../assets/img/place1.jpg";
import place2 from "../assets/img/place2.jpg";
import place3 from "../assets/img/place3.jpg";
import place4 from "../assets/img/place4.jpg";
import place5 from "../assets/img/place5.jpg";
const Place = () => {
    return (
        <section className="place section" id="place">
            <h2 className="section__title">Choose Your Place</h2>

            <div className="place__container container grid">
                {/* <!--==================== PLACES CARD 1 ====================--> */}
                <div className="place__card">
                    <img src={place1} alt="" className="place__img" />

                    <div className="place__content">
                        <span className="place__rating">
                            <i className="ri-star-line place__rating-icon"></i>
                            <span className="place__rating-number">4,8</span>
                        </span>

                        <div className="place__data">
                            <h3 className="place__title">Bali</h3>
                            <span className="place__subtitle">Indonesia</span>
                            <span className="place__price">$2499</span>
                        </div>
                    </div>

                    <button className="button button--flex place__button">
                        <RiArrowRightLine size={16} />
                    </button>
                </div>

                {/* <!--==================== PLACES CARD 2 ====================--> */}
                <div className="place__card">
                    <img src={place2} alt="" className="place__img" />

                    <div className="place__content">
                        <span className="place__rating">
                            <i className="ri-star-line place__rating-icon"></i>
                            <span className="place__rating-number">5,0</span>
                        </span>

                        <div className="place__data">
                            <h3 className="place__title">Bora Bora</h3>
                            <span className="place__subtitle">Polinesia</span>
                            <span className="place__price">$1599</span>
                        </div>
                    </div>

                    <button className="button button--flex place__button">
                        <RiArrowRightLine size={16} />
                    </button>
                </div>

                {/* <!--==================== PLACES CARD 3 ====================--> */}
                <div className="place__card">
                    <img src={place3} alt="" className="place__img" />

                    <div className="place__content">
                        <span className="place__rating">
                            <i className="ri-star-line place__rating-icon"></i>
                            <span className="place__rating-number">4,9</span>
                        </span>

                        <div className="place__data">
                            <h3 className="place__title">Hawaii</h3>
                            <span className="place__subtitle">EE.UU</span>
                            <span className="place__price">$3499</span>
                        </div>
                    </div>

                    <button className="button button--flex place__button">
                        <RiArrowRightLine size={16} />
                    </button>
                </div>

                {/* <!--==================== PLACES CARD 4 ====================--> */}
                <div className="place__card">
                    <img src={place4} alt="" className="place__img" />

                    <div className="place__content">
                        <span className="place__rating">
                            <i className="ri-star-line place__rating-icon"></i>
                            <span className="place__rating-number">4,8</span>
                        </span>

                        <div className="place__data">
                            <h3 className="place__title">Whitehaven</h3>
                            <span className="place__subtitle">Australia</span>
                            <span className="place__price">$2499</span>
                        </div>
                    </div>

                    <button className="button button--flex place__button">
                        <RiArrowRightLine size={16} />
                    </button>
                </div>

                {/* <!--==================== PLACES CARD 5 ====================--> */}
                <div className="place__card">
                    <img src={place5} alt="" className="place__img" />

                    <div className="place__content">
                        <span className="place__rating">
                            <i className="ri-star-line place__rating-icon"></i>
                            <span className="place__rating-number">4,8</span>
                        </span>

                        <div className="place__data">
                            <h3 className="place__title">Hvar</h3>
                            <span className="place__subtitle">Croacia</span>
                            <span className="place__price">$1999</span>
                        </div>
                    </div>

                    <button className="button button--flex place__button">
                        <RiArrowRightLine size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Place;
