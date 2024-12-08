import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from 'sequelize';

export async function getBrands(req, res) {
    const { search = '', page = 1 } = req.query; 
    const pageSize = 5; 
    const offset = (page - 1) * pageSize; 

    let whereClause = {}; 
    if (search.trim() !== '') {
        whereClause = {
            name: {
                [Op.like]: `%${search}%` 
            }
        };
    }

    const [brands, totalBrands] = await Promise.all([
        db.Brand.findAll({
            where: whereClause,
            limit: pageSize, 
            offset: offset 
        }),
        db.Brand.count({
            where: whereClause 
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách thương hiệu thành công!',
        data: brands,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalBrands / pageSize),
        totalBrands
    });
}

export async function getBrandById(req, res) {
    const { id } = req.params;
    const brand = await db.Brand.findByPk(id);
        if (!brand) {
            return res.status(404).json({
                message: 'Thương hiệu không tìm thấy'
            });
        }
        res.status(200).json({
            message: 'Lấy chi tiết thương hiệu',
            data: brand
        });
}

export async function insertBrand(req, res) {
    try {
        const brand = await db.Brand.create(req.body); 
        res.status(200).json({
            message: 'Thêm mới thương hiệu thành công',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm thương hiệu',
            error: error.message 
        });
    }
}

export async function deleteBrand(req, res) {
    const { id } = req.params;
    const deleted = await db.Brand.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xoá thương hiệu thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Thương hiệu không tìm thấy'
        });
    }
}

export async function updateBrand(req, res) {
    const { id } = req.params;
    const updatedBrand = await db.Brand.update(req.body, {
        where: { id }
    });
    if (updatedBrand[0] > 0) {
        return res.status(200).json({
            message: 'Cập nhật thương hiệu thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Thương hiệu không tìm thấy'
        });
    }
}