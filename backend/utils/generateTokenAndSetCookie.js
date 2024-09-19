import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res,userId,role) => {
    try {
        const token = jwt.sign({ userId,role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token",token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return token;
    } catch (error) {
        console.log(`Error generating token! ${error}`);
        throw error;
    }
};