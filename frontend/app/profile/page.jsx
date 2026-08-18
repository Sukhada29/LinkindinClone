"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/app/config/redux/action/authAction";
import UserLayout from "@/app/(user)/layout";
import DashboardLayout from "@/app/DashboardLayout";



export default function Profile() {

    const BASE = process.env.NEXT_PUBLIC_API_URL;

    const router = useRouter();

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    useEffect(() => {

        const token = localStorage.getItem("token");

        dispatch(getAboutUser({ token }));

    }, [dispatch]);

   

    return (
        <UserLayout>
            <DashboardLayout>

                <div
                   style={{
                        maxWidth: "700px",
                        margin: "30px auto",
                        padding: "30px",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    }}
>
               <h2
                    style={{
                        fontSize: "30px",
                        marginBottom: "25px",
                    }}
    >
        My Profile
    </h2>

    <img
    src={`${BASE}/uploads/${authState.user?.userId?.profilePicture}`}
    alt="Profile"
    style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        objectFit: "cover",
        display: "block",
        marginBottom: "20px",
    }}
/>

    <h3>
        {authState.user?.userId?.name}
    </h3>

    <p>
        @{authState.user?.userId?.username}
    </p>

    <p>
        {authState.user?.userId?.email}
  
    </p>

    <button
    onClick={() => router.push("/edit_profile")}
    style={{
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#0A66C2",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
    }}
>
    Edit Profile
</button>

          {authState.user?.bio && (
            <div style={{ marginTop: "25px" }}>
                <h3>About</h3>
                <p>{authState.user.bio}</p>
            </div>
)}

          {authState.user?.currentPost && (
            <div style={{ marginTop: "25px" }}>
                <h3>Current Position</h3>
                <p>{authState.user.currentPost}</p>
            </div>
)} 

          {authState.user?.education?.length > 0 && (
             <div style={{ marginTop: "30px" }}>
                  <h3>Education</h3>

        {authState.user.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>

                <h4>{edu.school}</h4>

                <p>
                    {edu.degree} in {edu.fieldOfStudy}
                </p>

            </div>
        ))}
    </div>
)}

         {authState.user?.pastWork?.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                  <h3>Work Experience</h3>

        {authState.user.pastWork.map((work, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>

                <h4>{work.company}</h4>

                <p>
                    {work.position}
                </p>

                <p>
                    {work.years} {work.years == 1 ? "year" : "years"}
                </p>

            </div>
        ))}
    </div>
)}
</div>

         
                    
                

            </DashboardLayout>
        </UserLayout>
    );
}