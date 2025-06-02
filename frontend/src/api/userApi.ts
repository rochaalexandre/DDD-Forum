import axios from "axios";

const API_BASE_URL = "http://localhost:3030";

export interface UserDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse {
  data?: UserResponse;
  success: boolean;
  error?: string;
}

/**
 * Fetches a user by email
 * @param email The email of the user to fetch
 * @returns Promise with the API response
 */
export const getUserByEmail = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse;
    }
    return {
      success: false,
      error: "Network error"
    };
  }
};

/**
 * Creates a new user
 * @param userData The user data to create
 * @returns Promise with the API response
 */
export const createUser = async (userData: UserDto): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/new`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse;
    }
    return {
      success: false,
      error: "Network error"
    };
  }
};

/**
 * Updates an existing user
 * @param userId The ID of the user to update
 * @param userData The updated user data
 * @returns Promise with the API response
 */
export const updateUser = async (userId: number, userData: UserDto): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/edit/${userId}`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse;
    }
    return {
      success: false,
      error: "Network error"
    };
  }
};
