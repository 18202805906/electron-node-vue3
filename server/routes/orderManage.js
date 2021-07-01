const router = require('koa-router')({
    //路由前缀
    prefix: '/order'
  });
  const DbOperation = require("../public/javascripts/dbCommon");
  const ParamCheck = require("../middleWares/paramCheck");
  const Op = require('sequelize').Op;
  let dbCommon = new DbOperation('t_order_manage');
  const { SUCCESS } = require("../utils/resCode");
  const models = require('../db/models');

  //分页查询
  router.post('/orderPage', async(ctx)=>{
    let { companyName, contactPerson,area,salesman } = ctx.request.body;
    const where ={remove:'0'};
    companyName && (where.companyName = { [Op.like]:'%' +companyName + '%' });
    contactPerson && (where.contactPerson = { [Op.like]:'%' +contactPerson + '%' });
    area && (where.area = { [Op.like]:'%' +area + '%' });
    salesman && (where.salesman = { [Op.like]:'%' +salesman + '%' });
    await dbCommon.findAndCountAll(ctx, where);
  });

  //新建
  router.post('/addOrder', async(ctx)=>{
    //必填参数以及参数类型参数是否为空校验
    let schema = {
      salesman: new ParamCheck().isString().isRequired().isEmpty('业务员'),
      companyName: new ParamCheck().isString().isRequired().isEmpty('公司名称'),
      contactPerson: new ParamCheck().isString().isRequired().isEmpty('联系人'),
      concatPhone: new ParamCheck().isString().isRequired().isEmpty('联系人手机'),
      address: new ParamCheck().isString().isRequired().isEmpty('地址'),
    }
    await ParamCheck.check(ctx.request.body, schema, ctx);
    await dbCommon.create(ctx);
  });
  //删除
  router.delete('/deleteOrder/:id', async(ctx)=>{
    //删除订购人信息的时候，同时删除其订单
    let id = Number(ctx.params.id);
    const result = await models.t_order_manage.update(
      {
        remove: '1'
      },
      { where: { id } }
    );
    await models.t_order_manage_list.update(
      {
        remove: '1'
      },
      { where: { orderId:id } }
    );
    await SUCCESS(ctx, { ...result.id }, '删除成功');
  });

  //获取订购人信息
  router.get('/findOrder/:id', async(ctx)=>{
    await dbCommon.findOne(ctx);
  });

  //修改订购人信息
  router.post('/updateOrder', async(ctx)=>{
      //必填参数以及参数类型参数是否为空校验
      let schema = {
        salesman: new ParamCheck().isString().isRequired().isEmpty('业务员'),
        companyName: new ParamCheck().isString().isRequired().isEmpty('公司名称'),
        contactPerson: new ParamCheck().isString().isRequired().isEmpty('联系人'),
        concatPhone: new ParamCheck().isString().isRequired().isEmpty('联系人手机'),
        address: new ParamCheck().isString().isRequired().isEmpty('地址'),
      }
      await ParamCheck.check(ctx.request.body, schema, ctx);
      await dbCommon.update(ctx, {id: Number(ctx.request.body.id)});
  });
  
  module.exports = router;
  