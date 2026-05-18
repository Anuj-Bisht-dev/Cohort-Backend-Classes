import { ApiResponse } from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js";
 
const register = async (req, res) => {
    await authService.register(req.body);
    ApiResponse.created(res, "Registration success", user);
}

export { register }
