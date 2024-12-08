import Joi from "joi";
class InsertProductRequest {
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
            name: Joi.string().required(),
            price: Joi.number().positive().required(),
            oldprice: Joi.number().positive(),
            image: Joi.string().uri().allow(""),
            description: Joi.string().optional(),
            specification: Joi.string().required(),
            buyturn: Joi.number().integer().min(0),
            quantity: Joi.number().integer().min(0),
            brand_id: Joi.number().integer().required(),
            category_id: Joi.number().integer().required(),
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

export default InsertProductRequest;