"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/app/DashboardLayout";
import {
    getPendingConnectionRequests, acceptConnectionRequest
} from "@/app/config/redux/action/authAction";

export default function ConnectionRequests() {

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    useEffect(() => {

        dispatch(getPendingConnectionRequests());

    }, [dispatch]);


    if (authState.isLoading) {
        return (
            <DashboardLayout>
                <h2>Loading connection requests...</h2>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout>

            <div style={{
                maxWidth: "700px",
                margin: "30px auto"
            }}>

                <h1>Connection Requests</h1>


                {authState.connectionRequest.length === 0 && (
                    <p style={{ marginTop: "20px" }}>
                        No pending connection requests.
                    </p>
                )}


                {authState.connectionRequest.map((request) => (

                    <div
                        key={request._id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            padding: "20px",
                            marginTop: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "10px"
                        }}
                    >

                        <img
                            src={`http://localhost:9090/uploads/${request.userId?.profilePicture}`}
                            alt="Profile"
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                        />


                        <div style={{ flex: 1 }}>

                            <h3>
                                {request.userId?.name}
                            </h3>

                            <p>
                                @{request.userId?.username}
                            </p>

                        </div>


                       <button
    onClick={() => {

        dispatch(
            acceptConnectionRequest({
                requestId: request._id,
                action_type: "accept"
            })
        );

    }}
    style={{
        padding: "8px 15px",
        marginRight: "10px",
        cursor: "pointer"
    }}
>
    Accept
</button>


<button
    onClick={() => {

        dispatch(
            acceptConnectionRequest({
                requestId: request._id,
                action_type: "reject"
            })
        );

    }}
    style={{
        padding: "8px 15px",
        cursor: "pointer"
    }}
>
    Reject
</button>

                    </div>

                ))}

            </div>

        </DashboardLayout>
    );
}