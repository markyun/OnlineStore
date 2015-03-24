/**
 * Created by huangxinghui on 2015/2/13.
 */
define([ 'app'//
, 'text!templates/OfferPackageTemplate.html'//
, 'text!templates/PartialOfferTemplate.html' ],//
function(app, template, partialTemplate) {
    var OfferPackageView = Backbone.View.extend({
        tagName : 'section',
        className : 'row',
        template : _.template(template),
        events : {
            'click .panel-default' : 'choose',
            'click .js-next' : 'next'
        },
        render : function() {
        	app.operationType = null;
			app.orderItemdtoList = null;
			app.reModifyBundle = null;
			app.modifyRes = null;
			app.prev = null;
        	var custId = "";
        	if(app.user) {
        		custId = app.user.custId;
        	}
            var that = this;
            this.$el.append(template);
//            app.get('order/queryCustOrder', [custId],function success(data) {
//        		console.log(data);
//        	});
            if(!app.accNbr){
            	app.post('offer/1.0.0/querySubsPlanList', {
                    "QuerySubsPlanListParam" : {
                        "channelType" : 3,
                        "custId" : custId
                    }
                }, function(json) {
                	var subsPlanListTemp = json.SubPlanListDto.subsPlanDtoList;
                	var subsPlanList = [];
                	if(subsPlanListTemp.length) {
                		subsPlanList = subsPlanListTemp;
                	}
                	else {
                		subsPlanList.push(subsPlanListTemp);
                	}
                	console.log(json);
                    that.$el.find('.js-wrapper').append(_.template(partialTemplate, {
                        'subsPlanDtoList' : subsPlanList,
                        'subsPlanIdBundle':app.selectedSubsId
                    }));
                });
            } 
            else {
            	app.get('offer/1.0.0/queryExchangeableSubsPlan', [ app.accNbr ],function success(data) {
            		console.log(data);
            		that.$el.find('.js-wrapper').append(_.template(partialTemplate, {
                        'subsPlanDtoList' : data.SubPlanListDto.subsPlanDtoList,
                        'subsPlanIdBundle':app.selectedSubsId
                    }));
            	});
            }
            
            this.$next = this.$('.js-next');
            if(app.selectedSubsId){
            	 this.$next.attr('disabled', false);
            }
            return this;
        },
        choose : function(e) {
            var $current = $(e.currentTarget);
            if (!$current.hasClass('active')) {
                $('.panel-default').removeClass('active');
                $current.addClass('active');
            }
            var subsPlanId = $current.data('subsPlanid');
            app.selectedSubsId = subsPlanId;
            var custId4Flow = 1;
            if(app.user){
            	custId4Flow = app.user.custId;
            }
            var subsEventId = 1;
            app.get('offer/1.0.0/querySubsPlanDetail', [ subsPlanId ], function success(data) {
            	var isSingleSubsPlan = false;
            	if(data.SubsPlanDetailDto.isBundleFlag === "N") {
            		isSingleSubsPlan = true;
            	}
            	var isMigrate = app.isMigrate;
            	if(isMigrate && isSingleSubsPlan) {
                	subsEventId = 206;
                }
            	app.post('workflow/1.0.0/startFlow', {
    				'StartFlowParamDto' : {
    					'subsEventId' : subsEventId,
    					'channelType' : 3,
    					'custId' : custId4Flow,
    					'subsPlanId' : subsPlanId,
    					'subsId' : app.subsId
    				}
    			}, function(data) {
    				app.custOrderId = data;
    				app.flag = null;
    			});
            });
            this.$next.attr('disabled', false);
        },
        next : function() { 
        	app.orderItemId = [];
        	app.subsPlanId = $('.col-md-3').find('.active').data('subsPlanid');
            app.subsPlanName = $('.active').find('.panel-heading').text();
            app.salePrice = $('.active').find('.panel-body').text();
            var id = app.subsPlanId;
            app.get('offer/1.0.0/querySubsPlanDetail', [ id ], function success(data) {
            	var element = data.SubsPlanDetailDto;
            	app.SubsPlanDetailDto = element;
            	console.log(element);
            	app.paidFlag = element.paidFlag;
                if (element.isBundleFlag === "N") {
                    app.userType = "single";
                    app.members = [ {
                        number : '1',
                        step : 0,
                        mandatoryProduct : {},
                        optionalProduct : {},
                        handset : {}
                    } ];
                    if(app.operationType){
                    	app.router.navigate('choose/migratePlan', {
                            trigger : true
                        });
                    }else{
                    	app.router.navigate('choose/pricePlan', {
                            trigger : true
                        });
                    }
                    
                }
                else {
                	var bundleUnitDtoListTemp = element.bundleUnitDtoList;
                    var bundleUnitDtoList = [];
                    if(bundleUnitDtoListTemp.length) {
                    	bundleUnitDtoList = bundleUnitDtoListTemp;
                    } else {
                    	bundleUnitDtoList.push(bundleUnitDtoListTemp);
                    }
                	if (element.isBundleFlag === "Y" && bundleUnitDtoList[0].upperLimit < 10) {
                		app.limits = bundleUnitDtoList[0].upperLimit;
                		app.userType = "family";
                	}
                	else {
                        app.userType = "business";
                    }
                	var subsPlanDtoList = [];
                	var subsBundle = bundleUnitDtoList[0].subsPlanDtoList;
                	if(subsBundle.length){
                		subsPlanDtoList = subsBundle;
                	}else{
                		subsPlanDtoList.push(subsBundle);
                	}
                	var subsPlanId = subsPlanDtoList[0].subsPlanId;
                	app.subsPlanIdBundle = subsPlanId;
                	app.get('offer/1.0.0/querySubsPlanDetail',[subsPlanId],function(data){
                		app.subsBundleDetail = data.SubsPlanDetailDto;
                		console.log(app.subsBundleDetail);
                		app.router.navigate('choose/group', {
                            trigger : true
                        });
                	});
                	
                }
            });
        }
    });

    return OfferPackageView;
});