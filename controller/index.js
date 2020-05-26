const userController = require('./userController');
const registerController = require('./registerController');
const loginController = require('./loginController');
const shopController = require('./shopController');
const swiperController = require('./swiperController');
const cabinetrController = require('./cabinetrController');
const payController = require('./payController');
const areaController = require('./areaController');
const addressController = require('./addressController');
const intergralController = require('./intergralController');
const optionsController = require('./optionsController');
const clothingController = require('./clothingController');

const router = (app) => {
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
	// 支付接口
	app.use('/pay', payController);
	// 地图位置
	app.use('/area', areaController);
	// 用户位置
	app.use('/address', addressController);
	// 积分相关
	app.use('/intergral', intergralController);
	// 用户意见
	app.use('/options', optionsController);
};
module.exports = router;
