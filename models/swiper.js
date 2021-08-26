const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('swiper', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shop_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "关联的商店id"
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "图片的url"
    },
    text: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "描述信息"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "权重，越大的显示越在前面"
    },
    is_delete: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "1",
      comment: "是否被删除 1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'swiper',
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
