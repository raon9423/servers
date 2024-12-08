'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NewsDetail.belongsTo(models.News,{
        foreignKey: 'news_id'
      });
      NewsDetail.belongsTo(models.Product,{
        foreignKey: 'product_id'
      });
    }
  }
  NewsDetail.init({
    product_id: DataTypes.INTEGER,
    news_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'NewsDetail',
    tableName: 'news_details',
    underscored: true
  });
  return NewsDetail;
};