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
							'click .group-d-list' : 'groupDisplay',
							'click .prev-toCheckOrder' : 'prev'
						},

						render : function() {
							this.$el.append(_.template(template, {
								'acctList' : app.user.acctList}));
							this.$continue = this.$('.continue');
							app.chooseAccount_index = 0;
							app.group_index = 0;
							var orderItemdtoList = app.orderItemdtoList;
							
							var resourceList_show = [];
							var isPrev = app.isPrev_account;
							if(app.userType === "business") {
								if(isPrev) {
									this.continueGroup(orderItemdtoList, 200);
									this.showPrev();
								} else {
									this.continueGroup(orderItemdtoList, 6);
								}
							}else {
								for(var i = 0; i < orderItemdtoList.length; i++) {
									var orderItem = orderItemdtoList[i];
									var resourcelist = orderItem.resourceDtoList;
									if(resourcelist && resourcelist[0].accNbr) {
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
								if(isPrev) {
									this.next(10);
									this.showPrev();
								} else {
									this.next(6);
								}
								
							}
							if(app.user.acctList.length === 0) {
								this.createAccount();
							}
							return this;
						},
						
						next: function(showAmount) {
							var that = this;
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
							if(orderItemdtoList.length === app.chooseAccount_index) {
								that.$('.b_choose').css("display","none");
								that.$('.end').css("display","block");
								if(app.user.acctList) {
									that.$('.confirm-order').attr("disabled", false);
								}
							}
						},

						continueGroup : function(orderItemdtoList, showAmount){
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
							if(orderItemdtoList.length === app.group_index) {
								this.$('.b_choose').css("display","none");
								this.$('.end').css("display","block");
								if(app.user.acctList) {
									this.$('.confirm-order').attr("disabled", false);
								}
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
						    			var $tr = $check.parentsUntil('tbody').eq(2);
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
						    			var $tr = $check.parentsUntil('tbody').eq(2);
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
					    	app.accNbrList = [];
							app.acctIdList = [];
					    	this.$('.confirm-order').attr("disabled", true);
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
							app.acctForAll = this.$('.selectForAll').val();
							var $acctForGroup = this.$('.selectForGroup');
							var groupAcctList = [];
							for(var i = 0; i < $acctForGroup.length; i++) {
								groupAcctList.push($($acctForGroup[i]).val());
							}
							app.acctForGroupList = groupAcctList;
							app.$checkboxList = this.$('.checkbox');
							app.$groupList = this.$('.group-d-list');
					    	var orderItemdtoList = app.orderItemdtoList;
					    	for ( var i = 0; i < orderItemdtoList.length; i++) {
								var OrderItemDto = orderItemdtoList[i];
								var resourcelist = OrderItemDto.resourceDtoList;
								var vasDtoList = OrderItemDto.vasDtoList;
								if (resourcelist) {
									for ( var j = 0; j < resourcelist.length; j++) {
										var resource = resourcelist[j];
										for(var m = 0; m < accNbrList.length; m++) {
											var accNbr = null;
											if(resource){
											if(resource.accNbr){
												accNbr = resource.accNbr.toString();
											}
											}
											if(accNbr === accNbrList[m]) {
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
											vasDto.operationType = 'A';
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
					    },
					showPrev : function () {
						var $acctIdList = this.$('.acctId');
						var acctList = app.acctIdList;
						this.$('.selectForAll').val(app.acctForAll);
						for(var i = 0; i < $acctIdList.length; i++) {
							$($acctIdList[i]).val(acctList[i]);
						}
						var $checkboxList = this.$('.checkbox');
						$checkList = app.$checkboxList;
						for(var i = 0; i < $checkboxList.length; i++) {
							var $checkbox = $($checkList[i]);
							if(!$checkbox.hasClass('fast')) {
								$($checkboxList[i]).removeClass('fast');
							} else {
								$($checkboxList[i]).removeClass('fast');
								$($checkboxList[i]).addClass('fast');
							}
						}
						if(app.userType === "business") {
							var $acctForGroup = this.$('.selectForGroup');
							var groupAcctList = app.acctForGroupList;
							for(var i = 0; i < $acctForGroup.length; i++) {
								$($acctForGroup[i]).val(groupAcctList[i]);
							}
							var groupList = app.$groupList;
							var $groupList = this.$('.group-d-list');
							for(var i = 0; i < groupList.length; i++) {
								var $group = $($groupList[i]);
								if(!$(groupList[i]).hasClass('off')) {
									var groupIndex = $group.data('group');
									$group.toggleClass('off');
							    	var $groupItem = this.$('.group-item');
							    	for(var j = 0; j < $groupItem.length; j++) {
							    		if($($groupItem[j]).hasClass(groupIndex)) {
							    			$($groupItem[j]).slideToggle("slow");
							    		}
							    	}
								}
							}
						}
					},
					prev : function() {
						app.accNbrList = [];
						app.acctIdList = [];
						app.isPrev_account = true;
						var $accNbrList = this.$('.accNbr');
						var $acctIdList = this.$('.acctId');
						for(var i = 0; i < $accNbrList.length; i++) {
							app.accNbrList.push($($accNbrList[i]).text());
						}
						for(var i = 0; i < $acctIdList.length; i++) {
							app.acctIdList.push($($acctIdList[i]).val());
						}
						app.acctForAll = this.$('.selectForAll').val();
						var $acctForGroup = this.$('.selectForGroup');
						var groupAcctList = [];
						for(var i = 0; i < $acctForGroup.length; i++) {
							groupAcctList.push($($acctForGroup[i]).val());
						}
						app.acctForGroupList = groupAcctList;
						app.$checkboxList = this.$('.checkbox');
						app.$groupList = this.$('.group-d-list');
						app.router.navigate('checkOrder', {
							trigger : true
						});
					}
				}
			);
			return ChooseAccountView;
		
});