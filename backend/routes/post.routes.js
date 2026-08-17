import { Router } from "express";
import { activeCheck } from "../controllers/post.controller.js";
import { createPost } from "../controllers/post.controller.js";
import { getAllPosts, deletePost, get_comments_by_post, delete_comment_of_user, increment_likes } from "../controllers/post.controller.js";
import {commentPost } from "../controllers/post.controller.js";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = Router();



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})


const upload = multer({ storage: storage })




router.route('/').get(activeCheck);


router.route("/post").post(authMiddleware, upload.single('media'), createPost)
router.route("/posts").get(getAllPosts)
router.delete("/delete_post", authMiddleware, deletePost);
router.route("/comment").post(authMiddleware, commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(authMiddleware, delete_comment_of_user);
router.route('/increment_post_like').post(authMiddleware, increment_likes);



export default router;