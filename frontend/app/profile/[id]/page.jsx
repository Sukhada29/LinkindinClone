"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileById, sendConnectionRequest, withdrawConnectionRequest, getConnectionRequestStatus } from "@/app/config/redux/action/authAction";

export default function OtherProfile() {

    const params = useParams();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
     const [requestSent, setRequestSent] = useState(false);

    console.log("PROFILE ID:", params.id);

    useEffect(() => {

    if (params.id) {

        dispatch(getUserProfileById(params.id));

        dispatch(
            getConnectionRequestStatus(params.id)
        )
        .unwrap()
        .then((data) => {

            setRequestSent(data.requestSent);

        })
        .catch((err) => {

            console.error(
                "Failed to get connection status:",
                err
            );

        });

    }

}, [params.id, dispatch]);


   


    if (!authState.otherUserProfileFetched) {
        return <h2>Profile not found</h2>;
    }


    const profile = authState.otherUserProfile;


    return (
        <div>

            <h1>Profile</h1>

            <img
                src={`http://localhost:9090/uploads/${profile.userId?.profilePicture}`}
                alt="Profile"
                style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover"
                }}
            />

            <h2>
                {profile.userId?.name}
            </h2>

            <p>
                @{profile.userId?.username}
            </p>

            <p>
                {profile.userId?.email}
            </p>


        <button
    disabled={authState.isLoading}
    onClick={async () => {

           if(requestSent) {

              await dispatch(
                 withdrawConnectionRequest(params.id)
              );

              setRequestSent(false);
           } else {

                const result = await dispatch(
                    sendConnectionRequest(params.id)
                );

                if(sendConnectionRequest.fulfilled.match(result)) {
                    setRequestSent(true);
                }
           }
        }}
    style={{
        marginTop: "20px",
        padding: "10px 20px",

        backgroundColor: requestSent
           
                ? "#fff"
                : "#0A66C2",

        color: requestSent
           
                ? "#666"
                : "#fff",

        border: requestSent
            
                ? "1px solid #666"
                : "none",

        borderRadius: "20px",

        cursor: authState.isLoading
            ? "not-allowed"
            : "pointer",

        fontWeight: "bold"
    }}
>
    {authState.isLoading
        ? "Please wait..."
        : requestSent
        ? "Withdraw"
        : "Send Connection Request"
    }
</button>

       

            {profile.bio && (
                <div>
                    <h3>About</h3>
                    <p>{profile.bio}</p>
                </div>
            )}


            {profile.currentPost && (
                <div>
                    <h3>Current Position</h3>
                    <p>{profile.currentPost}</p>
                </div>
            )}


            {profile.education?.length > 0 && (
                <div>
                    <h3>Education</h3>

                    {profile.education.map((edu, index) => (
                        <div key={index}>

                            <h4>{edu.school}</h4>

                            <p>
                                {edu.degree} in {edu.fieldOfStudy}
                            </p>

                        </div>
                    ))}
                </div>
            )}


            {profile.pastWork?.length > 0 && (
                <div>
                    <h3>Work Experience</h3>

                    {profile.pastWork.map((work, index) => (
                        <div key={index}>

                            <h4>{work.company}</h4>

                            <p>{work.position}</p>

                            <p>{work.years} years</p>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}