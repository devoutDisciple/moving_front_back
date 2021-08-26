const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('intergral_goods', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shopid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "商品名称"
    },
    desc: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "描述"
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "图片路径"
    },
    intergral: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 100,
      comment: "所需积分"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "排序"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false,
      comment: "创建时间"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'intergral_goods',
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
