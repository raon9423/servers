import { Sequelize, where } from "sequelize";
import db from "../models";
const {Op} = Sequelize;

export async function getNewsDetails(req, res) {
    const { page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const [newsDetail, totalNewsDetail] = await Promise.all([
        db.NewsDetail.findAll({
            limit: pageSize,
            offset: offset,
            include: [{model: db.News}, { model: db.Product}]
        }),
        db.NewsDetail.count()
    ]);
    res.status(200).json({
        message: 'Lấy danh sách tin tức thành công',
        data: newsDetail,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalNewsDetail / pageSize),
        totalNewsDetail
    })
}

export async function getNewDetailById(req, res) {
    const { id } = req.params;

    const newsDetail = await db.NewsDetail.findOne({
        where: { id },
        include: [{ model: db.News }, { model: db.Product }]
    });

    if (!newsDetail) {
        return res.status(404).json({
            message: 'Không tìm thấy tin tức với ID đã cho'
        });
    }

    res.status(200).json({
        message: 'Lấy chi tiết tin tức thành công',
        data: newsDetail
    });
}

export async function updateNewDetail(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    const [updated] = await db.NewsDetail.update(updateData, {
        where: { id }
    });

    if (!updated) {
        return res.status(404).json({
            message: 'Không tìm thấy tin tức với ID đã cho để cập nhật'
        });
    }

    const updatedNewsDetail = await db.NewsDetail.findOne({ where: { id } });

    res.status(200).json({
        message: 'Cập nhật tin tức thành công',
        data: updatedNewsDetail
    });
}

export async function deleteNewDetail(req, res) {
    const { id } = req.params;

    const deleted = await db.NewsDetail.destroy({
        where: { id }
    });

    if (!deleted) {
        return res.status(404).json({
            message: 'Không tìm thấy tin tức với ID đã cho để xóa'
        });
    }

    res.status(200).json({
        message: 'Xóa tin tức thành công'
    });
}
