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

// const mongoConnectionString = requiredEnvVar("MONGO_CONNECTION_STRING")
var mongouser = requiredEnvVar("MONGODB_USER");
var mongoPass = requiredEnvVar("MONGODB_PASSWORD");
var mongoDatabase = requiredEnvVar("MONGO_DATABASE");
var mongoService = requiredEnvVar("DATABASE_SERVICE_NAME");
var mongoUrl = 'mongodb://' + mongouser + ':' + mongoPass + '@' + mongoService + '/' + mongoDatabase;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbIk1vbmdvQ2xpZW50IiwicmVxdWlyZSIsInRoaW5ncyIsIm1vbmdvIiwiZXhwcmVzcyIsImNvbnNvbGUiLCJsb2ciLCJPYmplY3QiLCJrZXlzIiwiZGVjbGFyZV9yZWFkeSIsInRoaW5nIiwicmVkdWNlIiwiYyIsImsiLCJyZXF1aXJlZEVudlZhciIsInZhcmlhYmxlIiwicHJvY2VzcyIsImVudiIsImhhc093blByb3BlcnR5IiwiZXhpdCIsIm1vbmdvdXNlciIsIm1vbmdvUGFzcyIsIm1vbmdvRGF0YWJhc2UiLCJtb25nb1NlcnZpY2UiLCJtb25nb1VybCIsIm1vbmdvQ29ubmVjdGlvbiIsImNvbm5lY3QiLCJlcnIiLCJkYiIsImFwcCIsInVzZSIsImpzb24iLCJwb3J0IiwiaG9zdCIsInNlcnZlciIsImxpc3RlbiIsImdldCIsInNldCIsInBvc3QiLCJyZXEiLCJyZXMiLCJhcGlfcmVxdWVzdCIsInBhcmFtcyIsImJvZHkiLCJpcF9hZGRyZXNzIiwiaXAiLCJyZXNwb25zZVByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInRoZW4iLCJyZXNwb25zZSIsInNlbmQiLCJjYXRjaCIsImdldFVybCIsIm1vYmlsZSIsIm5lZWRzRm9udHMiLCJ1c2VyQWdlbnQiLCJyZWdleEZvck1vYmlsZSIsIldpbmRvd3NQaG9uZSIsIldpaSIsIlBsYXlzdGF0aW9uIiwiaVBhZCIsImlQb2QiLCJpUGhvbmUiLCJBbmRyb2lkIiwiQmxhY2tiZXJyeSIsIlNhbXN1bmciLCJNb2JpbGUiLCJhIiwidGVzdCJdLCJtYXBwaW5ncyI6Ijs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFWQSxJQUFJQSxjQUFjQyxRQUFRLFNBQVIsRUFBbUJELFdBQXJDOzs7QUFZQSxJQUFJRSxTQUFTO0FBQ1pDLFFBQU8sS0FESztBQUVaQyxVQUFTO0FBRkcsQ0FBYjtB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QUFiQSxVQUFhLENBQUNDLFNBQUQsRUFBZTtBQUNqQztBQUNBLEtBQU1DLGlCQUFpQjtBQUN0QjtBQUNBQyxnQkFBYyxnQkFGUTtBQUd0QjtBQUNBO0FBQ0FDLE9BQUssTUFMaUI7QUFNdEJDLGVBQWEsY0FOUztBQU90QkMsUUFBTSxPQVBnQjtBQVF0QkMsUUFBTSxPQVJnQjtBQVN0QkMsVUFBUSxTQVRjO0FBVXRCQyxXQUFTLFVBVmE7QUFXdEJDLGNBQVksYUFYVTtBQVl0QkMsV0FBUyxVQVphO0FBYXRCO0FBQ0FDLFVBQVE7QUFkYyxFQUF2QjtBQWdCQSxRQUFPN0QsT0FBT0MsSUFBUCxDQUFZa0QsY0FBWixFQUE0Qi9DLE1BQTVCLENBQW1DLFVBQUMwRCxDQUFELEVBQUl4RCxDQUFKO0FBQUEsU0FDekN3RCxLQUFLWCxlQUFlN0MsQ0FBZixFQUFrQnlELElBQWxCLENBQXVCYixTQUF2QixDQURvQztBQUFBLEVBQW5DLEVBRVAsS0FGTyxDQUFQO0FBR0EsQ0FyQkQ7O0FBdUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNb25nb0NsaWVudCA9IHJlcXVpcmUoJ21vbmdvZGInKS5Nb25nb0NsaWVudFxuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbidcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJ1xuaW1wb3J0IGNvcnMgZnJvbSAnY29ycydcblxuaW1wb3J0IHsgY2hhcHRlclRleHQgfSBmcm9tIFwiLi9hcGkvY2hhcHRlci10ZXh0XCJcbmltcG9ydCB7IHdvcmRMb29rdXAgfSBmcm9tIFwiLi9hcGkvd29yZC1sb29rdXBcIlxuaW1wb3J0IHsgdGVybVNlYXJjaCwgY29sbG9jYXRpb25TZWFyY2ggfSBmcm9tIFwiLi9hcGkvdGVybS1zZWFyY2hcIlxuXG5pbXBvcnQgTG9nIGZyb20gXCIuL3V0aWwvbG9nZ2luZ1wiXG5cbmxldCB0aGluZ3MgPSB7XG5cdG1vbmdvOiBmYWxzZSxcblx0ZXhwcmVzczogZmFsc2Vcbn1cbmNvbnNvbGUubG9nKFwiV0FJVElORzpcIiwgT2JqZWN0LmtleXModGhpbmdzKSlcbmNvbnN0IGRlY2xhcmVfcmVhZHkgPSAodGhpbmcpID0+IHtcblx0Y29uc29sZS5sb2coXCJSRUFEWTpcIiwgdGhpbmcpXG5cdHRoaW5nc1t0aGluZ10gPSB0cnVlXG5cdGlmIChPYmplY3Qua2V5cyh0aGluZ3MpLnJlZHVjZSgoYywgaykgPT4gYyAmJiB0aGluZ3Nba10sIHRydWUpKSB7XG5cdFx0Y29uc29sZS5sb2coXCJSRUFEWSBSRUFEWSBSRUFEWSFcIilcblx0fVxufVxuXG5cbmNvbnN0IHJlcXVpcmVkRW52VmFyID0gKHZhcmlhYmxlKSA9PiB7XG5cdGlmICghcHJvY2Vzcy5lbnYuaGFzT3duUHJvcGVydHkodmFyaWFibGUpKSB7XG5cdFx0Y29uc29sZS5sb2coYFNvcnJ5LCB3ZSBuZWVkIFwiJHt2YXJpYWJsZX1cIiB0byBiZSBzZXRgKVxuXHRcdHByb2Nlc3MuZXhpdCgpXG5cdH1cblx0cmV0dXJuIHByb2Nlc3MuZW52W3ZhcmlhYmxlXVxufVxuXG5cbi8vIGNvbnN0IG1vbmdvQ29ubmVjdGlvblN0cmluZyA9IHJlcXVpcmVkRW52VmFyKFwiTU9OR09fQ09OTkVDVElPTl9TVFJJTkdcIilcbmNvbnN0IG1vbmdvdXNlciA9IHJlcXVpcmVkRW52VmFyKFwiTU9OR09EQl9VU0VSXCIpXG5jb25zdCBtb25nb1Bhc3MgPSByZXF1aXJlZEVudlZhcihcIk1PTkdPREJfUEFTU1dPUkRcIilcbmNvbnN0IG1vbmdvRGF0YWJhc2UgPSByZXF1aXJlZEVudlZhcihcIk1PTkdPX0RBVEFCQVNFXCIpXG5jb25zdCBtb25nb1NlcnZpY2UgPSByZXF1aXJlZEVudlZhcihcIkRBVEFCQVNFX1NFUlZJQ0VfTkFNRVwiKVxuY29uc3QgbW9uZ29VcmwgPSBgbW9uZ29kYjovLyR7bW9uZ291c2VyfToke21vbmdvUGFzc31AJHttb25nb1NlcnZpY2V9LyR7bW9uZ29EYXRhYmFzZX1gXG5cbmxldCBtb25nb0Nvbm5lY3Rpb24gPSBudWxsO1xuTW9uZ29DbGllbnQuY29ubmVjdChtb25nb1VybCwgKGVyciwgZGIpID0+IHtcblx0aWYgKGVycikge1xuXHRcdGNvbnNvbGUubG9nKFwiRXJyb3Igc2V0dGluZyB1cCBtb25nbyBjb25uZWN0aW9uXCIpXG5cdFx0Y29uc29sZS5sb2coZXJyKVxuXHR9XG5cdGVsc2Uge1xuXHRcdG1vbmdvQ29ubmVjdGlvbiA9IGRiXG5cdFx0ZGVjbGFyZV9yZWFkeShcIm1vbmdvXCIpXG5cdH1cbn0pXG5cbmxldCBhcHAgPSBleHByZXNzKClcbmFwcC51c2UoY29tcHJlc3Npb24oKSlcbmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpXG5hcHAudXNlKGNvcnMoKSlcbmxldCBwb3J0ID0gK3JlcXVpcmVkRW52VmFyKFwiQVBQX0hPU1RcIilcbmxldCBob3N0ID0gcmVxdWlyZWRFbnZWYXIoXCJBUFBfUE9SVFwiKVxubGV0IHNlcnZlciA9IGFwcC5saXN0ZW4ocG9ydCwgaG9zdCwgKCkgPT4ge1xuXHRjb25zb2xlLmxvZyhcIlNlcnZlciBsaXN0ZW5pbmcgdG8gJXM6JWQgd2l0aGluICVzIGVudmlyb25tZW50XCIsIGhvc3QsIHBvcnQsIGFwcC5nZXQoJ2VudicpKVxuXHRkZWNsYXJlX3JlYWR5KFwiZXhwcmVzc1wiKVxufSlcblxuLy8gVXNlIFgtRm9yd2FyZGVkLUZvclxuYXBwLnNldCgndHJ1c3QgcHJveHknLCAnbG9vcGJhY2snKVxuXG5cbmNvbnNvbGUubG9nKFwiU2V0dGluZyB1cCByb3V0ZXNcIilcbmFwcC5wb3N0KFsnL2FwaScsICcvYXBpLyonXSwgKHJlcSwgcmVzKSA9PiB7XG5cdGNvbnN0IGFwaV9yZXF1ZXN0ID0gcmVxLnBhcmFtc1xuXHRjb25zdCBwYXJhbXMgPSByZXEuYm9keVxuXHRjb25zb2xlLmxvZyhhcGlfcmVxdWVzdFswXSlcblx0TG9nKHsgYXBpX3JlcXVlc3QsIHBhcmFtcywgaXBfYWRkcmVzczogcmVxLmlwIH0pXG5cblx0bGV0IHJlc3BvbnNlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHJlc29sdmUoKSlcblx0c3dpdGNoKGFwaV9yZXF1ZXN0WzBdKSB7XG5cdFx0Y2FzZSBcInRlcm0tc2VhcmNoXCI6XG5cdFx0XHRyZXNwb25zZVByb21pc2UgPSB0ZXJtU2VhcmNoKHBhcmFtcywgbW9uZ29Db25uZWN0aW9uKVxuXHRcdFx0YnJlYWtcblx0XHRjYXNlIFwiY29sbG9jYXRpb24tc2VhcmNoXCI6XG5cdFx0XHRyZXNwb25zZVByb21pc2UgPSBjb2xsb2NhdGlvblNlYXJjaChwYXJhbXMpXG5cdFx0XHQvLyByZXNwb25zZSA9IHRlcm1TZWFyY2gocGFyYW1zKSBcblx0XHRcdGJyZWFrXG5cdFx0Y2FzZSBcIndvcmQtc3R1ZHlcIjpcblx0XHRcdC8vIHJlc3BvbnNlID0gdGVybVNlYXJjaChwYXJhbXMpIFxuXHRcdFx0YnJlYWtcblx0XHRjYXNlIFwid29yZC1sb29rdXBcIjpcblx0XHRcdHJlc3BvbnNlUHJvbWlzZSA9IHdvcmRMb29rdXAocGFyYW1zLCBtb25nb0Nvbm5lY3Rpb24pIFxuXHRcdFx0YnJlYWtcblx0XHRjYXNlIFwidGVybS1oaWdobGlnaHRzXCI6XG5cdFx0XHQvLyByZXNwb25zZSA9IHRlcm1TZWFyY2gocGFyYW1zKSBcblx0XHRcdGJyZWFrXG5cdFx0Y2FzZSBcImNoYXB0ZXItdGV4dFwiOlxuXHRcdFx0cmVzcG9uc2VQcm9taXNlID0gY2hhcHRlclRleHQocGFyYW1zLCBtb25nb0Nvbm5lY3Rpb24pXG5cdFx0XHRicmVha1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdHJlamVjdCh7XG5cdFx0XHRcdFx0XCJlcnJvclwiOiBcIkludmFsaWQgYXBpIHJlcXVlc3QuIFJlcXVlc3Qgc2hvdWxkIGJlIGZvcm1hdHRlZCAvYXBpLzx0eXBlIG9mIHJlcXVlc3Q+XCIsXG5cdFx0XHRcdFx0XCJvcHRpb25zXCI6IFtcblx0XHRcdFx0XHRcdFwidGVybS1zZWFyY2hcIixcblx0XHRcdFx0XHRcdFwiY29sbG9jYXRpb24tc2VhcmNoXCIsXG5cdFx0XHRcdFx0XHRcIndvcmQtc3R1ZHlcIixcblx0XHRcdFx0XHRcdFwid29yZC1sb29rdXBcIixcblx0XHRcdFx0XHRcdFwidGVybS1oaWdobGlnaHRzXCIsXG5cdFx0XHRcdFx0XHRcImNoYXB0ZXItdGV4dFwiXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHRcdGJyZWFrXG5cdH1cblx0cmVzcG9uc2VQcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0cmVzLnNlbmQocmVzcG9uc2UpXG5cdH0pLmNhdGNoKChyZXNwb25zZSkgPT4ge1xuXHRcdHJlcy5zZW5kKHJlc3BvbnNlKVxuXHRcdGNvbnNvbGUubG9nKFwiZXJyb3JcIilcblx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSlcblx0fSlcbn0pXG5cblxuLy8gY29uc3QgY2xpZW50Um9vdCA9IFwiLi9jbGllbnQvYnVpbGRcIlxuLy8gY29uc3QgY2xpZW50Um9vdCA9IHJlcXVpcmVkRW52VmFyKFwiUEFSQUJJQkxFX0NMSUVOVF9ESVJcIilcbmNvbnN0IGdldFVybCA9IChtb2JpbGUpID0+IHtcblx0aWYgKG1vYmlsZSlcblx0XHRyZXR1cm4gJy9tb2JpbGUuaHRtbCdcblx0ZWxzZVxuXHRcdHJldHVybiAnL2luZGV4Lmh0bWwnXG59XG5jb25zdCBuZWVkc0ZvbnRzID0gKHVzZXJBZ2VudCkgPT4ge1xuXHQvLyB0ZWNobmljYWxseSB0aGlzIGlzIG5vdCBtb2JpbGUgLSBpdCdzIHdoZXRoZXIgb3Igbm90IHRvIGR1bXAgZm9udHMgaW50byB0aGUgaW5kZXguaHRtbFxuXHRjb25zdCByZWdleEZvck1vYmlsZSA9IHtcblx0XHQvLyBXaW5kb3dzOiAvd2luZG93cyBudC9pLFxuXHRcdFdpbmRvd3NQaG9uZTogL3dpbmRvd3MgcGhvbmUvaSxcblx0XHQvLyBNYWM6IC9tYWNpbnRvc2gvaSxcblx0XHQvLyBMaW51eDogL2xpbnV4L2ksXG5cdFx0V2lpOiAvd2lpL2ksXG5cdFx0UGxheXN0YXRpb246IC9wbGF5c3RhdGlvbi9pLFxuXHRcdGlQYWQ6IC9pcGFkL2ksXG5cdFx0aVBvZDogL2lwb2QvaSxcblx0XHRpUGhvbmU6IC9pcGhvbmUvaSxcblx0XHRBbmRyb2lkOiAvYW5kcm9pZC9pLFxuXHRcdEJsYWNrYmVycnk6IC9ibGFja2JlcnJ5L2ksXG5cdFx0U2Ftc3VuZzogL3NhbXN1bmcvaSxcblx0XHQvLyBDdXJsOiAvY3VybC9pXG5cdFx0TW9iaWxlOiAvbW9iaWxlL2lcblx0fVxuXHRyZXR1cm4gT2JqZWN0LmtleXMocmVnZXhGb3JNb2JpbGUpLnJlZHVjZSgoYSwgaykgPT5cblx0XHRhIHx8IHJlZ2V4Rm9yTW9iaWxlW2tdLnRlc3QodXNlckFnZW50KSxcblx0ZmFsc2UpXG59XG5cbi8vIFJvdXRlIG9yZGVyIG1hdHRlcnMgLSB0aGUgZmlyc3QgbGlzdGVkIHdpbGwgYmUgaW52b2tlZFxuLy8gYXBwLmdldChcIi9cIiwgKHJlcSwgcmVzKSA9PiB7XG4vLyBcdHJlcy5zZW5kRmlsZShnZXRVcmwobmVlZHNGb250cyhyZXEuaGVhZGVyc1tcInVzZXItYWdlbnRcIl0pKSwge3Jvb3Q6IGNsaWVudFJvb3R9KVxuLy8gfSlcbi8vIGFwcC51c2UoZXhwcmVzcy5zdGF0aWMoY2xpZW50Um9vdCkpXG4vLyBhcHAuZ2V0KFwiKlwiLCAocmVxLCByZXMpID0+IHtcbi8vIFx0cmVzLnNlbmRGaWxlKGdldFVybChuZWVkc0ZvbnRzKHJlcS5oZWFkZXJzW1widXNlci1hZ2VudFwiXSkpLCB7cm9vdDogY2xpZW50Um9vdH0pXG4vLyB9KSJdfQ==