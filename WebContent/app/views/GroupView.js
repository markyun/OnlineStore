/**
 * Created by huangxinghui on 2015/2/15.
 */
define([ 'app'//
, 'text!templates/GroupTemplate.html'//
, 'text!templates/FamilyMemberTemplate.html'//
, 'text!templates/GroupMemberTemplate.html'//
, 'text!templates/AddGroupTemplate.html'//
, 'text!templates/OneOfferTemplate.html'//
, 'text!templates/MultiOfferTemplate.html'//
, 'text!templates/AllOfferTemplate.html'//
, 'text!templates/MandatoryOneOfferTemplate.html'//
, 'text!templates/MandatoryMultiOfferTemplate.html'//
, 'text!templates/MandatoryAllOfferTemplate.html' ],//
function(app//
, template//
, familyTemp//
, compayTemp//
, addGroupTemplate//
, oneOfferTemp//
, multiOfferTemp//
, allOfferTemp//
, mandatoryOneOfferTemp//
, mandatoryMultiOfferTemp//
, mandatoryAllOfferTemp) {
    var GroupView = Backbone.View.extend({
        tagName : 'section',
        className : 'row',
        template : _.template(template),
        events : {
            'click .js-next' : 'next',
            'change .js-number' : 'choose',
            'click .add' : 'addGroup',
            'click .delete' : 'deleteGroup',
            'click .next' : 'next',
            'click .one-option' : 'chooseOffer',
            'click .multi-option' : 'chooseMulti',
            'click .all-option' : 'chooseAll',
            'click .group-chice' : 'chiceOfferGroup',
            'click .manda-multi-option' : 'chooseMandaMulti',
            'click .manda-one-option' : 'chooseMandaOffer',
            'click .js-prev':'prev'
        },

        render : function() {
            var limitList = app.limits;
            this.$el.append(this.template({
                "userType" : app.userType
            }));
            var that = this;
            if (app.userType === 'family') {
                that.$el.find('.js-wrapper').empty();
                that.$el.find('.js-wrapper').append(_.template(familyTemp, {
                    "limitList" : limitList
                }));
                var numberBox = that.$el.find('.js-number');
                numberBox.combobox();
                console.log(numberBox);
            }
            else {
                that.$el.find('.js-wrapper').empty();
                that.$el.find('.js-wrapper').append(_.template(compayTemp,{
                	"members" : app.members,
                }));
            }
            console.log(app.SubsPlanDetailDto.offerGroupDtoList);
            var offerGroupDtoListTemp = app.SubsPlanDetailDto.offerGroupDtoList;
            var offerGroupDtoList = [];
            if (offerGroupDtoListTemp.length) {
                offerGroupDtoList = offerGroupDtoListTemp;
            }
            else {
                offerGroupDtoList.push(offerGroupDtoListTemp);
            }

            for ( var i = 0; i < offerGroupDtoList.length; i++) {
                var offerDtoListTemp = [];
                if (!offerGroupDtoList[i].offerDtoList.length) {
                    offerDtoListTemp.push(offerGroupDtoList[i].offerDtoList);
                    offerGroupDtoList[i].offerDtoList = offerDtoListTemp;
                }
            }
            for ( var i = 0; i < offerGroupDtoList.length; i++) {
                var offerDtoList = offerGroupDtoList[i].offerDtoList;
                if (offerGroupDtoList[i].groupType === "B" && offerGroupDtoList[i].necessary === 0) {
                    that.$el.find('.bundle').append(_.template(oneOfferTemp, {
                        'offerDtoList' : offerDtoList,
                        'tempIndex' : i
                    }));
                }
                else if (offerGroupDtoList[i].groupType === "C" && offerGroupDtoList[i].necessary === 0) {
                    that.$el.find('.bundle').append(_.template(multiOfferTemp, {
                        'offerDtoList' : offerDtoList,
                        'tempIndex' : i
                    }));
                }
                else if (offerGroupDtoList[i].groupType === "A" && offerGroupDtoList[i].necessary === 0) {
                    that.$el.find('.bundle').append(_.template(allOfferTemp, {
                        'offerDtoList' : offerDtoList,
                        'tempIndex' : i
                    }));
                }
                else if (offerGroupDtoList[i].groupType === "B" && offerGroupDtoList[i].necessary === 1) {
                    that.$el.find('.bundle').append(_.template(mandatoryOneOfferTemp, {
                        'offerDtoList' : offerDtoList,
                        'tempIndex' : i
                    }));
                }
                else if (offerGroupDtoList[i].groupType === "C" && offerGroupDtoList[i].necessary === 1) {
                    that.$el.find('.bundle').append(_.template(mandatoryMultiOfferTemp, {
                        'offerDtoList' : offerDtoList,
                        'tempIndex' : i
                    }));
                }
                else if (offerGroupDtoList[i].groupType === "A" && offerGroupDtoList[i].necessary === 1) {
                    that.$el.find('.bundle').append(_.template(mandatoryAllOfferTemp, {
                        'offerDtoList' : offerDtoList,
                        'tempIndex' : i
                    }));
                }
            }
            app.members = [];
            if(app.userType === 'family'){
				app.num = 2;
				var orderItem = app.orderItemdtoList;
				if(app.reModifyBundle){
					// 根据选择的人数来，添加menbers
					for ( var i = 0; i < 2; i++) {
						app.members[i] = {
							number : i + 1,
							step : 0,
							orderItem :orderItem[i+1],
							isFinished:true
						};
					}
				}else{
					// 根据选择的人数来，添加menbers
					for ( var i = 0; i < 2; i++) {
						app.members[i] = {
							number : i + 1,
							step : 0,
							isFinished:false
						};
					}
				}
                var divList = that.$el.find('.bundle').children('div');
                for ( var i = 0; i < divList.length; i++) {
                    var $div = $(divList[i]);
                    $div.removeClass('col-sm-3 col-md-3');
                    $div.addClass('col-sm-6 col-md-6 bundle_family_' + i);
                }
            }
            else {
                var div = $(that.$el.find('.bundle').children('div')[0]);
                div.removeClass('col-sm-3 col-md-3');
                div.addClass('col-sm-12 col-md-12 bundle_business');
            }
            this.$next = this.$('.js-next');
            this.$next.attr('disabled', false);
            return this;
        },

        next : function() {
        	var that = this ;
        	//如果是企业的话，点击next 组装members ，并验证是否数量的
            if (app.userType === "business") {
                app.business = [];
                app.groupName = [];
                app.groupPerNum = [];
                var $group = $(".group-box");
                
                if (app.reModifyBundle){
                	var orderItem = app.orderItemdtoList;
     				//添加分组
     				if(orderItem.length <= $group.length) {
     					for ( var i = 0; i < $group.length-1; i++) {
         					var groupPerNum = $($group[i]).find('.groupNum').val();
         					
         					if  (i < orderItem.length-1){
         						//因为orderItem 第一个是bundle，第二个才是含有号码
         						if(orderItem[i+1].resourceDtoList.length===parseInt(groupPerNum)) {
         							app.members[i] = {
         									number : i + 1,
         	                                'groupName' : groupName,
         	                                'groupPerNum' : groupPerNum,
         	                                'resourceDtoList':orderItem[i+1].resourceDtoList,
         	                                'isFinished':true,
         	                                step : 0,
         	                            };	
         						}
         						else {
         							var resourceDtoList = orderItem[i+1].resourceDtoList;
         							if (resourceDtoList.length>0) {
         								for (var j=0; j<resourceDtoList.length; j++){
             								var prefix 	= resourceDtoList[j].prefix;
            								var acc_nbr = resourceDtoList[j].accNbr;
            								that.unlockAccNbr(prefix,acc_nbr,null);
             							}
         								
         							}
         							
         							app.members[i] = {
         									number : i + 1,
         	                                'groupName' : groupName,
         	                                'groupPerNum' : groupPerNum,
	         	                            'resourceDtoList':null,
         	                                'isFinished':false,
         	                                step : 0,
         	                            };
         						}
         					}
         					else {
         						app.members[i] = {
         								number : i + 1,
     	                                'groupName' : groupName,
     	                                'groupPerNum' : groupPerNum,
     	                                'resourceDtoList':null,
     	                                'isFinished':false,
     	                                step : 0,
     	                            };
         					}
         					//orderItem 的长度大于 group的数量  ，表示减少组数。
                          
                            
                         }
     					
     				}
     				//减少分组
     				else {
     					for ( var i = 0; i < $group.length-1; i++) {
         					var groupPerNum = $($group[i]).find('.groupNum').val();
     						//因为orderItem 第一个是bundle，第二个才是含有号码
     						if(orderItem[i+1].resourceDtoList!=undefined && orderItem[i+1].resourceDtoList.length===parseInt(groupPerNum)) {
     							app.members[i] = {
     									number : i + 1,
     	                                'groupName' : groupName,
     	                                'groupPerNum' : groupPerNum,
     	                                'resourceDtoList':orderItem[i+1].resourceDtoList,
     	                                'isFinished':true,
     	                                step : 0,
     	                            };	
     						}
     						else {
     							var resourceDtoList = orderItem[i+1].resourceDtoList;
     							for (var j=0; j< resourceDtoList.length; j++){
     								var prefix 	= resourceDtoList[j].prefix;
    								var acc_nbr = resourceDtoList[j].acc_nbr;
    								that.unlockAccNbr(prefix,acc_nbr,null);
     							}
     							app.members[i] = {
     									number : i + 1,
     	                                'groupName' : groupName,
     	                                'groupPerNum' : groupPerNum,
     	                               'resourceDtoList':null,
     	                                'isFinished':false,
     	                                step : 0,
     	                            };
     						}
                         }
     				}
                	
                }
                else {
                	for ( var i = 0; i < $group.length; i++) {
                		var groupName = $($group[i]).find('.groupName').val();
                        var groupPerNum = $($group[i]).find('.groupNum').val();
                        if (groupName != "" && groupName != undefined) {
                            app.members[i] = {
                            	number : i + 1,
                                'groupName' : groupName,
                                'groupPerNum' : groupPerNum,
                                'isFinished':false,
                                step : 0,
                            };

                        }
                	}
                }
               
                
               
                var total = 0;
                for ( var i = 0; i < app.members.length; i++) {
                	if (app.members[i].groupPerNum==null ||app.members[i].groupPerNum ==0){
                		 var opts = {};
                         fish.showToast('The number in each group should be greater than 0 , please confirm again.', opts);
                         return;
                		
                	}
                    total = total + parseInt(app.members[i].groupPerNum);
                }
                
                if (200 < total) {
                    var opts = {};
                    fish.showToast('The Maxinum of Mobiles lines is 200, please confirm again.', opts);
                    return;
                }else if (total<10){
                	 var opts = {};
                     fish.showToast('The Mininum of Mobiles lines is 10, please confirm again.', opts);
                     return;
                }
               
            }
            if (app.prev==false) {
            	app.accNbr = app.fristAccNbr;
            }
            var bundleItemDto = {};
            var bundleVasDto = [];
            var $currentBulde = $('.panel-bundle');
            for ( var j = 0; j < $currentBulde.length; j++) {
                var ret = {};
                var $current = $($currentBulde[j]);
                if ($current.hasClass('active')) {
                    var offerId = $current.data('offerId');
                    var effType = $current.data('effType');
                    ret.offerId = offerId;
                    ret.effType = effType;
                    ret.operationType = 'A';
                    bundleVasDto.push(ret);
                }
            }
            bundleItemDto.subsPlanId = app.subsPlanId;
            bundleItemDto.vasDtoList = bundleVasDto;
            bundleItemDto.qty = 1;
            app.bundleItemDto = bundleItemDto;
            app.router.navigate('choose/pricePlan', {
                trigger : true
            });
        },
        
        unlockAccNbr :function (prefix,acc_nbr,$current) {
			var that = this ;
			app.get('accNbr/1.0.0/unlockAccNbr', [prefix,acc_nbr], function(data) {
				if(data) {	
					if ($current!=null) {
						$current.removeClass('active');
					}
					return true;
				}
				else {
					alert("Unlock number failed");
					return false;
				}
			});

        },

        choose : function(e) {
            var num = 0;
            num = this.$el.find('.js-number option:selected').val();
            app.num = num;
            if(app.reModifyBundle){
				var orderItem = app.orderItemdtoList;
				var t = 1;
				for(var i=1; i<orderItem.length; i++){
					if(orderItem[i].resourceDtoList.length>0){
						t++;
					}
				}
				for(var i=0; i<num; i++){
					if(i < t-1){
						app.members[i] = {
								number : i + 1,
								step : 0,
								orderItem :orderItem[i+1],
								isFinished:true
							};
					}else{
						app.members[i] = {
								number : i + 1,
								step : 0,
								isFinished:false
							};
					}
				}
			}
			else {
				// 根据选择的人数来，添加menbers
				for ( var i = 0; i < num; i++) {
					app.members[i] = {
						number : i + 1,
						step : 0
					};
				}
			}
            if (num && num != '0') {
                this.$next.attr('disabled', false);
            }
            else {
                this.$next.attr('disabled', true);
            }

        },

        chooseOffer : function(e) {
            var $current = $(e.currentTarget);
            var index = $current.data('tempindex');
            if (!$current.hasClass('active')) {
                this.$el.find('.' + index).removeClass('active');
                $current.addClass('active');
            }
            else {
                $current.removeClass('active');
            }
        },
        chooseMulti : function(e) {
            var $current = $(e.currentTarget);
            if (!$current.hasClass('active')) {
                $current.addClass('active');
            }
            else {
                $current.removeClass('active');
            }
        },
        chooseAll : function(e) {
            var $current = $(e.currentTarget);
            var index = $current.data('tempindex');
            if (!$current.hasClass('active')) {
                this.$el.find('.' + index).addClass('active');
            }
            else {
                this.$el.find('.' + index).removeClass('active');
            }
        },
        chooseMandaOffer : function(e) {
            var $current = $(e.currentTarget);
            var index = $current.data('tempindex');
            if (!$current.hasClass('active')) {
                this.$el.find('.' + index).removeClass('active');
                $current.addClass('active');
            }
        },
        chooseMandaMulti : function(e) {
            var $current = $(e.currentTarget);
            if (!$current.hasClass('active')) {
                $current.addClass('active');
            }
            else {
                $current.removeClass('active');
            }
        },
        chiceOfferGroup : function(e) {
            var $current = $(e.currentTarget);
            this.$next.attr('disabled', false);
        },
        
        addGroup : function() {
            var grouptitleDivNum = $(".group-title").length + 1;
            var that = this;
            that.$el.find('.add').before(_.template(addGroupTemplate, {
                'number' : grouptitleDivNum
            }));
        },
        deleteGroup : function() {
            var $prevDiv = this.$el.find('.add').prev();
            if ($prevDiv != null) {
                $prevDiv.remove();
            }
        },
        prev:function(){
        	require(['views/PrevView'], function (PrevView) {
                var prevView = new PrevView();
                prevView.render().$el.appendTo(document.body);
                prevView.$el.dialog({
                    autoOpen: true,
                    modal: true,
                    width:370,
                    height:330
                });
            });
        }
    });

    return GroupView;
});
