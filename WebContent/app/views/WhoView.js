/**
 * Created by huangxinghui on 2015/2/13.
 */
define(['text!templates/WhoTemplate.html'], function(template) {
    var WhoView = Backbone.View.extend({
        tagName: 'section',
        className: 'row',
        template: template,

        events: {
            'click .thumbnail': 'choose'
        },

        render: function () {
            this.$el.append(this.template);
            this.$next = this.$('.js-next');
            return this;
        },

        choose: function (e) {
            var $current = $(e.currentTarget);
            if (!$current.hasClass('active')) {
                $('.thumbnail').removeClass('active');
                $current.addClass('active');
            }

            this.$next.attr('disabled', false);
        }
    });

    return WhoView;
});