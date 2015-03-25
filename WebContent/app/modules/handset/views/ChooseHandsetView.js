/**
 * Created by huangxinghui on 2015/2/13.
 */
define(
		[ 'app', 'text!modules/handset/templates/ChooseHandsetTemplate.html',
				'text!modules/handset/templates/PartialChooseHandsetTemplate.html' ],
		function(app, template, partialTemp) {
			var ChooseHandsetView = Backbone.View
					.extend({
						template : _.template(template),
						attributes : {
							style : 'display: none'
						},
						events : {
							'click .btn-phone' : 'choose',
							'click .filter_choose' : 'filter',
							'click .brand_li' : 'chooseBrand',
							'click .js-cancel' : 'cancel',
							'click .js-submit' : 'submit',
							'click .glyphicon-remove' : 'remove'
						},
						initializeMember : function() {
							var order = app.orderItemdtoList;
							var index = app.index;
							var onePhone = [];
							app.onePhone = [];
							if (order && index >= 0) {
								var vasDtoList = order[index].vasDtoList;
								for ( var j = 0; j < vasDtoList.length; j++) {
									var vasDto = vasDtoList[j];
									if(vasDtoList){
									if (vasDto.modelId) {
										onePhone.push(vasDto.modelId);
									}
									}
								}
								app.onePhone = onePhone;
							}
						},
						initializeMemberAdd : function(member) {
							this.member = member;
							app.onePhone = [];
							if (app.reModifyBundle) {
								var order = app.orderItemdtoList;
								var onePhone = [];
								var step = this.member.number;
								if (order && order.length > step) {
									var vasDtoList = order[step].vasDtoList;
									if(vasDtoList){
									for ( var j = 0; j < vasDtoList.length; j++) {
										var vasDto = vasDtoList[j];
										if (vasDto.modelId) {
											onePhone.push(vasDto.modelId);
										}
									}
									}
									app.onePhone = onePhone;
								}
							}
						},
						render : function() {
							if (app.modifyRes) {
								this.initializeMember();
							}
							app.sortByPriceFlag = 0;
							var phones = [];
							var data = null;
							if (app.userType === 'single') {
								data = app.SubsPlanDetailDto;
							} else {
								data = app.subsBundleDetail;
							}
							if (data.offerGroupDtoList.length) {
								phones = data.offerGroupDtoList;
							} else {
								phones.push(data.offerGroupDtoList);
							}
							var phone = [];
							var brands = [];
							app.brands = [];
							var offerId = null;
							var effType = null;
							for ( var i = 0; i < phones.length; i++) {
								if (!phones[i].offerDtoList.length) {
									if (phones[i].offerDtoList.boundOfferGroup) {
										offerId = phones[i].offerDtoList.offerId;
										effType = phones[i].offerDtoList.effType;
										var boundOfferGroup = phones[i].offerDtoList.boundOfferGroup;
										if (boundOfferGroup.offerDtoList.length) {
											phone = boundOfferGroup.offerDtoList;
										} else {
											phone
													.push(boundOfferGroup.offerDtoList);
										}
									}

								} else {
									for ( var j = 0; j < phones[i].offerDtoList.length; j++) {
										if (phones[i].offerDtoList[j].boundOfferGroup) {
											offerId = phones[i].offerDtoList.offerId;
											effType = phones[i].offerDtoList.effType;
											var boundOfferGroup = phones[i].offerDtoList[j].boundOfferGroup;
											if (boundOfferGroup.offerDtoList.length) {
												phone = boundOfferGroup.offerDtoList;
											} else {
												phone
														.push(boundOfferGroup.offerDtoList);
											}
										}

									}
								}
							}
							for ( var i = 0; i < phone.length; i++) {
								brands.push(phone[i].goodsProdSpec.brandName);
							}
							for ( var i = 0; i < app.brands.length; i++) {
								if (i === 0) {
									brands.push(app.brands[i]);
								} else {
									var flag = true;
									for ( var j = 0; j < brands.length; j++) {
										if (app.brands[i] === brands[j]) {
											flag = false;
											break;
										}
									}
									if (flag) {
										brands.push(app.brands[i]);
									}
								}

							}
							var that = this;
							that.$el.append(_.template(template, {
								'brands' : brands
							}));
							this.$wrapper = this.$('.js-wrap');
							that.$wrapper.html(_.template(partialTemp, {
								'phones' : phone,
								'efferId' : offerId,
								'effType' : effType,
							}));
							app.offerId = offerId;
							app.effType = effType;
							if (app.orderItemdtoList) {
								if (app.onePhone.length > 0) {
									var $current = this.$el.find('.cabin-btn');
									for ( var i = 0; i < $current.length; i++) {
										var $currentMulti = $($current[i]);
										for ( var j = 0; j < app.onePhone.length; j++) {
											if (app.onePhone[j] === $currentMulti
													.data('modelId')) {
												$currentMulti
														.addClass('active')
														.html('✔');
											}
										}
									}
								}
							}
							app.phones = phone;
							setTimeout(this.setimg, 55);
							return this;
						},
						setimg : function() {
							$(".phone-name").each(
									function() {
										if ($(this).text() == 'Sumsung S5') {
											$(this).parents(".phone-box").find(
													"img").attr("src",
													"img/s5.png");
										}
										;
										if ($(this).text() == 'Sumsung S4') {
											$(this).parents(".phone-box").find(
													"img").attr("src",
													"img/s42.png");
										}
										;
									});
						},
						show : function(phones) {
							var that = this;
							that.$wrapper.empty();
							that.$wrapper.html(_.template(partialTemp, {
								'phones' : phones,
								'efferId' : app.offerId,
								'effType' : app.effType,
							}));
							setTimeout(this.setimg, 55);
						},
						choose : function(e) {
							var $current = $(e.currentTarget);
							if (!$current.hasClass('active')) {
								this.$wrapper.find('.active').removeClass(
										'active').html('Choose');
								$current.addClass('active').html('✔');
							} else {
								this.$wrapper.find('.active').removeClass(
										'active').html('Choose');
							}
						},
						filter : function(event) {
							this.$(".filter_choose_div").slideToggle(200);
						},
						chooseBrand : function(e) {
							var $current = $(e.currentTarget);
							if (!$current.hasClass('active')) {
								$('.brand_li').removeClass('active');
								$current.addClass('active');
							} else {
								$current.removeClass('active');
							}
						},
						chooseColor : function(e) {
							var $current = $(e.currentTarget);
							if (!$current.hasClass('active')) {
								$('.color_li').removeClass('active');
								$current.addClass('active');
							} else {
								$current.removeClass('active');
							}
						},
						chooseCamera : function(e) {
							var $current = $(e.currentTarget);
							if (!$current.hasClass('active')) {
								$('.camera_li').removeClass('active');
								$current.addClass('active');
							} else {
								$current.removeClass('active');
							}
						},
						cancel : function() {
							this.$(".filter_choose_div").slideToggle(200);
						},
						submit : function() {
							var chosedElement = $('.active');
							for ( var i = 0; i < chosedElement.length; i++) {
								if ($(chosedElement[i]).hasClass('brand_li')) {
									app.brand = $(chosedElement[i]).text();
								}
							}
							app.matchedphones = this.filterByBrand(app.phones,
									app.brand);
							var that = this;
							that.$wrapper.empty();
							console.log(app.matchedphones);
							that.$wrapper.html(_.template(partialTemp, {
								'phones' : app.matchedphones,
								'efferId' : app.offerId,
								'effType' : app.effType,
							}));
							setTimeout(this.setimg, 55);
							if (app.brand) {
								this.$('.val').html(app.brand);
								this.$('.brand_chosed')
										.css('display', 'inline');
							}
							this.$(".filter_choose_div").slideToggle(200);
						},
						filterByBrand : function(phones, brand) {
							var matchPhones = [];
							if (brand && phones.length) {
								for ( var i = 0; i < phones.length; i++) {
									if (phones[i].goodsProdSpec.brandName === brand) {
										matchPhones.push(phones[i]);
									}
								}
								return matchPhones;
							} else {
								return phones;
							}
						},
						remove : function() {
							this.$('.val').empty();
							this.$('.brand_chosed').css('display', 'none');
							this.show(app.phones);
						}

					});

			return ChooseHandsetView;
		});
