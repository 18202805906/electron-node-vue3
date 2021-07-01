'use strict';
const {
  Model
} = require('sequelize');
const {formate} = require("../../utils/util");
module.exports = (sequelize, DataTypes) => {
  class t_order_manage_list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  t_order_manage_list.init({
    orderId:DataTypes.INTEGER,
    trademark: DataTypes.STRING,
    machineModel: DataTypes.STRING,
    power: DataTypes.TEXT,
    model: DataTypes.STRING,
    nums: DataTypes.STRING,
    unitPrice: DataTypes.STRING,
    totalMoney: DataTypes.STRING,
    paymentType: DataTypes.STRING,
    orderDate: {
      type:DataTypes.DATE,
      get(){
        const time = this.getDataValue('orderDate');
        return time && formate(time, "yyyy-MM-dd hh:mm:ss");
      }
    },
    remark: DataTypes.TEXT,
    deliveryDate: {
      type:DataTypes.DATE,
      get(){
        const time = this.getDataValue('deliveryDate');
        return time && formate(time, "yyyy-MM-dd hh:mm:ss");
      }
    },
    panel: DataTypes.STRING,
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
    modelName: 't_order_manage_list',
    createdAt: 'createTime',
    updatedAt: 'updateTime'
  });
  return t_order_manage_list;
};