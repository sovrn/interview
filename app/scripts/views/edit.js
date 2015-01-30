/*global define, jQuery*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/note'
], function ($, _, Backbone, JST, NoteModel) {
    'use strict';

    var ModalView = Backbone.View.extend({
        template: JST['app/scripts/templates/note.ejs'],
        
        
        events: {
            "click #save"   : "save",
            "change input"  : "validate",
            "click .modal_close"  : "destroy"
        },
        
        
        initialize: function (options) {
            this.render();
        },
        
        
        render: function () {
            var self = this;
            
            this.$el.html(this.template({
                note: self.model
            }));
            
            this.$title = jQuery('#title');
            console.log('this.$title: ', this.$title);
            this.$body  = jQuery('#body');
            console.log('this.$body: ', this.$body);
            this.$save  = jQuery('#save');
            console.log('this.$save: ', this.$save);
            
            this.$el.dialog({
                dialogClass: "no-close"
            });
            
            return this;
        },
        
        
        /**
         *  Assert that note data meets requirements for saving
         */
        validate: function () {
            if (!_.isEmpty(this.$title.val())) {
                this.$save.attr('disabled', false);
                return true;
            } else {
                this.$save.attr('disabled', true);
                return false;
            }
        },
        
        
        /**
         *  Save the model, add it to collection
         */
        save: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            
            this.$title = jQuery('#title');
            this.$body  = jQuery('#body');
            this.$save  = jQuery('#save');
            
            if (this.validate()) {
                this.model.set('title', this.$title.val());
                this.model.set('body', this.$body.val());
                console.log('this.model: ', this.model);
                this.model.save();
                
                this.collection.add(this.model);
                this.collection.save();
                
                this.destroy();
            }
            return false;
        },
        
        
        /**
         *  Remove the view from the DOM and unbind all events
         */
        destroy: function () {
            this.undelegateEvents();
            this.$el.removeData().unbind();
            this.remove();
            Backbone.View.prototype.remove.call(this);
        }
    });

    return ModalView;
});
