import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from 'sequelize';
import path from 'path';
import multer from 'multer';
import fs from 'fs'

export async function getBanners(req, res) {
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

    const [banners, totalBanners] = await Promise.all([
        db.Banner.findAll({
            where: whereClause,
            limit: pageSize, 
            offset: offset 
        }),
        db.Banner.count({
            where: whereClause 
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách banner thành công!',
        data: banners,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalBanners / pageSize),
        totalBanners
    });
}

export async function getBannerById(req, res) {
    const imageName = req.body.image;
        if (!imageName.startWith('http://') && !imageName.startWith('https://')){
            const imagePath = path.join(__dirname, '../uploads', imageName);
            if (!fs.existsSync(imagePath)) {
                return res.status(404).json({
                    message: 'Tệp hình ảnh không tồn tại'
                });
            }
        }
    const { id } = req.params;
    const banner = await db.Banner.findByPk(id);
        if (!banner) {
            return res.status(404).json({
                message: 'Banner không tìm thấy'
            });
        }
        res.status(200).json({
            message: 'Lấy chi tiết banner',
            data: banner
        });
}

export async function insertBanner(req, res) {
    try {
        const banner = await db.Banner.create(req.body); 
        res.status(200).json({
            message: 'Thêm mới banner thành công',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm banner',
            error: error.message 
        });
    }
}

export async function deleteBanner(req, res) {
    const { id } = req.params;
    const deleted = await db.Banner.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xoá banner thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Banner không tìm thấy'
        });
    }
}

export async function updateBanner(req, res) {
    const { id } = req.params;
    const updatedBanner = await db.Banner.update(req.body, {
        where: { id }
    });

    const imageName = req.body.image;
    if (!imageName.startWith('http://') && !imageName.startWith('https://')){
        const imagePath = path.join(__dirname, '../uploads', imageName);
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({
                message: 'File ảnh không tồn tại'
            });
        }
    }
    return res.status(200).json({
        message: 'Cập nhật banner thành công'
    })
}