(function(N) {
   
    N.Flight = Backbone.Model.extend({
        // Basic assumptions on non-travel time factors
        _arrivalBuffer: 10,
        _departureBuffer: 120,

        initialize: function() {
            this.on('change', this.computeTime, this);
        }, 

        formatMins: function(mins) {
            if (mins < 60) return Math.ceil(mins) + " mins";
            var h = Math.floor(mins/60),
                m = Math.ceil(mins % 60),
                fh =  h + ' hr' + (h > 1 ? 's':''),
                fm = m > 0 ? ' and ' + m + ' mins' : '';

            return fh + fm;
        },

        computeTime: function() {
            if (!this.get('travelTime')) return; 
            
            var scheduled = moment(this.get('scheduledDateTime')),
                landsAt = moment(this.get('estimatedDateTime')),
                landsIn = landsAt.diff(moment(), 'minutes'),
                leaveIn = landsAt.diff(moment()
                    .add(this.get('travelTime'), 'minutes'), 'minutes'),
                leaveInF = this.formatMins(leaveIn),
                leaveAt = moment().add(leaveIn, 'minutes').format('h:mm a'),
                travelTime = this.get('travelTime') || 0,
                travelTimeF = this.formatMins(travelTime),
                leave = leaveInF; 
                if (leaveIn === 0) {
                    leave = 'NOW!';
                } else if (leaveIn < 0) {
                   leave = 'YOU SHOULD HAVE LEFT BY NOW!';
                } 
            this.set({
                landsAt: landsAt,
                landsIn: landsIn,
                leaveIn: leaveIn,
                leaveInF: leave,
                leaveAt: leaveAt,
                travelTimeF: travelTimeF,
                scheduledF: scheduled.format("MM/DD/YYYY hh:mm A"),
                estimatedF: landsAt.format("MM/DD/YYYY hh:mm A")
            });

            this.trigger('updated');
        }
    });

    N.Flights = Backbone.Collection.extend({model: N.Flight});    

    N.FlightStatus = Backbone.View.extend({
        initialize: function() {
            this.$c = $('#flight-status');
            this.model.on('updated', this.render, this);
        },

        render: function() {
            var t = _.template($('#template-flight').html());
                ctx = this.model.toJSON();
            this.$el.empty().html(t(ctx));
            this.$el.appendTo(this.$c.empty());
            return this;
        }
    });

    N.FlightChooser = Backbone.View.extend({
        initialize: function() {
            this.tmpl = _.template($('#template-flight-choice').html());
            this.setElement(this.options.$list[0]);
            this.render();
        }, 
        
        events: {
            'click a.choice': 'handleClick'
        },

        render: function() {
            var self = this,
                choices = this.collection.map(function(flight) {
                    var ctx = flight.toJSON();
                    ctx.id = flight.cid;
                    return self.tmpl(ctx)
                });
            this.$el.empty().append.call(this.options.$list, choices)
            this.dialog = $('#choose').modal('show'); 
        },
        
        handleClick: function(evt) {
            var id = $(evt.target).data('id');
            this.trigger('selected', this.collection.get(id).attributes);
            this.dialog.modal('hide');
        }
    }); 

    N.FlightProgress = Backbone.View.extend({
        _alerted: false,

        initialize: function() {
            this.setElement(this.id);
            this.model.on('updated', this.render, this);
        }, 

        render: function() {
            var p = this.calculateProgress(),
                cls = 'progress-bar-success';
            if (p >  65 && p < 90) {
                cls = 'progress-bar-warning';
            } else if (p >= 90) {
                cls = 'progress-bar-danger';
            }
           
            this.$el.removeClass('progress-bar-success').removeClass('progress-bar-warning').removeClass('progress-bar-danger')   
                    .addClass(cls)
                    .css({width: p + "%" });
    
            // an alert should focus the tab if it's not visible
            if (p >= 100 && !this._alerted ) {
                this._alerted = true;
                alert("You should leave now! (gate " + this.model.get('gate') + ")");
            }
            return this;
        },

        calculateProgress: function() {
            // Totally arbitrary, call 2 hours 50%, 4 hrs -infinity, 0mins 100%
            var min = 4 * 60,
                t = this.model.get('leaveIn')
                p = t/min;
            if (p > 1) {
                return 2; //give it a sliver of a line
            } else {
                return Math.abs(Math.floor(p * 100) - 100);
            }
        } 

    });

}(this));
