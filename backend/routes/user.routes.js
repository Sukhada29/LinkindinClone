import { Router } from "express";
import { login, register, uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUserProfile, getUserProfileById, downloadProfile, sendConnectionRequest, getMyConnectionsRequests, getPendingConnectionRequests, whatAreMyConnections, acceptConnectionRequest, removeConnection, withdrawConnectionRequest, getMySentConnectionRequests, getConnectionRequestStatus, createPost } from "../controllers/user.controller.js";
import multer from "multer"; 
import {authMiddleware } from "../middleware/auth.middleware.js";
import {getFeed} from "../controllers/user.controller.js";
import {searchUsers} from "../controllers/user.controller.js";
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

router.route("/update_profile_picture")
      .post(authMiddleware, upload.single('profile_picture'), uploadProfilePicture)

router.route('/register').post(register);
router.route('/login').post(login);
router.route("/user_update").post(authMiddleware, updateUserProfile);
router.route("/get_user_and_profile").get(authMiddleware, getUserAndProfile);
router.get(
    "/get_user_profile/:id",
    authMiddleware,
    getUserProfileById
);
router.route("/update_profile_data").post(authMiddleware, updateProfileData);
router.route('/user/get_all_users').get(authMiddleware, getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(authMiddleware, sendConnectionRequest);
router.route("/user/withdraw_connection_request").post(authMiddleware, withdrawConnectionRequest);
router.route("/user/getConnectionRequests").get(authMiddleware, getMyConnectionsRequests);
router.route("/user/pending_connection_requests").get(authMiddleware, getPendingConnectionRequests);
router.route("/user/user_connection_request").get(authMiddleware, whatAreMyConnections);
router.route("/user/accept_connection_request").post(authMiddleware, acceptConnectionRequest);
router.route("/user/remove_connection").post(authMiddleware, removeConnection);
router.route("/user/my_sent_connection_requests").get(authMiddleware, getMySentConnectionRequests);
router.route("/user/connection_request_status/:connectionId").get(authMiddleware, getConnectionRequestStatus);
router.route("/user/feed").get(authMiddleware, getFeed);
router.route("/user/create_post").post(authMiddleware, createPost);
router.route("/user/search").get(authMiddleware, searchUsers);
export default router;