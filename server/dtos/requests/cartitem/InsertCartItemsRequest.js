import Joi from "joi";

class InsertCartItemsRequest {
    constructor(data) {
        this.cart_id = data.cart_id;
        this.product_id = data.product_id;
        this.quantity = data.quantity;
    }
    
    static validate(data) {
        const schema = Joi.object({
            cart_id: Joi.number().integer().required(),        
            product_id: Joi.number().integer().required(), 
            quantity: Joi.number().integer().min(0).required(),     
        });
        return schema.validate(data);
    }
}

export default InsertCartItemsRequest;
