define(['app','text!templates/PaymentSuccessTemplate.html'],function(app, template){
	var SuccessView = Backbone.View.extend({
		template:_.template(template),
		events:{
			'click .subs-list':'list',
			'click .shopping':'shopping'
		},
		render:function(){
			if(app.flag === 3){
				this.$el.append(this.template({
					userType:app.userType,
					bundel:app.subsPlanName,
					total:app.total,
					method:app.send_type,
					card:app.cardNumber
				}));
				setTimeout(function () { 
			        $('.wait_message').attr('hidden','true');
			        $('.success_message').removeAttr('hidden');
			     // 环节完成
					app.post('workflow/1.0.0/finishActivity', {
						'FinishActivityParamDto' : {
							'custOrderId' : app.custOrderId
						}
					}, function(data) {
						app.flag = 4;
						app.isFinished = data;
						if (data) {
							console.log("isFinished : Y");
						} else {
							console.log("isFinished : N");
						}});
			    }, 2000);
				
			}
			return this;
		},
		list:function(){
//			app.userplanlist = true;
			app.router.navigate('migrate/offer', {
                trigger : true
            });
		},
		shopping:function(){
			app.router.navigate('', {
                trigger : true
            });
		}
	});
	return SuccessView;
});