import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser, getUserProfileById, getAllUsers, updateProfileData, sendConnectionRequest, getPendingConnectionRequests, acceptConnectionRequest  } from "../../action/authAction"; // or correct path

const initialState = {
    user: undefined,
    otherUserProfile: null,
    otherUserProfileFetched: false,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    connectionRequestSent: null,
    connectionRequestMessage: "",
    all_users: [],
    all_profiles_fetched: false,
    
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false
        }
    },


    extraReducers: (builder) => {

        builder
         .addCase(loginUser.pending, (state) => {
             state.isLoading = true
             state.message = "Logging In..."
         })
         .addCase(loginUser.fulfilled, (state, action) => {

            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Login is Successfull"

         })
         .addCase(loginUser.rejected, (state, action) => {
             state.isLoading = false;
             state.isError = true;
             state.message = action.payload || "Login failed";
         })
         .addCase(registerUser.pending, (state) => {
            state.isLoading = true
            state.message = "Registering you..."
         })
         .addCase(registerUser.fulfilled, (state, action) => {
             state.isLoading = false;
             state.isError = false;
             state.isSuccess = true;
             state.loggedIn = false;
             state.message = "Registration is Successfull. Please login in"  }

    )
         .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload?.message || "Registration failed";
         })
          
        .addCase(getAboutUser.fulfilled, (state, action) => {

            console.log(action.payload);

            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload;

         })
        
         .addCase(getAboutUser.rejected, (state, action) => {

            state.isLoading = false;
            state.isError = true;
            state.profileFetched = false;
            state.user = undefined;

            state.message =
                action.payload?.message || "Authentication failed";
        })


         .addCase(getAllUsers.fulfilled, (state, action) => {
              state.isLoading = false;
              state.isError = false;
              state.all_profiles_fetched = true;
              state.all_users = action.payload.profiles
         })


          .addCase(getUserProfileById.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.otherUserProfileFetched = false;
        })
        .addCase(getUserProfileById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.otherUserProfileFetched = true;
            state.otherUserProfile = action.payload;
        })
        .addCase(getUserProfileById.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.otherUserProfileFetched = false;
            state.message = action.payload?.message || "Unable to fetch profile";
        })

         .addCase(updateProfileData.pending, (state) => {
              state.isLoading = true;
})

         .addCase(updateProfileData.fulfilled, (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = "Profile Updated Successfully";
})

         .addCase(updateProfileData.rejected, (state, action) => {
             state.isLoading = false;
             state.isError = true;
             state.message = action.payload?.message || "Something went wrong";
})

         .addCase(sendConnectionRequest.pending, (state) => {
            state.isLoading = true;
            state.connectionRequestMessage = "";
})

          .addCase(sendConnectionRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.connectionRequestSentTo = action.meta.arg;
                state.connectionRequestMessage = action.payload.message;

})

        .addCase(sendConnectionRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.connectionRequestMessage =
                  action.payload?.message || "Something went wrong";
})  

        .addCase(getPendingConnectionRequests.pending, (state) => {
           state.isLoading = true;
})

       .addCase(getPendingConnectionRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.connectionRequest = action.payload.requests;
})

       .addCase(getPendingConnectionRequests.rejected, (state, action) => {
           state.isLoading = false;
           state.isError = true;
           state.message =
              action.payload?.message || "Failed to fetch connection requests";
}) 

        .addCase(acceptConnectionRequest.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
})

       .addCase(acceptConnectionRequest.fulfilled, (state, action) => {

            state.isLoading = false;
            state.isError = false;
            state.message = action.payload.message;

    // Remove the request from pending requests
            state.connectionRequest = state.connectionRequest.filter(
                (request) => request._id !== action.meta.arg.requestId
            );

})

       .addCase(acceptConnectionRequest.rejected, (state, action) => {

            state.isLoading = false;
            state.isError = true;

            state.message =
                action.payload?.message || "Failed to update request";

})
    }


})


export const {reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions


export default authSlice.reducer