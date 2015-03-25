/**
 * Created by huangxinghui on 2015/3/12
 */
define([ 'app', 'text!templates/ChooseNumberTemplate.html',
		'text!templates/NumberTemplate.html',
		'text!templates/GroupNumberTemplate.html',
		'text!templates/OldNumberTemplate.html'], function(app, template,
		NumberTemplate,GroupNumberTemplate,OldNumberTemplate) {
	var ChooseNumberView = Backbone.View.extend({
		template : _.template(template),
		attributes: {
			style: 'display: none'
		},
		events : {
			'click .btn-random' : 'random',
			'click .number-box' : 'choose',
			'click .btn-replace' : 'replacement'
		},
		
		
		initializeMember: function (member) {
        	this.member = member;
        	this.availableAccNbrList=[];
        	this.num=40;
        	this.replaceValue = 1;
        },
        
        
		render : function() {
			var that = this;
			var hadPhoneNum =[];
			var PhoneNum =[];
			var availableAccNbrList=this.availableAccNbrList;	
			if  (app.userType =="family") {//如果是家庭的话
				that.$el.append(template);
				if  (app.user!=null) {
					console.log(app.user.custId);
					
					if (app.accNbr) {
						that.$el.find('.oldNumber').append("<div class='row mand_choose'>The current number of modified package</div>");
						hadPhoneNum = [{"accNbr":app.accNbr,
							"prefix":app.prefix,
							"simCardId":app.simCardId,
							"modify":true }];
						that.$el.find('.oldNumber').append(_.template(OldNumberTemplate, {
							'numbers' : hadPhoneNum,
						}));
						
						that.$('.form-control').val(app.accNbr);
						that.$('.btn-random').attr('style',"display:none");
						//仅仅是为了在下面的地方排除这个号码.
						app.fristAccNbr = app.accNbr;
						app.accNbr = null;
					}
					else {
						app.post('subs/1.0.0/querySubsList',
								{"QuerySubsListParamDto" :{"custId" : app.user.custId,
									"queryBundleMember": false}},
									function (data) {
									console.log(data);
									if (data.SubsListDto.subsDtoList) {
											if (data.SubsListDto.subsDtoList.length === undefined) {
												PhoneNum.push(data.SubsListDto.subsDtoList);
											}
											else {
												PhoneNum = data.SubsListDto.subsDtoList;
											}
//											for(var i= 0;i < PhoneNum.length;i++ ) {
//												if (app.fristAccNbr&& app.prefix){
//													var prefix = data.SubsListDto.subsDtoList[i].prefix;
//													var accNbr = data.SubsListDto.subsDtoList[i].accNbr;
//													if (accNbr === app.fristAccNbr && app.prefix === prefix) {
//														 PhoneNum.splice[i,1];
//													}
//												}
//												
//											}
											
											if (PhoneNum.length>0){
												Backbone.trigger('removeOldNbr');
												for(var i=0;i<PhoneNum.length;i++){
													if(app.oldNbrList){
														var prefix = PhoneNum[i].prefix;
														var accNbr = PhoneNum[i].accNbr;
														for (var j=0; j<app.oldNbrList.length;j++) {
															if(parseInt(app.oldNbrList[j].accNbr) === accNbr && parseInt(app.oldNbrList[j].prefix) === prefix){
																PhoneNum.splice(i,1);
															}
														}
													}
													
												}
												that.$el.find('.oldNumber').append("<div class='row mand_choose'>Select the old number to join Family Package</div>");
												that.$el.find('.oldNumber').append(_.template(OldNumberTemplate, {
													'numbers' : PhoneNum,
												}));
											}
									}
									that.$el.find('.newNumber').append("<div class='row mand_choose'>Select a new number to join Family Package</div>");
									that.selectAllowNumber(that.num,NumberTemplate);
								});	
					}
					
				}
				else {
					that.selectAllowNumber(that.num,NumberTemplate);
				}
			}
			else if  (app.userType =="single") {
				that.$el.append(template);
				that.selectAllowNumber(that.num,NumberTemplate);
			}
			else {
				var groupPersonNum = that.member.groupPerNum;	
				app.post('accNbr/1.0.0/queryAvailableAccNbrList', {
					"QryAccNbrParamDto" : {
							"subsPlanId" : null,
						}
					}, function(data) {
						
						if (app.modifyRes){
							for (var i = 0;i< app.NumbersList.length;i++) {
								that.availableAccNbrList[i] = app.NumbersList[i];
							}
							
						}
						
						else {
							
							if (app.reModifyBundle) {
								if (that.member.resourceDtoList!=null && that.member.resourceDtoList.length>0) {
									for (var i = 0;i< that.member.resourceDtoList.length;i++) {
										that.availableAccNbrList[i] = that.member.resourceDtoList[i];
									}
								}
								else {
									for ( var i = 0; i < groupPersonNum; i++) {
										that.availableAccNbrList[i] = data.AccNbrListDto.accNbrDtoList[i];
										console.log(data.AccNbrListDto.accNbrDtoList[i]);
										//把取出的所有号码都标记为占用状态。
										var prefix =  data.AccNbrListDto.accNbrDtoList[i].prefix;
										var acc_nbr =  data.AccNbrListDto.accNbrDtoList[i].accNbr;
									    that.lockAccNbr(prefix,acc_nbr,null);
										
									}
								}
								
							}
							else {
								for ( var i = 0; i < groupPersonNum; i++) {
									that.availableAccNbrList[i] = data.AccNbrListDto.accNbrDtoList[i];
									console.log(data.AccNbrListDto.accNbrDtoList[i]);
									//把取出的所有号码都标记为占用状态。
									var prefix =  data.AccNbrListDto.accNbrDtoList[i].prefix;
									var acc_nbr =  data.AccNbrListDto.accNbrDtoList[i].accNbr;
								    that.lockAccNbr(prefix,acc_nbr,null);
									
								}
							}
						}
						
						that.$el.append(_.template(GroupNumberTemplate,{
							
							'numbers' : that.availableAccNbrList,
							'member' : that.member
						}));
					});
					
			}
			return this;
		},
		
		selectAllowNumber : function (num,temp) {
			var that = this;
			app.post('accNbr/1.0.0/queryAvailableAccNbrList', {
				"QryAccNbrParamDto" : {
						"subsPlanId" : null
					}
				}, function(data) {
					console.log(data);
					
					if (app.modifyaccNbr) {
						
						//这个号码在之前已经被锁定了
						that.availableAccNbrList[0] = {
								"simCardId" :app.modifyasimCardId,
								"accNbr":app.modifyaccNbr,
								"prefix":app.modifyprefix
								};
						for(var i= 1;i < num;i++ ) {	
							that.availableAccNbrList[i] = data.AccNbrListDto.accNbrDtoList[i-1];
						}
					}
					else if (app.reModifyBundle){ 
						console.log(that.member.orderItem);
						if (that.member.orderItem!=null && that.member.orderItem.resourceDtoList.length>0) {
						var resourceDtoList = that.member.orderItem.resourceDtoList;
						
						that.availableAccNbrList[0] = {
								"simCardId" :resourceDtoList[0].simCardId,
								"accNbr":resourceDtoList[0].accNbr,
								"prefix":resourceDtoList[0].prefix
						};
						
						for(var i= 1;i < num;i++ ) {	
							that.availableAccNbrList[i] = data.AccNbrListDto.accNbrDtoList[i-1];
							}
						}
						else {
							
							for(var i= 0;i < num;i++ ) {	
								that.availableAccNbrList[i] = data.AccNbrListDto.accNbrDtoList[i];
							}
							var firstNumber = that.availableAccNbrList[0];
							var prefix = that.availableAccNbrList[0].prefix;
							var accNbr = that.availableAccNbrList[0].accNbr;
							that.lockAccNbr(prefix,accNbr,null);
						}
					} 
					else  {
						
						for(var i= 0;i < num;i++ ) {	
							that.availableAccNbrList[i] = data.AccNbrListDto.accNbrDtoList[i];
						}
						var firstNumber = that.availableAccNbrList[0];
						var prefix = that.availableAccNbrList[0].prefix;
						var accNbr = that.availableAccNbrList[0].accNbr;
						that.lockAccNbr(prefix,accNbr,null);
					}
					
					
					that.$('.form-control').val(accNbr);
					that.$el.find('.newNumber').append(_.template(temp,{

						'numbers' : that.availableAccNbrList,
					}));
					
				});
			
		},
		
		
		choose : function(e) {
			//如果当前页面是有号码active状态 则把这个号码解占用
			if (app.userType!="business") {
				var that = this;
				var $current = $(e.currentTarget);
				if ($current.hasClass("old")) {
					if (!$current.hasClass("active")) {
						var $PerActiveNumber = that.$('.js-num .active');
						for (var i= 0;i<$PerActiveNumber.length;i++) {
							if ($($PerActiveNumber[i]).hasClass("new")) {
								var prefix =  $($PerActiveNumber[i]).find('.prefix').text();
								var acc_nbr =  $($PerActiveNumber[i]).find('.accNbr').text();
								that.unlockAccNbr(prefix,acc_nbr,$($PerActiveNumber[i]));
							}
							else {
								$($PerActiveNumber[i]).removeClass("active");
							}
							
						}
						$current.addClass("active");
						var acc_nbr =  $current.find('.accNbr').text();
					}
									
				}
				else {
					if (!$current.hasClass("active")) {
						var $PerActiveNumber = that.$('.js-num .active');
						for (var i= 0;i<$PerActiveNumber.length;i++) {
							if ($($PerActiveNumber[i]).hasClass("new")) {
								var prefix =  $($PerActiveNumber[i]).find('.prefix').text();
								var acc_nbr =  $($PerActiveNumber[i]).find('.accNbr').text();
								//解除当前页面上的 之前被占用的号码;
								this.unlockAccNbr(prefix,acc_nbr,$($PerActiveNumber[i]));
								
								
							}
							else {
								$($PerActiveNumber[i]).removeClass("active");
							}
						}
						
						var prefix =  $current.find('.prefix').text();
						var acc_nbr =  $current.find('.accNbr').text();
						//console.log("H");
						that.lockAccNbr(prefix,acc_nbr,$current);
						
						
					
					}
				}
				
				}
			
		},
		
		
		
		random : function() {
				var address = null;
				var number = null;
				var that = this;	
				var $perList = this.$(".js-num .active");
				if ($perList.length!= 0) {
					//只是用来判断是否需要解锁,如果需要则解锁,如何不需要则不解锁
					for (var i = 0; i<$perList.length ;i++) {
						if ($($perList[i]).hasClass("new")) {
							var $per = $($perList[i]);
							var prefix = $per.find('.prefix').text();
							var acc_nbr = $per.find('.accNbr').text();	
							that.unlockAccNbr(prefix,acc_nbr,null);
						}
						$($perList[i]).removeClass("active");
					}
				}
				
				that.randomChooseNumber();
				
		},
		
		randomChooseNumber : function  () {
				var that = this;
				var chosedNum = this.$('.js-num .new'); 
	            var canBeChosedNum= [];
				for (var i=0 ;i<chosedNum.length;i++ ) {
					if (chosedNum[i].style.display != "none") {			
						canBeChosedNum.push(chosedNum[i]);
					}
				}
				//console.log(canBeChosedNum);
				address = _.random(0, canBeChosedNum.length-1);
				//console.log(address);
				number = canBeChosedNum[address];
				if (!$(number).hasClass("active")) {
					var prefix =  ($(number)).find('.prefix').text();
					var acc_nbr =  ($(number)).find('.accNbr').text();
					//console.log("aaa");
					console.log(prefix,acc_nbr);
					that.lockAccNbr(prefix,acc_nbr,$(number));		
				}
		},
		
		replacement : function () {
			var that = this;
			if (app.modifyRes) {
				var groupPersonNum = app.NumbersList.length;
			}
			else {
				var groupPersonNum = that.member.groupPerNum;
			}
			var value = that.replaceValue++;
			//获取当前页面上的所有号码 ，并解除占用
			var currentNumberList = this.$el.find('.number-box');
			for (var i= 0 ;i<currentNumberList.length ;i++){
				var $current = currentNumberList[i];
			    var prefix =  $($current).find('.prefix').text();
				var acc_nbr =  $($current).find('.accNbr').text();
				
				app.get('accNbr/1.0.0/unlockAccNbr', [prefix,acc_nbr], function(data) {
					if(data) {
								
					}
				});
			}
			app.post('accNbr/1.0.0/queryAvailableAccNbrList', {
					"QryAccNbrParamDto" : {
					"subsPlanId" : null
					}
				}, function(data) {
						if ((data.AccNbrListDto.accNbrDtoList.length-groupPersonNum*(value-1)) >= groupPersonNum) {
							for ( var i = groupPersonNum*(value-1); i < groupPersonNum*value; i++) {
									var prefix =  data.AccNbrListDto.accNbrDtoList[i].prefix;
									var acc_nbr = data.AccNbrListDto.accNbrDtoList[i].accNbr;
									console.log("b");
								    that.lockAccNbr(prefix,acc_nbr,null);
									that.availableAccNbrList[i-groupPersonNum*(value-1)] = data.AccNbrListDto.accNbrDtoList[i];
								}
							}
							
							else {

									var opts = {};
				        		    fish.showToast('The remaining number of deficiencies', opts);
				        		    that.replaceValue = 1;
				        		    for (var i = 0 ; i< groupPersonNum ;i++){
				        		    	var prefix =  data.AccNbrListDto.accNbrDtoList[i].prefix;
										var acc_nbr = data.AccNbrListDto.accNbrDtoList[i].accNbr;
										console.log("c");
									    that.lockAccNbr(prefix,acc_nbr,null);
									    that.availableAccNbrList[i] = data.AccNbrListDto.accNbrDtoList[i];
				        		    }
								}
								
							
							that.$el.find('.number').remove();
							that.$el.append(_.template(GroupNumberTemplate,{

								'numbers' : that.availableAccNbrList,
								'member':that.member
							}));
						});
				
			
			
			
	
			
		},
		
		//号码预占
		lockAccNbr :function (prefix,acc_nbr,$current) {
			var that = this;
			console.log("d");
			console.log(prefix+acc_nbr);
			app.get('accNbr/1.0.0/lockAccNbr', [prefix, acc_nbr ], function(data) {
				
				if (data) {	
					that.$('.form-control').val(acc_nbr);
					if ($current!=null) {
						$current.addClass('active');
					}
					} else {
					
					if($current!=null) {
						
						alert("You choose the number is occupied");
						$current.attr('style',"display:none");
					}
				}

			});
			
			
		},
		//解除号码占用
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

		}
		
	});

	return ChooseNumberView;
});