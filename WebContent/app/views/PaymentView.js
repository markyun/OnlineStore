/**
 * Created by huangxinghui on 2015/2/13.
 */
define([ 'app', 'text!templates/PaymentTemplate.html' ],
		function(app, template) {
			var PaymentView = Backbone.View.extend({
				template : _.template(template),
				events : {
					'click .pay' : 'payNow',
					'click .prev-toAccount' : 'prev'
				},
				render : function() {
					if(app.flag === 2){
					// 完成流程
					app.post('workflow/1.0.0/finishActivity', {
						"FinishActivityParamDto" : {
							"custOrderId" : app.custOrderId
						}
					}, function(data) {
						console.log(data);
						app.flag = 3;
						if (data) {
							console.log("isFinished : Y");
						} else {
							console.log("isFinished : N");
						}}
					);
					}
					this.$el.append(this.template({
						userType : app.userType,
						packag : app.subsPlanName,
						packageSale : app.salePrice,
						bundleList : app.offerGroupList,
						subTotal : app.otcAllTotal,
						total : app.otcAllTotal,
						subs : app.product,
						payTypeList : app.payTypeList,
						cardTypeList : app.cardTypeList

					}));
					console.log(app.custOrderId);
					this.$expirationdate = this.$el.find('#expirationdate');
					this.$expirationdate.datetimepicker({
						viewType : 'date'
					});
					this.$pay = this.$('.pay');
					return this;
				},
				payNow : function() {
					console.log(app.custOrderId);
					var send_type = this.$el.find('#send_type option:selected')
							.text();
					var cardNumber = this.$el.find('#cardNumber').val();
					var expirationdate = this.$el.find('#expirationdate').val();
					var CVV2 = this.$el.find('#CVV2').val();
					var nameOnCard = this.$el.find('#nameOnCard').val();
					if(!cardNumber){
						this.$el.find('.card').html("cardNumber is required!");
						var current = this.$('#cardNumber');
						var $current = $(current);
						$current.addClass('error');
						return;
					}
					if(!expirationdate){
						this.$el.find('.card').html("");
						var current = this.$('#cardNumber');
						var $current = $(current);
						$current.removeClass('error');
						this.$el.find('.date').html("expirationdate is required!");
						var current = this.$('#expirationdate');
						var $current = $(current);
						$current.addClass('error');
						return;
					}
					if(!CVV2){
						this.$el.find('.date').html("");
						var current = this.$('#expirationdate');
						var $current = $(current);
						$current.removeClass('error');
						this.$el.find('.tips').html("CVV2 is required!");
						var current = this.$('#CVV2');
						var $current = $(current);
						$current.addClass('error');
						return;
					}
					if(!nameOnCard){
						this.$el.find('.tips').html("");
						var current = this.$('#CVV2');
						var $current = $(current);
						$current.removeClass('error');
						this.$el.find('.name').html("nameOnCard is required!");
						var current = this.$('#nameOnCard');
						var $current = $(current);
						$current.addClass('error');
						return;
					}
					this.$el.find('.name').html("");
					var current = this.$('#nameOnCard');
					var $current = $(current);
					$current.removeClass('error');
					app.send_type = send_type;
					app.cardNumber = cardNumber;
					this.$pay.attr('disabled',true);
						// 提交订单
						app.post('order/1.0.0/submitOrder', {
							'SubmitOrderParamDto' : {
								'custOrderId' : app.custOrderId
							}
						}, function(data) {

							app.router.navigate('choose/successfully', {
								trigger : true
							});
						});
				},
			prev : function () {
				app.isPrev_account = true;
				app.router.navigate('choose/account', {
					trigger : true
				});
			}
			});

			return PaymentView;
		});