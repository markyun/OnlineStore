/**
 * Created by huangxinghui on 2015/2/13.
 */
define([ 'app', 'text!modules/handset/templates/HandsetDetailTemplate.html' ],
		function(app, template) {
			var HandsetDetailView = Backbone.View.extend({
				template : _.template(template),
				render : function() {
					var phones = app.phones;
					var modelId = app.modelId;
					var phone = null;
					for ( var i = 0; i < phones.length; i++) {
						if (phones[i].goodsProdSpec.modelId === modelId) {
							phone = phones[i];
							break;
						}
					}
					this.$el.append(this.template({
						"address" : app.address,
						"phone" : phone,
					}));
					$($('.step-footer')).css('display', 'none');
					setTimeout(this.setimg, 55);
					return this;
				},
				setimg : function() {
					$(".phone_name").each(
							function() {
								if ($(this).text() == 'Sumsung S5') {
									$(this).parents(".phone").find("img").attr(
											"src", "img/s5.png");
								}
								;
								if ($(this).text() == 'Sumsung S4') {
									$(this).parents(".phone").find("img").attr(
											"src", "img/s42.png");
								}
								;
							});
				}
			});

			return HandsetDetailView;
		});