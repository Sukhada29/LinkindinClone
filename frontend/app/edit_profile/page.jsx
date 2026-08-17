"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, updateProfileData } from "@/app/config/redux/action/authAction";
import { emptyMessage } from "@/app/config/redux/reducer/authReducer";
import DashboardLayout from "@/app/DashboardLayout";
import UserLayout from "@/app/(user)/layout";

export default function EditProfile() {

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    const [bio, setBio] = useState("");
    const [currentPost, setCurrentPost] = useState("");

    const [school, setSchool] = useState("");
    const [degree, setDegree] = useState("");
    const [fieldOfStudy, setFieldOfStudy] = useState("");

    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [years, setYears] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        dispatch(getAboutUser({ token }));

    }, []);

    useEffect(() => {

        if (authState.user) {

            

            setBio(authState.user.bio || "");
            setCurrentPost(authState.user.currentPost || "");

            setSchool(authState.user.education?.[0]?.school || "");
            setDegree(authState.user.education?.[0]?.degree || "");
            setFieldOfStudy(authState.user.education?.[0]?.fieldOfStudy || "");

            setCompany(authState.user.pastWork?.[0]?.company || "");
            setPosition(authState.user.pastWork?.[0]?.position || "");
            setYears(authState.user.pastWork?.[0]?.years || "");

        }

    }, [authState.user]);

    useEffect(() => {

    if (authState.message) {

        const timer = setTimeout(() => {
            dispatch(emptyMessage());
        }, 3000);

        return () => clearTimeout(timer);

    }

}, [authState.message]);

    return (
        <UserLayout>
            <DashboardLayout>
                <div
               style={{
                  
    
                    maxWidth: "600px",
                    margin: "30px auto",
                    padding: "30px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "boxShadow: 0 6px 20px rgba(0,0,0,0.08)",

 
                }}
> 

                <h2
                style={{
                    fontSize: "30px",
                    marginBottom: "25px",
}}
>
    Edit Profile
</h2>

                {authState.message && (
                    <p
                      style={{
                        backgroundColor: "#d4edda",
                        color: "#155724",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontWeight: "bold",
              }}  
                    >
                        {authState.message}
                    </p>
                )}

              

  


<div style={{ marginTop: 20 }}>

    
    <label
    style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    }}
>
    Bio
</label>

    <textarea
        placeholder="Tell us about yourself..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
        }}
    />

</div>

<div style={{ marginTop: 20 }}>

    <label
    style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    }}
>
    Current Position
</label>

    <input
        placeholder="Enter Current Position"
        value={currentPost}
        onChange={(e) => setCurrentPost(e.target.value)}
        style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
        }}
    />

</div>

<div style={{ marginTop: 20 }}>

    <label
    style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    }}
>
    School
</label>

    <input
        placeholder="Enter School"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
        style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
        }}
    />

</div>
            
                
<div style={{ marginTop: 20 }}>

    <label
    style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    }}
>
    Degree
</label>

    <input
        placeholder="Enter Degree"
        value={degree}
        onChange={(e) => setDegree(e.target.value)}
        style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
            
        }}
    />

</div>
                
                
<div style={{ marginTop: 20 }}>

    <label
    style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    }}
>
    Field Of Study
</label>

    <input
        placeholder="Enter Field Of Study"
        value={fieldOfStudy}
        onChange={(e) => setFieldOfStudy(e.target.value)}
        style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
        }}
    />

</div>                

<div style={{ marginTop: 20 }}>

    <label
    style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    }}
>
    Company
</label>

    <input
        placeholder="Enter Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
        }}
    />

</div>

<div style={{ marginTop: 20 }}>

    <label
    style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    }}
>
      Position
   </label>

    <input
        placeholder="Enter Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
        }}
    />

</div>

<div style={{ marginTop: 20 }}>

    <label
    style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    }}
>
      Years
   </label>

    <input
        placeholder="Enter Years"
        value={years}
        onChange={(e) => setYears(e.target.value)}
        style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
        }}
    />
</div>




<button
     type="button"
    disabled={authState.isLoading}
    onClick={async () => {
     await dispatch(
            updateProfileData({
                bio,
                currentPost,
                education: [
                    {
                        school,
                        degree,
                        fieldOfStudy,
                    }
                ],
                pastWork: [
                    {
                        company,
                        position,
                        years,
                    }
                ]
            })
        );

        

         const token = localStorage.getItem("token");
         dispatch(getAboutUser({ token }));

    }}

    style={{
        width: "100%",
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#0A66C2",
        color: "white",
        border: "none",
        borderRadius: "6px",
        backgroundColor: authState.isLoading ? "#7ba9d8" : "#0A66C2",
        opacity: authState.isLoading ? 0.7 : 1,
        cursor: authState.isLoading ? "not-allowed" : "pointer",
        fontSize: "16px",
        fontWeight: "bold",
    }}
>
    {authState.isLoading ? "Saving..." : "Save Profile"}
</button>

               </div>
            </DashboardLayout>
        </UserLayout>
    );
}