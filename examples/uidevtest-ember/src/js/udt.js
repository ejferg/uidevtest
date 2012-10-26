(function (root){
    'use strict';

    var Udt;

    /**
     * Create global object namespace for the UI Developer Test
     * application
     */
    root.Udt = Udt = Ember.Application.create({
        VERSION: '0.1',
        ready: function(){
            this.initialize();
            Udt.storiesController.load();
        }
    });

    /**
     * Model for all Storys. This will be
     * represented in our uidevtest-data.js file
     */
    Udt.Story = Ember.Object.extend({
        id: null,
        author: null,
        categories_name: null,
        lead_photo_credit: null,
        lead_photo_caption: null,
        lead_photo_image_thumb: null,
        lead_photo_image_url: null,
        pub_date: null,
        status: null,
        summary: null,
        title: null,
        story: null,
        topics: null,
        updated: null,
        url_path: null
    });


    /**
     * Controller for Storys within the application.
     */
    Udt.storiesController = Ember.ArrayController.create({
        content: [],

        /**
         * Load application data.
         */
        load: function(){
            $.getJSON('data/uidevtest-data.js', function(data){
                var items = [];

                /**
                 * Convert data to an array of Story objects.
                 */
                $.each(data.objects, function(key, value){
                    //this.pushObject(Udt.create(value));
                    items.push(Udt.Story.create(value));
                });

                /**
                 * Set content value for the controller to be used
                 * by the StoryController for binding.
                 */

               Udt.storiesController.set('content', items);
            });
        }
    });


    /**
     * Full view of an Story after it is clicked
     * in the list view.
     */
    Udt.StoryView = Ember.View.extend({

    });

    /**
     * The render items for each story in the
     * Story List View.
     */
    Udt.StoryItemView = Ember.View.extend({
        tagName: 'div'
    });

    /**
     * View that displays a list of Storys.
     * This is the main view for the application.
     */
    Udt.StoryListView = Ember.View.extend({
        storiesBinding: "Udt.storiesController",
        changeStory: function(){
            console.log('change story');
        }
       // tagName: 'ul'
       // itemViewClass: 'Udt.StoryItemView',
    })

})(window);