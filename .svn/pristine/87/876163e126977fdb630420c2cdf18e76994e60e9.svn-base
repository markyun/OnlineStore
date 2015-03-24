/**
 * Created by huangxinghui on 2015/2/16.
 */
define(['app', 'text!templates/RegisterTemplate.html',
        'text!templates/LoginTemplate.html'], function(app, template, loginTemplate) {
    var RegisterView = Backbone.View.extend({
    	className : 'ui-dialog',
    	template:_.template(template),
        events: {
            'click .register-submit': 'registerSubmit',
            'dialogclose' : 'remove',
            'click .register-cancel' : 'registerCancel'
        },


        render: function () {
            this.$el.append(this.template({
            	"cert" : app.cert_type,
            	"cust" : app.customer_type
            }));
            this.$el.find('#birthDate').datetimepicker({
				viewType : 'date'
			});
            return this;
        },
        
        login: function () {
            require(['views/LoginView'], function (LoginView) {
                var loginView = new LoginView();
                loginView.render().$el.appendTo(document.body);
                loginView.$el.dialog({
                    autoOpen: true,
                    modal: true,
                    width:350,
                });
            });
        },

        registerSubmit: function () {
        	var that = this;
			
    		this.register();
        },
        register : function () {
	        	var custTypeValue = this.$el.find('#user').val();
	    		var firstNameValue = this.$el.find('#firstName').val();
	    		var lastNameValue = this.$el.find('#lastName').val();
	    		var cert_typeIdValue = this.$el.find('#cert_type').val();
	    		var idNumberValue = this.$el.find('#idNumber').val();
	    		var birthDateValue = this.$el.find('#birthDate').val();
	    		var adressValue = this.$el.find('#adress').val();
	    		var zipCodeValue = this.$el.find('#zipCode').val();
	    		var cityValue =this.$el.find('#city').val();
	    		var daytimeContactNumberValue = this.$el.find('#daytimeContactNumber').val();
	    		var emailValue = this.$el.find('#email').val();
	    		var passwordValue = this.$el.find('#password').val();
	    		var password = this.$el.find('#confirmPassword').val();
	    		if(!custTypeValue){
	    			this.$el.find('.usertype').html("userType is required!");
					var current = this.$('#user');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!firstNameValue){
	    			this.$el.find('.usertype').html("");
	    			var current = this.$('#user');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.first').html("firstName is required!");
					var current = this.$('#firstName');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!lastNameValue){
	    			this.$el.find('.first').html("");
	    			var current = this.$('#firstName');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.last').html("lastName is required!");
					var current = this.$('#lastName');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!cert_typeIdValue){
	    			this.$el.find('.last').html("");
	    			var current = this.$('#lastName');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.certtype').html("CertType is required!");
					var current = this.$('#cert_type');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!idNumberValue){
	    			this.$el.find('.certtype').html("");
	    			var current = this.$('#cert_type');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.id').html("idNumber is required!");
					var current = this.$('#idNumber');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!birthDateValue){
	    			this.$el.find('.id').html("");
	    			this.$el.find('.birth').html("birthDate is required!");
					var current = this.$('#birthDate');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!adressValue){
	    			this.$el.find('.birth').html("");
	    			var current = this.$('#idNumber');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.adress').html("Adress is required!");
					var current = this.$('#adress');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!zipCodeValue){
	    			this.$el.find('.adress').html("");
	    			var current = this.$('#adress');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.zip').html("ZipCode is required!");
					var current = this.$('#zipCode');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!cityValue){
	    			this.$el.find('.zip').html("");
	    			var current = this.$('#zipCode');
					var $current = $(current);
					$current.removeClas('error');
	    			this.$el.find('.city').html("City is required!");
					var current = this.$('#city');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!daytimeContactNumberValue){
	    			this.$el.find('.city').html("");
	    			var current = this.$('#city');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.daytime').html("ContactNumber is required!");
					var current = this.$('#daytimeContactNumber');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!emailValue){
	    			this.$el.find('.daytime').html("");
	    			var current = this.$('#daytimeContactNumber');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.email').html("email is required!");
					var current = this.$('#email');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		} else {
	    			var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
	    			if (!filter.test(emailValue)) {
	    				this.$el.find('.daytime').html("");
		    			var current = this.$('#daytimeContactNumber');
						var $current = $(current);
						$current.removeClass('error');
		    			this.$el.find('.email').html("The email is not in the correct format");
						var current = this.$('#email');
						var $current = $(current);
						$current.addClass('error');
						return;
	    			}
	    		}
	    		this.$el.find('.email').html("");
    			var current = this.$('#email');
				var $current = $(current);
				$current.removeClass('error');
	    		if(!passwordValue){
	    			this.$el.find('.pass').html("password is required!");
					var current = this.$('#password');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		if(!password){
	    			this.$el.find('.pass').html("");
	    			var current = this.$('#password');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.confirmPass').html("confirmPassword is required!");
					var current = this.$('#confirmPassword');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		
	    		if(password != passwordValue){
	    			this.$el.find('.confirmPass').html("");
	    			var current = this.$('#password');
					var $current = $(current);
					$current.removeClass('error');
	    			this.$el.find('.confirmPass').html("The passwords you entered must be the same!");
					var current = this.$('#confirmPassword');
					var $current = $(current);
					$current.addClass('error');
					return;
	    		}
	    		this.$el.find('.confirmPass').html("");
	    		var current = this.$('#confirmPassword');
				var $current = $(current);
				$current.removeClass('error');
				var that = this;
	        	return app.post('cust/1.0.0/add', {
	    			'CustDto' : {
	    				'firstName' : firstNameValue,
	    				'secondName' : lastNameValue,
	            		'custName' : firstNameValue + " " +lastNameValue,
	            		'custType' : custTypeValue,
	            		'certTypeId' : cert_typeIdValue,
	        			'certNbr' : idNumberValue,
	            		'birthdayDay' : birthDateValue,
	            		'address' : cityValue + adressValue,
	            		'zipCode' :zipCodeValue,
	            		'email' : emailValue,
	            		'phoneNumber' : daytimeContactNumberValue,
	            		'pwd' : passwordValue
	    			}
	    		}, function(data) {
	    			if(data) {
	        			console.log(data);
	        				that.remove();
	        				var opts = {};
	    					fish.showToast("register success,please login again！", opts);
//	            				that.login();
	    			}
	    			else {
	    				var opts = {};
	    				fish.showToast("register fail！", opts);
	    			}
	    		}); 
        },
        registerCancel:function() {
        	var that = this;
			that.remove();
        }
    });

    return RegisterView;
});