import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const BASE_URL = 'https://f53b4046-5164-4ce1-a0dd-d5bf3beb1799-00-1nvu78jv81s33.janeway.replit.dev'

export const savePost = createAsyncThunk('posts/savePost', async (postContent) =>{
        const token = localStorage.getItem('authToken')
        const decode = jwtDecode(token)
        const userId = decode.id
        
        const data = {
            title: '',
            content: postContent,
            user_id:userId
        }
     const response = await axios.post(`${BASE_URL}/posts`, data)
     return response.data
    }
)

export const fetchPostsByUser = createAsyncThunk('posts/fetchPostByUser', async(userId)=>{
    const response = await fetch(`${BASE_URL}/posts/user/${userId}`)
    return response.json()
})

export const searchPosts = createAsyncThunk(
  "posts/searchPosts",
  async (searchTerm) => {
    const response = await axios.get(
      `${BASE_URL}/posts/search?q=${encodeURIComponent(searchTerm)}`,
    );
    return response.data;
  },
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    searchResults: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    }),
      builder.addCase(savePost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      }),
      builder.addCase(searchPosts.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      }),
      builder.addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;