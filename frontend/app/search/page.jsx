"use client";

import React, { useState } from "react";
import UserLayout from "@/app/(user)/layout";
import DashboardLayout from "@/app/DashboardLayout";
import { useRouter } from "next/navigation";

const BASE = "http://localhost:9090";

export default function SearchPage() {

    const router = useRouter();

    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {

        if (!query.trim()) {
            setUsers([]);
            setSearched(false);
            return;
        }

        const token = localStorage.getItem("token");

        try {

            setLoading(true);

            const response = await fetch(
                `${BASE}/user/search?query=${encodeURIComponent(query)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setUsers(data.users || []);
            } else {
                console.error(data.message);
                setUsers([]);
            }

            setSearched(true);

        } catch (error) {

            console.error("Search failed:", error);
            setUsers([]);

        } finally {

            setLoading(false);

        }
    };

    return (
        <UserLayout>
            <DashboardLayout>

                <div
                    style={{
                        maxWidth: "700px",
                        margin: "30px auto",
                        padding: "20px",
                    }}
                >

                    <h2>Search Users</h2>

                    {/* Search box */}

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "20px",
                            marginBottom: "30px",
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Search by name or username..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            style={{
                                flex: 1,
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                fontSize: "15px",
                            }}
                        />

                        <button
                            onClick={handleSearch}
                            style={{
                                padding: "12px 20px",
                                backgroundColor: "#0A66C2",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            Search
                        </button>

                    </div>


                    {/* Loading */}

                    {loading && (
                        <p>Searching...</p>
                    )}


                    {/* No results */}

                    {!loading &&
                        searched &&
                        users.length === 0 && (
                            <p>
                                No users found.
                            </p>
                        )
                    }


                    {/* Results */}

                    {!loading &&
                        users.length > 0 &&
                        users.map((user) => (

                            <div
                                key={user._id}
                                 onClick={() => {
                                    router.push(`/profile/${user._id}`);
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "15px",
                                    padding: "15px",
                                    marginBottom: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                }}
                            >

                                <img
                                    src={`${BASE}/uploads/${user.profilePicture || "default.jpg"}`}
                                    alt={user.name}
                                    style={{
                                        width: "55px",
                                        height: "55px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />

                                <div>

                                    <h3
                                        style={{
                                            margin: 0,
                                        }}
                                    >
                                        {user.name}
                                    </h3>

                                    <p
                                        style={{
                                            margin: "5px 0 0",
                                            color: "#666",
                                        }}
                                    >
                                        @{user.username}
                                    </p>

                                </div>

                            </div>

                        ))
                    }

                </div>

            </DashboardLayout>
        </UserLayout>
    );
}