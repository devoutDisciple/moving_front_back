const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('address', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "用户id"
    },
    username: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    sex: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-男 2-女"
    },
    area: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "用户所属区域"
    },
    street: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "用户所属街道"
    },
    is_defalut: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "是否是默认地址 1-否 2-是"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "是否删除 1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'address',
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
