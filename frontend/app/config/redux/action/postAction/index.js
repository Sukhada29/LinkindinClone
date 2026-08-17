import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE = "http://localhost:9090";

// Create a new post (supports text + optional image)
export const createPost = createAsyncThunk(
    "post/createPost",
    async ({ body, media }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("body", body);

            if (media) {
                formData.append("media", media);
            }

            const response = await fetch(`${BASE}/post`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to create post"
                );
            }

            return data;

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
// Fetch all posts
export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await fetch(`${BASE}/posts`);
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Like a post
export const likePost = createAsyncThunk(
    "post/likePost",
    async ({ post_id }, thunkAPI) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${BASE}/increment_post_like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        postId: post_id,
                    }),
                }
            );

            const data = await response.json();

            return {
                post_id,
                data,
            };

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.message
            );

        }
    }
);

// Comment on a post
export const commentOnPost = createAsyncThunk(
    "post/commentOnPost",
    async ({ post_id, comment }, thunkAPI) => {
        try {
           const token = localStorage.getItem("token");

            const response = await fetch(`${BASE}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    postId: post_id,
                    body: comment
                }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const getCommentsByPost = createAsyncThunk(
    "post/getCommentsByPost",
    async (postId, thunkAPI) => {
        try {
            const response = await fetch(
                `${BASE}/get_comments?postId=${postId}`
            );

            const data = await response.json();

            return {
                postId,
                comments: data.comments || []
            };

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Delete a post
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ postId }, thunkAPI) => {

    console.log("============== THUNK STARTED ==============");
    console.log("PostId =", postId);

    const token = localStorage.getItem("token");
    console.log("Token =", token);

    try {

      console.log("BEFORE FETCH");

      const response = await fetch(`${BASE}/delete_post`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });

      console.log("AFTER FETCH");
      console.log("Status =", response.status);

      const data = await response.json();

      console.log("Response =", JSON.stringify(data, null, 2));

      return { postId, data };

    } catch (err) {

      console.log("FETCH ERROR");
      console.log(err);

      return thunkAPI.rejectWithValue(err.message);
    }
  }
);