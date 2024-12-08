import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from 'sequelize';

export async function getProductImages(req, res) {
    const { search = '', page = 1 } = req.query; 
    const pageSize = 5; 
    const offset = (page - 1) * pageSize; 

    let whereClause = {}; 
    if (search.trim() !== '') {
        whereClause = {
            image_url: {
                [Op.like]: `%${search}%`
            }
        };
    }
    const [productImages, totalImages] = await Promise.all([
        db.ProductImage.findAll({
            where: whereClause,
            attributes: ['id', 'product_id', 'image_url'],
            limit: pageSize, 
            offset: offset ,
            //include: [{ model: db.Product, as: 'Product' }]
        }),
        db.ProductImage.count({
            where: whereClause 
        })
    ]);
    res.status(200).json({
        message: 'Lấy danh sách hình ảnh sản phẩm thành công',
        data: productImages,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalImages / pageSize),
        totalImages
    });
}

export async function getProductImageById(req, res) {
    const { id } = req.params;
    const productImage = await db.ProductImage.findByPk(id);
    if (!productImage) {
        return res.status(404).json({
            message: 'Hình ảnh sản phẩm không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy chi tiết hình ảnh sản phẩm thành công',
        data: productImage
    });
}

export async function insertProductImage(req, res) {
    try {
        const productImage = await db.ProductImage.create(req.body);
        res.status(200).json({
            message: 'Thêm mới hình ảnh sản phẩm thành công!',
            data: productImage
        });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm hình ảnh sản phẩm!',
            error: error.message 
        });
    }
}

export async function deleteProductImage(req, res) {
    const { id } = req.params;
    const deleted = await db.ProductImage.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xóa hình ảnh sản phẩm thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Hình ảnh sản phẩm không tìm thấy'
        });
    }
}