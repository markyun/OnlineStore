define([ 'app', 'text!templates/ShoppingCartTemplate.html' ], function(app,
		template) {
	var ShoppingCart = Backbone.View.extend({
		template:_.template(template),
		render:function(){
			this.$el.append(template);
			return this;
		}
	});
	return ShoppingCart;
});