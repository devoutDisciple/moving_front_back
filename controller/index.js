const userController = require('./userController');
const registerController = require('./registerController');
const loginController = require('./loginController');
const shopController = require('./shopController');
const swiperController = require('./swiperController');
const cabinetrController = require('./cabinetrController');
const payController = require('./payController');
const areaController = require('./areaController');
const addressController = require('./addressController');
const intergralGoodsController = require('./intergralGoodsController');
const intergralRecordController = require('./intergralRecordController');
const optionsController = require('./optionsController');
const clothingController = require('./clothingController');
const orderController = require('./orderController');
const versionController = require('./versionController');
const alipayController = require('./alipayController');

// 测试
const testController = require('./testController');

const router = (app) => {
	// 版本
	app.use('/version', versionController);
	// 用户
	app.use('/user', userController);
	// 注册
	app.use('/register', registerController);
	// 登录
	app.use('/login', loginController);
	// 商店
	app.use('/shop', shopController);
	// 轮播图
	app.use('/swiper', swiperController);
	// 快递柜
	app.use('/cabinet', cabinetrController);
	// 衣物相关
	app.use('/clothing', clothingController);
	// 订单相关
	app.use('/order', orderController);
	// 支付接口
	app.use('/pay', payController);
	// 地图位置
	app.use('/area', areaController);
	// 用户位置
	app.use('/address', addressController);
	// 积分商品相关
	app.use('/intergral_goods', intergralGoodsController);
	// 积分记录相关
	app.use('/intergral_record', intergralRecordController);
	// 用户意见
	app.use('/options', optionsController);
	// 处理支付宝支付皆苦
	app.use('/alipay', alipayController);

	// 测试 testController
	app.use('/test', testController);
};
module.exports = router;
