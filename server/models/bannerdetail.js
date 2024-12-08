'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BannerDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BannerDetail.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });
      BannerDetail.belongsTo(models.Order, {
        foreignKey: 'banner_id'
      });
    }
  }
  BannerDetail.init({
    product_id: DataTypes.INTEGER,
    banner_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BannerDetail',
    tableName: 'banner_detail',
    underscored: true
  });
  return BannerDetail;
};