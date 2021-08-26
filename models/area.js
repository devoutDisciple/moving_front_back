const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('area', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    parentid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-省 2-市 3-区"
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "区域级别： 1-省 2-市 3-区"
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "名称"
    },
    active: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-可以用 2-不可以用"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "权重"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'area',
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
