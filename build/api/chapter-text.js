'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.chapterText = exports.ridlistText = undefined;

var _book_names = require('../../data/book_names.json');

var _book_names2 = _interopRequireDefault(_book_names);

var _termSearch = require('./term-search');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ridlistText = function ridlistText(ridlist, requestedTextsSet, db) {
	return new Promise(function (resolve, reject) {
		var ridlistResponse = {};
		var cursor = db.collection("verse_data").find({ rid: { $in: ridlist } });
		cursor.each(function (err, doc) {
			if (err) console.log("ERROR", err);
			if (doc != null) {
				ridlistResponse[doc["rid"]] = {};
				if (requestedTextsSet.has("wlc")) ridlistResponse[doc["rid"]]["wlc"] = doc["wlc"];
				if (requestedTextsSet.has("net")) ridlistResponse[doc["rid"]]["net"] = doc["net"];
				if (requestedTextsSet.has("lxx")) ridlistResponse[doc["rid"]]["lxx"] = doc["lxx"];
			} else {
				resolve(ridlistResponse);
			}
		});
	});
};

var chapterText = function chapterText(params, db) {
	var ref = params.reference;

	var requestedTexts = new Set(params["texts"] || []);
	if (!requestedTexts.has("wlc") && !requestedTexts.has("net") && !requestedTexts.has("lxx")) requestedTexts.add("wlc");

	var highlights = {};
	if (params.hasOwnProperty("search_terms")) {
		params.search_terms.forEach(function (st) {
			highlights[st.uid] = (0, _termSearch._wordsThatMatchQuery)(st.data, [ref.book], ref.chapter);
		});
	}

	var minv = _book_names2.default[ref.book] * 10000000 + ref.chapter * 1000;
	var maxv = _book_names2.default[ref.book] * 10000000 + (ref.chapter + 1) * 1000;
	return new Promise(function (resolve, reject) {
		ridlistText(Array.from({ length: maxv - minv }, function (v, k) {
			return k + minv;
		}), requestedTexts, db).then(function (texts) {
			var returnVal = {
				"reference": params.reference,
				"text": texts
			};
			if (Object.keys(highlights).length > 0) returnVal["highlights"] = highlights;
			resolve(returnVal);
		}).catch(function (err) {
			reject(err);
		});
	});
};
exports.ridlistText = ridlistText;
exports.chapterText = chapterText;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvY2hhcHRlci10ZXh0LmpzIl0sIm5hbWVzIjpbInJpZGxpc3RUZXh0IiwicmlkbGlzdCIsInJlcXVlc3RlZFRleHRzU2V0IiwiZGIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJpZGxpc3RSZXNwb25zZSIsImN1cnNvciIsImNvbGxlY3Rpb24iLCJmaW5kIiwicmlkIiwiJGluIiwiZWFjaCIsImVyciIsImRvYyIsImNvbnNvbGUiLCJsb2ciLCJoYXMiLCJjaGFwdGVyVGV4dCIsInBhcmFtcyIsInJlZiIsInJlZmVyZW5jZSIsInJlcXVlc3RlZFRleHRzIiwiU2V0IiwiYWRkIiwiaGlnaGxpZ2h0cyIsImhhc093blByb3BlcnR5Iiwic2VhcmNoX3Rlcm1zIiwiZm9yRWFjaCIsInN0IiwidWlkIiwiZGF0YSIsImJvb2siLCJjaGFwdGVyIiwibWludiIsIm1heHYiLCJBcnJheSIsImZyb20iLCJsZW5ndGgiLCJ2IiwiayIsInRoZW4iLCJ0ZXh0cyIsInJldHVyblZhbCIsIk9iamVjdCIsImtleXMiLCJjYXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxjQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsT0FBRCxFQUFVQyxpQkFBVixFQUE2QkMsRUFBN0IsRUFBb0M7QUFDdkQsUUFBTyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3ZDLE1BQUlDLGtCQUFrQixFQUF0QjtBQUNBLE1BQU1DLFNBQVNMLEdBQUdNLFVBQUgsQ0FBYyxZQUFkLEVBQTRCQyxJQUE1QixDQUFpQyxFQUFFQyxLQUFLLEVBQUVDLEtBQUtYLE9BQVAsRUFBUCxFQUFqQyxDQUFmO0FBQ0FPLFNBQU9LLElBQVAsQ0FBWSxVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUN6QixPQUFJRCxHQUFKLEVBQ0NFLFFBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxHQUFyQjtBQUNELE9BQUlDLE9BQU8sSUFBWCxFQUFpQjtBQUNoQlIsb0JBQWdCUSxJQUFJLEtBQUosQ0FBaEIsSUFBOEIsRUFBOUI7QUFDQSxRQUFJYixrQkFBa0JnQixHQUFsQixDQUFzQixLQUF0QixDQUFKLEVBQ0NYLGdCQUFnQlEsSUFBSSxLQUFKLENBQWhCLEVBQTRCLEtBQTVCLElBQXFDQSxJQUFJLEtBQUosQ0FBckM7QUFDRCxRQUFJYixrQkFBa0JnQixHQUFsQixDQUFzQixLQUF0QixDQUFKLEVBQ0NYLGdCQUFnQlEsSUFBSSxLQUFKLENBQWhCLEVBQTRCLEtBQTVCLElBQXFDQSxJQUFJLEtBQUosQ0FBckM7QUFDRCxRQUFJYixrQkFBa0JnQixHQUFsQixDQUFzQixLQUF0QixDQUFKLEVBQ0NYLGdCQUFnQlEsSUFBSSxLQUFKLENBQWhCLEVBQTRCLEtBQTVCLElBQXFDQSxJQUFJLEtBQUosQ0FBckM7QUFDRCxJQVJELE1BUU87QUFDTlYsWUFBUUUsZUFBUjtBQUNBO0FBQ0QsR0FkRDtBQWVBLEVBbEJNLENBQVA7QUFvQkEsQ0FyQkQ7O0FBdUJBLElBQU1ZLGNBQWMsU0FBZEEsV0FBYyxDQUFDQyxNQUFELEVBQVNqQixFQUFULEVBQWdCO0FBQ25DLEtBQU1rQixNQUFNRCxPQUFPRSxTQUFuQjs7QUFFQSxLQUFJQyxpQkFBaUIsSUFBSUMsR0FBSixDQUFRSixPQUFPLE9BQVAsS0FBbUIsRUFBM0IsQ0FBckI7QUFDQSxLQUFJLENBQUNHLGVBQWVMLEdBQWYsQ0FBbUIsS0FBbkIsQ0FBRCxJQUNGLENBQUNLLGVBQWVMLEdBQWYsQ0FBbUIsS0FBbkIsQ0FEQyxJQUVGLENBQUNLLGVBQWVMLEdBQWYsQ0FBbUIsS0FBbkIsQ0FGSCxFQUdDSyxlQUFlRSxHQUFmLENBQW1CLEtBQW5COztBQUVELEtBQUlDLGFBQWEsRUFBakI7QUFDQSxLQUFJTixPQUFPTyxjQUFQLENBQXNCLGNBQXRCLENBQUosRUFBMkM7QUFDMUNQLFNBQU9RLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLGNBQU07QUFDakNILGNBQVdJLEdBQUdDLEdBQWQsSUFBcUIsc0NBQXFCRCxHQUFHRSxJQUF4QixFQUE4QixDQUFDWCxJQUFJWSxJQUFMLENBQTlCLEVBQTBDWixJQUFJYSxPQUE5QyxDQUFyQjtBQUNBLEdBRkQ7QUFHQTs7QUFJRCxLQUFNQyxPQUFPLHFCQUFXZCxJQUFJWSxJQUFmLElBQXVCLFFBQXZCLEdBQWtDWixJQUFJYSxPQUFKLEdBQWMsSUFBN0Q7QUFDQSxLQUFNRSxPQUFPLHFCQUFXZixJQUFJWSxJQUFmLElBQXVCLFFBQXZCLEdBQWtDLENBQUNaLElBQUlhLE9BQUosR0FBWSxDQUFiLElBQWtCLElBQWpFO0FBQ0EsUUFBTyxJQUFJOUIsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN2Q04sY0FBWXFDLE1BQU1DLElBQU4sQ0FBVyxFQUFDQyxRQUFRSCxPQUFLRCxJQUFkLEVBQVgsRUFBZ0MsVUFBQ0ssQ0FBRCxFQUFJQyxDQUFKO0FBQUEsVUFBVUEsSUFBRU4sSUFBWjtBQUFBLEdBQWhDLENBQVosRUFBK0RaLGNBQS9ELEVBQStFcEIsRUFBL0UsRUFBbUZ1QyxJQUFuRixDQUF3RixVQUFDQyxLQUFELEVBQVc7QUFDbEcsT0FBTUMsWUFBWTtBQUNqQixpQkFBYXhCLE9BQU9FLFNBREg7QUFFakIsWUFBUXFCO0FBRlMsSUFBbEI7QUFJQSxPQUFJRSxPQUFPQyxJQUFQLENBQVlwQixVQUFaLEVBQXdCYSxNQUF4QixHQUFpQyxDQUFyQyxFQUNDSyxVQUFVLFlBQVYsSUFBMEJsQixVQUExQjtBQUNEckIsV0FBUXVDLFNBQVI7QUFDQSxHQVJELEVBUUdHLEtBUkgsQ0FRUyxVQUFDakMsR0FBRCxFQUFTO0FBQ2pCUixVQUFPUSxHQUFQO0FBQ0EsR0FWRDtBQVdBLEVBWk0sQ0FBUDtBQWFBLENBakNEO1FBa0NTZCxXLEdBQUFBLFc7UUFBYW1CLFcsR0FBQUEsVyIsImZpbGUiOiJjaGFwdGVyLXRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYm9va19uYW1lcyBmcm9tICcuLi8uLi9kYXRhL2Jvb2tfbmFtZXMuanNvbidcbmltcG9ydCB7IF93b3Jkc1RoYXRNYXRjaFF1ZXJ5IH0gZnJvbSAnLi90ZXJtLXNlYXJjaCdcblxuY29uc3QgcmlkbGlzdFRleHQgPSAocmlkbGlzdCwgcmVxdWVzdGVkVGV4dHNTZXQsIGRiKSA9PiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0bGV0IHJpZGxpc3RSZXNwb25zZSA9IHt9XG5cdFx0Y29uc3QgY3Vyc29yID0gZGIuY29sbGVjdGlvbihcInZlcnNlX2RhdGFcIikuZmluZCh7IHJpZDogeyAkaW46IHJpZGxpc3QgfSB9KVxuXHRcdGN1cnNvci5lYWNoKChlcnIsIGRvYykgPT4ge1xuXHRcdFx0aWYgKGVycilcblx0XHRcdFx0Y29uc29sZS5sb2coXCJFUlJPUlwiLCBlcnIpXG5cdFx0XHRpZiAoZG9jICE9IG51bGwpIHtcblx0XHRcdFx0cmlkbGlzdFJlc3BvbnNlW2RvY1tcInJpZFwiXV0gPSB7fVxuXHRcdFx0XHRpZiAocmVxdWVzdGVkVGV4dHNTZXQuaGFzKFwid2xjXCIpKVxuXHRcdFx0XHRcdHJpZGxpc3RSZXNwb25zZVtkb2NbXCJyaWRcIl1dW1wid2xjXCJdID0gZG9jW1wid2xjXCJdXG5cdFx0XHRcdGlmIChyZXF1ZXN0ZWRUZXh0c1NldC5oYXMoXCJuZXRcIikpXG5cdFx0XHRcdFx0cmlkbGlzdFJlc3BvbnNlW2RvY1tcInJpZFwiXV1bXCJuZXRcIl0gPSBkb2NbXCJuZXRcIl1cblx0XHRcdFx0aWYgKHJlcXVlc3RlZFRleHRzU2V0LmhhcyhcImx4eFwiKSlcblx0XHRcdFx0XHRyaWRsaXN0UmVzcG9uc2VbZG9jW1wicmlkXCJdXVtcImx4eFwiXSA9IGRvY1tcImx4eFwiXVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzb2x2ZShyaWRsaXN0UmVzcG9uc2UpXG5cdFx0XHR9XG5cdFx0fSlcblx0fSlcblxufVxuXG5jb25zdCBjaGFwdGVyVGV4dCA9IChwYXJhbXMsIGRiKSA9PiB7XG5cdGNvbnN0IHJlZiA9IHBhcmFtcy5yZWZlcmVuY2VcblxuXHRsZXQgcmVxdWVzdGVkVGV4dHMgPSBuZXcgU2V0KHBhcmFtc1tcInRleHRzXCJdIHx8IFtdKVxuXHRpZiAoIXJlcXVlc3RlZFRleHRzLmhhcyhcIndsY1wiKSAmJiBcblx0XHRcdCFyZXF1ZXN0ZWRUZXh0cy5oYXMoXCJuZXRcIikgJiYgXG5cdFx0XHQhcmVxdWVzdGVkVGV4dHMuaGFzKFwibHh4XCIpKVxuXHRcdHJlcXVlc3RlZFRleHRzLmFkZChcIndsY1wiKVxuXG5cdGxldCBoaWdobGlnaHRzID0ge31cblx0aWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInNlYXJjaF90ZXJtc1wiKSkge1xuXHRcdHBhcmFtcy5zZWFyY2hfdGVybXMuZm9yRWFjaChzdCA9PiB7XG5cdFx0XHRoaWdobGlnaHRzW3N0LnVpZF0gPSBfd29yZHNUaGF0TWF0Y2hRdWVyeShzdC5kYXRhLCBbcmVmLmJvb2tdLCByZWYuY2hhcHRlcilcblx0XHR9KVxuXHR9XG5cblxuXHRcblx0Y29uc3QgbWludiA9IGJvb2tfbmFtZXNbcmVmLmJvb2tdICogMTAwMDAwMDAgKyByZWYuY2hhcHRlciAqIDEwMDBcblx0Y29uc3QgbWF4diA9IGJvb2tfbmFtZXNbcmVmLmJvb2tdICogMTAwMDAwMDAgKyAocmVmLmNoYXB0ZXIrMSkgKiAxMDAwXG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0cmlkbGlzdFRleHQoQXJyYXkuZnJvbSh7bGVuZ3RoOiBtYXh2LW1pbnZ9LCAodiwgaykgPT4gayttaW52KSwgcmVxdWVzdGVkVGV4dHMsIGRiKS50aGVuKCh0ZXh0cykgPT4ge1xuXHRcdFx0Y29uc3QgcmV0dXJuVmFsID0ge1xuXHRcdFx0XHRcInJlZmVyZW5jZVwiOiBwYXJhbXMucmVmZXJlbmNlLFxuXHRcdFx0XHRcInRleHRcIjogdGV4dHNcblx0XHRcdH1cblx0XHRcdGlmIChPYmplY3Qua2V5cyhoaWdobGlnaHRzKS5sZW5ndGggPiAwKVxuXHRcdFx0XHRyZXR1cm5WYWxbXCJoaWdobGlnaHRzXCJdID0gaGlnaGxpZ2h0c1xuXHRcdFx0cmVzb2x2ZShyZXR1cm5WYWwpXG5cdFx0fSkuY2F0Y2goKGVycikgPT4ge1xuXHRcdFx0cmVqZWN0KGVycilcblx0XHR9KVxuXHR9KVxufVxuZXhwb3J0IHsgcmlkbGlzdFRleHQsIGNoYXB0ZXJUZXh0IH1cbiJdfQ==