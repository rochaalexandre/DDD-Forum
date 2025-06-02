import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/shared.module.css";

interface HeaderProps {
  showSubmitLink?: boolean;
  showJoinButton?: boolean;
  isVertical?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
                                                showSubmitLink = false,
                                                showJoinButton = false,
                                                isVertical = false
                                              }) => {
  return (
    <header className={`${styles["forum-header"]} ${isVertical ? styles["vertical-header"] : ""}`}>
      <div className={styles["logo-section"]}>
        <img src="/images/logo.png" alt="DDD Logo" className={styles["forum-logo"]} />
        <div className={styles["header-text"]}>
          <h1>Domain-Driven Designers</h1>
          <p>Where awesome domain driven designers are made</p>
        </div>
      </div>
      <div className={styles.actions}>
        {showSubmitLink && (
          <Link to="/submit" className={styles["submit-link"]}>
            submit
          </Link>
        )}
        {showJoinButton && (
          <Link to="/join" className={styles["join-button"]}>
            Join
          </Link>
        )}
      </div>
    </header>
  );
}; 
