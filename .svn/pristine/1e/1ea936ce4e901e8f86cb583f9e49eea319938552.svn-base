/**
 * Created by huangxinghui on 2015/2/16.
 */
define(['app', 'text!templates/OrderTemplate.html','text!templates/OrderTemplateByGroup.html'], function (app, template,ordertemplatebygroup) {
    var OrderView = Backbone.View.extend({
        className: 'panel panel-order',
        template: _.template(template),
        events: {
            'click .js-step': 'step',
            'click .scroll-step-item': 'go',
            'click .btn-link': 'handsetDetail',
            'click .js-back': 'handsetBack',
            'click .js-choose':'choose'
        },

        initializeMember: function (member) {
        	if(app.userType === "business") {
        		this.member = member;
      		  	this.$el.append(_.template(ordertemplatebygroup)({
      		  	  index: _.indexOf(app.members, this.member) + 1,
      			  total: app.members.length,
                  steps: app.steps
                }));
    
      		  
	        }
        	else {
        		this.member = member;
        		if(app.userType === 'single' && app.operationType === 'M'){
        			this.$el.append(this.template({
    	                index: _.indexOf(app.members, this.member) + 1,
    	                total: app.members.length,
    	                steps: app.flow_steps
    	            	}));
        			
        		}else{
        			this.$el.append(this.template({
    	                index: _.indexOf(app.members, this.member) + 1,
    	                total: app.members.length,
    	                steps: app.steps
    	            	})); 
        		
        		}
        	};

            this.$content = this.$('.panel-body');
            this.goTo(this.member.step);
        },

        step: function () {
        	if(this.member.step === app.steps.length){
        		 this.goTo(this.member.step);
        	}else{
        		 this.goTo(++this.member.step);
        	}
           
        },

        go: function (e) {
            var $step = $(e.currentTarget);
            
            if (!$step.hasClass('active')) {
                this.member.step = $step.data('index');
                this.goTo(this.member.step);
            }
        },

        goTo: function (step) {
        	var that = this;
        	if(app.userType === 'single' && app.operationType === 'M'){
        		if (step === app.flow_steps.length) {
        			
        			that.$('.js-step').attr("disabled",true);
	
                    this.member.isFinished = true;
                    Backbone.trigger('orderFinished', +this.id.substring(6));
                    return;
                }
        	}
        	else if (step === app.steps.length) {
        		
        		that.$('.js-step').attr("disabled",true);
                this.member.isFinished = true;
                Backbone.trigger('orderFinished', +this.id.substring(6));
                return;
            }
        	
           
            var $step = this.$('.scroll-step-item').eq(step);//根据step 来判断是第几个div 
    		this.$('.scroll-step-item').removeClass('active');
        	$step.addClass('active');
        	this.$('.js-step').attr("disabled",false); 
            if (this.currentView) {
                this.currentView.$el.hide();//当前的页面隐藏起来
            }
            if(app.userType === 'single' && app.operationType === 'M'){
            	this[app.flow_steps[step]['method']]();
            }
            else 
            {
            	this[app.steps[step]['method']]();
            }
            
             	
        },
        
        stepDisabled : function () {
        	this.$('.js-step').attr("disdisabled",true);
        },
        

        chooseNumber: function () {
            var that = this;
            if (!this.chooseNumberView) {
                require(['views/ChooseNumberView'], function (ChooseNumberView) {
                    that.chooseNumberView = new ChooseNumberView();
                    that.currentView = that.chooseNumberView;
                    that.currentView.initializeMember(that.member); 
                    that.chooseNumberView.render();
                    that.$content.append(that.chooseNumberView.$el);
                });
            } else {
                this.chooseNumberView.$el.show();
                this.currentView = this.chooseNumberView;
            }
        },

        chooseMandatoryProduct: function () {
            var that = this;
            if (!this.chooseMandatoryProductView) {
                require(['modules/product/views/ChooseMandatoryProductView'], function (ChooseMandatoryProductView) {
                    that.chooseMandatoryProductView = new ChooseMandatoryProductView();
                    that.currentView = that.chooseMandatoryProductView;
                    that.currentView.initializeMemberAdd(that.member); 
                    that.chooseMandatoryProductView.render();
                    that.$content.append(that.chooseMandatoryProductView.$el);
                    that.currentView = that.chooseMandatoryProductView;
                });
            } else {
                this.chooseMandatoryProductView.$el.show();
                this.currentView = this.chooseMandatoryProductView;
            }
        },

        chooseOptionalProduct: function () {
            var that = this;
            if (!this.chooseOptionalProductView) {
                require(['modules/product/views/ChooseOptionalProductView'], function (ChooseOptionalProductView) {
                    that.chooseOptionalProductView = new ChooseOptionalProductView();
                    that.currentView = that.chooseOptionalProductView;
                    that.currentView.initializeMemberAdd(that.member); 
                    that.chooseOptionalProductView.render();
                    that.$content.append(that.chooseOptionalProductView.$el);
                    that.currentView = that.chooseOptionalProductView;
                });
            } else {
                this.chooseOptionalProductView.$el.show();
                this.currentView = this.chooseOptionalProductView;
            }
        },

        chooseHandset: function () {
            var that = this;
//            if (!this.chooseHandsetView) {
                require(['modules/handset/views/ChooseHandsetView'], function (ChooseHandsetView) {
                    that.chooseHandsetView = new ChooseHandsetView();
                    that.currentView = that.chooseHandsetView;
                    that.currentView.initializeMemberAdd(that.member); 
                    that.chooseHandsetView.render();
                    that.$content.append(that.chooseHandsetView.$el);
                    that.currentView = that.chooseHandsetView;
                });
//            } else {
//                this.chooseHandsetView.$el.show();
//                this.currentView = this.chooseHandsetView;
//            }
        },

        handsetDetail: function (handsetID) {
        	var $current = $(handsetID.currentTarget);
        	var goodsId = $current.data('goodsId');
        	var offerId = $current.data('offerId');
        	var modelId = $current.data('modelId');
        	app.offerId = offerId;
        	app.modelId = modelId;
            var that = this;
            this.currentView.$el.hide();
            app.get('order/1.0.1/queryShopAddress', [ goodsId ], function(
					data) {
				console.log(data);
				app.address = data.FtshopAddressListDto.ftshopAddressDtoList;
				if (!this.hansetDetailView) {
	                require(['modules/handset/views/HandsetDetailView'], function (HandsetDetailView) {
	                    that.hansetDetailView = new HandsetDetailView();
	                    that.hansetDetailView.render();
	                    that.$content.append(that.hansetDetailView.$el);
	                    that.currentView = that.hansetDetailView;
	                });
	            } else {
	                this.hansetDetailView.$el.show();
	                this.currentView = this.hansetDetailView;
	            }
			});
            $('.js-step').css('display', 'none');
            $('.step-footer').css('display', 'none');
        },

        handsetBack: function () {
        	$('.js-step').css('display', 'inline');
        	$('.step-footer').css('display', 'block');
            this.goTo(this.member.step);
        },
        choose:function(e){
        	this.$phone = this.$('.phone_detail');
        	var $current = $(e.currentTarget);
            if (!$current.hasClass('active')) {
                this.$phone.find('.active').removeClass('active').html('Choose');
                $current.addClass('active').html('✔');
            }else{
            	this.$phone.find('.active').removeClass('active').html('Choose');
            }
        }
    });

    return OrderView;
});