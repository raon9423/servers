import Joi from "joi";

class InsertBannerDetailRequest {
    constructor(data) {
        this.product_id = data.product_id;
        this.image_url = data.image_url;
    }

    static validate(data) {
        const schema = Joi.object({
            product_id: Joi.number().integer().required(), 
            image_url: Joi.string().required(),   
        });
        return schema.validate(data);
    }
}

export default InsertBannerDetailRequest;