import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from 'sequelize';

export async function getCategories(req, res) {
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
    const [categories, totalCategories] = await Promise.all([
        db.Category.findAll({
            where: whereClause,
            limit: pageSize, 
            offset: offset 
        }),
        db.Category.count({
            where: whereClause 
        })
    ]);
    res.status(200).json({
        message: 'Lấy danh sách danh mục thành công',
        data: categories,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalCategories / pageSize),
        totalCategories
    });
}

export async function getCategoryById(req, res) {
    const {id} = req.params;
    const category = await db.Category.findByPk(id);
    if(!category){
        return res.status(404).json({
            message: 'Danh mục không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy chi tiết danh mục',
        data: category
    });
}

export async function insertCategory(req, res) {
    try {
        const category = await db.Category.create(req.body);
        res.status(200).json({
            message: 'Thêm mới danh mục thành công!',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm danh mục!',
            error: error.message 
        });
    }
}

export async function deleteCategory(req, res) {
    const { id } = req.params;
    const deleted = await db.Category.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xoá danh mục thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Danh mục không tìm thấy'
        });
    }
}

export async function updateCategory(req, res) {
    const { id } = req.params;
    const updatedCategory = await db.Category.update(req.body, {
        where: { id }
    });
    if (updatedCategory[0] > 0) {
        return res.status(200).json({
            message: 'Cập nhật danh mục thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Danh mục không tìm thấy'
        });
    }
}