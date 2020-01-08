import securityCodeController from "./securityCodeController";

const router = (app) => {
	// 用户
	app.use("/user", securityCodeController);
};
module.exports = router;
