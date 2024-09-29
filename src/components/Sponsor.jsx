import sponsors1 from "../assets/img/sponsors1.png";
import sponsors2 from "../assets/img/sponsors2.png";
import sponsors3 from "../assets/img/sponsors3.png";
import sponsors4 from "../assets/img/sponsors4.png";
import sponsors5 from "../assets/img/sponsors5.png";
const Sponsor = () => {
    return (
        <section className="sponsor section">
            <div className="sponsor__container container grid">
                <div className="sponsor__content">
                    <img src={sponsors1} alt="" className="sponsor__img" />
                </div>
                <div className="sponsor__content">
                    <img src={sponsors2} alt="" className="sponsor__img" />
                </div>
                <div className="sponsor__content">
                    <img src={sponsors3} alt="" className="sponsor__img" />
                </div>
                <div className="sponsor__content">
                    <img src={sponsors4} alt="" className="sponsor__img" />
                </div>
                <div className="sponsor__content">
                    <img src={sponsors5} alt="" className="sponsor__img" />
                </div>
            </div>
        </section>
    );
};

export default Sponsor;
