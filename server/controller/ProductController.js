import { Sequelize, where } from "sequelize";
import db from "../models";
const {Op} = Sequelize;

export async function getProducts(req, res) {
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
    const [products, totalProducts] = await Promise.all([
        db.Product.findAll({
            where: whereClause,
            limit: pageSize, 
            offset: offset,
            include: [
                {
                    model: db.ProductImage, 
                    as: 'productimages' 
                },
                {
                    model: db.ProductAttribute, 
                    as: 'productattribute' 
                }
            ] 
        }),
        db.Product.count({
            where: whereClause 
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách sản phẩm thành công!',
        data: products,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalProducts / pageSize),
        totalProducts
    });
}

export function getProductById(req, res) {
    const { id } = req.params;

    db.Product.findByPk(id, {
        include: [
            {
                model: db.ProductImage,
                as: 'productimages'
            },
            {
                model: db.ProductAttribute,
                as: 'productattribute'
            }
        ]
    })
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Sản phẩm không tìm thấy'
            });
        }

        return res.status(200).json({
            message: 'Lấy chi tiết sản phẩm',
            data: product
        });
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy sản phẩm',
            error: err.message
        });
    });
}


export async function insertProduct(req, res) {
    const { attributes = [], ...productData } = req.body;

    const product = await db.Product.create(productData);

    for (const attr of attributes) {

        const [attribute] = await db.Attribute.findOrCreate({
            where: { name: attr.name },
            defaults: { name: attr.name }
        });

        await db.ProductAttribute.create({
            product_id: product.id,
            attribute_id: attribute.id,
            value: attr.value
        });
    }

    return res.status(200).json({
        message: 'Thêm mới sản phẩm thành công',
        data: product
    });
}


export async function deleteProduct(req, res) {
    const { id } = req.params;

    await db.ProductAttribute.destroy({
        where: { product_id: id }
    });

    const deleted = await db.Product.destroy({
        where: { id }
    });

    if (deleted) {
        return res.status(200).json({
            message: 'Xoá sản phẩm thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Sản phẩm không tìm thấy'
        });
    }
}

export async function updateProduct(req, res) {
    const { id } = req.params;
    const { attributes = [], ...productData } = req.body;

    try {
        const updatedProduct = await db.Product.update(productData, {
            where: { id }
        });

        if (updatedProduct[0] > 0) {

            await db.ProductAttribute.destroy({ where: { product_id: id } });

            for (const attr of attributes) {
                const [attribute, created] = await db.Attribute.findOrCreate({
                    where: { name: attr.name },
                    defaults: { name: attr.name }
                });

                await db.ProductAttribute.create({
                    product_id: id,
                    attribute_id: attribute.id,
                    value: attr.value
                });
            }

            return res.status(200).json({
                message: 'Cập nhật sản phẩm thành công'
            });
        } else {
            return res.status(404).json({
                message: 'Sản phẩm không tìm thấy'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi cập nhật sản phẩm',
            error: error.message
        });
    }
}
