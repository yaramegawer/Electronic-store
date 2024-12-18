export const isAuthorized=(...roles)=>{
    return (req,res,next)=>{
        //check user role
        if(!roles.includes(req.user.role)) return next(new Error("Not Authorized",{cause:403}));

        return next();
    };
};