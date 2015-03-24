/**
 * Created by huangxinghui on 2015/2/13.
 */
define([ 'app', 'text!templates/LoginTemplate.html' ], function(app, template) {
	var LoginView = Backbone.View.extend({
		className : 'ui-dialog',
		events : {
			'click .js-signIn' : 'signIn',
			'dialogclose' : 'remove',
			'click .f_r' : 'signUp',
		},

		render : function() {
			this.$el.append(template);
			this.$form = this.$el.find('.login_user').form();
			return this;
		},

		signIn : function() {
			var that = this;
//			if(this.$form.isValid()){
				var username = this.$el.find('#username').val();
				var password = this.$el.find('#password').val();
				if(!username||!password){
					this.$el.find('.error_msg').html("User name or password is incorrect!");
					var current = this.$('#username');
					var $current = $(current);
					$current.addClass('error');
					var paCurrent  = this.$('#password');
					var $paCurrent = $(paCurrent);
					$paCurrent.addClass('error');
					return;
				}
				app.post('cust/1.0.1/authCust', {
					"AuthCustDto" : {
						"certNbr":username,
						"custPwd":password,
						'custOrderId' : app.custOrderId
					}
				}, function(data) {
					if(data.AuthCustResultDto.custDto){
						console.log(data);
						app.user = {
								'username' : username,
								'password' : password,
								"custType" : data.AuthCustResultDto.custDto.custType,
								'custId' : data.AuthCustResultDto.custDto.custId,
		    					'acctList' : data.AuthCustResultDto.custDto.acctList
							};
						var opts = {};
						fish.showToast('Login success.', opts);
						Backbone.trigger('loginsuccess');
						that.remove();
					}else{
						that.$el.find('.error_msg').html("User name or password is incorrect!");
					}
					if(app.userType === "business" && app.user.custType === "A") {
						var opts = {};
						fish.showToast('You are Individual Customer, but you choose a business subsplan', opts);
					}

				});
//			}
		},
		signUp : function() {
			var that = this;
			that.remove();
			require(['views/RegisterView'], function (RegisterView) {
                var registerView = new RegisterView();
                registerView.render().$el.appendTo(document.body);
                registerView.$el.dialog({
                    autoOpen: true,
                    modal: true,
                    width:800,
                });
            });

		},

	});

	return LoginView;
});