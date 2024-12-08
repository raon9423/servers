import { Sequelize, Op } from "sequelize";
import db from "../models";
import { needsRehash } from "argon2";

export async function getCartItems(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            product_id: {
                [Op.like]: `%${search}%`
            }
        };
    }

    const [cartItems, totalCartItems] = await Promise.all([
        db.CartItem.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        db.CartItem.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách mục giỏ hàng thành công',
        data: cartItems,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalCartItems / pageSize),
        totalCartItems
    });
}

export async function getCartItemById(req, res) {
    const { cart_id } = req.params;
    const cartItem = await db.CartItem.findAll({
        where: {cart_id: cart_id}
    });
    if (!cartItem) {
        return res.status(404).json({
            message: 'Mục giỏ hàng không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy chi tiết mục giỏ hàng',
        data: cartItem
    });
}

export async function insertCartItem(req, res) {
    const { product_id, quantity, cart_id } = req.body;

    const productExists = await db.Product.findByPk(product_id);
    if (!productExists) {
        return res.status(404).json({
            message: "Sản phẩm không tồn tại"
        });
    }

    if (productExists.quantity < quantity){
        return res.status(400).json({
            message: 'Sản phẩm không đủ số lượng'
        })
    }

    const cartExists = await db.Cart.findByPk(cart_id);
    if (!cartExists) {
        return res.status(404).json({
            message: "Giỏ hàng không tồn tại"
        });
    }

    const existingCartItem = await db.CartItem.findOne({
        where: {
            product_id: product_id,
            cart_id: cart_id
        }
    });

    if (existingCartItem) {
        if (quantity === 0) {

            await existingCartItem.destroy();
            return res.status(200).json({
                message: 'Mục trong giỏ hàng đã được xoá'
            });
        } else {
            existingCartItem.quantity = quantity;
            await existingCartItem.save();
            return res.status(200).json({
                message: 'Cập nhật số lượng thành công',
                data: existingCartItem
            });
        }
    } else {
        if (quantity > 0) {
            const newCartItem = await db.CartItem.create(req.body);
            return res.status(201).json({
                message: 'Thêm mới mục giỏ hàng thành công',
                data: newCartItem
            });
        } else {
            return res.status(400).json({
                message: 'Số lượng phải lớn hơn 0 để thêm mới mục giỏ hàng'
            });
        }
    }
}

export async function deleteCartItem(req, res) {
    const { id } = req.params;
    const deleted = await db.CartItem.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xoá mục giỏ hàng thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Mục giỏ hàng không tìm thấy'
        });
    }
}

export async function updateCartItem(req, res) {
    const { id } = req.params;
    const updatedCartItem = await db.CartItem.update(req.body, {
        where: { id }
    });
    if (updatedCartItem[0] > 0) {
        return res.status(200).json({
            message: 'Cập nhật mục giỏ hàng thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Mục giỏ hàng không tìm thấy'
        });
    }
}
