module.exports = {
	cookieSign: 'H1YHED61C24A1X2AGSEBBFS344AXORWN',
	// 线上环境
	// userImgFilePath: '/root/moving_back/public/user', // 用户头像
	// userImgUrl: 'http://47.106.208.52:3001/user',
	// goodsPreUrl: 'http://47.106.208.52:3001/goods',

	// 本地环境
	userImgFilePath: '/Users/zhangzhen/moving/front_back/public/user', // 用户头像
	userImgUrl: 'user/',
	goodsPreUrl: 'http://localhost:3001/goods',

	// 短信验证码需要的信息
	message_accessKeyId: 'LTAI4FmR6WYzmWGpby7hCsC5',
	message_accessKeySecret: 'ewp6oNm7QLeJN1WoPpRkvUsRNtPUJ2',
	message_sign: 'moving洗衣店',

	// 打印机设置
	USER: '1094705507@qq.com', // 打印机后台注册用户名
	UKEY: 'SLb59vd942z9sGRV', // 打印机后台的key

	mch_id: 1582660231, // 商户号
	appid: 'wxcf235c09083c777a', // 微信开放平台的appid
	grant_type: 'authorization_code',
	key: '5EIRKZ8BBO0RT6IYVD1EU8V28H61V69F', // 商户平台的秘钥

	// 洗衣柜相关
	box_mtype: 'laundry',
	box_skey: 'Smartbox',
	box_userid: 'xiyigui',
	box_password: '123123',
	box_login_url: 'http://boxserver.zmkmdz.com/web/users/login',
	box_open_url: 'http://boxserver.zmkmdz.com/box/laundry/open_box_cell',
	box_getState_url: 'http://boxserver.zmkmdz.com/box/laundry/getbox_freecell',
	box_total_num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
	box_samll_num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
	box_big_num: [22, 23, 24, 25, 26, 27, 28, 29],
};
