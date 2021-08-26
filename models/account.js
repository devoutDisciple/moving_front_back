const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('account', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "账号所属人"
    },
    phone: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "用户手机号"
    },
    username: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    shopid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    role: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 2,
      comment: "1 超级管理员 2 商家 3 店员"
    },
    send_message: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-发送短信 2-不发送"
    },
    is_delete: {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: "1",
      comment: "1 存在 2 删除"
    }
  }, {
    sequelize,
    tableName: 'account',
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
