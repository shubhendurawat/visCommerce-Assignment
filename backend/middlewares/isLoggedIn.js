import jwt from "jsonwebtoken";
import User from "../models/users.models.js";

export const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(500).send({ success: false, message: "User unauthorized!" })
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(500).send({ success: false, message: "User unauthorized Or Invalid token" })
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(500).send({ success: false, message: "User not found!" })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(`Error in the middleware ${error.message}`);
        res.status(500).send({
            success: false,
            message: error
        })
    }
}