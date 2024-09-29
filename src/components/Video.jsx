// import video
import { RiPlayLine } from "@remixicon/react";
import video from "../assets/video/video.mp4";

const Video = () => {
    return (
        <section className="video section">
            <h2 className="section__title">Video Tour</h2>

            <div className="video__container container">
                <p className="video__description">
                    Find out more with our video of the most beautiful and
                    pleasant places for you and your family.
                </p>

                <div className="video__content">
                    <video id="video-file">
                        <source src={video} type="video/mp4" />
                    </video>

                    <button
                        className="button button--flex video__button"
                        id="video-button"
                    >
                        <RiPlayLine
                            className="video__buttion-icon"
                            id="video-icon"
                        />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Video;
