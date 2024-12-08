import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from 'sequelize';

export async function getOrders(req, res) {
    try {
        const orders = await db.Order.findAll(); 
        res.status(200).json({
            message: 'Lấy danh sách đơn hàng thành công!',
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export async function getOrderById(req, res) {
    const { id } = req.params
    const order = await db.Order.finByPk(id)
    if (order) {
        res.status(200).json({
            message: 'Lấy thông tin đơn hàng thành công',
            data: order
        })
    } else {
    res.status(200).json({
        message: 'Lấy chi tiết đơn hàng'
        })
    }
}

export async function insertOrder(req, res) {
    const userId = req.body.user_id;
    const userExists = await db.User.findByPk(userId);
    if (!userExists) {
        return res.status(404).json({
            message: 'Người dùng không tồn tại'
        });
    }
    const newOrder = await db.Order.create(req.body);
    if (newOrder) {
        return res.status(200).json({
            message: 'Thêm mới đơn hàng thành công!',
            data: newOrder
        });
    } else {
        return res.status(400).json({
            message: 'Không thể thêm đơn hàng!'
        });
    }
}

export async function deleteOrder(req, res) {
    const { id } = req.params;
    const deleted = await db.Order.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xoá đơn hàng thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Đơn hàng không tìm thấy'
        });
    }
}

export async function updateOrder(req, res) {
    const { id } = req.params;
    const updatedOrder = await db.Order.update(req.body, {
        where: { id }
    });
    if (updatedOrder[0] > 0) {
        return res.status(200).json({
            message: 'Cập nhật đơn hàng thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Đơn hàng không tìm thấy'
        });
    }
}