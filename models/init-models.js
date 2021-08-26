var Sequelize = require("sequelize").Sequelize;
var _account = require("./account");
var _address = require("./address");
var _advertising = require("./advertising");
var _area = require("./area");
var _bill = require("./bill");
var _cabinet = require("./cabinet");
var _clothing = require("./clothing");
var _clothing_type = require("./clothing_type");
var _exception = require("./exception");
var _intergral_goods = require("./intergral_goods");
var _intergral_record = require("./intergral_record");
var _money = require("./money");
var _options = require("./options");
var _order = require("./order");
var _ranking = require("./ranking");
var _register = require("./register");
var _shop = require("./shop");
var _swiper = require("./swiper");
var _user = require("./user");
var _version = require("./version");

function initModels(sequelize) {
  var account = _account(sequelize, Sequelize);
  var address = _address(sequelize, Sequelize);
  var advertising = _advertising(sequelize, Sequelize);
  var area = _area(sequelize, Sequelize);
  var bill = _bill(sequelize, Sequelize);
  var cabinet = _cabinet(sequelize, Sequelize);
  var clothing = _clothing(sequelize, Sequelize);
  var clothing_type = _clothing_type(sequelize, Sequelize);
  var exception = _exception(sequelize, Sequelize);
  var intergral_goods = _intergral_goods(sequelize, Sequelize);
  var intergral_record = _intergral_record(sequelize, Sequelize);
  var money = _money(sequelize, Sequelize);
  var options = _options(sequelize, Sequelize);
  var order = _order(sequelize, Sequelize);
  var ranking = _ranking(sequelize, Sequelize);
  var register = _register(sequelize, Sequelize);
  var shop = _shop(sequelize, Sequelize);
  var swiper = _swiper(sequelize, Sequelize);
  var user = _user(sequelize, Sequelize);
  var version = _version(sequelize, Sequelize);


  return {
    account,
    address,
    advertising,
    area,
    bill,
    cabinet,
    clothing,
    clothing_type,
    exception,
    intergral_goods,
    intergral_record,
    money,
    options,
    order,
    ranking,
    register,
    shop,
    swiper,
    user,
    version,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
