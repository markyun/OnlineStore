/**
 * Created by huangxinghui on 2015/2/13.
 */
define([ 'app', 'text!templates/CreateAccountTemplate.html' ], function(app,
		template) {
	var LoginView = Backbone.View.extend({
		className : 'ui-dialog',
		events : {
			'click .js-submit-account' : 'submitAccount',
			'dialogclose' : 'remove',
			'click .js-cancel-account' : 'cancelAccount'
		},

		render : function() {
			this.$el.append(template);
			this.$form = this.$el.find('.createAccount').form();
			return this;
		},
		submitAccount : function() {
			var that = this;
				var $adress = this.$el.find('#adress').val();
				var $zipCode = this.$el.find('#zipCode_acct').val();
				var $city = this.$el.find('#city').val();
				var $deliverMethod = this.$el.find('#deliverMethod').val();
				var $email = this.$el.find('#email').val();
				if(!$adress){
					this.$el.find('.adress').html("Address is required!");
					var current = this.$('#adress');
					var $current = $(current);
					$current.addClass('error');
					return;
				}
				if(!$zipCode){
					this.$el.find('.adress').html("");
					var current = this.$('#adress');
					var $current = $(current);
					$current.removeClass('error');
					this.$el.find('.zip').html("ZIP Code is required!");
					var current = this.$('#zipCode_acct');
					var $current = $(current);
					$current.addClass('error');
					return;
				}
				if(!$email){
					this.$el.find('.zip').html("");
					var current = this.$('#zipCode_acct');
					var $current = $(current);
					$current.removeClass('error');
					this.$el.find('.email').html("Email is required!");
					var current = this.$('#email');
					var $current = $(current);
					$current.addClass('error');
					return;
				}else {
	    			var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
	    			if (!filter.test($email)) {
	    				this.$el.find('.zip').html("");
		    			var current = this.$('#zipCode_acct');
						var $current = $(current);
						$current.removeClass('error');
		    			this.$el.find('.email').html("The email is not in the correct format");
						var current = this.$('#email');
						var $current = $(current);
						$current.addClass('error');
						return;
	    			}
	    		}
				if(!$deliverMethod){
					this.$el.find('.email').html("");
					var current = this.$('#email');
					var $current = $(current);
					$current.removeClass('error');
					this.$el.find('.deliver').html("Deliver Method is required!");
					var current = this.$('#deliverMethod');
					var $current = $(current);
					$current.addClass('error');
					return;
				}
				this.$el.find('.deliver').html("");
				var current = this.$('#deliverMethod');
				var $current = $(current);
				$current.removeClass('error');
				app.post('acct/1.0.0/add', {
					'AcctDto' : {
						'postpaid' : 'Y',
						'custId' : app.user.custId,
						'billAdress' : $city + $adress,
						'deliverMethod' : $deliverMethod,
						'zipcode' : $zipCode,
						'email' : $email
					}
				}, function(data) {
					console.log(data);
					if (app.user.acctList) {
						if (app.user.acctList.length) {
							app.user.acctList.push(data);
						} else {
							var acct = app.user.acctList;
							app.user.acctList = [];
							app.user.acctList.push(acct);
							app.user.acctList.push(data);
						}
					} else {
						app.user.acctList = [];
						app.user.acctList.push(data);
					}
					var selectList = $('.choose-number');
					for ( var i = 0; i < selectList.length; i++) {
						$(selectList[i]).append(
								'<option value="' + data.AcctDto.acctId
										+ '" selected="selected">'
										+ data.AcctDto.acctNbr + '</option>');
					}
					var opts = {};
    				fish.showToast("creat account success！", opts);
    				that.remove();
    				if(app.userType === "business") {
    					if(app.orderItemdtoList.length === app.chooseAccount_index && app.user.acctList) {
    						$('.confirm-order').attr("disabled", false);
    					}
    				} else {
    					if(app.resourceList_show.length === app.chooseAccount_index && app.user.acctList) {
    						$('.confirm-order').attr("disabled", false);
    					}
    				}
    				
				});
//				this.remove();
		},
		cancelAccount : function() {
			this.remove();
		}

	});
	return LoginView;
});