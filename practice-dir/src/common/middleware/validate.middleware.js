import { ApiError } from "../../../../express/RESTful-Apis/src/common/utils/api-error.js";

const validateDto = (DtoClass) => {
    return (req, res, next) => {
        const { value, error } = DtoClass.validate(req.body);

        if (error) {
            throw new ApiError.badRequest(errors.join(';'));
        }
        req.body = value;
        next();
    }
}

export default validateDto;
