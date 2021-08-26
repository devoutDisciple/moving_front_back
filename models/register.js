const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('register', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    phone: {
      type: Sequelize.STRING(11),
      allowNull: false,
      primaryKey: true
    },
    security_code: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    expire_time: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'register',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "phone" },
        ]
      },
    ]
  });
};
