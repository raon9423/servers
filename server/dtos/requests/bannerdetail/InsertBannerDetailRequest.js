import Joi from "joi";

class InsertBannerDetailRequest {
    constructor(data) {
        this.product_id = data.product_id;
        this.banner_id = data.banner_id;
    }

    static validate(data) {
        const schema = Joi.object({
            product_id: Joi.number().integer().required(),    
            banner_id: Joi.number().integer().required()   
        });
        return schema.validate(data);
    }
}

export default InsertBannerDetailRequest;