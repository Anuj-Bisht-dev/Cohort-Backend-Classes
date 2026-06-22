import cookie from "cookie-parser";
import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js"

// when ever user req for a route where the user has to be logedIn so, it sends the accessToken and we very it through middleware.
// this is actually how accessToken works: it sends a accessToken with every req (for loggedIn user only)
const authenticate = async (req, res, next) => {
    let token;
    if (req.cookie.accessToken || req.headers.authorization?.startsWith("Bearer ")) {  // it checks for both cookes and headers
        token = req.cookie.accessToken || req.headers.authorization.split(" ")[1];
    }
    if (!token) throw ApiError.unauthorized("not Authenticated");

    const decodedToken = verifyAccessToken(token);
    const user = await User.findById(decodedToken.id);
    if (!user) throw ApiError.unauthorized("user not found");

    req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
    }
    next();
}

const authorization = async (...roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) throw ApiError.forbidden("you have no access to perform this action");
        next();
    }
}

export { authenticate, authorization }