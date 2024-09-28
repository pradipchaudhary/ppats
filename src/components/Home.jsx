import BackgroundImage from "../assets/img/home1.jpg";

const Home = () => {
    return (
        <section className="home" id="home">
            <img
                src={BackgroundImage}
                alt="Home, Background image"
                className="home__img"
            />

            <div className="home__container container grid">
                <div className="home__data">
                    <span className="home__data-subtitle">
                        Discover your place
                    </span>
                    <h1 className="home__data-title">
                        Explore The <br /> Best{" "}
                        <b>
                            Beautiful <br /> Beaches
                        </b>
                    </h1>
                    <a href="#" className="button">
                        Explore
                    </a>
                </div>

                <div className="home__social">
                    <a
                        href="https://www.facebook.com/"
                        target="_blank"
                        className="home__social-link"
                    >
                        <i className="ri-facebook-box-fill"></i>
                    </a>
                    <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        className="home__social-link"
                    >
                        <i className="ri-instagram-fill"></i>
                    </a>
                    <a
                        href="https://twitter.com/"
                        target="_blank"
                        className="home__social-link"
                    >
                        <i className="ri-twitter-fill"></i>
                    </a>
                </div>

                <div className="home__info">
                    <div>
                        <span className="home__info-title">
                            5 best places to visit
                        </span>
                        <a
                            href=""
                            className="button button--flex button--link home__info-button"
                        >
                            More <i className="ri-arrow-right-line"></i>
                        </a>
                    </div>

                    <div className="home__info-overlay">
                        <img
                            src="assets/img/home2.jpg"
                            alt=""
                            className="home__info-img"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
