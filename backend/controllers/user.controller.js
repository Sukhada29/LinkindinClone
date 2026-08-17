import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import crypto from 'crypto';

import bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import fs from "fs";
import jwt from "jsonwebtoken";
import ConnectionRequest from "../models/connections.model.js";
import Post from "../models/posts.model.js";


const convertUserDataTOPDF = async (userData) => {
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`, { align: "center", width: 100 })
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

    doc.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Company Name: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);
    })

    doc.end();

    return outputPath;
}




export const register = async(req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if(!name || !email || !password || !username) return res.status(400).json({ message: "All fields are required" })

        const user = await User.findOne({
            email
        });

        if(user) return res.status(400).json({ message: "User already exists"});


        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
            profilePicture: "default.jpg"
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id});

        await profile.save();

        return res.json({ message: "User Created" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const login = async(req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" })

        const user = await User.findOne({
            email
        });

        if(!user) return res.status(404).json({ message: "User does not exist"})

         const isMatch = await bcrypt.compare(password, user.password);   
         if(!isMatch) return res.status(400).json({ message: "Invalid Credentials" })

         const payload = {
            id: user._id,
            email: user.email,
            username: user.username
};

         const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h"
});

return res.json({ token });

    } catch(error) {
         return res.status(500).json({ message: error.message })
    }
}


export const uploadProfilePicture = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profilePicture = req.file.filename;

        await user.save();

        return res.json({ message: "Profile Picture Updated" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateUserProfile = async (req, res) => {

    try {

        const newUserData = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { username, email } = newUserData;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser && String(existingUser._id) !== String(user._id)) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        Object.assign(user, newUserData);

        await user.save();

        return res.json({ message: "User Updated" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserAndProfile = async (req, res) => {

    try {

        const user = req.user;
        const userProfile = await Profile.findOne({ userId: user.id})
            .populate('userId', 'name email username profilePicture');

         


        return res.json(userProfile);


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


export const getUserProfileById = async (req, res) => {

    try {

        const userProfile = await Profile.findOne({
            userId: req.params.id
        }).populate(
            "userId",
            "name email username profilePicture"
        );

        if (!userProfile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        return res.json(userProfile);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};


export const updateProfileData = async (req, res) => {

    try {

        const newProfileData = req.body;

        const profileToUpdate = await Profile.findOne({
            userId: req.user.id
        });

        if (!profileToUpdate) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        Object.assign(profileToUpdate, newProfileData);

        await profileToUpdate.save();

        return res.json({
            message: "Profile Updated"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const getAllUserProfile = async (req, res) => {
    try {

        const profiles = await Profile.find({
            userId: { $ne: req.user.id }   // exclude logged-in user
        }).populate('userId', 'name username email profilePicture');

        return res.json({ profiles });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const downloadProfile = async (req, res) => {

    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id })
      .populate('userId', 'name username email profilePicture');

    let outputPath = await convertUserDataTOPDF(userProfile);  

    return res.json({ "message": outputPath })
}


export const sendConnectionRequest = async (req, res) => {

    const { connectionId } = req.body;

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connectionUser = await User.findById(connectionId);

        if (!connectionUser) {
            return res.status(404).json({
                message: "Connection User not found"
            });
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "Request already sent"
            });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await request.save();

        return res.json({
            message: "Request Sent"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

export const getMyConnectionsRequests = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connections = await ConnectionRequest.find({
            userId: user._id,
            status_accepted: null
        }).populate(
            "connectionId",
            "name username email profilePicture"
        );

        return res.json({ connections });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


export const getPendingConnectionRequests = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const requests = await ConnectionRequest.find({
            connectionId: user._id,
            status_accepted: null
        }).populate(
            "userId",
            "name username email profilePicture"
        );

        return res.json({ requests });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


export const whatAreMyConnections = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connections = await ConnectionRequest.find({
    status_accepted: true,
    $or: [
        { userId: req.user.id },
        { connectionId: req.user.id }
    ]
})
.populate(
    "userId",
    "name username email profilePicture"
)
.populate(
    "connectionId",
    "name username email profilePicture"
);
      const myConnections = connections.map(connection => {

    if (connection.userId._id.toString() === req.user.id) {

        return connection.connectionId;

    } else {

        return connection.userId;

    }

});

return res.json({
    connections: myConnections
});  

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


export const getFeed = async (req, res) => {

    try {

        // Logged in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Get all accepted connections
        const connections = await ConnectionRequest.find({
            status_accepted: true,
            $or: [
                { userId: req.user.id },
                { connectionId: req.user.id }
            ]
        });

        // Store IDs whose posts should appear
        const ids = [];

        // Include logged-in user's posts
        ids.push(req.user.id);

        // Add all connected users
        connections.forEach((connection) => {

            if (String(connection.userId) === String(req.user.id)) {
                ids.push(connection.connectionId);
            } else {
                ids.push(connection.userId);
            }

        });

        // Fetch posts
        const posts = await Post.find({
            userId: {
                $in: ids
            }
        })
        .populate("userId", "name username profilePicture")
        .sort({ createdAt: -1 });

        return res.json({ posts });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};


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

export const acceptConnectionRequest = async (req, res) => {

    const { requestId, action_type } = req.body;

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connection = await ConnectionRequest.findById(requestId);

        if (!connection) {
            return res.status(404).json({
                message: "Connection not found"
            });
        }

        connection.status_accepted = (action_type === "accept");

        await connection.save();

        return res.json({
            message: "Request Updated"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


export const removeConnection = async (req, res) => {

    const { connectionId } = req.body;

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connection = await ConnectionRequest.findOne({
            status_accepted: true,
            $or: [
                {
                    userId: user._id,
                    connectionId: connectionId
                },
                {
                    userId: connectionId,
                    connectionId: user._id
                }
            ]
        });

        if (!connection) {
            return res.status(404).json({
                message: "Connection not found"
            });
        }

        await ConnectionRequest.findByIdAndDelete(connection._id);

        return res.json({
            message: "Connection removed successfully"
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};

export const withdrawConnectionRequest = async (req, res) => {

    const { connectionId } = req.body;

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const request = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionId,
            status_accepted: null
        });

        if (!request) {
            return res.status(404).json({
                message: "Request already sent"
            });
        }

        await ConnectionRequest.findByIdAndDelete(request._id);

        return res.json({
            message: "Connection request withdrawn"
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};


export const getMySentConnectionRequests = async (req, res) => {
    try {

        const requests = await ConnectionRequest.find({
            userId: req.user.id,
            status_accepted: null
        }).select("connectionId");

        const connectionIds = requests.map(
            (request) => request.connectionId.toString()
        );

        return res.json({
            requests: connectionIds
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};



export const getConnectionRequestStatus = async (req, res) => {

    const { connectionId } = req.params;

    try {

        const request = await ConnectionRequest.findOne({
            userId: req.user.id,
            connectionId: connectionId,
            status_accepted: null
        });

        return res.json({
            requestSent: !!request
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};


export const searchUsers = async (req, res) => {

    try {

        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                 message: "Search query is required"
    });
}

        const users = await User.find({
            $or: [
                {
                    name: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    username: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        }).select("name username email profilePicture");
        return res.json({
             users
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}









