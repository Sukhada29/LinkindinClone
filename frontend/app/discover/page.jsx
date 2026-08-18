"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import UserLayout from "@/app/(user)/layout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/app/config/redux/action/authAction";

const BASE = "https://linkindinclone.onrender.com";

export default function DiscoverPage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const [connectingId, setConnectingId] = useState(null);
    const [sentRequests, setSentRequests] = useState([]);

    useEffect(() => {

    if (!authState.all_profiles_fetched) {
        dispatch(getAllUsers());
    }

    const fetchSentRequests = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${BASE}/user/my_sent_connection_requests`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log("Sent requests from backend:", data);

            if (response.ok) {
                setSentRequests(data.requests || []);
            }

        } catch (err) {

            console.error(
                "Failed to fetch sent requests:",
                err
            );

        }

    };

    fetchSentRequests();

}, [authState.all_profiles_fetched, dispatch]);

    const myUserId = authState.user?.user?._id;

    console.log("Auth State:", authState);
    console.log("My User ID:", myUserId);


    // Remove yourself from the discover list
    const users = authState.all_users.filter(
        (profile) => profile.userId?._id !== myUserId
    );

    const handleConnect = async (receiverId) => {

        setConnectingId(receiverId);

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(`${BASE}/user/send_connection_request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    connectionId: receiverId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSentRequests((prev) => [...prev, String(receiverId)]);
            } else {
                alert(data.message);
            }

        } catch (err) {

            console.log(err);

        } finally {

            setConnectingId(null);

        }
    };


    const handleWithdraw = async (receiverId) => {

    setConnectingId(receiverId);

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${BASE}/user/withdraw_connection_request`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    connectionId: receiverId,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {

            // Remove user from sent requests
            setSentRequests((prev) =>
                prev.filter((id) => id !== String(receiverId))
            );

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);

    } finally {

        setConnectingId(null);

    }
};

    return (
        <UserLayout>
            <DashboardLayout>

                <div
                    style={{
                        maxWidth: "700px",
                        margin: "0 auto",
                        padding: "20px",
                    }}
                >
                    <h2
                        style={{
                            marginBottom: "20px",
                            color: "var(--color-text-primary)",
                        }}
                    >
                        Discover People
                    </h2>

                    {!authState.all_profiles_fetched && (
                        <p>Loading people...</p>
                    )}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "16px",
                        }}
                    >
                        {users.length === 0 ? (

                            <p>No people found.</p>

                        ) : (

                            users.map((profile) => {

                                const alreadySent = sentRequests.includes(
                                    String(profile.userId?._id)
                                );

                                return (

                                    <div
                                        key={profile._id}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "12px",
                                            padding: "16px",
                                            textAlign: "center",
                                            background: "#fff",
                                        }}
                                    >
                                        <img
                                            src={`${BASE}/uploads/${profile.userId?.profilePicture || "default.jpg"}`}
                                            alt={profile.userId?.name}
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                marginBottom: "10px",
                                            }}
                                        />

                                        <h4 style={{ margin: "5px 0" }}>
                                            {profile.userId?.name}
                                        </h4>

                                        <p
                                            style={{
                                                color: "gray",
                                                marginBottom: "12px",
                                            }}
                                        >
                                            @{profile.userId?.username}
                                        </p>

                                        <button
                                            onClick={() => {
                                                if (alreadySent) {
                                                    handleWithdraw(profile.userId?._id);
                                                } else {
                                                    handleConnect(profile.userId?._id);
                                                }
                                            }}
                                            disabled={connectingId === profile.userId?._id}
                                            style={{
                                                padding: "8px 18px",
                                                borderRadius: "20px",
                                                border: alreadySent
                                                    ? "1px solid #666"
                                                    : "none",
                                                cursor: "pointer",
                                                background: alreadySent
                                                    ? "#fff"
                                                    : "#0a66c2",
                                                color: alreadySent
                                                    ? "#666"
                                                    : "#fff",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {connectingId === profile.userId?._id
                                                ? alreadySent
                                                    ? "Withdrawing..."
                                                    : "Sending..."
                                                : alreadySent
                                                ? "Withdraw"
                                                : "Connect"}
                                        </button>
                                    </div>

                                );
                            })

                        )}
                    </div>
                </div>

            </DashboardLayout>
        </UserLayout>
    );
}