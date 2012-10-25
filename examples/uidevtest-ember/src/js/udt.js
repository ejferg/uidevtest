(function (root){
    'use strict';

    /**
     * Create global object namespace for the UI Developer Test
     * application
     */
    var UDT = Ember.Application.create({
        VERSION: '0.1',
        rootElement: '#udt-app',
        ready: function(){
            this.initialize();
            UDT.articlesController.load();
        }
    });

    /**
     * Model for all articles. This will be
     * represented in our uidevtest-data.js file
     */
    UDT.Article = Ember.Object.extend({
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
     * Controller for articles within the application.
     */
    UDT.articlesController = Ember.ArrayController.create({
        content: [],

        /**
         * Load application data.
         */
        load: function(){
            $.getJSON('data/uidevtest-data.js', function(data){
                var items = [];

                /**
                 * Convert data to an array of Article objects.
                 */
                $.each(data.objects, function(key, value){
                    items.push(UDT.Article.create(value));
                });

                /**
                 * Set content value for the controller to be used
                 * by the articleController for binding.
                 */

                UDT.articlesController.set('content', items);
            });
        }
    });


    /**
     * Full view of an article after it is clicked
     * in the list view.
     */
    UDT.ArticleView = Ember.View.extend({

    });


    /**
     * View that displays a list of articles.
     * This is the main view for the application.
     */
    UDT.ArticleListView = Ember.View.extend({

    });

    var articleListView = UDT.ArticleListView.create();
    articleListView.appendTo('#udt-app');

    root.UDT = UDT;

})(window);