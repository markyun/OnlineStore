/**
 * Created by huangxinghui on 2015/2/9.
 */
define([ 'app', 'text!templates/IndexTemplate.html' ],
		function(app, template) {
			var AppView = Backbone.View
					.extend({
						el : 'body',
						template : template,
						events : {
							'click .js-login' : 'login',
							'click .js-logout' : 'logout',
							'click .js-link' : 'link',
							'click .setUser':'shoppingCart'
						},

						initialize : function() {
							this.$content = $('#mainContent');
							Backbone.on('loginsuccess', _.bind(
									this.loginsuccess, this));
							Backbone.on('loginoutSuccess', _.bind(
									this.loginoutSuccess, this));
							$(".dropdown-toggle").dropdown();
							
							
						},

						render : function() {
							this.$content.html(this.template);
							return this;
						},

						login : function() {
							var that = this;
							require([ 'views/LoginView' ], function(LoginView) {
								var loginView = new LoginView();
								loginView.render().$el.appendTo(document.body);
								loginView.$el.dialog({
									autoOpen : true,
									modal : true,
									width : 350,
									height:370
								});
							});
						},

						pageSlider : function(page) {
							this.$content.html(page);
						},
						loginsuccess : function() {
							this.$el.find('.dropdown-toggle').remove();
							this.$el.find('.dropdown').append(
									"<a class='dropdown-toggle bg clear' data-toggle='dropdown'>"+
				                    " <span class=''>Hello &nbsp;&nbsp;"
									+  app.user.username +"</span></a>"+
				                   
				                    "<ul class='dropdown-menu animated fadeInRight'>"+
//				                     "<li><a class='set' href='#'>set</a></li>"+
//
//				                       "<li><a class ='setUser'>User infromation</a></li>"+
//
//				                        "<li><a class='message' href='#'><span class='badge bg-danger pull-right'>3</span>messages</a></li>"+ 
//				                        
//				                        "<li><a class='help' href='#'>help</a></li>"+
				                        
				                        "<li><a class='js-logout' data-toggle='ajaxModal' style='cursor: pointer;'>logout</a></li></ul>");
							 $(".dropdown-toggle").dropdown();
							
						},

						logout : function() {
							require(['views/LogoutView'], function (LogoutView) {
				                var logoutView = new LogoutView();
				                logoutView.render().$el.appendTo(document.body);
				                logoutView.$el.dialog({
				                    autoOpen: true,
				                    modal: true,
				                    width:370,
				                    height:330
				                    
				                });
				            });
						},
						
						
						loginoutSuccess :function () {
							 this.$el.find('.dropdown').remove();
							 this.$el.find('.drop').append(
									 "<li class='dropdown' id='dropdown-m'>"+
					                    "<a class='dropdown-toggle bg clear js-login' data-toggle='dropdown' style='cursor: pointer;'>"+
					                      "login</a></li>");
						},
						
						link : function() {
							if (!app.user) {
								require([ 'views/LoginView' ], function(
										LoginView) {
									var loginView = new LoginView();
									loginView.render().$el
											.appendTo(document.body);
									loginView.$el.dialog({
										autoOpen : true,
										modal : true,
										width : 350,
									});
								});
							} else {
								app.router.navigate('migrate/offer', {
									trigger : true
								});
							}
						},
						shoppingCart:function(){
							if(app.user.custId){
								app.get('order/1.0.0/queryCustOrder',[app.user.custId], function(data) {
										if(data.CustOrderListDto){
											if(data.CustOrderListDto.custOrderList){
												app.shoppingCart = data.CustOrderListDto.custOrderList;
											}
										}
										console.log(data);
										app.router.navigate('shopping/cart', {
											trigger : true
										});
								});	
							}
						}
					});

			return AppView;
		});
