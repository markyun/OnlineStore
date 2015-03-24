define([ 'app', 'text!templates/NumberDetailTemplate.html' ], function(app,
		template) {
	var NumberDetailView = Backbone.View.extend({
		template : _.template(template),
		id:'NumberDetail',
		modal: false,
		width:640,
		render : function() {
			this.$el.append(this.template({
				detailView : app.orderItemdtoList[app.groupIndex+1].resourceDtoList
			}));
			return this;
		}
	});
	return NumberDetailView;
});
