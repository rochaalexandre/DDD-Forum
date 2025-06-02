import axios from "axios";

const API_BASE_URL = "http://localhost:3030";

export interface Post {
  id: number;
  title: string;
  author: string;
  commentsCount: number;
  votes: number;
  daysAgo: number;
}

export interface CreatePostDto {
  title: string;
  content: string;
  postType: string;
  memberId: number;
}

export interface VoteDto {
  memberId: number;
  voteType: "Upvote" | "Downvote";
}

/**
 * Fetches all posts
 * @returns Promise with the posts array
 */
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

/**
 * Creates a new post
 * @param postData The post data to create
 * @returns Promise with the created post
 */
export const createPost = async (postData: CreatePostDto): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/new`, postData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

/**
 * Votes on a post
 * @param postId The ID of the post to vote on
 * @param voteData The vote data
 * @returns Promise with the vote result
 */
export const voteOnPost = async (postId: number, voteData: VoteDto): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/${postId}/vote`, voteData);
    return response.data;
  } catch (error) {
    console.error("Error voting on post:", error);
    throw error;
  }
};
