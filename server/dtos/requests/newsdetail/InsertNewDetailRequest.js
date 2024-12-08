import Joi from "joi";

class InsertNewDetailRequest {
    constructor(data) {
        this.product_id = data.product_id;
        this.news_id = data.news_id;
    }

    static validate(data) {
        const schema = Joi.object({
            product_id: Joi.number().integer().required(),
            news_id: Joi.number().integer().required()
        });
        return schema.validate(data);
    }
}

export default InsertNewDetailRequest;
