import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, createPost, likePost, deletePost, commentOnPost } from "../../action/postAction";

const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    isPosting: false,
    message: "",
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.postFetched = true;
                state.posts = action.payload.posts;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createPost.pending, (state) => {
                state.isPosting = true;
            })
            .addCase(createPost.fulfilled, (state) => {
                state.isPosting = false;
                state.postFetched = false;
            })
            .addCase(createPost.rejected, (state) => {
                state.isPosting = false;
                state.isError = true;
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const post = state.posts.find(p => p._id === action.payload.post_id);
                if (post) post.likes += 1;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(p => p._id !== action.payload.postId);
            })
            .addCase(commentOnPost.fulfilled, (state) => {
                state.postFetched = false;
            });
    },
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;