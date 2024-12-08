import Joi from "joi";

class NewsRequest {
    constructor(data) {
        this.title = data.title;
        this.image = data.image;
        this.content = data.content;
        //this. product_ids = data.product_ids;
    }

    static validate(data) {
        const schema = Joi.object({
            title: Joi.string().optional().allow(null),
            image: Joi.string().uri().allow("").optional(), 
            content: Joi.string().optional().allow(null),
            //product_ids: Joi.array().items (Joi.number().integer()).optional().allow(null)
        });
        return schema.validate(data);
    }
}

export default NewsRequest;
