import React, { useEffect, useState } from "react";
import { Header } from "./shared/Header";
import styles from "../styles/shared.module.css";
import { getPosts, Post } from "../api/postApi";

const ForumHome: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles['forum-container']}>
      <Header showJoinButton showSubmitLink />

      <nav className={styles['forum-nav']}>
        <button className={`${styles['nav-button']} ${styles['active']}`}>Popular</button>
        <button className={styles['nav-button']}>New</button>
      </nav>

      <main className={styles['posts-list']}>
        {loading ? (
          <div className={styles["loading"]}>Loading posts...</div>
        ) : error ? (
          <div className={styles["error"]}>{error}</div>
        ) : posts.length === 0 ? (
          <div className={styles["no-posts"]}>No posts found.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className={styles["post-item"]}>
              <div className={styles["vote-section"]}>
                <button className={styles["vote-button"]}>▲</button>
                <span className={styles["vote-count"]}>{post.votes}</span>
                <button className={styles["vote-button"]}>▼</button>
              </div>
              <div className={styles["post-content"]}>
                <h2 className={styles["post-title"]}>{post.title}</h2>
                <div className={styles["post-meta"]}>
                  {post.daysAgo} days ago | by <a
                  href={`/user/${post.author}`}>{post.author}</a> | {post.commentsCount} comments
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default ForumHome; 
