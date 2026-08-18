"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import UserLayout from "@/app/(user)/layout";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function MyConnectionsPage() {
    const [requests, setRequests] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        try {
           const [reqRes, connRes] = await Promise.all([
                fetch(`${BASE}/user/getConnectionRequests`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),

                fetch(`${BASE}/user/user_connection_request`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
]);
            const reqData = await reqRes.json();
            const connData = await connRes.json();
            setRequests(reqData.requests || []);
            setConnections(connData.connections || []);
        } catch (err) {
            console.error("Failed to fetch connections", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (requestId) => {
    const token = localStorage.getItem("token");

    try {
        await fetch(`${BASE}/user/accept_connection_request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                requestId: requestId,
                action_type: "accept"
            }),
        });

        fetchData();

    } catch (err) {
        console.error("Failed to accept request", err);
    }
};

    const handleRemoveConnection = async (connectionId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `${BASE}/user/remove_connection`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    connectionId: connectionId
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        console.log(data.message);

        // Refresh connections list
        fetchData();

    } catch (err) {
        console.error("Failed to remove connection", err);
    }
}; 

    const cardStyle = {
        background: "var(--color-background-secondary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: 12,
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
    };

    return (
        <UserLayout>
            <DashboardLayout>
                <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 0" }}>

                    
                    
                        
                    {/* Pending requests */}

{loading && (
    <p style={{
        color: "var(--color-text-secondary)",
        fontSize: 14
    }}>
        Loading...
    </p>
)}

{!loading && requests.length > 0 && (
    <div>

        <h2 style={{
            fontSize: 18,
            fontWeight: 500,
            marginBottom: 12,
            color: "var(--color-text-primary)"
        }}>
            Connection requests ({requests.length})
        </h2>

        {requests.map((req) => (
            <div key={req._id} style={cardStyle}>

                <img
                    src={`${BASE}/uploads/${req.userId?.profilePicture || "default.jpg"}`}
                    alt={req.userId?.name}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        objectFit: "cover"
                    }}
                />

                <div style={{ flex: 1 }}>
                    <p style={{
                        margin: 0,
                        fontWeight: 500,
                        fontSize: 14,
                        color: "var(--color-text-primary)"
                    }}>
                        {req.userId?.name || "Unknown"}
                    </p>

                    <p style={{
                        margin: 0,
                        fontSize: 12,
                        color: "var(--color-text-secondary)"
                    }}>
                        @{req.userId?.username}
                    </p>
                </div>

                <button
                    onClick={() => handleAccept(req._id)}
                    style={{
                        background: "#0a66c2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 20,
                        padding: "7px 18px",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer"
                    }}
                >
                    Accept
                </button>

            </div>
        ))}

    </div>
)}

                    {/* Accepted connections */}
                    <h2 style={{ fontSize: 18, fontWeight: 500, marginTop: 24, marginBottom: 12, color: "var(--color-text-primary)" }}>
                        My connections {connections.length > 0 && `(${connections.length})`}
                    </h2>

                    {!loading && connections.length === 0 && (
                        <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>No connections yet. Go to Discover to connect!</p>
                    )}

                    {connections.map((conn) => (
                        <div key={conn._id} style={cardStyle}>
                            <img
                                src={`${BASE}/uploads/${conn.profilePicture || "default.jpg"}`}
                                alt={conn.name}
                                style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                            />
                            <div>
                                <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>
                                    {conn.name || "Unknown"}
                                </p>
                                <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
                                    @{conn.username}
                                </p>
                                <button
                                    onClick={() => handleRemoveConnection(conn._id)}
                                    style={{
                                        background: "#fff",
                                        color: "#d11124",
                                        border: "1px solid #d11124",
                                        borderRadius: 20,
                                        padding: "7px 16px",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        cursor: "pointer"
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}
