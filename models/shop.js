const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('shop', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(45),
      allowNull: false,
      comment: "商家名称"
    },
    manager: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "店长姓名"
    },
    phone: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "电话号码"
    },
    address: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: "浙江省杭州市余杭区五常街道西溪水岸花苑",
      comment: "商家地址"
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "店铺图标"
    },
    longitude: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "120.050247",
      comment: "经度"
    },
    latitude: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "30.282795",
      comment: "纬度"
    },
    sn: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "打印机编号"
    },
    key: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "打印机秘钥"
    },
    sales: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "订单量"
    },
    desc: {
      type: Sequelize.STRING(45),
      allowNull: true,
      comment: "商家描述，限定二十个字"
    },
    special: {
      type: Sequelize.STRING(800),
      allowNull: true,
      comment: "优惠 满减"
    },
    invite: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1 支持自取 2 不支持自取"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "排序"
    },
    auto_print: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-自动打印 2-不是自动打印"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1 存在 2 删除"
    }
  }, {
    sequelize,
    tableName: 'shop',
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
      {
        name: "id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
