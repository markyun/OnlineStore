define([ 'app', 'text!templates/LogoutTemplate.html'], function(app, template) {
	var LogoutView = Backbone.View.extend({
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
			Backbone.trigger('loginoutSuccess');
			app.user=null;
			app=null;
			this.remove();
			
		},
		
		cancel: function() {
			this.remove();
			
		}
	});
	return LogoutView;
});