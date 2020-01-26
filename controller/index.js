const userController = require("./userController");
const registerController = require("./registerController");
const loginController = require("./loginController");
const shopController = require("./shopController");

const router = (app) => {
	// 用户
	app.use("/user", userController);
	// 注册
	app.use("/register", registerController);
	// 登录
	app.use("/login", loginController);
	// 商店
	app.use("/shop", shopController);
};
module.exports = router;
