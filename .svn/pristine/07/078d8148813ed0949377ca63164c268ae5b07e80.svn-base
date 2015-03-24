/**
 * Created by huangxinghui on 2015/2/13.
 */
define(
		[
				'app',
				'text!modules/product/templates/ChooseMandatoryProductTemplate.html',
				'text!modules/product/templates/MandatoryProductOneTemplate.html',
				'text!modules/product/templates/MandatoryProductMultipleTemplate.html',
				'text!modules/product/templates/MandatoryProductAllTemplate.html' ],
		function(app, template, mandOneTemplate, mandMultiTemplate, allTemplate) {
			var ChooseMandatoryProductView = Backbone.View
					.extend({
						events : {
							'click .js-one-panel' : 'chooseOne',
							'click .js-multiply-panel' : 'chooseMulti'
						},
						initializeMember : function() {
							//获取save中信息
							var order = app.orderItemdtoList;
							var index = app.index;
							var one = [];
							var multi = [];
							var all = [];
							//保存单选
							app.one = [];
							//保存多选
							app.multi = [];
							//保存全选
							app.all = [];
							if (order && index >= 0) {
								var vasDtoList = order[index].vasDtoList;
								for ( var j = 0; j < vasDtoList.length; j++) {
									var vasDto = vasDtoList[j];
									if (vasDto.necessary === 1) {
										if (vasDto.groupType === 'B') {
											one.push(vasDto.offerId);
										} else if (vasDto.groupType === 'C') {
											multi.push(vasDto.offerId);
										} else if (vasDto.groupType === 'A') {
											all.push(vasDto.offerId);
										}
									}
								}
								app.one = one;
								app.multi = multi;
								app.all = all;
							}
						},
						initializeMemberAdd:function(member){
							this.member = member;
							app.one = [];
							app.multi = [];
							app.all = [];
							if(app.reModifyBundle){
								var order = app.orderItemdtoList;
								var one = [];
								var multi = [];
								var all = [];
								var step = this.member.number;
								if (order && order.length > step) {
									var vasDtoList = order[step].vasDtoList;
									for ( var j = 0; j < vasDtoList.length; j++) {
										var vasDto = vasDtoList[j];
										if (vasDto.necessary === 1) {
											if (vasDto.groupType === 'B') {
												one.push(vasDto.offerId);
											} else if (vasDto.groupType === 'C') {
												multi.push(vasDto.offerId);
											} else if (vasDto.groupType === 'A') {
												all.push(vasDto.offerId);
											}
										}
									}
									app.one = one;
									app.multi = multi;
									app.all = all;
								}
							}
						},
						render : function() {
							if(app.modifyRes){
								this.initializeMember();
							}
							this.$el.append(template);
							this.$oneChoice = this.$('.js-one');
							this.$multiplyChoice = this.$('.js-multiply');
							this.$allChoice = this.$('.js-all');
							var that = this;
							var data = null;
							if (app.userType === 'single') {
								data = app.SubsPlanDetailDto;
							} else {
								data = app.subsBundleDetail;
							}
							var allProduct = [];
							if (data.offerGroupDtoList.length) {
								allProduct = data.offerGroupDtoList;
							} else {
								allProduct.push(data.offerGroupDtoList);
							}
							for ( var i = 0; i < allProduct.length; i++) {
								var necessary = allProduct[i].necessary;
								if (allProduct[i].groupType === 'B'
										&& necessary === 1) {
									var groupName = allProduct[i].offerGroupName;
									var productOne = [];
									if (!allProduct[i].offerDtoList.length) {
										if (!allProduct[i].offerDtoList.boundOfferGroup) {
											productOne
													.push(allProduct[i].offerDtoList);
										}
									} else {
										for ( var j = 0; j < allProduct[i].offerDtoList.length; j++) {
											if (!allProduct[i].offerDtoList[j].boundOfferGroup) {
												productOne
														.push(allProduct[i].offerDtoList[j]);
											}
										}
									}
									if (productOne.length > 0) {
										that.$oneChoice
												.after(_
														.template(
																mandOneTemplate,
																{
																	'mandatoryone' : productOne,
																	'indexss' : i,
																	"groupName" : groupName
																}));
									}

								} else if (allProduct[i].groupType === 'C'
										&& necessary === 1) {
									var groupName = allProduct[i].offerGroupName;
									var productMulti = [];
									if (!allProduct[i].offerDtoList.length) {
										if (!allProduct[i].offerDtoList.boundOfferGroup) {
										}
										productMulti
												.push(allProduct[i].offerDtoList);
									} else {
										for ( var j = 0; j < allProduct[i].offerDtoList.length; j++) {
											if (!allProduct[i].offerDtoList[j].boundOfferGroup) {
												productMulti
														.push(allProduct[i].offerDtoList[j]);
											}
										}
									}
									if (productMulti.length > 0) {
										that.$multiplyChoice
												.after(_
														.template(
																mandMultiTemplate,
																{
																	'mandatorymulti' : productMulti,
																	'indexss' : i,
																	"groupName" : groupName
																}));
									}

								} else if (allProduct[i].groupType === 'A'
										&& necessary === 1) {
									var groupName = allProduct[i].offerGroupName;
									var productAll = [];
									if (!allProduct[i].offerDtoList.length) {
										if (!allProduct[i].offerDtoList.boundOfferGroup) {
											productAll
													.push(allProduct[i].offerDtoList);
										}

									} else {
										for ( var j = 0; j < allProduct[i].offerDtoList.length; j++) {
											if (!allProduct[i].offerDtoList[j].boundOfferGroup) {
												productAll
														.push(allProduct[i].offerDtoList[j]);
											}

										}
									}
									if (productAll.length > 0) {
										that.$allChoice
												.after(_
														.template(
																allTemplate,
																{
																	'mandatoryall' : productAll,
																	"groupName" : groupName
																}));
									}
								}
							}
							if (app.orderItemdtoList) {
								if (app.one.length > 0) {
									var $current = this.$el
											.find('.js-one-panel');
									for ( var i = 0; i < $current.length; i++) {
										var $currentOne = $($current[i]);
										for ( var j = 0; j < app.one.length; j++) {
											if (app.one[j] === $currentOne
													.data('offerId')) {
												var step = $currentOne
														.data('indexStep');
												this.$el.find('.' + step)
														.removeClass('active')
														.find('.cabin-btn')
														.html('Choose');
												$currentOne.addClass('active')
														.find('.cabin-btn')
														.html('✔');
											}
										}
									}
								}
								if (app.multi.length > 0) {
									var $current = this.$el
											.find('.js-multiply-panel');
									for ( var i = 0; i < $current.length; i++) {
										var $currentMulti = $($current[i]);
										for ( var j = 0; j < app.multi.length; j++) {
											if (app.multi[j] === $currentMulti
													.data('offerId')) {
												$currentMulti
														.addClass('active')
														.find('.cabin-btn')
														.html('✔');
											}
										}
									}
								}
							}
							return this;
						},
						chooseOne : function(e) {
							var $current = $(e.currentTarget);
							var index = $current.data('indexStep');
							if (!$current.hasClass('active')) {
								this.$el.find('.' + index)
										.removeClass('active').find(
												'.cabin-btn').html('Choose');
								$current.addClass('active').find('.cabin-btn')
										.html('✔');
							}

						},

						chooseMulti : function(e) {
							var $current = $(e.currentTarget);
							if (!$current.hasClass('active')) {
								$current.addClass('active').find('.cabin-btn')
										.html('✔');
							} else {
								$current.removeClass('active').find(
										'.cabin-btn').html('Choose');
							}
							var multiActive = this.$el
									.find('.js-multiply-panel');
							var count = 0;
							for ( var i = 0; i < multiActive.length; i++) {
								var $currentActive = $(multiActive[i]);
								if ($currentActive.hasClass('active')) {
									count++;
								}
							}
							if (multiActive.length > 0) {
								if (count === 0) {
									$(multiActive[0]).addClass('active').find(
											'.cabin-btn').html('✔');
								}
							}
						},

						setSelection : function($panel) {
							if (!$panel.hasClass('active')) {
								$panel.addClass('active').find('.cabin-btn')
										.html('✔');
							}
						},
						removeSelection : function($panel) {
							if ($panel.hasClass('active')) {
								$panel.removeClass('active').find('.cabin-btn')
										.html('Choose');
							}
						}
					});
			return ChooseMandatoryProductView;
		});