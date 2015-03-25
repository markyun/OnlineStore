/**
 * Created by huangxinghui on 2015/2/15.
 */
define(
		[ 'app', 'text!templates/PricePlanTemplate.html', 'views/OrderView' ],
		function(app, template, OrderView) {
			var PricePlanView = Backbone.View
					.extend({
						tagName : 'section',
						className : 'row',
						events : {
							'click .js-next' : 'next',
							'click .js-save' : 'saveClick',
							'click .js-prev' : 'prev',
							'click .js-fee':'fee'
						},

						initialize : function() {
							this.memberViews = {};
							Backbone.on('orderFinished', _.bind(
									this.orderFinished, this));// 监听事件
							Backbone.on('nextMember', _.bind(
									this.nextMember, this));
							Backbone.on('removeOldNbr', _.bind(
									this.removeOldNbr, this));
							
				
						},

						render : function() {
							this.$el.append(template);
							if (app.flag === null) {
								if (app.custOrderId) {
									app.post('workflow/1.0.0/finishActivity', {
										"FinishActivityParamDto" : {
											"custOrderId" : app.custOrderId
										}
									}, function(data) {
										console.log(data);
										app.flag = 1;
										if (data) {
											console.log("isFinished : Y");
										} else {
											console.log("isFinished : N");
										}
									});
								}
							}
							this.$orderList = this.$('.js-order-list');
							this.$next = this.$('.js-next');
							this.$save = this.$('.js-save');
							this.$fee = this.$('.js-fee');
							this.initializeMembers();
							return this;
						},

						initializeMembers : function() {
							// 获取前一个页面的app.members
							var member, orderView;
							for ( var i = 0, n = app.members.length; i < n; i++) {
								member = app.members[i];
								this.memberViews[i] = this.createMember(member,
										i);
								if (!member.isFinished) {
									break;
								}
							}
						},

						createMember : function(member, index) {
							var orderView = new OrderView({
								id : 'member' + index
							});
							orderView.initializeMember(member);
							this.$orderList.append(orderView.$el);

							return orderView;
						},

						orderFinished : function(index) {
							if (index === app.members.length - 1) {
								this.$('.js-next').attr("disabled", false);
							} else {
								this.memberViews[++index] = this.memberViews[index]
										|| this.createMember(
												app.members[index], index);
							}
						},
						check : function() {
							app.router.navigate('checkOrder', {
								trigger : true
							});
						},
						finish : function() {
							console.log(app.custOrderId);
							return app.post('workflow/1.0.0/finishActivity', {
								"FinishActivityParamDto" : {
									"custOrderId" : app.custOrderId
								}
							}, function(data) {
								console.log(data);
								app.flag = 2;
								if (data) {
									console.log("isFinished : Y");
								} else {
									console.log("isFinished : N");
								}
							});
						},
						
						next : function() {
							this.$('.js-next').attr("disabled", true);
							//修改单个号码，调用
							if(app.modifyRes){
								this.reSave().then(this.finish).done(this.check);
							}else if (app.flag == 1) {
								this.save().then(this.finish).done(this.check);
							} else {
								this.save().done(this.check);
							}
						},
						//重新获取页面上所有数据
						reSave:function(showSuccMsg){
							this.save();
							var orderList = app.orderItemdList;
							console.log(orderList);
							var index = app.index;
							var itemList = [];
							if(orderList && orderList.length){
								for(var i=0; i<orderList.length; i++){
									if(i === index){
										itemList.push(app.OrderItemDto);
									}else{
										itemList.push(orderList[i]);
									}
								}
							}
							app.orderItemdtoList = itemList;
							console.log(app.orderItemdtoList);
							return app.post('order/1.0.0/saveOrder', {
								"CustOrderDto" : {
									"custOrderId" : app.custOrderId,
									"orderItemDtoList" : app.orderItemdtoList
								}
							}, function(data) {
								if(showSuccMsg){
									var opts = {};
								    fish.showToast('Save success!', opts);
								}
							});
						},
						saveClick : function() {
							if(!app.user){
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
								return;
							}
							if(app.modifyRes||app.modifyRes){
								this.reSave(true);
							}else{
								this.save(true);
							}
						},
						
						
						removeOldNbr :function (prefix,accNbr) {
							var oldNbrList = this.$(".js-num .old");
							
							var oldNbrDetailList = [];
							for (var i=0;i<oldNbrList.length;i++){
								if ($(oldNbrList[i]).hasClass("active")) {
									var prefix = $(oldNbrList[i]).find('.prefix').text();
									var accNbr = $(oldNbrList[i]).find('.accNbr').text();
									var oldNbr = {'prefix' :prefix,
										'accNbr': accNbr
									};
									oldNbrDetailList.push(oldNbr);
								}
								
							}
							
							app.oldNbrList = oldNbrDetailList;
						},
						
						nextMember : function(member) {
							

//							$("html, body").animate({"scrollTop": (($(this).offset().top)+50) + "px" }, 500, "swing");
		        			
							
						},
						save : function(showSuccMsg) {
							var orderItemdtoList = [];
							// bundle下必选产品和可选产品
							if (app.bundleItemDto) {
								orderItemdtoList.push(app.bundleItemDto);
								if(app.modifyRess){
									app.bundleItemDto = null;
								}
								
							}
							var subsPlanId = null;
							if (app.userType === 'single') {
								subsPlanId = app.subsPlanId;
							} else {
								subsPlanId = app.subsPlanIdBundle;
							}
							for ( var i = 0; i < app.members.length; i++) {
								var OrderItemDto = {};
								// var orderItemdtoList = [];
								var vasDtoList = [];
								var resourcelist = [];
								var id = "member" + i;
								var $currentTemplate = $('#' + id);
								var $currentActive = $currentTemplate
										.find('.number-box');
								if (app.userType === 'business') {
									for ( var j = 0; j < $currentActive.length; j++) {
										var resource = {};
										var $current = $($currentActive[j]);
										var price = $current.find(
												'.number-price').text();
										var prefix = $current.find('.prefix')
												.text();
										var simCardId = $current.find(
												'.simCardId').text();
										var acc_nbr = $current.find('.accNbr')
												.text();
										resource.prefix = prefix;
										resource.accNbr = acc_nbr;
										resource.simCardId = simCardId;
										resource.modelId = null;
										resource.esn = null;
										resource.offerId = null;
										resource.acctId = null;
										resourcelist.push(resource);
									}
								} else {
									for ( var j = 0; j < $currentActive.length; j++) {
										var resource = {};
										var $current = $($currentActive[j]);
										if ($current.hasClass("active")) {
											var price = $current.find(
													'.number-price').text();
											var prefix = $current.find(
													'.prefix').text();
											var acc_nbr = $current.find(
													'.accNbr').text();
											var simCardId = $current.find(
													'.simCardId').text();
											resource.prefix = prefix;
											resource.accNbr = acc_nbr;
											resource.simCardId = simCardId;
											resource.modelId = null;
											resource.esn = null;
											resource.offerId = null;
											// 存放accId
											resource.acctId = null;
											resourcelist.push(resource);
										}
									}
									// 个人套餐---个人套餐
									if (app.userType === 'single'
											&& app.isMigrate) {
										flag = true;
										var resource = {};
										resource.prefix = app.subs.prefix;
										resource.accNbr = app.subs.accNbr;
										resource.simCardId = app.subs.simCardId;
										resource.modelId = null;
										resource.esn = null;
										resource.offerId = null;
										resource.acctId = null;
										resourcelist.push(resource);
									}
								}
								OrderItemDto.resourceDtoList = resourcelist;
								var vasAttrDtoList = [];
								var currentOne = [];
								var currentMulti = [];
								var currentAll = [];
								currentOne = $currentTemplate
										.find('.select-one');
								currentMulti = $currentTemplate
										.find('.select-multiply');
								currentAll = $currentTemplate
										.find('.select-all');
								for ( var j = 0; j < currentOne.length; j++) {
									var $selectOne = $(currentOne[j]);
									var $currentOneM = $selectOne
											.find('.js-one-panel');
									for ( var k = 0; k < $currentOneM.length; k++) {
										var $currentOne = $($currentOneM[k]);
										var ret = {};
										var VasAttrDto = {};
										if ($currentOne.hasClass("active")) {
											ret.offerId = $currentOne
													.data('offerId');
											ret.offerGroupId = $currentOne
													.data('offerGroupid');
											ret.effType = $currentOne
													.data('effType');
											ret.offerName = $currentOne.find(
													'.panel-heading').text();
											ret.comments = $currentOne.find(
													'.highlight').text();
											var attr = $currentOne.find(
											'.cabin-select').val();
											if(attr){
											if(attr.split(',').length>1){
											VasAttrDto.attrId = attr.split(',')[0];
											VasAttrDto.attrValue = attr.split(',')[1];
											}
											ret.attr = attr;
											}
											ret.necessary = $currentOne
													.data('proNecessary');
											ret.groupType = $currentOne
													.data('groupType');
											// 个人---个人
//											if (app.flag === 2) {
//												ret.operationType = 'M';
//											} else {
												ret.operationType = 'A';
//											}
											if(VasAttrDto.attrId){
												vasAttrDtoList.push(VasAttrDto);
												ret.vasAttrDtoList = vasAttrDtoList;
											}
											vasDtoList.push(ret);
										}
									}
								}
								for ( var j = 0; j < currentMulti.length; j++) {
									var $selectMulti = $(currentMulti[j]);
									var $selectMultiM = $selectMulti
											.find('.js-multiply-panel');
									for ( var k = 0; k < $selectMultiM.length; k++) {
										var $currentMulti = $($selectMultiM[k]);
										var ret = {};
										var VasAttrDto = {};
										if ($currentMulti.hasClass("active")) {
											ret.offerId = $currentMulti
													.data('offerId');
											ret.offerGroupId = $currentMulti
													.data('offerGroupid');
											ret.effType = $currentMulti
													.data('effType');
											ret.offerName = $currentMulti.find(
													'.panel-heading').text();
											ret.saleListPrice = $currentMulti
													.find('.highlight').text();
											var attr = $currentMulti.find(
											'.cabin-select').val();
											if(attr){
											if(attr.split(',').length>1){
											VasAttrDto.attrId = attr.split(',')[0];
											VasAttrDto.attrValue = attr.split(',')[1];
											}
											ret.attr = attr;
											}
											ret.necessary = $currentMulti
													.data('proNecessary');
											ret.groupType = $currentMulti
													.data('groupType');
											// 个人---个人
//											if (app.flag === 2) {
//												ret.operationType = 'M';
//											} else {
												ret.operationType = 'A';
//											}
											if(VasAttrDto.attrId){
												vasAttrDtoList.push(VasAttrDto);
												ret.vasAttrDtoList = vasAttrDtoList;
											}
											vasDtoList.push(ret);
										}
									}

								}
								for ( var j = 0; j < currentAll.length; j++) {
									var $selectAll = $(currentAll[j]);
									var $currentAllM = $selectAll
											.find('.js-all-panel');
									for ( var k = 0; k < $currentAllM.length; k++) {
										var $currentAll = $($currentAllM[k]);
										var ret = {};
										var VasAttrDto = {};
										if ($currentAll.hasClass("active")) {
											ret.offerId = $currentAll
													.data('offerId');
											ret.offerGroupId = $currentAll
													.data('offerGroupid');
											ret.effType = $currentAll
													.data('effType');
											ret.offerName = $currentAll.find(
													'.panel-heading').text();
											ret.comments = $currentAll.find(
													'.highlight').text();
											var attr = $currentAll.find(
											'.cabin-select').val();
											if(attr){
											if(attr.split(',').length>1){
											VasAttrDto.attrId = attr.split(',')[0];
											VasAttrDto.attrValue = attr.split(',')[1];
											}
											ret.attr = attr;
											}
											ret.necessary = $currentAll
													.data('proNecessary');
											ret.groupType = $currentAll
													.data('groupType');
											// 个人---个人
//											if (app.flag === 2) {
//												ret.operationType = 'M';
//											} else {
												ret.operationType = 'A';
//											}
												if(VasAttrDto.attrId){
													vasAttrDtoList.push(VasAttrDto);
													ret.vasAttrDtoList = vasAttrDtoList;
												}
											vasDtoList.push(ret);
										}
									}
								}
								// 保存可选产品
								var currentOptionOne = [];
								var currenOptiontMulti = [];
								var currentOptionAll = [];
								currentOptionOne = $currentTemplate
										.find('.option-one');
								currenOptiontMulti = $currentTemplate
										.find('.option-multi');
								currentOptionAll = $currentTemplate
										.find('.option-all');
								for ( var j = 0; j < currentOptionOne.length; j++) {
									var $optionOne = $(currentOptionOne[j]);
									var $optionOneM = $optionOne
											.find('.js-one-option');
									for ( var k = 0; k < $optionOneM.length; k++) {
										var $currentOptionOne = $($optionOneM[k]);
										var ret = {};
										var VasAttrDto = {};
										if ($currentOptionOne
												.hasClass("active")) {
											ret.offerId = $currentOptionOne
													.data('offerId');
											ret.offerGroupId = $currentOptionOne
													.data('offerGroupid');
											ret.effType = $currentOptionOne
													.data('effType');
											ret.offerName = $currentOptionOne
													.find('.panel-heading')
													.text();
											ret.saleListPrice = $currentOptionOne
													.find('.highlight').text();
											var attr = $currentOptionOne.find(
											'.cabin-select').val();
											if(attr){
											if(attr.split(',').length>1){
											VasAttrDto.attrId = attr.split(',')[0];
											VasAttrDto.attrValue = attr.split(',')[1];
											}
											ret.attr = attr;
											}
											ret.necessary = $currentOptionOne
													.data('proNecessary');
											ret.groupType = $currentOptionOne
													.data('groupType');
											// 个人---个人
//											if (app.flag === 2) {
//												ret.operationType = 'M';
//											} else {
												ret.operationType = 'A';
//											}
												if(VasAttrDto.attrId){
													vasAttrDtoList.push(VasAttrDto);
													ret.vasAttrDtoList = vasAttrDtoList
												}
											vasDtoList.push(ret);
										}
									}
								}
								for ( var j = 0; j < currenOptiontMulti.length; j++) {
									var $optionMulti = $(currenOptiontMulti[j]);
									var $optionMultiM = $optionMulti
											.find('.js-multiply-option');
									for ( var k = 0; k < $optionMultiM.length; k++) {
										var ret = {};
										var VasAttrDto = {};
										var $currenOptiontMulti = $($optionMultiM[k]);
										if ($currenOptiontMulti
												.hasClass("active")) {
											ret.offerId = $currenOptiontMulti
													.data('offerId');
											ret.offerGroupId = $currenOptiontMulti
													.data('offerGroupid');
											ret.effType = $currenOptiontMulti
													.data('effType');
											ret.offerName = $currenOptiontMulti
													.find('.panel-heading')
													.text();
											ret.saleListPrice = $currenOptiontMulti
													.find('.highlight').text();
											var attr = $currenOptiontMulti.find(
											'.cabin-select').val();
											if(attr){
											if(attr.split(',').length>1){
											VasAttrDto.attrId = attr.split(',')[0];
											VasAttrDto.attrValue = attr.split(',')[1];
											}
											ret.attr = attr;
											}
											ret.necessary = $currenOptiontMulti
													.data('proNecessary');
											ret.groupType = $currenOptiontMulti
													.data('groupType');
											// 个人---个人
//											if (app.flag === 2) {
//												ret.operationType = 'M';
//											} else {
												ret.operationType = 'A';
//											}
												if(VasAttrDto.attrId){
													vasAttrDtoList.push(VasAttrDto);
													ret.vasAttrDtoList = vasAttrDtoList
												}
											vasDtoList.push(ret);
										}
									}
								}
								for ( var j = 0; j < currentOptionAll.length; j++) {
									var $optionAll = $(currentOptionAll[j]);
									var $optionAllM = $optionAll
											.find('.js-all-option');
									for ( var k = 0; k < $optionAllM.length; k++) {
										var $currentOptionAll = $($optionAllM[k]);
										var ret = {};
										var VasAttrDto = {};
										if ($currentOptionAll
												.hasClass("active")) {
											ret.offerId = $currentOptionAll
													.data('offerId');
											ret.offerGroupId = $currentOptionAll
													.data('offerGroupid');
											ret.effType = $currentOptionAll
													.data('effType');
											ret.offerName = $currentOptionAll
													.find('.panel-heading')
													.text();
											ret.saleListPrice = $currentOptionAll
													.find('.highlight').text();
											var attr = $currentOptionAll.find(
											'.cabin-select').val();
											if(attr){
											if(attr.split(',').length>1){
											VasAttrDto.attrId = attr.split(',')[0];
											VasAttrDto.attrValue = attr.split(',')[1];
											}
											ret.attr = attr;
											}
											ret.necessary = $currentOptionAll
													.data('proNecessary');
											ret.groupType = $currentOptionAll
													.data('groupType');
											// 个人---个人
//											if (app.flag === 2) {
//												ret.operationType = 'M';
//											} else {
												ret.operationType = 'A';
//											}
												if(VasAttrDto.attrId){
													vasAttrDtoList.push(VasAttrDto);
													ret.vasAttrDtoList = vasAttrDtoList;
												}
											vasDtoList.push(ret);
										}
									}
								}
								OrderItemDto.vasDtoList = vasDtoList;
								// 保存手机信息
								var Phones = [];
								Phones = $currentTemplate.find('.phone-btn');
								for ( var j = 0; j < Phones.length; j++) {
									var $phone = $(Phones[j]);
									var ret = {};
									if ($phone.hasClass('active')) {
										ret.modelId = $phone.data('modelId');
										ret.offerId = $phone.data('offerId');
										ret.offerType = $phone
												.data('offerType');
										ret.modelName = $phone.find(
												'.phone-name').text();
										// 个人---个人
//										if (app.flag === 2) {
//											ret.operationType = 'M';
//										} else {
											ret.operationType = 'A';
//										}
										vasDtoList.push(ret);
									}
								}
								OrderItemDto.subsPlanId = subsPlanId;
								OrderItemDto.qty = resourcelist.length;
								OrderItemDto.resourceDtoList = resourcelist;
								OrderItemDto.vasDtoList = vasDtoList;
								orderItemdtoList.push(OrderItemDto);
								if(i === 0){
									app.OrderItemDto = OrderItemDto;
								}
							}
							console.log("+++++++++++++++++++++++++++++++");
							console.log(orderItemdtoList);
							app.orderItemdtoList = orderItemdtoList;

							// // 订单保存
							if(!app.modifyRes && !app.prev){
								return app.post('order/1.0.0/saveOrder', {
									"CustOrderDto" : {
										"custOrderId" : app.custOrderId,
										"orderItemDtoList" : orderItemdtoList
									}
								}, function(data) {
									if(showSuccMsg) {
									    var opts = {};
									    fish.showToast('Save success!', opts);
									}
								});

							}
							
						},
						prev : function() {
							if (app.userType === 'single') {
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
							} else {
								//修改bundle标识
								app.reModifyBundle = true;
								//单个修改标识
								app.modifyRes = false;
								app.prev = true;
								this.save();
								app.prev = false;
								app.router.navigate('choose/group', {
									"members" :app.members,
									trigger : true
								});
							}
						},
						fee:function(){
							this.$fee.attr('disabled',true);
							if(app.modifyRes){
								this.reSave().done(this.feeNext);
							}else{
								this.save().done(this.feeNext);
							}
							
						},
						feeNext:function(){
							app.reModifyBundle = false;
							app.modifyRes = false;
							app.router.navigate('choose/fee', {
								trigger : true
							});
						}
					});

			return PricePlanView;
		});