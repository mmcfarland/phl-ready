(function(N) {
   
    N.Flight = Backbone.Model.extend({
        initialize: function() {
            this.on('change', this.computeTime, this);
        }, 

        computeTime: function() {
            var landsAt = moment(this.get('scheduledDateTime')),
                landsIn = landsAt.diff(moment(), 'minutes'),
                leaveIn = landsAt.diff(moment()
                    .add(this.get('travelTime'), 'minutes'), 'minutes'),
                leaveAt = moment().add(leaveIn, 'minutes').format('h:mm:ss a');

            this.set({
                landsAt: landsAt,
                landsIn: landsIn,
                leaveIn: leaveIn,
                leaveAt: leaveAt
            });

            this.trigger('updated');
        }
    });
    
    N.FlightV = Backbone.View.extend({
        initialize: function() {
            this.$c = $('#flight-status');
            this.model.on('updated', this.render, this);
        },

        render: function() {
            var t = _.template($('#template-flight').html());
                ctx = this.model.toJSON();
            console.log(ctx);
            this.$el.empty().html(t(ctx));
            this.$el.appendTo(this.$c);
            return this;
        }
    });

}(this));
