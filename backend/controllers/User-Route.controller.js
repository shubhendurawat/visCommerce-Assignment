import User from "../models/users.models.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwt-token.js";

export const userRegister = async (req, res) => {
    try {
        const { fullName, username, email, password, gender, profilePic } = req.body;

        const user = await User.findOne({ username, email });
        if (user) {
            return res.status(400).send({
                success: false,
                message: "Username or Email already exists",
            });
        }

        const hashPassword = bcryptjs.hashSync(password, 10);
        const profileBoy = profilePic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilePic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashPassword,
            gender,
            profilePic: gender === "male" ? profileBoy : profileGirl,
        });

        await newUser.save();

        // Generate JWT token and set it in the cookie
        jwtToken(newUser._id, res);

        // Send the success response
        return res.status(201).send({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            profilePic: newUser.profilePic,
            gender: newUser.gender,
            message: "Registered Successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// export const userRegister = async (req, res) => {
//     try {
//         const { fullName, username, email, password, gender, profilePic } = req.body;
//         const user = await User.findOne({ username, email });
//         if (user) {
//             return res.status(500).send({
//                 success: false,
//                 message: "Username or Email are already existing"
//             })
//         }
//         const hashPassword = bcryptjs.hashSync(password, 10);
//         const profileBoy = profilePic || `https://avatar.iran.liara.run/public/boy?username=${username}`
//         const profileGirl = profilePic || `https://avatar.iran.liara.run/public/girl?username=${username}`


//         const newUser = new User({
//             fullName,
//             username,
//             email,
//             password: hashPassword,
//             gender,
//             profilePic: gender === "male" ? profileBoy : profileGirl
//         })

//         if (newUser) {
//             jwtToken(newUser._id, res);
//             await newUser.save();
//         } else {
//             res.status(500).send({
//                 success: false,
//                 message: "Invalid user data"
//             })
//         }
//         res.status(201).send({
//             _id: newUser._id,
//             fullName: newUser.fullName,
//             username: newUser.username,
//             email: newUser.email,
//             profilePic: newUser.profilePic,
//             gender: newUser.gender,
//             message: "Registered Successfully"
//         })
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: error
//         })
//         console.log(error);
//     }
// }

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).send({
                success: false,
                message: "Email does not exist"
            })
        }
        const comparePassword = await bcryptjs.compare(password, user.password || "");
        if (!comparePassword) {
            res.status(401).send({
                success: false,
                message: "Invalid password"
            })
        }
        jwtToken(user._id, res);
        res.status(200).send({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            gender: user.gender,
            message: "Successfully Logged In"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}


export const userLogut = async(req, res) => {
    try {
        res.cookie("jwt", '', {
            maxAge: 0,
        })
        res.status(200).send({
            message: "User logged out"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}