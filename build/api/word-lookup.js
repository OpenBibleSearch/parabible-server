"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var to_exclude = new Set(["wid", "trailer_utf8"]);

var wordLookup = function wordLookup(params, db) {
	return new Promise(function (resolve, reject) {
		// validate param
		if (!params.hasOwnProperty("wid")) {
			reject({ "error": "Invalid request, needs an object like { wid: n }." });
		} else if (!Number.isInteger(params.wid) || params.wid < 1) {
			reject({ "error": "Invalid wid, must be a positive integer." });
		} else {
			var cursor = db.collection("word_data").findOne({ wid: params.wid }, function (err, doc) {
				if (err) {
					console.log("error with wid lookup");
					reject(err);
				}
				if (!doc) {
					console.log("no doc:", doc);
					reject("wid not found");
				}
				var features = doc["features"];
				to_exclude.forEach(function (e) {
					if (features.hasOwnProperty(e)) delete features[e];
				});
				resolve({
					"wid": params.wid,
					"results": features
				});
			});
		}
	});
};
exports.wordLookup = wordLookup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvd29yZC1sb29rdXAuanMiXSwibmFtZXMiOlsidG9fZXhjbHVkZSIsIlNldCIsIndvcmRMb29rdXAiLCJwYXJhbXMiLCJkYiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiaGFzT3duUHJvcGVydHkiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ3aWQiLCJjdXJzb3IiLCJjb2xsZWN0aW9uIiwiZmluZE9uZSIsImVyciIsImRvYyIsImNvbnNvbGUiLCJsb2ciLCJmZWF0dXJlcyIsImZvckVhY2giLCJlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQU1BLGFBQWEsSUFBSUMsR0FBSixDQUFRLENBQzFCLEtBRDBCLEVBRTFCLGNBRjBCLENBQVIsQ0FBbkI7O0FBS0EsSUFBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUNDLE1BQUQsRUFBU0MsRUFBVCxFQUFnQjtBQUNsQyxRQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdkM7QUFDQSxNQUFJLENBQUNKLE9BQU9LLGNBQVAsQ0FBc0IsS0FBdEIsQ0FBTCxFQUFtQztBQUNsQ0QsVUFBTyxFQUFDLFNBQVMsbURBQVYsRUFBUDtBQUNBLEdBRkQsTUFHSyxJQUFJLENBQUNFLE9BQU9DLFNBQVAsQ0FBaUJQLE9BQU9RLEdBQXhCLENBQUQsSUFBaUNSLE9BQU9RLEdBQVAsR0FBYSxDQUFsRCxFQUFxRDtBQUN6REosVUFBTyxFQUFDLFNBQVMsMENBQVYsRUFBUDtBQUNBLEdBRkksTUFHQTtBQUNKLE9BQU1LLFNBQVNSLEdBQUdTLFVBQUgsQ0FBYyxXQUFkLEVBQTJCQyxPQUEzQixDQUFtQyxFQUFFSCxLQUFLUixPQUFPUSxHQUFkLEVBQW5DLEVBQXdELFVBQUNJLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3BGLFFBQUlELEdBQUosRUFBUztBQUNSRSxhQUFRQyxHQUFSLENBQVksdUJBQVo7QUFDQVgsWUFBT1EsR0FBUDtBQUNBO0FBQ0QsUUFBSSxDQUFDQyxHQUFMLEVBQVU7QUFDVEMsYUFBUUMsR0FBUixDQUFZLFNBQVosRUFBdUJGLEdBQXZCO0FBQ0FULFlBQU8sZUFBUDtBQUNBO0FBQ0QsUUFBSVksV0FBV0gsSUFBSSxVQUFKLENBQWY7QUFDQWhCLGVBQVdvQixPQUFYLENBQW1CLGFBQUs7QUFDdkIsU0FBSUQsU0FBU1gsY0FBVCxDQUF3QmEsQ0FBeEIsQ0FBSixFQUNDLE9BQU9GLFNBQVNFLENBQVQsQ0FBUDtBQUNELEtBSEQ7QUFJQWYsWUFBUTtBQUNQLFlBQU9ILE9BQU9RLEdBRFA7QUFFUCxnQkFBV1E7QUFGSixLQUFSO0FBSUEsSUFsQmMsQ0FBZjtBQW1CQTtBQUNELEVBN0JNLENBQVA7QUE4QkEsQ0EvQkQ7UUFnQ1NqQixVLEdBQUFBLFUiLCJmaWxlIjoid29yZC1sb29rdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0b19leGNsdWRlID0gbmV3IFNldChbXG5cdFwid2lkXCIsXG5cdFwidHJhaWxlcl91dGY4XCJcbl0pXG5cbmNvbnN0IHdvcmRMb29rdXAgPSAocGFyYW1zLCBkYikgPT4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdC8vIHZhbGlkYXRlIHBhcmFtXG5cdFx0aWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoXCJ3aWRcIikpIHtcblx0XHRcdHJlamVjdCh7XCJlcnJvclwiOiBcIkludmFsaWQgcmVxdWVzdCwgbmVlZHMgYW4gb2JqZWN0IGxpa2UgeyB3aWQ6IG4gfS5cIn0pXG5cdFx0fVxuXHRcdGVsc2UgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHBhcmFtcy53aWQpIHx8IHBhcmFtcy53aWQgPCAxKSB7XG5cdFx0XHRyZWplY3Qoe1wiZXJyb3JcIjogXCJJbnZhbGlkIHdpZCwgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCJ9KVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNvbnN0IGN1cnNvciA9IGRiLmNvbGxlY3Rpb24oXCJ3b3JkX2RhdGFcIikuZmluZE9uZSh7IHdpZDogcGFyYW1zLndpZCB9LCAoZXJyLCBkb2MpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiZXJyb3Igd2l0aCB3aWQgbG9va3VwXCIpXG5cdFx0XHRcdFx0cmVqZWN0KGVycilcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWRvYykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwibm8gZG9jOlwiLCBkb2MpXG5cdFx0XHRcdFx0cmVqZWN0KFwid2lkIG5vdCBmb3VuZFwiKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCBmZWF0dXJlcyA9IGRvY1tcImZlYXR1cmVzXCJdXG5cdFx0XHRcdHRvX2V4Y2x1ZGUuZm9yRWFjaChlID0+IHtcblx0XHRcdFx0XHRpZiAoZmVhdHVyZXMuaGFzT3duUHJvcGVydHkoZSkpXG5cdFx0XHRcdFx0XHRkZWxldGUgZmVhdHVyZXNbZV1cblx0XHRcdFx0fSlcblx0XHRcdFx0cmVzb2x2ZSh7XG5cdFx0XHRcdFx0XCJ3aWRcIjogcGFyYW1zLndpZCxcblx0XHRcdFx0XHRcInJlc3VsdHNcIjogZmVhdHVyZXNcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cdFx0fVxuXHR9KVxufVxuZXhwb3J0IHsgd29yZExvb2t1cCB9Il19