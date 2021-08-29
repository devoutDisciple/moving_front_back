const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('order', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "订单编号"
    },
    shopid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "订单的商店id"
    },
    userid: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "订单的下单人"
    },
    goods: {
      type: Sequelize.STRING(8000),
      allowNull: true,
      defaultValue: "[]",
      comment: "订单涉及的商品种类"
    },
    send_people: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "录入订单的人"
    },
    cabinetId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "快递柜的id"
    },
    boxid: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "存储柜子的id"
    },
    cellid: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "存储柜子的格子id"
    },
    home_address: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "送货上门的时候的地址"
    },
    home_username: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "送货上门的时候的用户名称"
    },
    home_phone: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "送货上门的时候的用户手机号"
    },
    home_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "预约上门取衣时间"
    },
    intergral_address: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "积分兑换的收货地址"
    },
    intergral_username: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "积分兑换的用户名称"
    },
    intergral_phone: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "积分兑换的收货人手机号"
    },
    intergral_num: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "积分兑换消耗的积分"
    },
    is_sure: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "店员是否确认 1-用户确认 2-店员确认"
    },
    pre_pay: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "预付款"
    },
    send_money: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "配送费"
    },
    origin_money: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "原始价格"
    },
    money: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "订单金额"
    },
    discount: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "10",
      comment: "折扣"
    },
    order_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "下单类型：1-通过柜子下单 2-上门取衣 3-积分兑换 4-店员录入订单 5-店内下单"
    },
    send_status: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "送货方式 1-存储在柜子 2-在店内自取 3-送货到家"
    },
    send_home: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-没送 2-完成派送"
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存储在柜子 2-店员取货，清洗中 3-待付款 4-待取货 5-已完成 6-预约上门，未付款 7-积分兑换  8-预约上门取衣，已付款 9-店员下单"
    },
    urgency: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-普通订单 2-加急订单"
    },
    desc: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "订单备注"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false,
      comment: "订单创建时间"
    },
    modify_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "订单完成时间"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'order',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
