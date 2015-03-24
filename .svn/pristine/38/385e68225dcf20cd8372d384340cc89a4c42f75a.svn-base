/**
 * Created by huangxinghui on 2015/2/13.
 */
define(
		[ 'app', 'text!templates/ChooseAccountTemplate.html', 
		  'text!templates/ShowAccountTemplate.html',
		  'text!templates/ShowAccountGroupTemplate.html',
		  'views/ChooseAccountView' ],
		function(app, template, showTemp, showGroupTemp, ChooseAccountView) {
			var ChooseAccountView = Backbone.View
					.extend({
						events : {
							'click .one' : 'choose',
							'click .group' : 'chooseGroup',
							'click .all' : 'chooseAll',
							'click .a_choose' : 'createAccount',
							'click .b_choose' : 'next',
							'change .selectForGroup' : 'chooseAccountForGroup',
							'change .selectForAll' : 'chooseAccountForAll',
							'click .confirm-order' : 'confirmOrder',
							'click .group-d-list' : 'groupDisplay'
						},

						render : function() {
							this.$el.append(_.template(template, {
								'acctList' : app.user.acctList}));
							this.$continue = this.$('.continue');
							app.chooseAccount_index = 0;
							app.group_index = 0;
							app.accNbrList = [];
							app.acctIdList = [];
							var orderItemdtoList = app.orderItemdtoList;
							var resourceList_show = [];
							if(app.userType === "business") {
								this.continueGroup(orderItemdtoList);
							}else {
								for(var i = 0; i < orderItemdtoList.length; i++) {
									var orderItem = orderItemdtoList[i];
									var resourcelist = orderItem.resourceDtoList;
									if(resourcelist) {
										for ( var j = 0; j < resourcelist.length; j++) {
											if(resourcelist[j]) {
												resourceList_show.push(resourcelist[j]);
											}
											else {
												
											}
										}
									}
									else {
										resourcelist = [{
											"accNbr" : app.subsPlanName,
											"simCardId" : "",
											"acctId" : ""
											}];
										resourceList_show.push(resourcelist[0]);
									}
								}
								app.resourceList_show = resourceList_show;
								this.next();
							}
							if(!app.user.acctList) {
								this.createAccount();
							}
							return this;
						},
						
						next: function() {
							var that = this;
							var showAmount = 6;
							var orderItemdtoList = app.resourceList_show;
							var showResourceList = [];
							var remainNum = orderItemdtoList.length - app.chooseAccount_index;
							var start_index = app.chooseAccount_index;
							if(remainNum > showAmount) {
								for(var i = 0; i < showAmount;i++, app.chooseAccount_index++) {
									showResourceList.push(orderItemdtoList[app.chooseAccount_index]);
								}
							}
							else {
								for(;app.chooseAccount_index < orderItemdtoList.length; app.chooseAccount_index++) {
									showResourceList.push(orderItemdtoList[app.chooseAccount_index]);
								}
							}
							console.log(orderItemdtoList);
							console.log(showResourceList);
							this.show(showResourceList, start_index);
							if(orderItemdtoList.length === app.chooseAccount_index && app.user.acctList) {
								that.$('.b_choose').attr("disabled",true);
								that.$('.confirm-order').attr("disabled", false);
							}
						},

						continueGroup : function(orderItemdtoList){
							var showAmount = 6;
							var showOrderList = [];
							var remainNum = orderItemdtoList.length - app.group_index;
							if(remainNum > showAmount) {
								for(var i = 1; i < showAmount;i++, app.group_index++) {
									showOrderList.push(orderItemdtoList[app.group_index]);
								}
							}
							else {
								for(;app.group_index < orderItemdtoList.length; app.group_index++) {
									showOrderList.push(orderItemdtoList[app.group_index]);
								}
							}
							console.log(showOrderList);
							this.showGroup(showOrderList);
							if(orderItemdtoList.length === app.group_index && app.user.acctList) {
								this.$('.b_choose').attr("disabled",true);
								this.$('.confirm-order').attr("disabled", false);
							}
						},
						show : function(resourceList, start_index) {
							this.$continue.before(_.template(showTemp, {
								'resourceList' : resourceList,
								'acctList' : app.user.acctList,
								'start_index' : start_index
							}));
						},
						
						showGroup : function(orderItemdtoList) {
							var bundleName = app.subsBundleDetail.subsPlanName;
							this.$continue.before(_.template(showGroupTemp, {
								'name' : bundleName,
								'orderItemdtoList' : orderItemdtoList,
								'acctList' : app.user.acctList,
								'subsPlanName' : app.subsPlanName
							}));
						},
						
						createAccount : function() {
							require(
									[ 'views/CreateAccountView' ],
									function(CreateAccountView) {
										var createAccountView = new CreateAccountView();
										this.$dialog = createAccountView
												.render().$el
												.appendTo(document.body);
										createAccountView.$el.dialog({
											autoOpen : true,
											modal : true,
											width : 600,
										});
									});
						},
						
						choose : function(e) {
							var $current = $(e.currentTarget);
							var groupIndex = $current.data("group");
							var groupCheckList = $('.group');
							var $groupCheck = null;
							for(var i = 0; i < groupCheckList.length; i++) {
								var $group = $(groupCheckList[i]);
					    		if($group.hasClass(groupIndex)) {
					    			$groupCheck = $(groupCheckList[i]);
					    		} 
					    		var $tr = $group.parentsUntil('tbody').eq(2);
								var $select = $tr.children('.selectAccount').children('.selectForGroup');
								$select.attr("disabled", false);
					    	}
							if($current.parent(".i-checks").eq(0).hasClass('fast')){
								$(".all").parent(".i-checks").eq(0).removeClass('fast');
								if($groupCheck) {
									$groupCheck.parent(".i-checks").eq(0).removeClass('fast');
								}
								$current.parent(".i-checks").eq(0).toggleClass("fast");
								var $tr = $current.parentsUntil('tbody').eq(2);
								var $select = $tr.children('.selectAccount').children('.acctId');
								$select.attr("disabled", false);
							}
							else {
								
								var $tr = $current.parentsUntil('tbody').eq(2);
								var $select = $tr.children('.selectAccount').children('.acctId');
								$select.attr("disabled", true);
								$current.parent(".i-checks").eq(0).addClass("fast");
							}
					    },
					    
					    chooseGroup : function(e) {
					    	var $current = $(e.currentTarget);
					    	var groupIndex = $current.data('group');
					    	var groupCheckList = $('.group');
							for(var i = 0; i < groupCheckList.length; i++) {
								var $group = $(groupCheckList[i]);
					    		var $tr = $group.parentsUntil('tbody').eq(2);
								var $select = $tr.children('.selectAccount').children('.selectForGroup');
								$select.attr("disabled", false);
					    	}
					    	var checkList = $('.one');
					    	var currentCheck = $current.parent(".i-checks").eq(0);
					    	if(currentCheck.hasClass('fast')) {
					    		currentCheck.removeClass('fast');
					    		$('.all').parent(".i-checks").eq(0).removeClass('fast');
					    		for(var i = 0; i < checkList.length; i++) {
						    		var $check = $(checkList[i]);
						    		if($check.hasClass(groupIndex)) {
						    			$check.parent(".i-checks").eq(0).removeClass('fast');
						    			var $tr = $check.parentsUntil('tbody').eq(1);
							    		var $select = $tr.children('.selectAccount').children('.acctId');
							    		$select.attr("disabled", false);
						    		} 
						    	}
					    	}else {
					    		currentCheck.addClass('fast');
					    		for(var i = 0; i < checkList.length; i++) {
						    		var $check = $(checkList[i]);
						    		if($check.hasClass(groupIndex)) {
						    			$check.parent(".i-checks").eq(0).addClass('fast');
						    			var $tr = $check.parentsUntil('tbody').eq(1);
							    		var $select = $tr.children('.selectAccount').children('.acctId');
							    		$select.attr("disabled", true);
						    		} 
						    	}
					    	}
					    },
					    
					    chooseAll : function(e) {
					    	var $current = $(e.currentTarget);
							if($current.parent(".i-checks").eq(0).hasClass('fast')) {
								$current.parent(".i-checks").eq(0).removeClass('fast');
								$("select").attr("disabled", false);
								$('.selectForGroup').attr("disabled", false);
								$(".i-checks").removeClass('fast');
								$(".selectForAll").attr("disabled", false);
							} else {
								$current.parent(".i-checks").eq(0).addClass('fast');
								$(".i-checks").removeClass('fast');
								$("select").attr("disabled", true);
								$('.selectForGroup').attr("disabled", true);
								$(".i-checks").addClass("fast");
								$(".selectForAll").attr("disabled", false);
							}
					    },
					    
					    chooseAccountForGroup: function(e) {
					    	var $current = $(e.currentTarget);
					    	var chosedAcctId = parseInt($current.val());
					    	var groupIndex = $current.data('group');
					    	var groupEleList = [];
					    	var checkList = $('.fast');
					    	for(var i = 0; i < checkList.length; i++) {
					    		var $check = $(checkList[i]);
					    		if($check.hasClass(groupIndex)) {
					    			var $tr = $check.parentsUntil('tbody').eq(1);
						    		var $select = $tr.children('.selectAccount').children('.acctId');
						    		groupEleList.push($select);
					    		}
					    	}
					    	for(var i = 0; i < groupEleList.length; i++) {
					    		var $select = $(groupEleList[i]);
					    		$select.val(chosedAcctId);
					    	}
					    },
					    
					    chooseAccountForAll : function() {
					    	var chosedAcctId = parseInt($('.selectForAll').val());
					    	var checkList = $('.fast');
					    	var selectList = [];
					    	for(var i = 0; i < checkList.length; i++) {
					    		var $tr = $(checkList[i]).parentsUntil('tbody').eq(1);
					    		var $select = $tr.children('.selectAccount').children('.acctId');
					    		var $group =  $tr.children('.selectAccount').children('.selectForGroup');
					    		if($group) {
					    			selectList.push($group);
					    		}
					    		if($select) {
					    			selectList.push($select);
					    		}
					    	}
					    	for(var i = 0; i < selectList.length; i++) {
					    		$(selectList[i]).val(chosedAcctId);
					    	}
					    },
					    
					    groupDisplay : function(e) {
					    	var $current = $(e.currentTarget);
					    	var groupIndex = "" + $current.data('group');
					    	$($current).toggleClass('off');
					    	var $groupItem = this.$('.group-item');
					    	for(var i = 0; i < $groupItem.length; i++) {
					    		if($($groupItem[i]).hasClass(groupIndex)) {
					    			$($groupItem[i]).slideToggle("slow");
					    		}
					    	}
					    },
					    
					    confirmOrder : function() {
					    	var $accNbrList = this.$('.accNbr');
							var $acctIdList = this.$('.acctId');
							for(var i = 0; i < $accNbrList.length; i++) {
								app.accNbrList.push($($accNbrList[i]).text());
							}
							for(var i = 0; i < $acctIdList.length; i++) {
								app.acctIdList.push($($acctIdList[i]).val());
							}
					    	var accNbrList = app.accNbrList;
							var acctIdList = app.acctIdList;
					    	var orderItemdtoList = app.orderItemdtoList;
					    	for ( var i = 0; i < orderItemdtoList.length; i++) {
								var OrderItemDto = orderItemdtoList[i];
								var resourcelist = OrderItemDto.resourceDtoList;
								var vasDtoList = OrderItemDto.vasDtoList;
								if (resourcelist) {
									for ( var j = 0; j < resourcelist.length; j++) {
										var resource = resourcelist[j];
										for(var m = 0; m < accNbrList.length; m++) {
											if(resource.accNbr === accNbrList[m]) {
												resource.acctId = acctIdList[m];
												
											}
										}
									}
								}else {
									app.orderItemdtoList[0].qty = 1;
									app.orderItemdtoList[0].resourceDtoList = [{
										"acctId" : acctIdList[0]
									}];
								}
								if(vasDtoList){
									for(var j=0; j<vasDtoList.length; j++){
										var vasDto = vasDtoList[j];
										for(var k=0; k<vasDto.length; k++){
											vasDto.operationType = 'M';
										}
									}
								}
							}
					    	app.orderItemdtoList = orderItemdtoList;
					    	console.log(orderItemdtoList);
					    	if(app.flag === 2){
					    		app.post('order/1.0.0/saveOrder', {
									"CustOrderDto" : {
										"custOrderId" : app.custOrderId,
										"orderItemDtoList" : app.orderItemdtoList
									}
								}, function() {
									if (app.otcAllTotal < 0.00000001) {
										// 完成流程
										app.post('workflow/1.0.0/finishActivity', {
											"FinishActivityParamDto" : {
												"custOrderId" : app.custOrderId
											}
										}, function(data) {
											console.log(data);
											app.flag = 3;
											if (data) {
												console.log("isFinished : Y");
											} else {
												console.log("isFinished : N");
											}
											// 提交订单
						                    app.post('order/1.0.0/submitOrder', {
						                        'SubmitOrderParamDto' : {
						                            'custOrderId' : app.custOrderId
						                        }
						                    }, function(data) {

						                        app.router.navigate('choose/successfully', {
						                            trigger : true
						                        });
						                    });
										});
						            }	
									else{
										app.router.navigate('payment', {
											trigger : true
										});
									}
									
								});
					    	}else{
					    		app.post('order/1.0.0/saveOrder', {
									"CustOrderDto" : {
										"custOrderId" : app.custOrderId,
										"orderItemDtoList" : app.orderItemdtoList
									}
								}, function() {
									if (app.otcAllTotal < 0.00000001) {
										app.router.navigate('choose/successfully', {
				                            trigger : true
				                        });           
									}else{
										app.router.navigate('payment', {
											trigger : true
										});
									}
								});
					    	}
					    }
					}
			);
			return ChooseAccountView;
		
});