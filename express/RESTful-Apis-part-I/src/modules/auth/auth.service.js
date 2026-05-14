import User from "./auth.model.js";
import { ApiError } from "./../../common/utils/api-error.js"
import { generateResetToken } from "../../common/utils/jwt.utils.js";


const register = async (name, email, password, role) => {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError.conflict("email already exists");
    }
    
    const { rawToken, hashedToken } = generateResetToken();
    
    const user = await User.create({
        // name: name // is it equivalent to below ones
        name,
        email,
        password,
        role,
        isVerified,
        verificationToken: hashedToken,
    });
    
    // TODO: send an email to user with Token: rawToken

    // in case want to delete the any feilds from user then
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;


    return userObj;
}

register();

export { register } 