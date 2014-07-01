var colorMap = {
	0: 'one',
	1: 'two',
	2: 'three',
	3: 'four'
};

var BoxModel = Backbone.Model.extend({
	defaults: {
		backgroundColor: 'black',
		interval: 1000 
	},

	colors: [
		'#C41E3A',
		'#009E60',
		'#0051BA',
		'#FF5800',
		'#FFD500',
		'#FFFFFF'
	],

	initialize: function () {
		this.setRandomInterval();
		this.initInterval();
	},

	initInterval: function () {
		var model = this;
		this.intervalId = setInterval(
			function () {
				model.setRandomColor();
			}, 
			this.get('interval')
		);
	},
	
	getRandomColor: function () {
		var randNum = Math.floor((Math.random() * 1000)) % 4;
		return this.colors[randNum];
	},

	setRandomColor: function () {
		this.set('backgroundColor', this.getRandomColor());
	},

	setRandomInterval: function () {
		this.set('interval', 2000 + Math.floor(Math.random() * 2000));
	}
});

var BoxView = Backbone.View.extend({
	className: 'box',
	initialize: function () {
		this.model.on('change:backgroundColor', this.render, this);
	},

	render: function () {
		this.$el.css('backgroundColor', this.model.get('backgroundColor'));	

		return this;
	}
});

var BoxesView = Backbone.View.extend({
	el: '.boxes',

	initialize: function () {
		_.bindAll(this, 'render', 'createBoxView');

		// Auto generate a collection of box models
		this.collection = this.collection || new Backbone.Collection([
			new BoxModel({color: colorMap[0], row: 0}),
			new BoxModel({color: colorMap[1], row: 0}),
			new BoxModel({color: colorMap[2], row: 0}),
			new BoxModel({color: colorMap[3], row: 1}),
			new BoxModel({color: colorMap[4], row: 1}),
			new BoxModel({color: colorMap[5], row: 1}),
			new BoxModel({color: colorMap[6], row: 2}),
			new BoxModel({color: colorMap[7], row: 2}),
			new BoxModel({color: colorMap[8], row: 2}),
		]);

		this.collection.on('change:backgroundColor', function(model){
			var this_row = model.collection.where({row: model.get('row')});
			var all_same = _.every(this_row, function(m) {
				return m.get('backgroundColor') === model.get('backgroundColor');
			});
			if (all_same) {
				console.log('hey hey hey, row ' + model.get('row') +' has the same colors!');
			}
		});
	},

	render: function () {
		// Create and store the box views from the box models
		this.boxes = this.collection.map(this.createBoxView);

		return this;
	},

	createBoxView: function (model) {
		var randDelay = Math.floor((Math.random() * 2000)),
			// Instantiate and render the box view
			view = new BoxView({model: model}).render();

		// Append the box view to our boxes container
		this.$el.append(view.$el);

		return view;
	}
});

$(document).ready(function () {
	var boxView = new BoxesView().render();
	$('.boxes').append(boxView.el);
});
