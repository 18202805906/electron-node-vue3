'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('t_order_manage_lists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(32),
        comment: '表id'
      },
      orderId: {
        allowNull: false,
        type: Sequelize.INTEGER(32),
        comment: '订购人id'
      },
      trademark: {
        type: Sequelize.STRING(500),
        comment: '商标'
      },
      machineModel: {
        type: Sequelize.STRING(128),
        comment: '型号'
      },
      power: {
        type: Sequelize.STRING(200),
        comment: '功率'
      },
      model: {
        type: Sequelize.STRING(128),
        comment: '机型：'
      },
      nums: {
        type: Sequelize.STRING(128),
        comment: '数量'
      },
      unitPrice: {
        type: Sequelize.STRING(200),
        comment: '单价'
      },
      totalMoney: {
        type: Sequelize.STRING(128),
        comment: '金额'
      },
      paymentType: {
        type: Sequelize.STRING(400),
        comment: '付款方式'
      },
      orderDate: {
        type: Sequelize.DATE,
        comment: '下单日期'
      },
      deliveryDate: {
        type: Sequelize.DATE,
        comment: '交货日期'
      },
      panel: {
        type: Sequelize.STRING(128),
        comment: '面板'
      },
      remark: {
        type: Sequelize.STRING(2000),
        comment: '备注'
      },
      remove: {
        defaultValue: '0',
        type: Sequelize.STRING(1),
        comment: '逻辑删除'
      },
      createTime: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: '创建时间'
      },
      updateTime: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: '修改时间'
      },
      createBy: {
        type: Sequelize.STRING(128),
        comment: '创建人'
      },
      updateBy: {
        type: Sequelize.STRING(128),
        comment: '修改人'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('t_order_manage_lists');
  }
};