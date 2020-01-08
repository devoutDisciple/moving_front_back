const userController = require("./userController");
const registerController = require("./registerController");

const router = (app) => {
	// 用户
	app.use("/user", userController);
	// 注册
	app.use("/register", registerController);
};
module.exports = router;
