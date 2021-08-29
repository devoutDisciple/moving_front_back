const Sequelize = require('sequelize');

module.exports = sequelize => {
	return sequelize.define(
		'bill',
		{
			id: {
				autoIncrement: true,
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			code: {
				type: Sequelize.STRING(255),
				allowNull: false,
				primaryKey: true,
				comment: '订单号',
			},
			userid: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			orderid: {
				type: Sequelize.STRING(255),
				allowNull: true,
				comment: '订单编号',
			},
			money: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: '0',
				comment: '消费金额',
			},
			send: {
				type: Sequelize.STRING(255),
				allowNull: true,
				defaultValue: '0',
				comment: '当充值或者成为会员的时候赠送的金额',
			},
			pay_type: {
				type: Sequelize.STRING(255),
				allowNull: true,
				comment: '支付方式：1-微信 2-支付宝 3-余额',
			},
			type: {
				type: Sequelize.STRING(255),
				allowNull: true,
				comment:
					'消费类型：1-订单支付(order) 2-上门取衣支付(clothing) 3-充值(recharge) 4-购买会员(member) 5:保存衣物收取一元(save_clothing)',
			},
			update_type: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
				comment: '1-用户创建 2-系统自动计算完成',
			},
			create_time: {
				type: Sequelize.DATE,
				allowNull: true,
				comment: '创建时间',
			},
		},
		{
			sequelize,
			tableName: 'bill',
			timestamps: false,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }, { name: 'code' }],
				},
			],
		},
	);
};
