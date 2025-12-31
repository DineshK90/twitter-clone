import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {collection, doc, getDoc, getDocs, setDoc, where, query} from 'firebase/firestore'
import { db } from "../../firebase";

// const BASE_URL = 'https://f53b4046-5164-4ce1-a0dd-d5bf3beb1799-00-1nvu78jv81s33.janeway.replit.dev'

export const savePost = createAsyncThunk('posts/savePost', 
  async ({userId, postContent}) =>{
    try{
        const postsRef = collection(db, `users/${userId}/posts`)
        const newPostRef = doc(postsRef)
        await setDoc(newPostRef, {content:postContent, likes:[]})

        const newPost = await getDoc(newPostRef)
        const post = {
          id: newPost.id,
          ...newPost.data()
        }
        return post;
    } catch(error){
      console.error(error)
      throw error
    }
  }
)

export const fetchPostsByUser = createAsyncThunk(
  'posts/fetchPostByUser',
  async (userId) => {
    try {
      const postsRef = collection(db, `users/${userId}/posts`);
      const querySnapshot = await getDocs(postsRef);

      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return docs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const searchPosts = createAsyncThunk(
  "posts/searchPosts",
  async (searchTerm) => {
    try {
      const postsRef = collection(db, "posts");

      const q = query(
        postsRef,
        where("content", ">=", searchTerm),
        where("content", "<=", searchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);

      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return docs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async({userId, postId}) => {
    try{
      const postRef = doc(db, `users/${userId}/posts/${postId}`)
      const docSnap = await getDoc(postRef)

      if(docSnap.exists()){
        const postData = docSnap.data()
        const likes = [...postData.likes, userId]

        await setDoc(postRef,{...postData, likes})
      }
      return{userId, postId}
    } catch(error){
      console.error(error)
      throw error
    }
  }
)

export const removeLikeFromPost = createAsyncThunk(
  "posts/removeLikeFromPost",
  async({userId, postId}) => {
    try{
      const postRef = doc(db, `users/${userId}/posts/${postId}`)
      const docSnap = await getDoc(postRef)

      if(docSnap.exists()){
        const postData = docSnap.data()
        const likes = postData.likes.filter((id) => id !== userId)

        await setDoc(postRef,{...postData, likes})
      }
      return{userId, postId}
    } catch(error){
      console.error(error)
      throw error
    }
  }
)


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
    builder
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })

      .addCase(savePost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      })

      .addCase(likePost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload;
        const postIndex = state.posts.findIndex(
          (post) => post.id === postId
        );

        if (postIndex !== -1) {
          state.posts[postIndex].likes.push(userId);
        }
      })

      .addCase(removeLikeFromPost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload;
        const postIndex = state.posts.findIndex(
          (post) => post.id === postId
        );

        if (postIndex !== -1) {
          state.posts[postIndex].likes =
            state.posts[postIndex].likes.filter(
              (id) => id !== userId
            );
        }
      });
  },
});

export default postsSlice.reducer;