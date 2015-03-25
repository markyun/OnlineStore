/**
 * Created by huangxinghui on 2015/2/13.
 */
define(
		[ 'app', 'text!templates/QueryFeeTemplate.html', 'views/OrderView' ],
		function(app, template, OrderView) {
			var CheckOrderView = Backbone.View
					.extend({
						events : {
							'click .modify' : 'modifyVas',
							'click .js-showdetail' : 'detailAll',
							'click .modifyBundle' : 'modifyBundle',
							'click .js-prev' : 'prev',
						},

						render : function() {
							var custOrderId = app.custOrderId;
							console.log(custOrderId);
							var that = this;
							app
									.get(
											'order/1.0.0/queryOrderFee',
											[ custOrderId ],
											function(data) {
												console.log(data);
												var orderFeeList = [];
												var bundleFeeList = [];
												var feeDetailList = [];
												var otcAllTotal = 0;
												var mrcAllTotal = 0;
												var orderFee = data.OrderFeeResultDto.orderFeeList;
												if (orderFee.length === undefined) {

													orderFeeList.push(orderFee);

												} else {
													orderFeeList = orderFee;
												}

												for ( var i = 0; i < orderFeeList.length; i++) {
													var otcPriceTotal = 0;
													var otcVasPriceTotal = 0;
													var mrcPriceTotal = 0;
													var mrcVasPriceTotal = 0;
													var mrcTotal = 0;
													var otcTotal = 0;
													var feeDetail;
													var accNbrDetail;
													var accNbrList = [];
													if (orderFeeList[i].accNbrList != undefined) {
														accNbrDetail = orderFeeList[i].accNbrList;
														if (accNbrDetail.length === undefined) {
															accNbrList
																	.push(accNbrDetail);
														} else {
															accNbrList = accNbrDetail;
														}
														orderFeeList[i].accNbrList = accNbrList;
													}
													if (orderFeeList[i].feeDetailList != undefined) {
														feeDetail = orderFeeList[i].feeDetailList;
														if (feeDetail.length === undefined) {

															feeDetailList
																	.push(feeDetail);

														} else {
															feeDetailList = feeDetail;
														}
														for ( var j = 0; j < feeDetailList.length; j++) {
															mrcPriceTotal += feeDetailList[j].mrc;
															mrcVasPriceTotal += feeDetailList[j].mrcVat;
															otcPriceTotal += feeDetailList[j].otc;
															otcVasPriceTotal += feeDetailList[j].otcVat;

														}
														orderFeeList[i].mrcPriceTotal = mrcPriceTotal / 10000;
														orderFeeList[i].mrcVasPriceTotal = mrcVasPriceTotal / 10000;
														orderFeeList[i].otcPriceTotal = otcPriceTotal / 10000;
														orderFeeList[i].otcVasPriceTotal = otcVasPriceTotal / 10000;
														mrcTotal += mrcPriceTotal;
														otcTotal += otcPriceTotal;
														if (app.userType === "business") {
															mrcTotal = orderFeeList[i].accNbrList.length
																	* mrcTotal;
															otcTotal = orderFeeList[i].accNbrList.length
																	* otcTotal;
														}
														orderFeeList[i].mrcTotal = mrcTotal / 10000;
														orderFeeList[i].otcTotal = otcTotal / 10000;

													} else {
														orderFeeList[i].feeDetailList = null;

													}
												}
												if (data.OrderFeeResultDto.bundleFeeList != undefined) {

													bundleFeeList = data.OrderFeeResultDto.bundleFeeList;

													var otcBundlePriceTotal = 0;
													var otcVatBundlePriceTotal = 0;
													var mrcBundlePriceTotal = 0;
													var mrcVatBundlePriceTotal = 0;
													for ( var i = 0; i < bundleFeeList.length; i++) {

														mrcBundlePriceTotal += bundleFeeList[i].mrc;
														mrcVatBundlePriceTotal += bundleFeeList[i].mrcVat;
														otcBundlePriceTotal += bundleFeeList[i].otc;
														otcVatBundlePriceTotal += bundleFeeList[i].otcVat;
													}
													bundleFeeList.mrcBundlePriceTotal = mrcBundlePriceTotal / 10000;
													bundleFeeList.mrcVatBundlePriceTotal = mrcVatBundlePriceTotal / 10000;
													bundleFeeList.otcBundlePriceTotal = otcBundlePriceTotal / 10000;
													bundleFeeList.otcVatBundlePriceTotal = otcVatBundlePriceTotal / 10000;
													app.bundleOtcTotal += otcBundlePriceTotal / 10000;

												} else {
													bundleFeeList = null;
												}

												_
														.each(
																orderFeeList,
																function(
																		orderFee,
																		groupIndex,
																		orderFeeList) {

																	otcAllTotal += orderFee.otcTotal;
																	mrcAllTotal += orderFee.mrcTotal;
																});
												if (bundleFeeList != null) {
													otcAllTotal = otcAllTotal
															+ bundleFeeList.otcBundlePriceTotal;
													mrcAllTotal = mrcAllTotal
															+ bundleFeeList.mrcBundlePriceTotal;
												} else {
													otcAllTotal = otcAllTotal;
													mrcAllTotal = mrcAllTotal;
												}
												app.otcAllTotal = otcAllTotal;
												app.mrcAllTotal = mrcAllTotal;
												console.log(bundleFeeList);
												console.log(orderFeeList);

												that.$el
														.append(_
																.template(
																		template,
																		{
																			'bundleFeeList' : bundleFeeList,
																			'orderFeeList' : orderFeeList,
																			'userType' : app.userType,
																			'otcAllTotal' : app.otcAllTotal,
																			'mrcAllTotal' : app.mrcAllTotal,
																			'subsPlanName' : app.subsPlanName,

																		}));
											});
							// setTimeout(function () {
							// $('.blockUI').empty();
							// this.$('.js-prev').attr('disabled',false);
							// this.$('.js-save').attr('disabled',false);
							// this.$('.js-confirm').attr('disabled',false);
							// },20000);
							this.$js_confirm = this.$('.js-confirm');
							return this;
						},

						modifyVas : function(e) {
							if (!app.orderView) {
								app.orderView = new OrderView();
							}
							var $current = $(e.currentTarget);
							var index = $current.data('index');
							app.orderItemdList = app.orderItemdtoList;
							app.modifyRes = true;
							app.reModifyBundle = false;
							if (app.userType === 'single') {
								app.index = index;
							} else {
								app.index = index + 1;
							}
							var orderList = app.orderItemdList;

							if (app.userType === "family") {
								if (orderList.length > app.index) {
									app.modifyaccNbr = orderList[app.index].resourceDtoList[0].accNbr;
									app.modifyprefix = orderList[app.index].resourceDtoList[0].prefix;
								}
							} else if (app.userType === "business") {
								if (orderList.length > app.index) {
									app.NumbersList = orderList[app.index].resourceDtoList;
								}

							}

							console.log(app.modifyNumber);
							this.$content = $('.panel-body');
							if (app.userType === 'single' && app.isMigrate) {
								app.members = [ {
									number : '1',
									step : 0,
									mandatoryProduct : {},
									optionalProduct : {},
									handset : {}
								} ];
								app.router.navigate('choose/pricePlan', {
									trigger : true
								});
							} else {
								app.members = [ {
									'index' : '1',
									'total' : '1',
									step : 0,
								} ];
								app.router.navigate('choose/pricePlan', {
									trigger : true
								});
							}
						},
						detailAll : function(e) {
							var $current = $(e.currentTarget);
							var groupIndex = $current.data('groupIndex');
							app.groupIndex = groupIndex;
							require([ 'views/NumberDetailView' ], function(
									NumberDetailView) {
								var numberDetail = new NumberDetailView();
								numberDetail.render().$el
										.appendTo(document.body);
								numberDetail.$el.dialog({
									autoOpen : true,
									modal : true,
									width : 350,
								});
							});
						},

						modifyBundle : function() {
							app.reModifyBundle = true;
							app.modifyRes = false;
							app.router.navigate('choose/group', {
								trigger : true
							});
						},

						prev : function() {
							app.reModifyBundle = true;
							app.modifyRes = false;
							app.orderItemdList = app.orderItemdtoList;
							// 根据选择的人数来，添加menbers
							if (app.userType === 'family') {
								app.members = [];
								for ( var i = 0; i < app.num; i++) {
									app.members[i] = {
										number : i + 1,
										step : 0,
										orderItem : app.orderItemdtoList[i + 1],
										isFinished : true
									};
								}
							} else if (app.userType === 'business') {
								console.log(app.orderItemdList);
								var orderItem = app.orderItemdtoList;
								for ( var i = 0; i < orderItem.length - 1; i++) {
									app.members[i] = {
										number : i + 1,
										'groupPerNum' : orderItem[i + 1].qty,
										'resourceDtoList' : orderItem[i + 1].resourceDtoList,
										'step' : 0,
										'isFinished' : true
									};
								}
							} else {
								app.modifyRes = true;
								app.reModifyBundle = false;
								app.index = 0;
								app.members[0] = {
									number : 1,
									step : 0
								}
							}
							console.log(app.orderItemdtoList);
							app.router.navigate('choose/pricePlan', {
								trigger : true
							});
						},

					});

			return CheckOrderView;
		});