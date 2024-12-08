import Joi from "joi";

class InsertCartsRequest {
    constructor(data) {
        this.user_id = data.user_id;
        this.session_id = data.session_id;
    }
    
    static validate(data) {
        const schema = Joi.object({
            user_id: Joi.number().integer().optional(),        
            session_id: Joi.string().required()     
        });
        return schema.validate(data);
    }
}

export default InsertCartsRequest;
