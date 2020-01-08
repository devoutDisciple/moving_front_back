const express = require("express");
const router = express.Router();
const collectionService = require("../services/collectionService");

// 根据用户id获取收藏信息
router.get("/getByOpenid", (req, res) => {
	collectionService.getByOpenid(req, res);
});
// 加入收藏
router.post("/addCollectionGoods", (req, res) => {
	collectionService.addCollectionGoods(req, res);
});
// 移除收藏
router.post("/removeCollectionGoods", (req, res) => {
	collectionService.removeCollectionGoods(req, res);
});



module.exports = router;
