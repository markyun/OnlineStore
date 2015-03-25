define([ 'app', 'text!templates/PrevSuccessTemplate.html'], function(app, template) {
	var PrevView = Backbone.View.extend({
		className : 'ui-dialog',
		events : {
			'click .Ok' : 'ok',
			'dialogclose' : 'remove',
			'click .Cancel' : 'cancel'
		},
		
		
		render : function() {
			this.$el.append(template);
			return this;
		},
		
		ok : function() {
			app.router.navigate('choose/offer', {
				trigger : true
			});
			this.remove();
			
		},
		
		cancel: function() {
			this.remove();
			
		}
	});
	return PrevView;
});