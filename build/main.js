'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _chapterText = require('./api/chapter-text');

var _wordLookup = require('./api/word-lookup');

var _termSearch = require('./api/term-search');

var _logging = require('./util/logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoClient = require('mongodb').MongoClient;


var things = {
	mongo: false,
	express: false
};
console.log("WAITING:", Object.keys(things));
var declare_ready = function declare_ready(thing) {
	console.log("READY:", thing);
	things[thing] = true;
	if (Object.keys(things).reduce(function (c, k) {
		return c && things[k];
	}, true)) {
		console.log("READY READY READY!");
	}
};

var requiredEnvVar = function requiredEnvVar(variable) {
	if (!process.env.hasOwnProperty(variable)) {
		console.log('Sorry, we need "' + variable + '" to be set');
		process.exit();
	}
	return process.env[variable];
};

var mongoConnectionString = requiredEnvVar("MONGO_CONNECTION_STRING");
var mongoDatabase = requiredEnvVar("MONGO_DATABASE");
var mongoUrl = 'mongodb://' + mongoConnectionString + '/' + mongoDatabase;

var mongoConnection = null;
MongoClient.connect(mongoUrl, function (err, db) {
	if (err) {
		console.log("Error setting up mongo connection");
		console.log(err);
	} else {
		mongoConnection = db;
		declare_ready("mongo");
	}
});

var app = (0, _express2.default)();
app.use((0, _compression2.default)());
app.use(_bodyParser2.default.json());
app.use((0, _cors2.default)());
var port = +requiredEnvVar("APP_HOST");
var host = requiredEnvVar("APP_PORT");
var server = app.listen(port, host, function () {
	console.log("Server listening to %s:%d within %s environment", host, port, app.get('env'));
	declare_ready("express");
});

// Use X-Forwarded-For
app.set('trust proxy', 'loopback');

console.log("Setting up routes");
app.post(['/api', '/api/*'], function (req, res) {
	var api_request = req.params;
	var params = req.body;
	console.log(api_request[0]);
	(0, _logging2.default)({ api_request: api_request, params: params, ip_address: req.ip });

	var responsePromise = new Promise(function (resolve, reject) {
		return resolve();
	});
	switch (api_request[0]) {
		case "term-search":
			responsePromise = (0, _termSearch.termSearch)(params, mongoConnection);
			break;
		case "collocation-search":
			responsePromise = (0, _termSearch.collocationSearch)(params);
			// response = termSearch(params) 
			break;
		case "word-study":
			// response = termSearch(params) 
			break;
		case "word-lookup":
			responsePromise = (0, _wordLookup.wordLookup)(params, mongoConnection);
			break;
		case "term-highlights":
			// response = termSearch(params) 
			break;
		case "chapter-text":
			responsePromise = (0, _chapterText.chapterText)(params, mongoConnection);
			break;
		default:
			responsePromise = new Promise(function (resolve, reject) {
				reject({
					"error": "Invalid api request. Request should be formatted /api/<type of request>",
					"options": ["term-search", "collocation-search", "word-study", "word-lookup", "term-highlights", "chapter-text"]
				});
			});
			break;
	}
	responsePromise.then(function (response) {
		res.send(response);
	}).catch(function (response) {
		res.send(response);
		console.log("error");
		console.log(response);
	});
});

// const clientRoot = "./client/build"
// const clientRoot = requiredEnvVar("PARABIBLE_CLIENT_DIR")
var getUrl = function getUrl(mobile) {
	if (mobile) return '/mobile.html';else return '/index.html';
};
var needsFonts = function needsFonts(userAgent) {
	// technically this is not mobile - it's whether or not to dump fonts into the index.html
	var regexForMobile = {
		// Windows: /windows nt/i,
		WindowsPhone: /windows phone/i,
		// Mac: /macintosh/i,
		// Linux: /linux/i,
		Wii: /wii/i,
		Playstation: /playstation/i,
		iPad: /ipad/i,
		iPod: /ipod/i,
		iPhone: /iphone/i,
		Android: /android/i,
		Blackberry: /blackberry/i,
		Samsung: /samsung/i,
		// Curl: /curl/i
		Mobile: /mobile/i
	};
	return Object.keys(regexForMobile).reduce(function (a, k) {
		return a || regexForMobile[k].test(userAgent);
	}, false);
};

// Route order matters - the first listed will be invoked
// app.get("/", (req, res) => {
// 	res.sendFile(getUrl(needsFonts(req.headers["user-agent"])), {root: clientRoot})
// })
// app.use(express.static(clientRoot))
// app.get("*", (req, res) => {
// 	res.sendFile(getUrl(needsFonts(req.headers["user-agent"])), {root: clientRoot})
// })
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbIk1vbmdvQ2xpZW50IiwicmVxdWlyZSIsInRoaW5ncyIsIm1vbmdvIiwiZXhwcmVzcyIsImNvbnNvbGUiLCJsb2ciLCJPYmplY3QiLCJrZXlzIiwiZGVjbGFyZV9yZWFkeSIsInRoaW5nIiwicmVkdWNlIiwiYyIsImsiLCJyZXF1aXJlZEVudlZhciIsInZhcmlhYmxlIiwicHJvY2VzcyIsImVudiIsImhhc093blByb3BlcnR5IiwiZXhpdCIsIm1vbmdvQ29ubmVjdGlvblN0cmluZyIsIm1vbmdvRGF0YWJhc2UiLCJtb25nb1VybCIsIm1vbmdvQ29ubmVjdGlvbiIsImNvbm5lY3QiLCJlcnIiLCJkYiIsImFwcCIsInVzZSIsImpzb24iLCJwb3J0IiwiaG9zdCIsInNlcnZlciIsImxpc3RlbiIsImdldCIsInNldCIsInBvc3QiLCJyZXEiLCJyZXMiLCJhcGlfcmVxdWVzdCIsInBhcmFtcyIsImJvZHkiLCJpcF9hZGRyZXNzIiwiaXAiLCJyZXNwb25zZVByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInRoZW4iLCJyZXNwb25zZSIsInNlbmQiLCJjYXRjaCIsImdldFVybCIsIm1vYmlsZSIsIm5lZWRzRm9udHMiLCJ1c2VyQWdlbnQiLCJyZWdleEZvck1vYmlsZSIsIldpbmRvd3NQaG9uZSIsIldpaSIsIlBsYXlzdGF0aW9uIiwiaVBhZCIsImlQb2QiLCJpUGhvbmUiLCJBbmRyb2lkIiwiQmxhY2tiZXJyeSIsIlNhbXN1bmciLCJNb2JpbGUiLCJhIiwidGVzdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFWQSxJQUFJQSxjQUFjQyxRQUFRLFNBQVIsRUFBbUJELFdBQXJDOzs7QUFZQSxJQUFJRSxTQUFTO0FBQ1pDLFFBQU8sS0FESztBQUVaQyxVQUFTO0FBRkcsQ0FBYjtBQUlBQyxRQUFRQyxHQUFS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QUFhLGNBTlM7QUFPdEJDLFFBQU0sT0FQZ0I7QUFRdEJDLFFBQU0sT0FSZ0I7QUFTdEJDLFVBQVEsU0FUYztBQVV0QkMsV0FBUyxVQVZhO0FBV3RCQyxjQUFZLGFBWFU7QUFZdEJDLFdBQVMsVUFaYTtBQWF0QjtBQUNBQyxVQUFRO0FBZGMsRUFBdkI7QUFnQkEsUUFBTzNELE9BQU9DLElBQVAsQ0FBWWdELGNBQVosRUFBNEI3QyxNQUE1QixDQUFtQyxVQUFDd0QsQ0FBRCxFQUFJdEQsQ0FBSjtBQUFBLFNBQ3pDc0QsS0FBS1gsZUFBZTNDLENBQWYsRUFBa0J1RCxJQUFsQixDQUF1QmIsU0FBdkIsQ0FEb0M7QUFBQSxFQUFuQyxFQUVQLEtBRk8sQ0FBUDtBQUdBLENBckJEOztBQXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTW9uZ29DbGllbnQgPSByZXF1aXJlKCdtb25nb2RiJykuTW9uZ29DbGllbnRcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nXG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcidcbmltcG9ydCBjb3JzIGZyb20gJ2NvcnMnXG5cbmltcG9ydCB7IGNoYXB0ZXJUZXh0IH0gZnJvbSBcIi4vYXBpL2NoYXB0ZXItdGV4dFwiXG5pbXBvcnQgeyB3b3JkTG9va3VwIH0gZnJvbSBcIi4vYXBpL3dvcmQtbG9va3VwXCJcbmltcG9ydCB7IHRlcm1TZWFyY2gsIGNvbGxvY2F0aW9uU2VhcmNoIH0gZnJvbSBcIi4vYXBpL3Rlcm0tc2VhcmNoXCJcblxuaW1wb3J0IExvZyBmcm9tIFwiLi91dGlsL2xvZ2dpbmdcIlxuXG5sZXQgdGhpbmdzID0ge1xuXHRtb25nbzogZmFsc2UsXG5cdGV4cHJlc3M6IGZhbHNlXG59XG5jb25zb2xlLmxvZyhcIldBSVRJTkc6XCIsIE9iamVjdC5rZXlzKHRoaW5ncykpXG5jb25zdCBkZWNsYXJlX3JlYWR5ID0gKHRoaW5nKSA9PiB7XG5cdGNvbnNvbGUubG9nKFwiUkVBRFk6XCIsIHRoaW5nKVxuXHR0aGluZ3NbdGhpbmddID0gdHJ1ZVxuXHRpZiAoT2JqZWN0LmtleXModGhpbmdzKS5yZWR1Y2UoKGMsIGspID0+IGMgJiYgdGhpbmdzW2tdLCB0cnVlKSkge1xuXHRcdGNvbnNvbGUubG9nKFwiUkVBRFkgUkVBRFkgUkVBRFkhXCIpXG5cdH1cbn1cblxuXG5jb25zdCByZXF1aXJlZEVudlZhciA9ICh2YXJpYWJsZSkgPT4ge1xuXHRpZiAoIXByb2Nlc3MuZW52Lmhhc093blByb3BlcnR5KHZhcmlhYmxlKSkge1xuXHRcdGNvbnNvbGUubG9nKGBTb3JyeSwgd2UgbmVlZCBcIiR7dmFyaWFibGV9XCIgdG8gYmUgc2V0YClcblx0XHRwcm9jZXNzLmV4aXQoKVxuXHR9XG5cdHJldHVybiBwcm9jZXNzLmVudlt2YXJpYWJsZV1cbn1cblxuY29uc3QgbW9uZ29Db25uZWN0aW9uU3RyaW5nID0gcmVxdWlyZWRFbnZWYXIoXCJNT05HT19DT05ORUNUSU9OX1NUUklOR1wiKVxuY29uc3QgbW9uZ29EYXRhYmFzZSA9IHJlcXVpcmVkRW52VmFyKFwiTU9OR09fREFUQUJBU0VcIilcbmNvbnN0IG1vbmdvVXJsID0gYG1vbmdvZGI6Ly8ke21vbmdvQ29ubmVjdGlvblN0cmluZ30vJHttb25nb0RhdGFiYXNlfWBcblxubGV0IG1vbmdvQ29ubmVjdGlvbiA9IG51bGw7XG5Nb25nb0NsaWVudC5jb25uZWN0KG1vbmdvVXJsLCAoZXJyLCBkYikgPT4ge1xuXHRpZiAoZXJyKSB7XG5cdFx0Y29uc29sZS5sb2coXCJFcnJvciBzZXR0aW5nIHVwIG1vbmdvIGNvbm5lY3Rpb25cIilcblx0XHRjb25zb2xlLmxvZyhlcnIpXG5cdH1cblx0ZWxzZSB7XG5cdFx0bW9uZ29Db25uZWN0aW9uID0gZGJcblx0XHRkZWNsYXJlX3JlYWR5KFwibW9uZ29cIilcblx0fVxufSlcblxubGV0IGFwcCA9IGV4cHJlc3MoKVxuYXBwLnVzZShjb21wcmVzc2lvbigpKVxuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSlcbmFwcC51c2UoY29ycygpKVxubGV0IHBvcnQgPSArcmVxdWlyZWRFbnZWYXIoXCJBUFBfSE9TVFwiKVxubGV0IGhvc3QgPSByZXF1aXJlZEVudlZhcihcIkFQUF9QT1JUXCIpXG5sZXQgc2VydmVyID0gYXBwLmxpc3Rlbihwb3J0LCBob3N0LCAoKSA9PiB7XG5cdGNvbnNvbGUubG9nKFwiU2VydmVyIGxpc3RlbmluZyB0byAlczolZCB3aXRoaW4gJXMgZW52aXJvbm1lbnRcIiwgaG9zdCwgcG9ydCwgYXBwLmdldCgnZW52JykpXG5cdGRlY2xhcmVfcmVhZHkoXCJleHByZXNzXCIpXG59KVxuXG4vLyBVc2UgWC1Gb3J3YXJkZWQtRm9yXG5hcHAuc2V0KCd0cnVzdCBwcm94eScsICdsb29wYmFjaycpXG5cblxuY29uc29sZS5sb2coXCJTZXR0aW5nIHVwIHJvdXRlc1wiKVxuYXBwLnBvc3QoWycvYXBpJywgJy9hcGkvKiddLCAocmVxLCByZXMpID0+IHtcblx0Y29uc3QgYXBpX3JlcXVlc3QgPSByZXEucGFyYW1zXG5cdGNvbnN0IHBhcmFtcyA9IHJlcS5ib2R5XG5cdGNvbnNvbGUubG9nKGFwaV9yZXF1ZXN0WzBdKVxuXHRMb2coeyBhcGlfcmVxdWVzdCwgcGFyYW1zLCBpcF9hZGRyZXNzOiByZXEuaXAgfSlcblxuXHRsZXQgcmVzcG9uc2VQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVzb2x2ZSgpKVxuXHRzd2l0Y2goYXBpX3JlcXVlc3RbMF0pIHtcblx0XHRjYXNlIFwidGVybS1zZWFyY2hcIjpcblx0XHRcdHJlc3BvbnNlUHJvbWlzZSA9IHRlcm1TZWFyY2gocGFyYW1zLCBtb25nb0Nvbm5lY3Rpb24pXG5cdFx0XHRicmVha1xuXHRcdGNhc2UgXCJjb2xsb2NhdGlvbi1zZWFyY2hcIjpcblx0XHRcdHJlc3BvbnNlUHJvbWlzZSA9IGNvbGxvY2F0aW9uU2VhcmNoKHBhcmFtcylcblx0XHRcdC8vIHJlc3BvbnNlID0gdGVybVNlYXJjaChwYXJhbXMpIFxuXHRcdFx0YnJlYWtcblx0XHRjYXNlIFwid29yZC1zdHVkeVwiOlxuXHRcdFx0Ly8gcmVzcG9uc2UgPSB0ZXJtU2VhcmNoKHBhcmFtcykgXG5cdFx0XHRicmVha1xuXHRcdGNhc2UgXCJ3b3JkLWxvb2t1cFwiOlxuXHRcdFx0cmVzcG9uc2VQcm9taXNlID0gd29yZExvb2t1cChwYXJhbXMsIG1vbmdvQ29ubmVjdGlvbikgXG5cdFx0XHRicmVha1xuXHRcdGNhc2UgXCJ0ZXJtLWhpZ2hsaWdodHNcIjpcblx0XHRcdC8vIHJlc3BvbnNlID0gdGVybVNlYXJjaChwYXJhbXMpIFxuXHRcdFx0YnJlYWtcblx0XHRjYXNlIFwiY2hhcHRlci10ZXh0XCI6XG5cdFx0XHRyZXNwb25zZVByb21pc2UgPSBjaGFwdGVyVGV4dChwYXJhbXMsIG1vbmdvQ29ubmVjdGlvbilcblx0XHRcdGJyZWFrXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJlc3BvbnNlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0cmVqZWN0KHtcblx0XHRcdFx0XHRcImVycm9yXCI6IFwiSW52YWxpZCBhcGkgcmVxdWVzdC4gUmVxdWVzdCBzaG91bGQgYmUgZm9ybWF0dGVkIC9hcGkvPHR5cGUgb2YgcmVxdWVzdD5cIixcblx0XHRcdFx0XHRcIm9wdGlvbnNcIjogW1xuXHRcdFx0XHRcdFx0XCJ0ZXJtLXNlYXJjaFwiLFxuXHRcdFx0XHRcdFx0XCJjb2xsb2NhdGlvbi1zZWFyY2hcIixcblx0XHRcdFx0XHRcdFwid29yZC1zdHVkeVwiLFxuXHRcdFx0XHRcdFx0XCJ3b3JkLWxvb2t1cFwiLFxuXHRcdFx0XHRcdFx0XCJ0ZXJtLWhpZ2hsaWdodHNcIixcblx0XHRcdFx0XHRcdFwiY2hhcHRlci10ZXh0XCJcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHRcdFx0YnJlYWtcblx0fVxuXHRyZXNwb25zZVByb21pc2UudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRyZXMuc2VuZChyZXNwb25zZSlcblx0fSkuY2F0Y2goKHJlc3BvbnNlKSA9PiB7XG5cdFx0cmVzLnNlbmQocmVzcG9uc2UpXG5cdFx0Y29uc29sZS5sb2coXCJlcnJvclwiKVxuXHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuXHR9KVxufSlcblxuXG4vLyBjb25zdCBjbGllbnRSb290ID0gXCIuL2NsaWVudC9idWlsZFwiXG4vLyBjb25zdCBjbGllbnRSb290ID0gcmVxdWlyZWRFbnZWYXIoXCJQQVJBQklCTEVfQ0xJRU5UX0RJUlwiKVxuY29uc3QgZ2V0VXJsID0gKG1vYmlsZSkgPT4ge1xuXHRpZiAobW9iaWxlKVxuXHRcdHJldHVybiAnL21vYmlsZS5odG1sJ1xuXHRlbHNlXG5cdFx0cmV0dXJuICcvaW5kZXguaHRtbCdcbn1cbmNvbnN0IG5lZWRzRm9udHMgPSAodXNlckFnZW50KSA9PiB7XG5cdC8vIHRlY2huaWNhbGx5IHRoaXMgaXMgbm90IG1vYmlsZSAtIGl0J3Mgd2hldGhlciBvciBub3QgdG8gZHVtcCBmb250cyBpbnRvIHRoZSBpbmRleC5odG1sXG5cdGNvbnN0IHJlZ2V4Rm9yTW9iaWxlID0ge1xuXHRcdC8vIFdpbmRvd3M6IC93aW5kb3dzIG50L2ksXG5cdFx0V2luZG93c1Bob25lOiAvd2luZG93cyBwaG9uZS9pLFxuXHRcdC8vIE1hYzogL21hY2ludG9zaC9pLFxuXHRcdC8vIExpbnV4OiAvbGludXgvaSxcblx0XHRXaWk6IC93aWkvaSxcblx0XHRQbGF5c3RhdGlvbjogL3BsYXlzdGF0aW9uL2ksXG5cdFx0aVBhZDogL2lwYWQvaSxcblx0XHRpUG9kOiAvaXBvZC9pLFxuXHRcdGlQaG9uZTogL2lwaG9uZS9pLFxuXHRcdEFuZHJvaWQ6IC9hbmRyb2lkL2ksXG5cdFx0QmxhY2tiZXJyeTogL2JsYWNrYmVycnkvaSxcblx0XHRTYW1zdW5nOiAvc2Ftc3VuZy9pLFxuXHRcdC8vIEN1cmw6IC9jdXJsL2lcblx0XHRNb2JpbGU6IC9tb2JpbGUvaVxuXHR9XG5cdHJldHVybiBPYmplY3Qua2V5cyhyZWdleEZvck1vYmlsZSkucmVkdWNlKChhLCBrKSA9PlxuXHRcdGEgfHwgcmVnZXhGb3JNb2JpbGVba10udGVzdCh1c2VyQWdlbnQpLFxuXHRmYWxzZSlcbn1cblxuLy8gUm91dGUgb3JkZXIgbWF0dGVycyAtIHRoZSBmaXJzdCBsaXN0ZWQgd2lsbCBiZSBpbnZva2VkXG4vLyBhcHAuZ2V0KFwiL1wiLCAocmVxLCByZXMpID0+IHtcbi8vIFx0cmVzLnNlbmRGaWxlKGdldFVybChuZWVkc0ZvbnRzKHJlcS5oZWFkZXJzW1widXNlci1hZ2VudFwiXSkpLCB7cm9vdDogY2xpZW50Um9vdH0pXG4vLyB9KVxuLy8gYXBwLnVzZShleHByZXNzLnN0YXRpYyhjbGllbnRSb290KSlcbi8vIGFwcC5nZXQoXCIqXCIsIChyZXEsIHJlcykgPT4ge1xuLy8gXHRyZXMuc2VuZEZpbGUoZ2V0VXJsKG5lZWRzRm9udHMocmVxLmhlYWRlcnNbXCJ1c2VyLWFnZW50XCJdKSksIHtyb290OiBjbGllbnRSb290fSlcbi8vIH0pIl19