const router = require('koa-router')({
    //路由前缀
    prefix: '/order'
  });
  const DbOperation = require("../public/javascripts/dbCommon");
  const ParamCheck = require("../middleWares/paramCheck");
  const Op = require('sequelize').Op;
  let dbCommon = new DbOperation('t_order_manage_list');
  const { SUCCESS , CONTENT_NOT_SUCCESS} = require("../utils/resCode");
  const {upload} = require("../middlewares/upload");
    //引入node-xlsx解析excel模块
  const node_xlsx = require('node-xlsx');
  const multer = require('koa-multer');
  const {formate} = require("../utils/util");

  //分页查询
  router.post('/orderListPage', async(ctx)=>{
    let { machineModel, power, orderId } = ctx.request.body;
    const where ={remove:'0', orderId};
    machineModel && (where.machineModel = { [Op.like]:'%' +machineModel + '%' });
    power && (where.power = { [Op.like]:'%' +power + '%' });
    await dbCommon.findAndCountAll(ctx, where);
  });

  //新建
  router.post('/addOrderList', async(ctx)=>{
    //必填参数以及参数类型参数是否为空校验
    let schema = {
      machineModel: new ParamCheck().isString().isRequired().isEmpty('型号'),
      power: new ParamCheck().isString().isRequired().isEmpty('功率'),
      panel: new ParamCheck().isString().isRequired().isEmpty('面板'),
    }
    await ParamCheck.check(ctx.request.body, schema, ctx);
    await dbCommon.create(ctx);
  });
  //删除
  router.delete('/deleteOrderList/:id', async(ctx)=>{
    await dbCommon.delete(ctx)
  });

  //获取订购人信息
  router.get('/findOrderList/:id', async(ctx)=>{
    await dbCommon.findOne(ctx);
  });

  //修改订购人信息
  router.post('/updateOrderList', async(ctx)=>{
      //必填参数以及参数类型参数是否为空校验
      let schema = {
        // deliveryDate: new ParamCheck().isString().isRequired().isEmpty('交货日期'),
        // orderDate: new ParamCheck().isString().isRequired().isEmpty('下单日期'),
        machineModel: new ParamCheck().isString().isRequired().isEmpty('型号'),
        power: new ParamCheck().isString().isRequired().isEmpty('功率'),
        panel: new ParamCheck().isString().isRequired().isEmpty('面板'),
      }
      await ParamCheck.check(ctx.request.body, schema, ctx);
      await dbCommon.update(ctx, {id: Number(ctx.request.body.id)});
  });


  //解析excel文件
  router.post('/importExcel/:orderId', multer().single('file'), async(ctx)=>{
    //解析文件
    const file = ctx.req.file;
    // 获取订购人id
    const orderId = ctx.params.orderId;
    const obj = node_xlsx.parse(file.buffer);
    //目前只获取第一个sheet中的内容
    const excelObj = obj[0].data;
    // 定义导入数据的实体类
    const dataArray = new Array('trademark','panel','machineModel','power','model','nums','unitPrice','totalMoney','paymentType','orderDate','deliveryDate','remark');
    //循环遍历表每一行的数据
    let isError = null;
    let allData = [];
    for(let i=1;i < excelObj.length;i++){
        let rdata = excelObj[i];
        //将每一行的数据存进数据库中
        let stu = {orderId};
        for(let j=0; j<rdata.length; j++){
          //进行数值类型判断
          if(['power', 'nums', 'unitPrice' ,'totalMoney'].includes(dataArray[j])){
            //如果有类型不正确的值。直接退出
            if(rdata[j] && isNaN(Number(rdata[j]))){
              isError = excelObj[0][j];
              break;
            }
          }
          //时间格式判断
          if(['orderDate', 'deliveryDate'].includes(dataArray[j])){
            //如果有类型不正确的值。直接退出
            if(rdata[j] && isNaN(Date.parse(rdata[j]))){
              isError = excelObj[0][j];
              break;
            }
            rdata[j] = formate((new Date(1900, 0, rdata[j] -1 )), "yyyy-MM-dd hh:mm:ss");
          }
          stu[dataArray[j]] = rdata[j];
        }
        allData.push(stu);
    }
    if(isError){
      await CONTENT_NOT_SUCCESS(ctx, isError+'列的数据格式存在问题，请检查后再导入' )
    }else{
      if(allData.length){
         //批量新增
        await dbCommon.bulkCreate(ctx, allData)
        await SUCCESS(ctx, '', file.originalname + '导入成功')
      }else{
        await SUCCESS(ctx, '', file.originalname + '无可导入的数据')
      }
     
    }
  });

  
  module.exports = router;
  