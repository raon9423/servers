import { Sequelize, where } from "sequelize";
import db from "../models";
import { Op } from 'sequelize';
import { error } from "console";
import { required } from "joi";

export async function getCarts(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            session_id: {
                [Op.like]: `%${search}%`
            }
        };
    }

    const [carts, totalCarts] = await Promise.all([
        db.Cart.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset,
            include: [
                {
                    model: db.CartItem, 
                    as: 'cartitems' 
                }
            ]   
        }),
        db.Cart.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách giỏ hàng thành công',
        data: carts,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalCarts / pageSize),
        totalCarts
    });
}

export const checkoutCart = async (req, res) => {
    const { cart_id, total, note, phone, address } = req.body;
    const transaction = await db.sequelize.transaction();
    
    try {
        const cart = await db.Cart.findByPk(cart_id, {
            include: [
                {
                    model: db.CartItem, 
                    as: 'cartitems',
                    include: [{
                        model: db.Product,
                        as: 'product' 
                    }] 
                }]
        });
        if (!cart || !cart.cartitems.length){
            return res.status(404).json({ 
                message: 'Giỏ hàng trống'
            });
        }
        const newOrder = await db.Order.create({
            user_id: cart.user_id,
            session_id: cart.session_id,
            total: total || cart.cartitems.reduce((acc, item) => acc + item.quantity * item.product.price, 0), 
            note: note,
            phone: phone,
            address: address
        }, {transaction: transaction});
        
        for (let item of cart.cartitems){
            await db.OrderDetail.create({
                order_id: newOrder.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.product.price,
            }, {transaction: transaction})
        }

        await db.CartItem.destroy({ 
            where: { cart_id: cart_id }
        }, { transaction: transaction });

        await cart.destroy({transaction: transaction});

        await transaction.commit();
        res.status(201).json({
            message: 'Thanh toán giỏ hàng thành công',
            data: newOrder
        })

    } catch (error) {
        await transaction.rollback();
        console.error('Lỗi thanh toán:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình thanh toán',
            error: error.message
         });
    }
}

export async function getCartById(req, res) {
    const { id } = req.params;
    const cart = await db.Cart.findByPk(id);
    if (!cart) {
        return res.status(404).json({
            message: 'Giỏ hàng không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy chi tiết giỏ hàng',
        data: cart
    });
}

export async function insertCart(req, res) {
    const { session_id, user_id } = req.body;

    if (!session_id && !user_id) {
        return res.status(400).json({
            message: 'Phải cung cấp ít nhất một trong hai giá trị là session_id hoặc user_id'
        });
    }

    const existingCart = await db.Cart.findOne({
        where: {
            [Op.or]: [
                ...(session_id ? [{ session_id }] : []), 
                ...(user_id ? [{ user_id }] : []) 
            ]
        }
    });

    if (existingCart) {
        return res.status(409).json({
            message: 'Một giỏ hàng với session_id hoặc user_id đã tồn tại'
        });
    }

    const cart = await db.Cart.create(req.body);

    res.status(200).json({
        message: 'Thêm mới giỏ hàng thành công!',
        data: cart
    });
}

export async function deleteCart(req, res) {
    const { id } = req.params;
    const deleted = await db.Cart.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xoá giỏ hàng thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Giỏ hàng không tìm thấy'
        });
    }
}

export async function updateCart(req, res) {
    const { id } = req.params;
    const updatedCart = await db.Cart.update(req.body, {
        where: { id }
    });
    if (updatedCart[0] > 0) {
        return res.status(200).json({
            message: 'Cập nhật giỏ hàng thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Giỏ hàng không tìm thấy'
        });
    }
}
