define([ 'app', 'text!templates/ShoppingCartTemplate.html' ], function(app,
		template) {
	var ShoppingCart = Backbone.View.extend({
		template:_.template(template),
		events:{
			'click .list_o2':'chooseContinue'
		},
		render:function(){
			this.$el.append(this.template({
				"carts":app.shoppingCart
			}));
			return this;
		},
		chooseContinue:function(e){
			var $current = $(e.currentTarget);
			if($current.hasClass('ative')){
				var custOrderId = $current.data('custOrder');
				console.log(custOrderId);
			}
		}
	});
	return ShoppingCart;
});