"use client";

import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
    setTokenIsThere,
    setTokenIsNotThere
} from "../config/redux/reducer/authReducer";

import {
    getAllUsers,
    getAboutUser
} from "../config/redux/action/authAction";


export default function DashboardLayout({ children }) {

  const BASE = process.env.NEXT_PUBLIC_API_URL;  

    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    const [checkingAuth, setCheckingAuth] = useState(true);


    useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

        dispatch(setTokenIsNotThere());
        router.replace("/login");

        return;
    }

    dispatch(setTokenIsThere());

    dispatch(getAboutUser({ token }));

    dispatch(getAllUsers());

    setCheckingAuth(false);

}, [dispatch, router]);


    useEffect(() => {

    if (authState.isError && !authState.profileFetched) {

        localStorage.removeItem("token");

        dispatch(setTokenIsNotThere());

        router.replace("/login");
    }

}, [
    authState.isError,
    authState.profileFetched,
    dispatch,
    router
]);


    // Don't render protected page while checking token
    if (checkingAuth) {
        return null;
    }


    return (
        <div>

           <div className={styles.container}>

                <div className={styles.homeContainer}>

                    {/* LEFT SIDEBAR */}

                    <div className={styles.homeContainer_leftBar}>

                        <div
                            onClick={() => {
                                router.push("/dashboard");
                            }}
                            className={styles.sideBarOption}
                        >
                            {/* your existing Scroll SVG */}
                            <p>Scroll</p>
                        </div>


                        <div
                            onClick={() => {
                                router.push("/discover");
                            }}
                            className={styles.sideBarOption}
                        >
                            {/* your existing Discover SVG */}
                            <p>Discover</p>
                        </div>


                        <div
                            onClick={() => {
                                router.push("/my_connections");
                            }}
                            className={styles.sideBarOption}
                        >
                            {/* your existing SVG */}
                            <p>My Connections</p>
                        </div>


                        <div
                            onClick={() => {
                                router.push("/connection_requests");
                            }}
                            className={styles.sideBarOption}
                        >
                            <p>Connection Requests</p>
                        </div>

                    </div>


                    {/* MAIN CONTENT */}

                    <div className={styles.homeContainer_feedContainer}>
                            {children}
                    </div>


                    {/* TOP PROFILES */}

                    <div className={styles.homeContainer_extraContainer}>

                        <h3>Top Profiles</h3>

                        {authState.all_profiles_fetched &&
                            authState.all_users.map((profile) => (

                                <div
                                    key={profile._id}
                                    className={styles.extraContainer_profile}
                                    onClick={() => {
                                        router.push(
                                            `/profile/${profile.userId?._id}`
                                        );
                                    }}
                                    style={{ cursor: "pointer" }}
                                >

                                    <img
                                        src={`${BASE}/uploads/${profile.userId?.profilePicture}`}
                                        alt="Profile"
                                        className={
                                            styles.extraContainer_profile_image
                                        }
                                    />

                                    <div>

                                        <p
                                            className={
                                                styles.extraContainer_profile_name
                                            }
                                        >
                                            {profile.userId?.name}
                                        </p>

                                        <p
                                            className={
                                                styles.extraContainer_profile_username
                                            }
                                        >
                                            @{profile.userId?.username}
                                        </p>

                                    </div>

                                </div>
                                
                                
                            ))
                        }

                    </div>

                </div>

            </div>
            </div>
            

        
    );
}