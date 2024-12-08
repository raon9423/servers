import { Sequelize, where } from "sequelize";
import db from "../models";
const {Op} = Sequelize;
import { News } from "../models";

export async function getNews(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            title: {
                [Op.like]: `%${search}%`
            }
        };
    }

    const [newsList, totalNews] = await Promise.all([
        News.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        News.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách tin tức thành công',
        data: newsList,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalNews / pageSize),
        totalNews
    });
}

export async function getNewsById(req, res) {
    const { id } = req.params;
    const newsItem = await News.findByPk(id);
    if (!newsItem) {
        return res.status(404).json({
            message: 'Tin tức không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy chi tiết tin tức thành công',
        data: newsItem
    });
}

export async function insertNews(req, res) {
    const transaction = await db.sequelize.transaction(); 
    try {
        const newsArticle = await db.News.create(req.body, { transaction });
        const productIds = req.body.product_ids;
        if(productIds && productIds.length){
            const validProducts = await db.Product.findAll({
                where: {
                    id: productIds
                },
                transaction
            });
        const validProductIds = validProducts.map(product => product.id);
        const fillteredProductIds = productIds.filter(id => validProductIds.includes(id));
        const newsDetailsPromises = fillteredProductIds.map(product_id =>
            db.NewsDetail.create({
                product_id: product_id,
                news_id: newsArticle.id
            }, { transaction }) 
        );
    
        await Promise.all(newsDetailsPromises);
    }
        await transaction.commit(); 
        res.status(201).json({
            message: 'Thêm mới bài báo thành công',
            data: newsArticle 
        });
    } catch (error) {
        await transaction.rollback(); 
        res.status(500).json({
            message: 'Không thể thêm bài báo',
            error: error.message
        });
    }
}

export async function deleteNews(req, res) {
    const { id } = req.params;

    try {
        await db.NewsDetails.destroy({
            where: { news_id: id }
        });

        const deleted = await db.News.destroy({
            where: { id }
        });

        if (deleted) {
            return res.status(200).json({
                message: 'Xoá tin tức thành công'
            });
        } else {
            return res.status(404).json({
                message: 'Tin tức không tìm thấy'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi xoá tin tức!',
            error: error.message
        });
    }
}

export async function updateNews(req, res) {
    const { id } = req.params;
    const { productIds, ...newsData } = req.body; 

    try {
        const updatedNews = await db.News.update(newsData, {
            where: { id }
        });

        if (updatedNews[0] > 0) {
            if (productIds && productIds.length > 0) {
                await db.NewsDetails.destroy({
                    where: { news_id: id }
                });

                const newsDetails = productIds.map(productId => ({
                    product_id: productId,
                    news_id: id
                }));
                await db.NewsDetails.bulkCreate(newsDetails); 
            }

            return res.status(200).json({
                message: 'Cập nhật tin tức thành công'
            });
        } else {
            return res.status(404).json({
                message: 'Tin tức không tìm thấy'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi cập nhật tin tức!',
            error: error.message
        });
    }
}