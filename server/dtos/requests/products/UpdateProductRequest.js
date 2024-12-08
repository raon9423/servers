import Joi from "joi";
class UpdateProductRequest {
    constructor (data) {
        this.name = data.name;
        this.image = data.image;
        this.price = data.price;
        this.oldprice = data.oldprice;
        this.description = data.description;
        this.specification = data.specification;
        this.buyturn = data.buyturn;
        this.quantity = data.quantity;
        this.brand_id = data.brand_id;
        this.category_id = data.category_id;
        this.attributes = data.attributes;
    }
    
    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().required().optional(),
            price: Joi.number().positive().required().optional(),
            oldprice: Joi.number().positive().optional(),
            image: Joi.string().uri().allow("").optional(),
            description: Joi.string().optional(),
            specification: Joi.string().optional(),
            buyturn: Joi.number().integer().min(0).optional(),
            quantity: Joi.number().integer().min(0).optional(),
            brand_id: Joi.number().integer().optional(),
            category_id: Joi.number().integer().optional(),
            attributes: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    value: Joi.string().required(),
                })
            ).optional()
        });
        return schema.validate(data);
    }
}

export default UpdateProductRequest;