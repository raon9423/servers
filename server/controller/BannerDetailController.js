import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from 'sequelize';

export async function getBannerDetails(req, res) {
    const { bannerId, page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const whereClause = bannerId ? { banner_id: bannerId } : {};

    const [bannerDetails, totalBannerDetails] = await Promise.all([
        db.BannerDetail.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        db.BannerDetail.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách chi tiết banner thành công!',
        data: bannerDetails,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalBannerDetails / pageSize),
        totalBannerDetails
    });
}

export async function getBannerDetailById(req, res) {
    const { id } = req.params;
    const bannerDetail = await db.BannerDetail.findByPk(id);
    if (!bannerDetail) {
        return res.status(404).json({
            message: 'Chi tiết banner không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy chi tiết banner thành công',
        data: bannerDetail
    });
}

export async function insertBannerDetail(req, res) {
    try {
        const bannerDetail = await db.BannerDetail.create(req.body);
        res.status(200).json({
            message: 'Thêm mới chi tiết banner thành công',
            data: bannerDetail
        });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm chi tiết banner',
            error: error.message
        });
    }
}

export async function deleteBannerDetail(req, res) {
    const { id } = req.params;
    const deleted = await db.BannerDetail.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xoá chi tiết banner thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Chi tiết banner không tìm thấy'
        });
    }
}

export async function updateBannerDetail(req, res) {
    const { id } = req.params;
    const updatedBannerDetail = await db.BannerDetail.update(req.body, {
        where: { id }
    });
    if (updatedBannerDetail[0] > 0) {
        return res.status(200).json({
            message: 'Cập nhật chi tiết banner thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Chi tiết banner không tìm thấy'
        });
    }
}