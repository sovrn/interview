/*global define, jQuery */

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'collections/note',
    'models/note',
    'views/edit',
    'jqueryui'
], function (jQuery, _, Backbone, JST, NoteCollection, NoteModel, EditView, ui) {
    'use strict';

    var NoteListView = Backbone.View.extend({
        template: JST['app/scripts/templates/list.ejs'],
        modalTemplate: JST['app/scripts/templates/note.ejs'],
        
        collection: new NoteCollection(),
        
        editView: null,
        
        $modalEl: null,
        
        events: {
            "click #create" : "create",
            "click a.note"  : "edit",
            "click .delete" : "removeNote",
            "click #clear-all" : "clearAll",
            "click .title" : "sortTitle",
            "click .body" : "sortBody"

        },
        
        create: function () {
            var self = this;
            
            this.editView = new EditView({
                el: self.$modalEl,
                collection: self.collection,
                model: new NoteModel()
            });
        },
        
        edit: function (event) {
            var self = this,
                noteId = jQuery(event.target).data('note-id'),
                note = this.collection.get(noteId);
            
            console.log('noteId: ', noteId);
            console.log('note: ', note);

            this.editView = new EditView({
                el: self.$modalEl,
                collection: self.collection,
                model: note
            });
            
        },
        
        initialize: function (options) {
            var self = this;

            
            this.$modalEl = jQuery(options.modalEl);

            console.log('this.$modalEl: ', this.$modalEl)
            
            this.collection.fetch({
                complete: function () {
                    self.render();
                }
            });
            
            this.collection.on('all', function () {
                self.render();
            });
        },
        
        render: function () {
            var self = this;
            
            this.$el.html(this.template({
                notes: self.collection
            }));
        },

        /////////////////////////////////////////////////
        // REMOVE NOTE, CLEAR ALL, SORT TITLE AND BODY //
        /////////////////////////////////////////////////

        removeNote: function() {
            // Use same selector that grabs the ID from the note
            // to edit and remove the note from the collection
            var noteId = jQuery(event.target).data('note-id'),
                note = this.collection.get(noteId);

            this.collection.remove(note).save();
        },

        clearAll: function() {
            // Reset collection
            this.collection.reset().save();
        },

        sortTitle: function() {
            // Set comparator to title and use native sort
            this.collection.comparator = "title";
            this.collection.sort('title');
        },

        sortBody: function() {
            // Set comparator to body and use native sort
            this.collection.comparator = "body";
            this.collection.sort('body');
        }
    });

    return NoteListView;
});
