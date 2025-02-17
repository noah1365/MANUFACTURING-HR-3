export const checkRole = (role) => (req, res, next) => {
   /*  console.log("User Role:", req.user?.role); 
    console.log("Required Role:", role);  */

    if (req.user && req.user.role === role) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden" });
    }
};
