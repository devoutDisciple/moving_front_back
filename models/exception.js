const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('exception', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    success: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "1-成功 2-异常"
    },
    result: {
      type: Sequelize.STRING(8000),
      allowNull: true,
      comment: "异常原因"
    },
    optid: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "操作人的id"
    },
    user_type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-用户 2-店员"
    },
    cabinetid: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "柜子的id"
    },
    boxid: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "自己系统的柜子id"
    },
    cellid: {
      type: Sequelize.STRING(11),
      allowNull: true,
      comment: "格口"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    }
  }, {
    sequelize,
    tableName: 'exception',
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
