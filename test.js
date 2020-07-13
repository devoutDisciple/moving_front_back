const urlencode = require('urlencode');
console.log(
	urlencode(
		'{"type":"clothing","userid":10,"money":0.01,"shopid":26,"home_time":"2020-07-14 09:00:00","home_address":"四川省 成都市 区域二 西溪水岸花苑","home_username":"张振","home_phone":"18210619398","home_desc":"Test"}',
	),
);
