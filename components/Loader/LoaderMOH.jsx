import React, { useEffect } from "react";
import styles from "./LoaderMOH.module.css";

const Loader = ({ imageSrc, isVisible }) => {
    useEffect(() => {
        if (isVisible) {
            document.body.classList.add("loader-active");
        } else {
            document.body.classList.remove("loader-active");
        }
        return () => {
            document.body.classList.remove("loader-active");
        };
    }, [isVisible]);
    if (!isVisible) return null;


    return (
        <div className={styles["loader-container"]}>
            <div className={styles.loader}>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
                <div className={styles.logo}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 94 94"
                        className={styles.svg}
                    >
                        <image
                            href={imageSrc}
                            x="0"
                            y="0"
                            width="94"
                            height="94"
                            preserveAspectRatio="xMidYMid slice"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Loader;