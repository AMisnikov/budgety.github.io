
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
		this.percentage = -1;
	};


	Expense.prototype.calcPercentage = function(totalIncome){

		if (totalIncome > 0) {
			this.percentage = Math.round((this.value/totalIncome)*100);
		} else {

			this.percentage = -1;
		}

	Expense.prototype.getPercentage = function () {

		return this.percentage;
	}

		
		
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
		},

		budget: 0,
		percentage: -1
	};


	var calculateTotal = function (type) {

		var sum = 0;


		data.allItems[type].forEach( function(element) {
			
			sum += element.value;

		});

		data.totals[type] = sum;
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

		deleteItem: function(type, id) {

			var ids, index;


			ids = data.allItems[type].map(function(element){
				return element.id;

			});

			console.log(ids);

			index = ids.indexOf(id);

			if (index !== -1) {

				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function () {

			//Считаем  доходы

			calculateTotal('inc');

			//Считаем расходы

			calculateTotal('exp');

			//Считаем бюджет

			data.budget = data.totals.inc - data.totals.exp;
			//Считаем процент расходов от дохода
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
			} else {
				data.percentage = -1;
			}
			
		},

		calculatePercantages: function() {

			data.allItems.exp.forEach( function(element) {
				
				element.calcPercentage(data.totals.inc);
			});

		},

		getPercentages: function (){

			var allPerc = data.allItems.exp.map(function(element){

				return element.getPercentage();

			});

			return allPerc;
		},

		getBudget: function() {

			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		test: function() {
			console.log(data);
		}


		/*calc: function(type, value) {


			data.totals[type] += value;
			console.log(data.totals);


			return {

				totalExp: data.totals.exp,
				totalInc: data.totals.inc

			}



		}*/




		
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
		expContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		expenseLabel: '.budget__expenses--value',
		incomeLabel: '.budget__income--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensePercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'

	};


	var formatNumbers = function(num, type) {

			var numSplit, int, dec, sign;

			num = Math.abs(num);

			num = num.toFixed(2);

			numSplit = num.split('.');

			int = numSplit[0];

			if (int.length > 6) {

				int = int.substr(0, int.length - 6) + ',' + int.substr(int.length - 6 , 3) + ',' + int.substr(int.length - 3 , 3);
				
			} else if (int.length > 3) {

				int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3 , 3);

			}

			dec = numSplit[1];

			type === 'exp' ? sign = '-' : sign = '+';

			return sign + ' ' + int + '.' + dec;

		};


		var nodeListForEach = function(list, callback){

				for (var i = 0; i < list.length; i++) {

					callback(list[i], i);
				}

			};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDesc).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			}
		},

		changeType: function() {

			var fields = document.querySelectorAll(

					DOMStrings.inputType + ',' +
					DOMStrings.inputDesc + ',' + 
					DOMStrings.inputValue
				);

			nodeListForEach(fields, function(el){

				el.classList.toggle('red-focus');
			});


			document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
		},

		displayDate: function() {

			var now, year, month, months;

			now = new Date();

			months = ['January', 'February', 'March', 'April','May','June','July', 'August', 
			'September', 'October', 'November','December']

			year = now.getFullYear();

			month = now.getMonth();


			document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
		},



		getDOMStrings: function() {
			return DOMStrings;
		},

		addListItem: function(obj, type) {

			var html, newHtml, element;

			if(type === 'inc') {

				element = DOMStrings.incContainer;

				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			} else if (type === 'exp') {

				element = DOMStrings.expContainer;

				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			}


			newHtml = html.replace('%id%', obj.id);

			newHtml = newHtml.replace('%description%', obj.description);

			newHtml = newHtml.replace('%value%', formatNumbers(obj.value, type));

			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


		},

		deleteListItem: function(selectorID){

				var element = document.getElementById(selectorID);

				element.parentNode.removeChild(element);

		},

		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMStrings.inputDesc + ',' + DOMStrings.inputValue);

			//конвертируем список в массив

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(element, index, array) {
				element.value = '';
			});

			fieldsArr[0].focus();


		},

		displayBudget: function(obj) {

			var type;

			obj.budget > 0 ? type = 'inc' : type = 'exp';

			if (obj.budget === 0) {

				document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;

			} else {

				document.querySelector(DOMStrings.budgetLabel).textContent = formatNumbers(obj.budget, type);
			}

			
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumbers(obj.totalInc, 'inc');
			document.querySelector(DOMStrings.expenseLabel).textContent = formatNumbers(obj.totalExp, 'exp');
			document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
		},

		displayPercentages: function(percentages){

			var fields = document.querySelectorAll(DOMStrings.expensePercLabel);

			

			nodeListForEach(fields, function(element, index) {

				if (percentages[index] > 0) {

					element.textContent = percentages[index] + '%';
				} else {

					element.textContent = '---';
				}

				


			});
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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change', UI.changeType);

	};

	var updateBudget = function() {

		//Подсичтываем бюджет

		budget.calculateBudget();

		//Возвращаем бюджет в виде объекта

		var budgety = budget.getBudget();


		//Выводим бюджет в интерфейс

		UI.displayBudget(budgety);
	}

	var updatePercentages = function() {

		//Подсчитываем проценты
		budget.calculatePercantages();

		//Считываем с контроллера бюджета
		var percentages = budget.getPercentages();

		//Выводим в интерфейс
		console.log(percentages);
		UI.displayPercentages(percentages);
	}

	var ctrlDeleteItem = function(event) {

		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {

			splitID = itemID.split('-');

			type = splitID[0];

			ID = parseInt(splitID[1]);

			//Удаляем доход/расход из бюджета

			budget.deleteItem(type, ID);

			//Удаляем доход/расход из интерфейса

			UI.deleteListItem(itemID);

			//Пересчитываем и показываем бюджет

			updateBudget();

			//Пересчитываем и показываем проценты

			updatePercentages();

		}

		
	}

	

	var eventCtrl = function () {
		var input, newItem, bud;


		//Получаем данные от пользователя
		input = UI.getInput();

		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

		//Создаем объект(расход либо доход) на основе полученных от пользователя данных и добавляем его в контроллер бюджета

		newItem = budget.addItem(input.type, input.description, input.value);

		//Выводим полученные от пользователя данные в интерфейс

		UI.addListItem(newItem, input.type);

		//Очищаем поля ввода

		UI.clearFields();

		

		//budget.calc(input.type, parseInt(input.value));

		//Подсчитываем бюджет и Выводим бюджет в интрфейс

		updateBudget();

		//Пересчитываем и показываем проценты

		updatePercentages();



	}

		





		
	};



	return {
		init: function() {
			console.log('START!');
			UI.displayDate();
			UI.displayBudget(
				{
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};

	


	

})(budgetController, UIController);



controller.init();