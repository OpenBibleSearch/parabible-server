"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var removeValue = function removeValue(value) {
	return function (array_to_purge) {
		var to_return = array_to_purge.slice();
		var index = to_return.indexOf(value);
		if (index > -1) to_return.splice(index, 1);
		return to_return;
	};
};

var uniqueValuePerArray = function uniqueValuePerArray(arrays) {
	if (arrays.length === 1) {
		return arrays[0].length > 0 ? arrays[0][0] : false;
	} else {
		var array_slice = arrays.slice(1);
		for (var i in arrays[0]) {
			var test_value = arrays[0][i];
			var trial_array = array_slice.map(removeValue(test_value));
			var trial = uniqueValuePerArray(trial_array);
			if (trial !== false) {
				return test_value + " " + trial;
			}
		}
		return false;
	}
};

exports.uniqueValuePerArray = uniqueValuePerArray;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3VuaXF1ZVZhbHVlUGVyQXJyYXkuanMiXSwibmFtZXMiOlsicmVtb3ZlVmFsdWUiLCJ2YWx1ZSIsImFycmF5X3RvX3B1cmdlIiwidG9fcmV0dXJuIiwic2xpY2UiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJ1bmlxdWVWYWx1ZVBlckFycmF5IiwiYXJyYXlzIiwibGVuZ3RoIiwiYXJyYXlfc2xpY2UiLCJpIiwidGVzdF92YWx1ZSIsInRyaWFsX2FycmF5IiwibWFwIiwidHJpYWwiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTUEsY0FBYyxTQUFkQSxXQUFjLENBQUNDLEtBQUQsRUFBVztBQUM5QixRQUFPLFVBQUNDLGNBQUQsRUFBb0I7QUFDMUIsTUFBTUMsWUFBWUQsZUFBZUUsS0FBZixFQUFsQjtBQUNBLE1BQU1DLFFBQVFGLFVBQVVHLE9BQVYsQ0FBa0JMLEtBQWxCLENBQWQ7QUFDQSxNQUFJSSxRQUFRLENBQUMsQ0FBYixFQUNDRixVQUFVSSxNQUFWLENBQWlCRixLQUFqQixFQUF3QixDQUF4QjtBQUNELFNBQU9GLFNBQVA7QUFDQSxFQU5EO0FBT0EsQ0FSRDs7QUFVQSxJQUFNSyxzQkFBc0IsU0FBdEJBLG1CQUFzQixDQUFDQyxNQUFELEVBQVk7QUFDdkMsS0FBSUEsT0FBT0MsTUFBUCxLQUFrQixDQUF0QixFQUF5QjtBQUN4QixTQUFPRCxPQUFPLENBQVAsRUFBVUMsTUFBVixHQUFtQixDQUFuQixHQUF1QkQsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUF2QixHQUFzQyxLQUE3QztBQUNBLEVBRkQsTUFHSztBQUNKLE1BQU1FLGNBQWNGLE9BQU9MLEtBQVAsQ0FBYSxDQUFiLENBQXBCO0FBQ0EsT0FBSyxJQUFJUSxDQUFULElBQWNILE9BQU8sQ0FBUCxDQUFkLEVBQXlCO0FBQ3hCLE9BQU1JLGFBQWFKLE9BQU8sQ0FBUCxFQUFVRyxDQUFWLENBQW5CO0FBQ0EsT0FBTUUsY0FBY0gsWUFBWUksR0FBWixDQUFnQmYsWUFBWWEsVUFBWixDQUFoQixDQUFwQjtBQUNBLE9BQU1HLFFBQVFSLG9CQUFvQk0sV0FBcEIsQ0FBZDtBQUNBLE9BQUlFLFVBQVUsS0FBZCxFQUFxQjtBQUNwQixXQUFPSCxhQUFhLEdBQWIsR0FBbUJHLEtBQTFCO0FBQ0E7QUFDRDtBQUNELFNBQU8sS0FBUDtBQUNBO0FBQ0QsQ0FoQkQ7O1FBa0JTUixtQixHQUFBQSxtQiIsImZpbGUiOiJ1bmlxdWVWYWx1ZVBlckFycmF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcmVtb3ZlVmFsdWUgPSAodmFsdWUpID0+IHtcblx0cmV0dXJuIChhcnJheV90b19wdXJnZSkgPT4ge1xuXHRcdGNvbnN0IHRvX3JldHVybiA9IGFycmF5X3RvX3B1cmdlLnNsaWNlKClcblx0XHRjb25zdCBpbmRleCA9IHRvX3JldHVybi5pbmRleE9mKHZhbHVlKVxuXHRcdGlmIChpbmRleCA+IC0xKVxuXHRcdFx0dG9fcmV0dXJuLnNwbGljZShpbmRleCwgMSlcblx0XHRyZXR1cm4gdG9fcmV0dXJuXG5cdH1cbn1cblxuY29uc3QgdW5pcXVlVmFsdWVQZXJBcnJheSA9IChhcnJheXMpID0+IHtcblx0aWYgKGFycmF5cy5sZW5ndGggPT09IDEpIHtcblx0XHRyZXR1cm4gYXJyYXlzWzBdLmxlbmd0aCA+IDAgPyBhcnJheXNbMF1bMF0gOiBmYWxzZVxuXHR9XG5cdGVsc2Uge1xuXHRcdGNvbnN0IGFycmF5X3NsaWNlID0gYXJyYXlzLnNsaWNlKDEpXG5cdFx0Zm9yIChsZXQgaSBpbiBhcnJheXNbMF0pIHtcblx0XHRcdGNvbnN0IHRlc3RfdmFsdWUgPSBhcnJheXNbMF1baV1cblx0XHRcdGNvbnN0IHRyaWFsX2FycmF5ID0gYXJyYXlfc2xpY2UubWFwKHJlbW92ZVZhbHVlKHRlc3RfdmFsdWUpKVxuXHRcdFx0Y29uc3QgdHJpYWwgPSB1bmlxdWVWYWx1ZVBlckFycmF5KHRyaWFsX2FycmF5KVxuXHRcdFx0aWYgKHRyaWFsICE9PSBmYWxzZSkge1xuXHRcdFx0XHRyZXR1cm4gdGVzdF92YWx1ZSArIFwiIFwiICsgdHJpYWxcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cbn1cblxuZXhwb3J0IHsgdW5pcXVlVmFsdWVQZXJBcnJheSB9Il19