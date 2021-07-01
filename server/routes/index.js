const Router = require('koa-router');
// 进行组合
const compose = require('koa-compose');
const router = new Router();


// routes
const login = require('./login');
const file = require('./file');
const orderManage = require('./orderManage');
const orderManageList = require('./orderManageList');
const stats = require('./stats');
const image = require('./image');

// routes definition
router.use(login.routes(), login.allowedMethods());
router.use(file.routes(), file.allowedMethods());
router.use(orderManage.routes(), orderManage.allowedMethods());
router.use(orderManageList.routes(), orderManageList.allowedMethods());
router.use(stats.routes(), stats.allowedMethods());
router.use(image.routes(), image.allowedMethods());



module.exports = function () {
    return compose([
        router.routes(),
        router.allowedMethods()
    ])
}