"use client";

import { useRouter } from "next/navigation";
import UserLayout from "@/app/(user)/layout";

export default function Home() {

   const router = useRouter();

  return (
    <UserLayout>
    
    <div className="container">
      <div className="mainContainer">
        
        <div className="mainContainer_left">
           
           <p>Connect with Friends without Exaggeration</p>

           <p>A True social media platform, with stories no blufs !</p>

           <div 
             onClick={() => router.push("/login")}
             className="buttonJoin"
           >
             <p>Join Now</p>
           </div>

        </div>

        <div className="mainContainer_right">
          <img src="/images/homemain_connection.jpeg" alt="home" />
        </div>

      </div>
    </div>
  </UserLayout>
    
  );
}