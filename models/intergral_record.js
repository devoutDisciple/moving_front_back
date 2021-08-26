const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('intergral_record', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    shopid: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    goodsId: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    intergral: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "消耗积分"
    },
    cabinetId: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "存放柜子id"
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-待发货 2-待取货 3-兑换完成"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'intergral_record',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "userid" },
          { name: "shopid" },
          { name: "goodsId" },
        ]
      },
    ]
  });
};
