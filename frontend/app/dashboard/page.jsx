"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, createPost, likePost, deletePost, commentOnPost, getCommentsByPost } from "@/app/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/app/config/redux/action/authAction";

import DashboardLayout from "@/app/DashboardLayout";

const BASE = "http://localhost:9090";

export default function Dashboard() {

   

    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.posts);

    


    const [postBody, setPostBody] = useState("");

    useEffect(() => {

        console.log("Dashboard useEffect started");

        const token = localStorage.getItem("token");

        console.log("Token =", token);

        if (token) {

            console.log("Dispatching getAboutUser");

            dispatch(getAboutUser({ token }));

            console.log("Dispatching getAllUsers");

            dispatch(getAllUsers());

        }

    }, [dispatch]);
    
    const [postMedia, setPostMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [openComments, setOpenComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [comments, setComments] = useState({});
    
    
    console.log("Dashboard component rendered");


    // On mount: load user, posts, all users
    



    // Re-fetch posts whenever postFetched is false (after creating/deleting/commenting)
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token && !postState.postFetched) {

            dispatch(getAllPosts());

        }

    }, [dispatch, postState.postFetched]);

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPostMedia(file);
        setMediaPreview(URL.createObjectURL(file));
    };

    const handleCreatePost = async () => {
        if (!postBody.trim()) return;

        const result = await dispatch(createPost({ body: postBody, media: postMedia }));

        if(createPost.fulfilled.match(result)){
        setPostBody("");
        setPostMedia(null);
        setMediaPreview(null);
        dispatch(getAllPosts());
    } else {
        console.error("Failed to create post:", result.payload);
    }
};

    const handleLike = async (post_id) => {
    const result = await dispatch(likePost({ post_id }));

    if (likePost.fulfilled.match(result)) {
        dispatch(getAllPosts());
    }
};

     const handleDelete = async (postId) => {

        console.log("Delete clicked");
        console.log("Post ID:", postId);

        const result = await dispatch(deletePost({ postId }));

        console.log("Delete Result:", result);

};
    const handleComment = async (post_id) => {
    const comment = commentText[post_id];

    if (!comment?.trim()) return;

    await dispatch(commentOnPost({ post_id, comment }));

    setCommentText((prev) => ({
        ...prev,
        [post_id]: ""
    }));

    const result = await dispatch(getCommentsByPost(post_id));

    if (getCommentsByPost.fulfilled.match(result)) {
        setComments((prev) => ({
            ...prev,
            [post_id]: result.payload.comments
        }));
    }
};

   const toggleComments = async (post_id) => {

    console.log("🔥 TOGGLE COMMENTS CLICKED:", post_id);

    setOpenComments((prev) => ({prev,[post_id]: !prev[post_id]
    }));

  

const result = await dispatch(getCommentsByPost(post_id));

    if (getCommentsByPost.fulfilled.match(result)) {
        setComments((prev) => ({
            ...prev,
            [post_id]: result.payload.comments
        }));
    }
};

    const myUserId = String(authState.user?.userId?._id || "");

    return (
        
            <DashboardLayout>
                <div style={{ width: "100%", padding: "16px 0" }}>

                    {/* ── CREATE POST BOX ── */}
                    <div style={{
                        background: "var(--color-background-secondary)",
                        border: "1px solid var(--color-border-tertiary)",
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 20,
                    }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <img
                               src={
                                 authState.user?.userId?.profilePicture
                                        ? `${BASE}/uploads/${authState.user.userId.profilePicture}`
                                        : `${BASE}/uploads/default.jpg`
                                }
                              alt="You"
                                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                            />
                            <textarea
                                placeholder="What's on your mind?"
                                value={postBody}
                                onChange={(e) => setPostBody(e.target.value)}
                                rows={3}
                                style={{
                                    flex: 1,
                                    resize: "none",
                                    border: "1px solid var(--color-border-tertiary)",
                                    borderRadius: 8,
                                    padding: "10px 12px",
                                    fontSize: 14,
                                    background: "var(--color-background-primary)",
                                    color: "var(--color-text-primary)",
                                    outline: "none",
                                }}
                            />
                        </div>

                        {mediaPreview && (
                            <div style={{ marginTop: 10, position: "relative", display: "inline-block" }}>
                                <img src={mediaPreview} alt="preview" style={{ maxHeight: 180, borderRadius: 8 }} />
                                <button
                                    onClick={() => { setPostMedia(null); setMediaPreview(null); }}
                                    style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontSize: 14 }}
                                >×</button>
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
                            <label style={{ cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v10.5a1.5 1.5 0 001.5 1.5z" />
                                </svg>
                                Add image
                                <input type="file" accept="image/*" hidden onChange={handleMediaChange} />
                            </label>
                            <button
                                onClick={handleCreatePost}
                                disabled={!postBody.trim() || postState.isPosting}
                                style={{
                                    background: postBody.trim() ? "#0a66c2" : "var(--color-border-tertiary)",
                                    color: postBody.trim() ? "#fff" : "var(--color-text-tertiary)",
                                    border: "none",
                                    borderRadius: 20,
                                    padding: "8px 20px",
                                    fontWeight: 500,
                                    fontSize: 14,
                                    cursor: postBody.trim() ? "pointer" : "not-allowed",
                                    transition: "background 0.2s",
                                }}
                            >
                                {postState.isPosting ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>

                 

                {/* ── POSTS FEED ── */}

{postState.isLoading && (
    <p
        style={{
            textAlign: "center",
            color: "var(--color-text-secondary)",
            fontSize: 14
        }}
    >
        Loading posts...
    </p>
)}

{postState.posts &&
    postState.posts.map((post) => {

        const isMyPost = post.userId?._id === myUserId;
        const commentsOpen = openComments[post._id];

        const isLiked = post.likedBy?.some(
        (id) => String(id) === myUserId
    );

        return (
            <div
                key={post._id}
                style={{
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 12,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)"
                }}
            >

                {/* ───────── AUTHOR ROW ───────── */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center"
                        }}
                    >

                        <img
                            src={
                                post.userId?.profilePicture
                                    ? `${BASE}/uploads/${post.userId.profilePicture}`
                                    : `${BASE}/uploads/default.jpg`
                            }
                            alt={post.userId?.name || "User"}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                        />

                        <div>

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#191919"
                                }}
                            >
                                {post.userId?.name || "Unknown User"}
                            </p>

                            <p
                                style={{
                                    margin: "2px 0",
                                    fontSize: 12,
                                    color: "#666"
                                }}
                            >
                                @{post.userId?.username}
                            </p>

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 11,
                                    color: "#888"
                                }}
                            >
                                1h • 🌐
                            </p>

                        </div>

                    </div>


                    {/* DELETE */}

                    {isMyPost && (
                        <button
                            type="button"
                            onClick={() => handleDelete(post._id)}
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: 18,
                                color: "#666",
                                padding: "2px 6px"
                            }}
                        >
                            •••
                        </button>
                    )}

                </div>


                {/* ───────── POST BODY ───────── */}

                <p
                    style={{
                        margin: "0 0 12px",
                        fontSize: 14,
                        color: "#191919",
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {post.body}
                </p>


                {/* ───────── POST IMAGE ───────── */}

                {post.media && (
                    <img
                        src={`${BASE}/uploads/${post.media}`}
                        alt="Post media"
                        style={{
                            width: "100%",
                            maxHeight: 500,
                            objectFit: "cover",
                            borderRadius: 4,
                            display: "block",
                            marginBottom: 8
                        }}
                    />
                )}


                {/* ───────── LIKE COUNT ───────── */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 2px",
                        color: "#666",
                        fontSize: 12
                    }}
                >

                    <div>
                        <span>
                            👍 {post.likes || 0}
                        </span>

                        {post.likedBy?.length > 0 && (
                            <span style={{ marginLeft: "8px" }}>
                                {post.likedBy
                                    .slice(0, 2)
                                    .map((user) => user.name)
                                    .join(", ")}

                                {post.likedBy.length > 2 && " and others"}
                            </span>
                        )}
                    </div>

                    {comments[post._id]?.length > 0 && (
                        <span>
                            {comments[post._id].length} comments
                        </span>
                    )}

                </div>


                {/* ───────── ACTION BUTTONS ───────── */}

                <div
                    style={{
                        display: "flex",
                        borderTop: "1px solid #e0e0e0",
                        paddingTop: 4
                    }}
                >

                    {/* LIKE */}

               <button
                    type="button"
                    onClick={() => handleLike(post._id)}
                    style={{
                        flex: 1,
                        border: "none",
                        background: "transparent",
                        padding: "10px 5px",
                        cursor: "pointer",
                        color: isLiked ? "#0a66c2" : "#666",
                        fontSize: 13,
                        fontWeight: 600
                    }}
                >
                    {isLiked ? "👍 Unlike" : "👍 Like"}
                </button>


                    {/* COMMENT */}

                    <button
                        type="button"
                        onClick={() => toggleComments(post._id)}
                        style={{
                            flex: 1,
                            border: "none",
                            background: "transparent",
                            padding: "10px 5px",
                            cursor: "pointer",
                            color: "#666",
                            fontSize: 13,
                            fontWeight: 600
                        }}
                    >
                        💬 Comment
                    </button>


                    {/* SHARE */}

                    <button
                        type="button"
                        style={{
                            flex: 1,
                            border: "none",
                            background: "transparent",
                            padding: "10px 5px",
                            cursor: "pointer",
                            color: "#666",
                            fontSize: 13,
                            fontWeight: 600
                        }}
                    >
                        ↗ Share
                    </button>

                </div>


                {/* ───────── COMMENTS ───────── */}

                {commentsOpen && (
                    <div
                        style={{
                            borderTop: "1px solid #eee",
                            marginTop: 4,
                            paddingTop: 12
                        }}
                    >

                        {/* EXISTING COMMENTS */}

                        {comments[post._id]?.length > 0 && (
                            <div style={{ marginBottom: 12 }}>

                                {comments[post._id].map((comment) => (

                                    <div
                                        key={comment._id}
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            marginBottom: 10
                                        }}
                                    >

                                        <img
                                            src={`${BASE}/uploads/${
                                                comment.userId?.profilePicture ||
                                                "default.jpg"
                                            }`}
                                            alt={
                                                comment.userId?.name ||
                                                "User"
                                            }
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                flexShrink: 0
                                            }}
                                        />


                                        <div
                                            style={{
                                                background: "#f3f3f3",
                                                borderRadius:
                                                    "0 8px 8px 8px",
                                                padding: "8px 12px",
                                                flex: 1
                                            }}
                                        >

                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: "#191919"
                                                }}
                                            >
                                                {comment.userId?.name ||
                                                    "Unknown User"}
                                            </p>


                                            <p
                                                style={{
                                                    margin: "3px 0 0",
                                                    fontSize: 13,
                                                    color: "#333"
                                                }}
                                            >
                                                {comment.body}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}


                        {/* COMMENT INPUT */}

                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center"
                            }}
                        >

                            <img
                                src={
                                    authState.user?.userId?.profilePicture
                                        ? `${BASE}/uploads/${authState.user.userId.profilePicture}`
                                        : `${BASE}/uploads/default.jpg`
                                }
                                alt="You"
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />


                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={
                                    commentText[post._id] || ""
                                }
                                onChange={(e) =>
                                    setCommentText((prev) => ({
                                        ...prev,
                                        [post._id]: e.target.value
                                    }))
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleComment(post._id);
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    border: "1px solid #ccc",
                                    borderRadius: 20,
                                    padding: "9px 14px",
                                    fontSize: 13,
                                    outline: "none",
                                    background: "#fff",
                                    color: "#191919"
                                }}
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    handleComment(post._id)
                                }
                                style={{
                                    border: "none",
                                    background: "#0a66c2",
                                    color: "#fff",
                                    borderRadius: 20,
                                    padding: "8px 14px",
                                    cursor: "pointer",
                                    fontSize: 13,
                                    fontWeight: 600
                                }}
                            >
                                Send
                            </button>

                        </div>

                    </div>
                )}

            </div>
        );
    })}   
                </div>
            </DashboardLayout>
        
    );
}
