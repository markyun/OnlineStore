/**
 * Created by huangxinghui on 2015/2/5.
 */
define([ 'app', 'views/AppView' ], function(app, AppView) {
	var Router = Backbone.Router.extend({
		routes : {
			'' : 'index',
			'choose/who' : 'chooseWho',
			'choose/offer' : 'chooseOffer',
			'choose/group' : 'chooseGroup',
			'choose/pricePlan(/:member/:step)' : 'choosePricePlan',
			'checkOrder' : 'checkOrder',
			'choose/account' : 'chooseAccount',
			'register?toUrl=:toUrl' : 'register',
			'payment' : 'payment',
			'migrate/offer':'migrate',
			'choose/migratePlan(:member/:step)':'changeMigratePlan',
			'choose/successfully':'successfully',
			'shopping/cart(/:custOrderList)':'cart',
			'choose/fee':'fee'
		},
		index : function() {
			if (!app.appView) {
				app.appView = new AppView();
			}
			app.members = null;
			app.isMigrate = null;
			app.operationType = null;
			app.orderItemdtoList = null;
			app.reModifyBundle = null;
			app.modifyRes = null;
			app.selectedSubsId = null;
			app.prev = null;
			app.SubsPlanDetailDto = null;
			app.accNbr = null;
			app.subsPlanIdBundle = null;
			app.subs = null;
			app.prefix = null;
			app.appView.render();
		},

		chooseWho : function() {
			require([ 'views/WhoView' ], function(WhoView) {
				var whoView = new WhoView();
				app.appView.pageSlider(whoView.render().$el);
			});
		},

		chooseOffer : function() {
			require([ 'views/OfferPackageView' ], function(OfferPackageView) {
				var offerView = new OfferPackageView();
				app.appView.pageSlider(offerView.render().$el);
			});
		},

		chooseGroup : function() {
			require([ 'views/GroupView' ], function(GroupView) {
				var groupView = new GroupView();
				app.appView.pageSlider(groupView.render().$el);
			});
		},

		choosePricePlan : function(member, step) {
			if (member && step) {
			} else {
				require([ 'views/PricePlanView' ], function(PricePlanView) {
					var pricePlanView = new PricePlanView();
					app.appView.pageSlider(pricePlanView.render().$el);
				});
			}
		},

		checkOrder : function() {
			require([ 'views/CheckOrderView' ], function(CheckOrderView) {
				var checkOrderView = new CheckOrderView();
				app.appView.pageSlider(checkOrderView.render().$el);
			});
		},
		
		chooseAccount :  function() {
			require([ 'views/ChooseAccountView' ], function(ChooseAccountView) {
				var chooseAccountView = new ChooseAccountView();
				app.appView.pageSlider(chooseAccountView.render().$el);
			});
		},

		register : function(toUrl) {
			require([ 'views/RegisterView' ], function(RegisterView) {
				var registerView = new RegisterView();
				registerView.toUrl = toUrl;
				app.appView.pageSlider(registerView.render().$el);
			});
		},

		payment : function() {
			require([ 'views/PaymentView' ], function(PaymentView) {
				var paymentView = new PaymentView();
				app.appView.pageSlider(paymentView.render().$el);
			});
		},
		migrate:function(){
			require(['views/MigrateView'], function(MigrateView){
				var migrateView = new MigrateView();
				app.appView.pageSlider(migrateView.render().$el);
			});
		},
		changeMigratePlan:function(member,step){
			if (member && step) {
			} else {
				require([ 'views/PricePlanView' ], function(PricePlanView) {
					var pricePlanView = new PricePlanView();
					app.appView.pageSlider(pricePlanView.render().$el);
				});
			}
		},
		successfully:function(){
			require(['views/SuccessView'], function(SuccessView){
				var successView = new SuccessView();
				app.appView.pageSlider(successView.render().$el);
			});
		},
		cart:function(custOrderList){
			require(['views/ShoppingCartView'], function(ShoppingCartView){
				var shoppingCartView = new ShoppingCartView();
				app.appView.pageSlider(shoppingCartView.render(custOrderList).$el);
			});
		},
		fee:function(){
			require(['views/QueryFeeView'], function(QueryFeeView){
				var queryFee = new QueryFeeView();
				app.appView.pageSlider(queryFee.render().$el);
			});
		}
	});

	return Router;
});