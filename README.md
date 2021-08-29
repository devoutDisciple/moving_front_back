# 本项目使用mysql作为永久化存储服务器，搭载在阿里云服务器上

使用sequelize作为node的orm框架，使用sequelize-auto自动生成models,地址：https://www.npmjs.com/package/sequelize-auto

参考命令：
sequelize-auto -o "./models" -d sequelize_auto_test -h localhost -u my_username -p 5432 -x my_password -e postgres

sequelize-auto -o "./models" -d laundry -h localhost -u root -p 3306 -x zz941025 && node formatModels.js

项目中用到了shelljs以及commander...

bill -> update_type int 默认值 1 1-用户创建 2-系统自动计算完成
advertising -> 新增