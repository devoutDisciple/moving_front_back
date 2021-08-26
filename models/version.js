const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('version', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    version: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    desc: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    current: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "1-当前版本 2-过期版本"
    },
    force: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-不强制更新 2-强制更新"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-客户端 2-商家端"
    },
    remark: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "备注"
    }
  }, {
    sequelize,
    tableName: 'version',
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
