define([ 'app', 'text!templates/MigrateTemplate.html',
		'text!templates/MigrateSubsTemplate.html' ], function(app, template,
		subsTemplate) {
	var MigrateView = Backbone.View.extend({
		template : _.template(template),
		events : {
			'click .js-next' : 'changePlan',
		},
		render : function() {
			this.$el.append(template);
			var that = this;
			this.$migrate = this.$('.migrate-body');
			app.isMigrate = true;
			console.log(app.user.custId);
			app.post('subs/1.0.0/querySubsList', {
				"QuerySubsListParamDto" : {
					"custId" : app.user.custId
				}
			}, function(data) {
				app.subsList = data.SubsListDto.subsDtoList;
				console.log(data);
				var subsDetail = [];
				if(data.SubsListDto.subsDtoList) {
					if (data.SubsListDto.subsDtoList.length) {
						subsDetail = data.SubsListDto.subsDtoList;
					} else {
						subsDetail.push(data.SubsListDto.subsDtoList);
					}
				}
				for ( var i = 0; i < subsDetail.length; i++) {
					var subs = subsDetail[i];
					if(subs.completedDate){
					if (subs.completedDate.length > 10) {
						subsDetail[i].completedDate = subs.completedDate
								.substring(0, 10);
					}
					}
					if(subs.prodExpDate){
					if (subs.prodExpDate.length > 10) {
						subsDetail[i].prodExpDate = subs.prodExpDate
								.substring(0, 10);
					}
					}
				}
				app.subsList = subsDetail;
				that.$migrate.html(_.template(subsTemplate, {
					'subs' : subsDetail,
				}));
			});
			return this;
		},
		changePlan : function(e) {
			var $current = $(e.currentTarget);
			var subsId = $current.data('subsId');
			var index = $current.data('index');
			app.subsId = subsId;
			app.subs = app.subsList[index];
			app.accNbr = app.subsList[index].accNbr;
			app.prefix = app.subsList[index].prefix;
			console.log(app.subs);
			app.router.navigate('choose/offer', {
				trigger : true
			});
		}
	});
	return MigrateView;
});