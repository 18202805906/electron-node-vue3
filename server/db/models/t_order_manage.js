'use strict';
const {
  Model
} = require('sequelize');
const {formate} = require("../../utils/util");
module.exports = (sequelize, DataTypes) => {
  class t_order_manage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  t_order_manage.init({
    consignee: DataTypes.STRING,
    consigneePhone: DataTypes.STRING,
    contactPerson: DataTypes.TEXT,
    concatPhone: DataTypes.STRING,
    companyName: DataTypes.STRING,
    salesman:DataTypes.STRING,
    area:DataTypes.STRING,
    telephone: DataTypes.STRING,
    fox: DataTypes.STRING,
    deliveryAddress: DataTypes.STRING,
    address: DataTypes.STRING,
    remark: DataTypes.TEXT,
    createTime: {
      type:DataTypes.DATE
    },
    updateTime: {
      type:DataTypes.DATE,
      get(){
        const updateTime = this.getDataValue('updateTime');
        return formate(updateTime, "yyyy-MM-dd hh:mm:ss");

      }
    },
    createBy: DataTypes.STRING,
    updateBy: DataTypes.STRING,
    remove: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_order_manage',
    createdAt: 'createTime',
    updatedAt: 'updateTime'
  });
  return t_order_manage;
};