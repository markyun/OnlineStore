/**
 * Created by huangxinghui on 2015/2/13.
 */
define([ 'app', 'text!modules/handset/templates/HandsetDetailTemplate.html'],
		function(app, template) {
			var HandsetDetailView = Backbone.View.extend({
				template : _.template(template),
				events:{
					'click .select':'choose'
				},
				render : function() {
					app.goodsPordSelect = app.goodsSelect;
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
						"select":app.goodsSelect
					}));
					$($('.step-footer')).css('display', 'none');
					return this;
				},
				choose : function(e) {
					var goodsId = null;
					var $current = $(e.currentTarget);
					if (!$current.hasClass('active')) {
						goodsId = $current.data('modelId');
					} else {
						goodsId = null;
					}
					if(goodsId != null){
						app.goodsPordSelect = goodsId;
					}else{
						app.goodsPordSelect = goodsId;
					}
				}
			});

			return HandsetDetailView;
		});