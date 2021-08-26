const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('clothing', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shopid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    typeid: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    price: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'clothing',
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
