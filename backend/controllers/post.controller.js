import Post from "../models/posts.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

import bcrypt from 'bcrypt';
import Comment from "../models/comments.model.js";


export const activeCheck = async (req, res) => {
    return res.status(200).json({ message: "RUNNING"})
}

export const createPost = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { body } = req.body;

        if (!body || body.trim() === "") {
            return res.status(400).json({
                message: "Post cannot be empty"
            });
        }

        const post = new Post({
            userId: user._id,
            body: body.trim(),

            media: req.file ? req.file.filename : "",

            fileType: req.file ? req.file.mimetype : ""
        });

        await post.save();

        return res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name username profilePicture').populate('likedBy', 'name username profilePicture').sort({ createdAt: -1 });
         return res.json({ posts })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


export const deletePost = async (req, res) => {

    try {

        const { postId } = req.body;

        // Check if postId is provided
        if (!postId) {
            return res.status(400).json({
                message: "Post ID is required"
            });
        }

        // Find the post
        const post = await Post.findById(postId);

        // Check if post exists
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Authorization check
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this post"
            });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

}


export const commentPost = async (req, res) => {

    try {

        const { postId, body } = req.body;

        if (!postId || !body) {
            return res.status(400).json({
                message: "Post ID and comment are required"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = new Comment({
            userId: req.user.id,
            postId: postId,
            body: body
        });

        await comment.save();

        return res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};



export const get_comments_by_post = async (req, res) => {

    try {

        const { postId } = req.query;

        const comments = await Comment.find({
            postId: postId
        })
        .populate("userId", "name username profilePicture")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            comments
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};


export const delete_comment_of_user = async (req, res) => {

    try {

        const { commentId } = req.body;

        if (!commentId) {
            return res.status(400).json({
                message: "Comment ID is required"
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this comment"
            });
        }

        await comment.deleteOne();

        return res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};



export const increment_likes = async (req, res) => {

    try {

        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({
                message: "Post ID is required"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const userId = req.user.id;

        const alreadyLiked = post.likedBy.some(
            (id) => String(id) === String(userId)
        );

        if (alreadyLiked) {

            // Unlike
            post.likedBy = post.likedBy.filter(
                (id) => String(id) !== String(userId)
            );

            post.likes -= 1;

        } else {

            // Like
            post.likedBy.push(userId);

            post.likes += 1;
        }

        await post.save();

        return res.status(200).json({
            message: alreadyLiked
                ? "Post unliked successfully"
                : "Post liked successfully",
            likes: post.likes,
            likedBy: post.likedBy
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};