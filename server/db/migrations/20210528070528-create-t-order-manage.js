'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('t_order_manages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(32),
        comment: '表id'
      },
      consignee: {
        type: Sequelize.STRING(500),
        comment: '收货人'
      },
      consigneePhone: {
        type: Sequelize.STRING(128),
        comment: '收货人电话'
      },
      contactPerson: {
        type: Sequelize.STRING(500),
        comment: '联系人'
      },
      consigneePhone: {
        type: Sequelize.STRING(128),
        comment: '收货人电话'
      },
      concatPhone: {
        type: Sequelize.STRING(128),
        comment: '联系人手机'
      },
      companyName: {
        type: Sequelize.STRING(500),
        comment: '公司名称'
      },
      telephone: {
        type: Sequelize.STRING(128),
        comment: '电话'
      },
      salesman: {
        type: Sequelize.STRING(128),
        comment: '业务员'
      },
      area: {
        type: Sequelize.STRING(128),
        comment: '区域'
      },
      fox: {
        type: Sequelize.STRING(128),
        comment: '传真'
      },
      deliveryAddress: {
        type: Sequelize.STRING(1000),
        comment: '发货货场'
      },
      address: {
        type: Sequelize.STRING(1000),
        comment: '地址'
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
    await queryInterface.dropTable('t_order_manages');
  }
};