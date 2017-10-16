
/*архитекстура проекта включает три модуля. Первый модуль взаимодействует с данными, 
производит мат вычисления, второй модуль взаимодействует с пользовательским интерфейсом,
третий модуль является контроллером, с помощью которого два других модуля взаимодействуют
друг с другом
 */


//Первый модуль - Контроллер Бюджета
var budgetController = (function () {

	var Income = function(id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Expense = function(id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			inc: [],
			exp: []
		},

		totals: {
			exp: 0,
			inc: 0
		}
	};

	return {

		addItem: function(type, desc, val) {

			var newItem, ID;

			if (data.allItems[type].length > 0) {

				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {

				ID = 0;
			}

			

			if (type === 'inc') {

				newItem = new Income(ID, desc, val);
			} else if (type === 'exp') {

				newItem = new Expense(ID, desc, val);
			}

			data.allItems[type].push(newItem);
			return newItem;
		},

		test: function() {
			console.log(data);
		}
	};

	
})();

//Второй модуль - контроллер пользовательского интерфейса

var UIController = (function() {

	var DOMStrings = {
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'

	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDesc).value,
				value: document.querySelector(DOMStrings.inputValue).value
			}
		},

		getDOMStrings: function() {
			return DOMStrings;
		}

	}
})();


//Третий модуль - контроллер(обеспечивает взаимодействие двух других модулей)
var controller = (function(budget, UI) {

	var setupEventListeners = function() {
		var DOM = UI.getDOMStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', eventCtrl);


		document.addEventListener('keypress', function(event) {
			if (event.keyCode === 13 || event.which === 13) {

			eventCtrl();
		}
	});

	};

	

	var eventCtrl = function () {
		var input, newItem;


		input = UI.getInput();

		newItem = budget.addItem(input.type, input.description, input.value);

		console.log(input);
	};



	return {
		init: function() {
			console.log('START!');
			setupEventListeners();
		}
	};

	


	

})(budgetController, UIController);



controller.init();