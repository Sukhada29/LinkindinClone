import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/app/config";


export const loginUser = createAsyncThunk(
    "user/login",
    async (user , thunkAPI) => {
        try{

          const response = await clientServer.post('/login', {
              email: user.email,
              password: user.password
          });

           if(response.data.token) {
              localStorage.setItem("token", response.data.token)
           } else {
                return thunkAPI.rejectWithValue({
                    message: "token not provided"
                })
           }

           return thunkAPI.fulfillWithValue(response.data.token)

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)


export const registerUser = createAsyncThunk(
    "auth/register",
    async (user, thunkAPI) => {
        try {
            const request = await clientServer.post("/register", {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name,
            })
            return request.data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {

        try {

            

            const response = await clientServer.get(
                "/get_user_and_profile",
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            

            return thunkAPI.rejectWithValue(err.response?.data);

        }
    }
);


export const getUserProfileById = createAsyncThunk(
    "user/getUserProfileById",
    async (userId, thunkAPI) => {

        try {

            const token = localStorage.getItem("token");

            const response = await clientServer.get(
                `/get_user_profile/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(
                err.response?.data
            );

        }
    }
);

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, thunkAPI) => {
        try {

            const token = localStorage.getItem('token');

            const response = await clientServer.get(
                '/user/get_all_users',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const getPendingConnectionRequests = createAsyncThunk(
    "user/getPendingConnectionRequests",
    async (_, thunkAPI) => {

        try {

            const token = localStorage.getItem("token");

            const response = await clientServer.get(
                "/user/pending_connection_requests",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(
                err.response?.data || {
                    message: "Failed to fetch connection requests"
                }
            );

        }
    }
);


export const updateProfileData = createAsyncThunk(
    "user/updateProfileData",
    async (profileData, thunkAPI) => {

        try {

            const token = localStorage.getItem("token");

            const response = await clientServer.post(
                "/update_profile_data",
                profileData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data);

        }
    }
);


export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async (connectionId, thunkAPI) => {

        try {

            const token = localStorage.getItem("token");

            const response = await clientServer.post(
                "/user/send_connection_request",
                {
                    connectionId: connectionId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(
                err.response?.data || {
                    message: "Something went wrong"
                }
            );

        }
    }
);


export const acceptConnectionRequest = createAsyncThunk(
    "user/acceptConnectionRequest",
    async ({ requestId, action_type }, thunkAPI) => {

        try {

            const token = localStorage.getItem("token");

            const response = await clientServer.post(
                "/user/accept_connection_request",
                {
                    requestId,
                    action_type
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(
                err.response?.data || {
                    message: "Failed to update request"
                }
            );

        }
    }
);



export const withdrawConnectionRequest = (connectionId) => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:9090/user/withdraw_connection_request",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    connectionId,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            dispatch({
                type: "WITHDRAW_CONNECTION_REQUEST_SUCCESS",
                payload: connectionId,
            });
        } else {
            dispatch({
                type: "CONNECTION_REQUEST_ERROR",
                payload: data.message,
            });
        }

    } catch (error) {
        dispatch({
            type: "CONNECTION_REQUEST_ERROR",
            payload: error.message,
        });
    }
};


export const getConnectionRequestStatus = createAsyncThunk(
    "user/getConnectionRequestStatus",
    async (connectionId, thunkAPI) => {

        try {

            const token = localStorage.getItem("token");

            const response = await clientServer.get(
                `/user/connection_request_status/${connectionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(
                err.response?.data || {
                    message: "Failed to check connection request"
                }
            );

        }
    }
);