import { ApiError } from "../utils/api-error";

const validate = (DtoClass) => {
    return (req, res, next) => {
        const { errors, value } = DtoClass.validate(req.body);
        if (errors) {
            throw ApiError.badRequest(errors.join("; "));
        }
        req.body = value; // this is very imp. often forgets by manyones
        // this changes the req.body data into sanitized validated data
        next();
    }
}

export { validate }
