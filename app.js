
/*архитекстура проекта включает три модуля. Первый модуль взаимодействует с данными, 
производит мат вычисления, второй модуль взаимодействует с пользовательским интерфейсом,
третий модуль является контроллером, с помощью которого два других модуля взаимодействуют
друг с другом
 */


//Первый модуль - Контроллер Бюджета
var budgetController = (function () {


	//Конструктор дохода
	var Income = function(id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;
	};

	//Конструктор расхода
	var Expense = function(id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;
	};


	//Объект, в котором хранятся все данные
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
		inputBtn: '.add__btn',
		incContainer: '.income__list',
		expContainer: '.expenses__list'

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
		},

		addListItem: function(obj, type) {

			var html, newHtml, element;

			if(type === 'inc') {

				element = DOMStrings.incContainer;

				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			} else if (type === 'exp') {

				element = DOMStrings.expContainer;

				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			}


			newHtml = html.replace('%id%', obj.id);

			newHtml = newHtml.replace('%description%', obj.description);

			newHtml = newHtml.replace('%value%', obj.value);

			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


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


		//Получаем данные от пользователя
		input = UI.getInput();

		//Создаем объект(расход либо доход) на основе полученных от пользователя данных и добавляем его в контроллер бюджета

		newItem = budget.addItem(input.type, input.description, input.value);

		//Выводим полученные от пользователя данные в интерфейс

		UI.addListItem(newItem, input.type);

		//Подсчитываем бюджет


		//Выводим бюджет в интрфейс





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