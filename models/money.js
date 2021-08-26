const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('money', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    money: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    send: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'money',
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
