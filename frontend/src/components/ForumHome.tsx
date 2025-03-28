import React from 'react';
import styles from './ForumHome.module.css';

interface Post {
  id: number;
  title: string;
  author: string;
  commentsCount: number;
  votes: number;
  daysAgo: number;
}

const ForumHome: React.FC = () => {
  const posts: Post[] = [
    {
      id: 1,
      title: "Domain services vs Application services",
      author: "stemmlerjs",
      commentsCount: 5,
      votes: 9,
      daysAgo: 7
    },
    {
      id: 2,
      title: "Ports and Adapters",
      author: "stemmlerjs",
      commentsCount: 1,
      votes: 3,
      daysAgo: 6
    },
    {
      id: 3,
      title: "An Introduction to Domain-Driven Design - DDD w/ TypeScript",
      author: "stemmlerjs",
      commentsCount: 0,
      votes: 2,
      daysAgo: 7
    }
  ];

  return (
    <div className={styles['forum-container']}>
      <header className={styles['forum-header']}>
        <div className={styles['logo-section']}>
          <img src="/images/logo.png" alt="DDD Forum Logo" className={styles['forum-logo']} />
          <div className={styles['header-text']}>
            <h1>Domain-Driven Designers</h1>
            <p>Where awesome Domain-Driven Designers are made</p>
          </div>
        </div>
        <button className={styles['join-button']}>Join</button>
      </header>

      <div className={styles['submit-section']}>
        <a href="/submit" className={styles['submit-link']}>submit</a>
      </div>

      <nav className={styles['forum-nav']}>
        <button className={`${styles['nav-button']} ${styles['active']}`}>Popular</button>
        <button className={styles['nav-button']}>New</button>
      </nav>

      <main className={styles['posts-list']}>
        {posts.map((post) => (
          <div key={post.id} className={styles['post-item']}>
            <div className={styles['vote-section']}>
              <button className={styles['vote-button']}>▲</button>
              <span className={styles['vote-count']}>{post.votes}</span>
              <button className={styles['vote-button']}>▼</button>
            </div>
            <div className={styles['post-content']}>
              <h2 className={styles['post-title']}>{post.title}</h2>
              <div className={styles['post-meta']}>
                {post.daysAgo} days ago | by <a href={`/user/${post.author}`}>{post.author}</a> | {post.commentsCount} comments
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default ForumHome; 