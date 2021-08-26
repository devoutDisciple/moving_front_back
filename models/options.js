const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('options', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    option: {
      type: Sequelize.STRING(800),
      allowNull: true,
      comment: "1，2，3，4"
    },
    desc: {
      type: Sequelize.STRING(800),
      allowNull: true,
      comment: "描述"
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-待处理 2-已处理"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    }
  }, {
    sequelize,
    tableName: 'options',
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
