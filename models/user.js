const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nickname: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "用户昵称 12个字符以内"
    },
    username: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true,
      comment: "用户名称或者昵称 限制12个字符以内"
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "12个字符以内"
    },
    phone: {
      type: Sequelize.STRING(11),
      allowNull: false,
      primaryKey: true,
      comment: "手机号"
    },
    photo: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "logo_square.jpg",
      comment: "头像的地址"
    },
    address: {
      type: Sequelize.STRING(8000),
      allowNull: true,
      comment: "用户地址"
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 20,
      comment: "默认20岁"
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "邮箱"
    },
    sex: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "性别 1-男 2-女"
    },
    token: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "用户的登录标示"
    },
    security_code: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "验证码"
    },
    security_create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "验证码的创建时间"
    },
    security_expire_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "验证码的过期时间"
    },
    cabinet_use_time: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "可用的打开柜子门的次数"
    },
    balance: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "余额"
    },
    integral: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "积分"
    },
    member: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "1",
      comment: "会员 1-普通用户 2-会员 "
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "用户的创建时间"
    },
    is_delete: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "1",
      comment: "是否被删除 1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "username" },
          { name: "phone" },
        ]
      },
    ]
  });
};
