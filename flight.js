(function(N) {
   
    N.Flight = Backbone.Model.extend({
        initialize: function() {
            this.on('change', this.computeTime, this);
        }, 

        formatMins: function(mins) {
            if (mins < 60) return mins + " mins";
            var h = Math.floor(mins/60),
                m = Math.ceil(mins % 60),
                fh =  h + ' hr' + (h > 1 ? 's':''),
                fm = m > 0 ? ' and ' + m + ' mins' : '';

            return fh + fm;
        },

        computeTime: function() {
            var landsAt = moment(this.get('scheduledDateTime')),
                landsIn = landsAt.diff(moment(), 'minutes'),
                leaveIn = landsAt.diff(moment()
                    .add(this.get('travelTime'), 'minutes'), 'minutes'),
                leaveInF = this.formatMins(leaveIn),
                leaveAt = moment().add(leaveIn, 'minutes').format('h:mm a'),
                travelTime = this.get('travelTime') || 0,
                travelTimeF = this.formatMins(travelTime); 

            this.set({
                landsAt: landsAt,
                landsIn: landsIn,
                leaveIn: leaveIn,
                leaveInF: leaveInF,
                leaveAt: leaveAt,
                travelTimeF: travelTimeF
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
            this.$el.appendTo(this.$c.empty());
            return this;
        }
    });

}(this));
