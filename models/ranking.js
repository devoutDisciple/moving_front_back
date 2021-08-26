const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ranking', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    username: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    photo: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    money: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0"
    },
    discount: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0"
    },
    orderids: {
      type: Sequelize.STRING(5000),
      allowNull: true,
      defaultValue: "[]"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-最近七天 2-最近一个月"
    }
  }, {
    sequelize,
    tableName: 'ranking',
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
