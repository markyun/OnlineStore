/**
 * Created by huangxinghui on 2015/2/13.
 */
define(
		[
				'app',
				'text!modules/product/templates/ChooseOptionalProductTemplate.html',
				'text!modules/product/templates/OptionProductMultipleTemplate.html',
				'text!modules/product/templates/OptionProductOneTemplate.html',
				'text!modules/product/templates/OptionProductAllTemplate.html' ],
		function(app, template, optionMultiTemplate, optionOneTemplate,
				allTemplate) {
			var ChooseOptionalProductView = Backbone.View
					.extend({
						events : {
							'click .js-one-option' : 'chooseOne',
							'click .js-multiply-option' : 'chooseMulti',
							'click .js-all-option' : 'allOption'
						},
						initializeMember : function() {
							var order = app.orderItemdtoList;
							var index = app.index;
							var one = [];
							var multi = [];
							var all = [];
							app.one = [];
							app.multi = [];
							app.all = [];
							if (order && index >= 0) {
								var vasDtoList = order[index].vasDtoList;
								for ( var j = 0; j < vasDtoList.length; j++) {
									var vasDto = vasDtoList[j];
									if (vasDto.necessary === 0) {
										if (vasDto.groupType === 'B') {
											one.push(vasDto.offerId);
										} else if (vasDto.groupType === 'C') {
											multi.push(vasDto.offerId);
										}else if (vasDto.groupType === 'A') {
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
								if (order && order.length>step) {
									var vasDtoList = order[step].vasDtoList;
									for ( var j = 0; j < vasDtoList.length; j++) {
										var vasDto = vasDtoList[j];
										if (vasDto.necessary === 0) {
											if (vasDto.groupType === 'B') {
												one.push(vasDto.offerId);
											} else if (vasDto.groupType === 'C') {
												multi.push(vasDto.offerId);
											}else if (vasDto.groupType === 'A') {
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
							this.$oneChoice = this.$('.js-option-one');
							this.$multiplyChoice = this
									.$('.js-option-multiply');
							this.$allChoice = this.$('.option-all');
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
										&& necessary === 0) {
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
										that.$oneChoice.after(_.template(
												optionOneTemplate, {
													'optionone' : productOne,
													'indexss' : i,
													"groupName" : groupName
												}));
									}
								} else if (allProduct[i].groupType === 'C'
										&& necessary === 0) {
									var groupName = allProduct[i].offerGroupName;
									var productMulti = [];
									if (!allProduct[i].offerDtoList.length) {
										if (!allProduct[i].offerDtoList.boundOfferGroup) {
											productMulti
													.push(allProduct[i].offerDtoList);
										}

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
																optionMultiTemplate,
																{
																	'optionmulti' : productMulti,
																	"groupName" : groupName
																}));
									}
								} else if (allProduct[i].groupType === 'A'
										&& necessary === 0) {
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
										that.$allChoice.after(_.template(
												allTemplate, {
													'allTemplate' : productAll,
													"groupName" : groupName
												}));
									}
								}
							}
							this.$next = this.$('.js-choose');
							if (app.orderItemdtoList) {
								if (app.one.length > 0) {
									var $current = this.$el
											.find('.js-one-option');
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
											.find('.js-multiply-option');
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
								if (app.all.length > 0) {
									var $current = this.$el
											.find('.js-all-option');
									for ( var i = 0; i < $current.length; i++) {
										var $currentAll = $($current[i]);
										for ( var j = 0; j < app.all.length; j++) {
											if (app.all[j] === $currentAll
													.data('offerId')) {
												$currentAll.addClass('active')
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
							if (!$current.hasClass('active')) {
								this.$oneChoice.find('.active').removeClass(
										'active').find('.cabin-btn').html(
										'Choose');
								$current.addClass('active').find('.cabin-btn')
										.html('✔');
							} else {
								$current.removeClass('active').find(
										'.cabin-btn').html('Choose');
							}

							this.$next.attr('disabled', false);
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
							this.$next.attr('disabled', false);
						},
						allOption : function(e) {
							var $current = $(e.currentTarget);
							if (!$current.hasClass('active')) {
								this.$el.find('.js-all-option').addClass(
										'active').find('.cabin-btn').html('✔');
							} else {
								this.$el.find('.js-all-option').removeClass(
										'active').find('.cabin-btn').html(
										'Choose');
							}
						}
					});
			return ChooseOptionalProductView;
		});