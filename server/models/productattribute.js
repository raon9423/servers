'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductAttribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductAttribute.belongsTo(models.Product,{
        foreignKey: 'product_id'
      });
      ProductAttribute.belongsTo(models.Attribute,{
        foreignKey: 'attribute_id'
      });
    }
  }
  ProductAttribute.init({
    product_id: DataTypes.INTEGER,
    attribute_id: DataTypes.INTEGER,
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ProductAttribute',
    tableName: 'product_attribute',
    underscored: true
  });
  return ProductAttribute;
};