"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.chapterText = exports.ridlistText = undefined;

var _book_names = require("../../data/book_names.json");

var _book_names2 = _interopRequireDefault(_book_names);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ridlistText = function ridlistText(ridlist, requested_texts_set, db) {
	return new Promise(function (resolve, reject) {
		var ridlistResponse = {};
		var cursor = db.collection("verse_data").find({ rid: { $in: ridlist } });
		console.log("busy processing cursor");
		cursor.each(function (err, doc) {
			if (doc != null) {
				ridlistResponse[doc["rid"]] = {};
				if (requested_texts_set.has("wlc")) ridlistResponse[doc["rid"]]["wlc"] = doc["wlc"];
				if (requested_texts_set.has("net")) ridlistResponse[doc["rid"]]["net"] = doc["net"];
				if (requested_texts_set.has("lxx")) ridlistResponse[doc["rid"]]["lxx"] = doc["lxx"];
			} else {
				resolve(ridlistResponse);
			}
		});
	});
};

var chapterText = function chapterText(params, db) {
	var requested_texts = new Set(params["texts"] || []);
	if (!requested_texts.has("wlc") && !requested_texts.has("net") && !requested_texts.has("lxx")) requested_texts.add("wlc");

	var ref = params.reference;
	var minv = _book_names2.default[ref.book] * 10000000 + ref.chapter * 1000;
	var maxv = _book_names2.default[ref.book] * 10000000 + (ref.chapter + 1) * 1000;
	return new Promise(function (resolve, reject) {
		ridlistText(Array.from({ length: maxv - minv }, function (v, k) {
			return k + minv;
		}), requested_texts, db).then(function (texts) {
			resolve({
				"reference": params.reference,
				"text": texts
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};
exports.ridlistText = ridlistText;
exports.chapterText = chapterText;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvY2hhcHRlci10ZXh0LmpzIl0sIm5hbWVzIjpbInJpZGxpc3RUZXh0IiwicmlkbGlzdCIsInJlcXVlc3RlZF90ZXh0c19zZXQiLCJkYiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmlkbGlzdFJlc3BvbnNlIiwiY3Vyc29yIiwiY29sbGVjdGlvbiIsImZpbmQiLCJyaWQiLCIkaW4iLCJjb25zb2xlIiwibG9nIiwiZWFjaCIsImVyciIsImRvYyIsImhhcyIsImNoYXB0ZXJUZXh0IiwicGFyYW1zIiwicmVxdWVzdGVkX3RleHRzIiwiU2V0IiwiYWRkIiwicmVmIiwicmVmZXJlbmNlIiwibWludiIsImJvb2siLCJjaGFwdGVyIiwibWF4diIsIkFycmF5IiwiZnJvbSIsImxlbmd0aCIsInYiLCJrIiwidGhlbiIsInRleHRzIiwiY2F0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsY0FBYyxTQUFkQSxXQUFjLENBQUNDLE9BQUQsRUFBVUMsbUJBQVYsRUFBK0JDLEVBQS9CLEVBQXNDO0FBQ3pELFFBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN2QyxNQUFJQyxrQkFBa0IsRUFBdEI7QUFDQSxNQUFNQyxTQUFTTCxHQUFHTSxVQUFILENBQWMsWUFBZCxFQUE0QkMsSUFBNUIsQ0FBaUMsRUFBRUMsS0FBSyxFQUFFQyxLQUFLWCxPQUFQLEVBQVAsRUFBakMsQ0FBZjtBQUNBWSxVQUFRQyxHQUFSLENBQVksd0JBQVo7QUFDQU4sU0FBT08sSUFBUCxDQUFZLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3pCLE9BQUlBLE9BQU8sSUFBWCxFQUFpQjtBQUNoQlYsb0JBQWdCVSxJQUFJLEtBQUosQ0FBaEIsSUFBOEIsRUFBOUI7QUFDQSxRQUFJZixvQkFBb0JnQixHQUFwQixDQUF3QixLQUF4QixDQUFKLEVBQ0NYLGdCQUFnQlUsSUFBSSxLQUFKLENBQWhCLEVBQTRCLEtBQTVCLElBQXFDQSxJQUFJLEtBQUosQ0FBckM7QUFDRCxRQUFJZixvQkFBb0JnQixHQUFwQixDQUF3QixLQUF4QixDQUFKLEVBQ0NYLGdCQUFnQlUsSUFBSSxLQUFKLENBQWhCLEVBQTRCLEtBQTVCLElBQXFDQSxJQUFJLEtBQUosQ0FBckM7QUFDRCxRQUFJZixvQkFBb0JnQixHQUFwQixDQUF3QixLQUF4QixDQUFKLEVBQ0NYLGdCQUFnQlUsSUFBSSxLQUFKLENBQWhCLEVBQTRCLEtBQTVCLElBQXFDQSxJQUFJLEtBQUosQ0FBckM7QUFDRCxJQVJELE1BUU87QUFDTlosWUFBUUUsZUFBUjtBQUNBO0FBQ0QsR0FaRDtBQWFBLEVBakJNLENBQVA7QUFtQkEsQ0FwQkQ7O0FBc0JBLElBQU1ZLGNBQWMsU0FBZEEsV0FBYyxDQUFDQyxNQUFELEVBQVNqQixFQUFULEVBQWdCO0FBQ25DLEtBQUlrQixrQkFBa0IsSUFBSUMsR0FBSixDQUFRRixPQUFPLE9BQVAsS0FBbUIsRUFBM0IsQ0FBdEI7QUFDQSxLQUFJLENBQUNDLGdCQUFnQkgsR0FBaEIsQ0FBb0IsS0FBcEIsQ0FBRCxJQUNGLENBQUNHLGdCQUFnQkgsR0FBaEIsQ0FBb0IsS0FBcEIsQ0FEQyxJQUVGLENBQUNHLGdCQUFnQkgsR0FBaEIsQ0FBb0IsS0FBcEIsQ0FGSCxFQUdDRyxnQkFBZ0JFLEdBQWhCLENBQW9CLEtBQXBCOztBQUVELEtBQU1DLE1BQU1KLE9BQU9LLFNBQW5CO0FBQ0EsS0FBTUMsT0FBTyxxQkFBV0YsSUFBSUcsSUFBZixJQUF1QixRQUF2QixHQUFrQ0gsSUFBSUksT0FBSixHQUFjLElBQTdEO0FBQ0EsS0FBTUMsT0FBTyxxQkFBV0wsSUFBSUcsSUFBZixJQUF1QixRQUF2QixHQUFrQyxDQUFDSCxJQUFJSSxPQUFKLEdBQVksQ0FBYixJQUFrQixJQUFqRTtBQUNBLFFBQU8sSUFBSXhCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdkNOLGNBQVk4QixNQUFNQyxJQUFOLENBQVcsRUFBQ0MsUUFBUUgsT0FBS0gsSUFBZCxFQUFYLEVBQWdDLFVBQUNPLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFVBQVVBLElBQUVSLElBQVo7QUFBQSxHQUFoQyxDQUFaLEVBQStETCxlQUEvRCxFQUFnRmxCLEVBQWhGLEVBQW9GZ0MsSUFBcEYsQ0FBeUYsVUFBQ0MsS0FBRCxFQUFXO0FBQ25HL0IsV0FBUTtBQUNQLGlCQUFhZSxPQUFPSyxTQURiO0FBRVAsWUFBUVc7QUFGRCxJQUFSO0FBSUEsR0FMRCxFQUtHQyxLQUxILENBS1MsVUFBQ3JCLEdBQUQsRUFBUztBQUNqQlYsVUFBT1UsR0FBUDtBQUNBLEdBUEQ7QUFRQSxFQVRNLENBQVA7QUFVQSxDQXBCRDtRQXFCU2hCLFcsR0FBQUEsVztRQUFhbUIsVyxHQUFBQSxXIiwiZmlsZSI6ImNoYXB0ZXItdGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBib29rX25hbWVzIGZyb20gJy4uLy4uL2RhdGEvYm9va19uYW1lcy5qc29uJ1xuXG5jb25zdCByaWRsaXN0VGV4dCA9IChyaWRsaXN0LCByZXF1ZXN0ZWRfdGV4dHNfc2V0LCBkYikgPT4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGxldCByaWRsaXN0UmVzcG9uc2UgPSB7fVxuXHRcdGNvbnN0IGN1cnNvciA9IGRiLmNvbGxlY3Rpb24oXCJ2ZXJzZV9kYXRhXCIpLmZpbmQoeyByaWQ6IHsgJGluOiByaWRsaXN0IH0gfSlcblx0XHRjb25zb2xlLmxvZyhcImJ1c3kgcHJvY2Vzc2luZyBjdXJzb3JcIilcblx0XHRjdXJzb3IuZWFjaCgoZXJyLCBkb2MpID0+IHtcblx0XHRcdGlmIChkb2MgIT0gbnVsbCkge1xuXHRcdFx0XHRyaWRsaXN0UmVzcG9uc2VbZG9jW1wicmlkXCJdXSA9IHt9XG5cdFx0XHRcdGlmIChyZXF1ZXN0ZWRfdGV4dHNfc2V0LmhhcyhcIndsY1wiKSlcblx0XHRcdFx0XHRyaWRsaXN0UmVzcG9uc2VbZG9jW1wicmlkXCJdXVtcIndsY1wiXSA9IGRvY1tcIndsY1wiXVxuXHRcdFx0XHRpZiAocmVxdWVzdGVkX3RleHRzX3NldC5oYXMoXCJuZXRcIikpXG5cdFx0XHRcdFx0cmlkbGlzdFJlc3BvbnNlW2RvY1tcInJpZFwiXV1bXCJuZXRcIl0gPSBkb2NbXCJuZXRcIl1cblx0XHRcdFx0aWYgKHJlcXVlc3RlZF90ZXh0c19zZXQuaGFzKFwibHh4XCIpKVxuXHRcdFx0XHRcdHJpZGxpc3RSZXNwb25zZVtkb2NbXCJyaWRcIl1dW1wibHh4XCJdID0gZG9jW1wibHh4XCJdXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXNvbHZlKHJpZGxpc3RSZXNwb25zZSlcblx0XHRcdH1cblx0XHR9KVxuXHR9KVxuXG59XG5cbmNvbnN0IGNoYXB0ZXJUZXh0ID0gKHBhcmFtcywgZGIpID0+IHtcblx0bGV0IHJlcXVlc3RlZF90ZXh0cyA9IG5ldyBTZXQocGFyYW1zW1widGV4dHNcIl0gfHwgW10pXG5cdGlmICghcmVxdWVzdGVkX3RleHRzLmhhcyhcIndsY1wiKSAmJiBcblx0XHRcdCFyZXF1ZXN0ZWRfdGV4dHMuaGFzKFwibmV0XCIpICYmIFxuXHRcdFx0IXJlcXVlc3RlZF90ZXh0cy5oYXMoXCJseHhcIikpXG5cdFx0cmVxdWVzdGVkX3RleHRzLmFkZChcIndsY1wiKVxuXG5cdGNvbnN0IHJlZiA9IHBhcmFtcy5yZWZlcmVuY2Vcblx0Y29uc3QgbWludiA9IGJvb2tfbmFtZXNbcmVmLmJvb2tdICogMTAwMDAwMDAgKyByZWYuY2hhcHRlciAqIDEwMDBcblx0Y29uc3QgbWF4diA9IGJvb2tfbmFtZXNbcmVmLmJvb2tdICogMTAwMDAwMDAgKyAocmVmLmNoYXB0ZXIrMSkgKiAxMDAwXG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0cmlkbGlzdFRleHQoQXJyYXkuZnJvbSh7bGVuZ3RoOiBtYXh2LW1pbnZ9LCAodiwgaykgPT4gayttaW52KSwgcmVxdWVzdGVkX3RleHRzLCBkYikudGhlbigodGV4dHMpID0+IHtcblx0XHRcdHJlc29sdmUoe1xuXHRcdFx0XHRcInJlZmVyZW5jZVwiOiBwYXJhbXMucmVmZXJlbmNlLFxuXHRcdFx0XHRcInRleHRcIjogdGV4dHNcblx0XHRcdH0pXG5cdFx0fSkuY2F0Y2goKGVycikgPT4ge1xuXHRcdFx0cmVqZWN0KGVycilcblx0XHR9KVxuXHR9KVxufVxuZXhwb3J0IHsgcmlkbGlzdFRleHQsIGNoYXB0ZXJUZXh0IH1cbiJdfQ==