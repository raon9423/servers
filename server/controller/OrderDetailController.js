import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from 'sequelize';

export async function getOrderDetails(req, res) {
    const orderDetail = await db.OrderDetail.finAll()
    res.status(200).json({
        message: 'Lấy danh sách đơn hàng thành công!',
        data: orderDetail
    });
}

export async function getOrderDetailById(req, res) {
    const { id } = req.params
    const orderDetail = await db.OrderDetail.finByPk(id)
    if (orderDetail) {
        res.status(200).json({
            message: 'Lấy thông tin đơn hàng thành công',
            data: orderDetail
        })
    } else {
    res.status(200).json({
        message: 'Lấy chi tiết đơn hàng'
        })
    }
}

export async function insertOrderDetail(req, res) {
    const orderDetail = await db.OrderDetail.create(req.body);
    return res.status(200).json({
        message: 'Thêm mới chi tiết đơn hàng thành công!',
        data: req.body
    });
}

export async function deleteOrderDetail(req, res) {
    const { id } = req.params;
    const deleted = await db.OrderDetail.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xoá chi tiết đơn hàng thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Chi tiết đơn hàng không tìm thấy'
        });
    }
}

export async function updateOrderDetail(req, res) {
    const { id } = req.params;
    const updatedOrderDetail = await db.OrderDetail.update(req.body, {
        where: { id }
    });
    if (updatedOrderDetail[0] > 0) {
        return res.status(200).json({
            message: 'Cập nhật chi tiết đơn hàng thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Chi tiết đơn hàng không tìm thấy'
        });
    }
}