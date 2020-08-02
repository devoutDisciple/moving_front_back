module.exports = {
	// 会员等级
	filterMemberStatus: function (status) {
		let data = '';
		switch (Number(status)) {
			case 1:
				data = '普通用户';
				break;
			case 2:
				data = 'MOVING会员';
				break;
			case 3:
				data = 'MOVING PLUS 会员';
				break;
			default:
				data = '普通用户';
		}
		return data;
	},
};
