import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/shared.module.css";
import { useAuth } from "../../context/AuthContext";

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
  const { user, isAuthenticated, logout } = useAuth();
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
        {isAuthenticated && user ? (
          <div className={styles["user-section"]}>
            <div className={styles["user-profile"]}>
              <div className={styles["avatar"]}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className={styles["user-info"]}>
                <span className={styles["username"]}>{user.username}</span>
                <span className={styles["user-role"]}>Member</span>
              </div>
            </div>
            <button onClick={logout} className={styles["logout-button"]}>
              Logout
            </button>
          </div>
        ) : (
          <>
            {showJoinButton && (
              <Link to="/join" className={styles["join-button"]}>
                Join
              </Link>
            )}
            <Link to="/login" className={styles["login-button"]}>
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
}; 
