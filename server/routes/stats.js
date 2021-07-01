const router = require('koa-router')({
    //路由前缀
    prefix: '/stats'
  });
const models = require('../db/models');
const { SUCCESS } = require("../utils/resCode");
const {formate} = require("../utils/util");
const Op = require('sequelize').Op;
// 默认统计本月数据
  //统计热销功放
router.post('/count-ranking', async(ctx)=>{
  let currentMonth = formate(new Date(), "yyyy-MM");
    const result = await models.t_order_manage_list.count({
        where: { 
          remove: 0,
          orderDate: {
            [Op.between]: [new Date(currentMonth + '-01 00:00:00') , new Date(currentMonth + '-31 23:59:59')],
         },
         },
        attributes: ['machineModel'],
        group: 'machineModel',
        limit: 5
    });
    await SUCCESS(ctx, result, '查询成功')
});

//统计购买人购买数量
router.post('/person-ranking', async(ctx)=>{
  let currentMonth = formate(new Date(), "yyyy-MM");
    //先统计购买数量
    let result = await models.t_order_manage_list.count({
      where: { 
        remove: 0,
        createTime: {
          [Op.between]: [currentMonth + '-01 00:00:00' , currentMonth + '-31 23:59:59'],
       } 
      },
      attributes: ['orderId'],
      group: 'orderId',
      limit: 5
  });
  let val = '';
  let countResult = []
  console.log('result', result);
  for(let i =0; i< result.length; i ++){
    val = await models.t_order_manage.findOne({ where:{id: result[i].orderId, remove:0} });
    countResult.push({
      person: val.dataValues.contactPerson,
      count: result[i].count
    })
  }
  await SUCCESS(ctx, countResult, '查询成功')
});

module.exports = router;
  