var colorMap = {
	0: 'one',
	1: 'two',
	2: 'three',
	3: 'four'
};

var BaseView = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;
		_.isFunction(this.init) && this.init();

		if ( this.modelEvents ) {
			var view = this;

			_.each(this.modelEvents, function(method, eventName) {
				view.listenTo(view.model, eventName, view[method]);
			});
		}

		// if ( this.collectionEvents ) {
		// 	var view = this;

		// 	_.each(this.collectionEvents, function(method, eventName) {
		// 		view.listenTo(view.collection, eventName, view[method]);
		// 	});
		// }
	},

	close: function() {
		_.isFunction(this.onBeforeClose) && this.onBeforeClose();
		this.remove();
	}
});



var BaseCollection = Backbone.Collection.extend({
	close: function() {
		this.invoke('close');
		this.stopListening();
	}
});



var BoxModel = Backbone.Model.extend({
	url: 'randomBox',
	defaults: function() {
		return {
			color: 'white',
			interval: 2000 + Math.floor(Math.random() * 2000)
		};
	},

	initialize: function () {
		this.initInterval();
	},

	initInterval: function () {
		var model = this;
		this.intervalId = setInterval(
			function () {
				model.fetch();
			}, 
			this.get('interval')
		);
	},

	close: function() {
		window.clearInterval(this.intervalId);
	}
});



var BoxView = BaseView.extend({
	className: 'box',
	modelEvents: {
		"change:color": "changeColor"
	},

	init: function() {
		this.changeColor();
	},

	changeColor: function() {
		this.$el.css('backgroundColor', this.model.get('color'));		
	}
});



var BoxesView = BaseView.extend({
	el: '.boxes',

	init: function () {
		// Auto generate a collection of box models
		this.collection = this.collection || new BaseCollection([
			new BoxModel(),
			new BoxModel(),
			new BoxModel(),
			new BoxModel()
		]);

		this.listenTo(this.collection, 'change:color', function() {
			var color = this.collection.at(0).get('color');
			if ( this.collection.where({ color: color }).length === this.collection.length ) {
				alert("All the same color!");
			}
		});
	},

	render: function () {
		// Create and store the box views from the box models
		this.boxes = this.collection.map(this.createBoxView, this);

		return this;
	},

	createBoxView: function (model) {
		var randDelay = Math.floor((Math.random() * 2000)),
			// Instantiate and render the box view
			view = new BoxView({model: model}).render();

		// Append the box view to our boxes container
		this.$el.append(view.$el);

		return view;
	},

	onBeforeClose: function() {
		_.each(this.boxes, function(boxView) {
			boxView.close();
		});
		this.collection.close();
	}
});

$(document).ready(function () {
	var boxView = new BoxesView({}).render();
	$('.boxes').append(boxView.el);
});
