import Joi from "joi";
import { UserRole } from "../../../constants";

class LoginUserRequest {
    constructor (data) {
        this.email = data.email;
        this.password = data.password
        this.phone = data.phone;
    }

    static validate(data) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            phone: Joi.string().optional()
        });
        return schema.validate(data);
    }
}

export default LoginUserRequest;