const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('cabinet', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shopid: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "关联店铺"
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "快递柜名称"
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "快递柜地址"
    },
    boxid: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "boxid"
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "首页展示图片"
    },
    total: {
      type: Sequelize.STRING(800),
      allowNull: true,
      defaultValue: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]"
    },
    used: {
      type: Sequelize.STRING(800),
      allowNull: true,
      defaultValue: "[]"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "排序"
    }
  }, {
    sequelize,
    tableName: 'cabinet',
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
