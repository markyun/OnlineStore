/**
 * Created by huangxinghui on 2015/2/16.
 */
define(['app'
        , 'text!templates/OrderTemplate.html'
        ,'text!templates/OrderTemplateByGroup.html'
        , 'views/ChooseNumberView'
        , 'modules/product/views/ChooseMandatoryProductView'
        , 'modules/product/views/ChooseOptionalProductView'
        , 'modules/handset/views/ChooseHandsetView']
, function (app, template, ordertemplatebygroup, ChooseNumberView, ChooseMandatoryProductView, ChooseOptionalProductView, ChooseHandsetView) {
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
        
        render: function() {
        	var that = this;
        	this.$content = this.$('.panel-body');
        	
        	this.steps;
        	if(app.userType === 'single' && app.isMigrate){
        		this.steps = app.flow_steps;
            } else {
            	this.steps = app.steps;
            }
        	
        	this.steps.forEach(function (step) {
        		that[step.method]();
        	});
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
        		if(app.userType === 'single' && app.isMigrate){
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
        	
        	this.render();
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
        	if(app.userType === 'single' && app.isMigrate){
        		if (step === app.flow_steps.length) {
        			
        			that.$('.js-step').attr("disabled",true);
                    this.member.isFinished = true;
                    Backbone.trigger('orderFinished', +this.id.substring(6));
                    Backbone.trigger('nextMember',that.member);
                    return;
                }
        	}
        	else if (step === app.steps.length) {
        		
        		$(".js-order-list").delegate('.btn-next', 'click', function() {
        			$("html, body").animate({"scrollTop": (($(this).offset().top)+50) + "px" }, 500, "swing");
        		});
        		that.$('.js-step').attr("disabled",true);
                this.member.isFinished = true;
                Backbone.trigger('orderFinished', +this.id.substring(6));
                Backbone.trigger('nextMember',that.member);
                return;
            }
        	
           
            var $step = this.$('.scroll-step-item').eq(step);//根据step 来判断是第几个div 
    		this.$('.scroll-step-item').removeClass('active');
        	$step.addClass('active');
        	this.$('.js-step').attr("disabled",false); 
            if (this.currentView) {
                this.currentView.$el.hide();//当前的页面隐藏起来
            }
            
            this.currentView = this[this.steps[step]['method'] + 'View'];
            this.currentView.$el.show();
            if(step ===1 || step===2){
       		 var maxheight = 0;
				 var this_maxdiv;
				    $(".col-md-3").each(function(index,element) {
				        if ($(element).height() > maxheight) {
				            maxheight = $(element).height();
				            this_maxdiv = $(element);
				        };
				    });
				    $(this_maxdiv).parent().find(".col-md-3").each(function(index,element) {
				        $(element).find(".panel").height(maxheight - 22);
				    });
       	}
        },
        
        stepDisabled : function () {
        	this.$('.js-step').attr("disdisabled",true);
        },
        

        chooseNumber: function () {
        	this.chooseNumberView = new ChooseNumberView();
        	this.chooseNumberView.initializeMember(this.member); 
        	this.chooseNumberView.render();
        	this.$content.append(this.chooseNumberView.$el);
        },

        chooseMandatoryProduct: function () {
        	this.chooseMandatoryProductView = new ChooseMandatoryProductView();
        	this.chooseMandatoryProductView.initializeMemberAdd(this.member); 
        	this.chooseMandatoryProductView.render();
        	this.$content.append(this.chooseMandatoryProductView.$el);
        },

        chooseOptionalProduct: function () {
        	this.chooseOptionalProductView = new ChooseOptionalProductView();
        	this.chooseOptionalProductView.initializeMemberAdd(this.member); 
        	this.chooseOptionalProductView.render();
        	this.$content.append(this.chooseOptionalProductView.$el);
        },

        chooseHandset: function () {
        	this.chooseHandsetView = new ChooseHandsetView();
        	this.chooseHandsetView.initializeMemberAdd(this.member); 
        	this.chooseHandsetView.render();
        	this.$content.append(this.chooseHandsetView.$el);
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
        	if(app.steps.length === this.member.step){
        		this.member.step--;
        	}
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