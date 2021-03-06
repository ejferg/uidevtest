(function (root){
    'use strict';

    var App;

    /**
     * Create global object namespace for the UI Developer Test
     * application
     */
    root.App = App = Ember.Application.create({

        VERSION: '0.1',

        // Handler for Embers application ready event
        ready: function(){

            this.initialize();

            var state = History.getState();
            App.changeViewState(state);

            // Load initial application data.
            App.storiesController.load();
        }
    });

    /**
     * Parse uri query string parameters
     * @param name
     * @return {String}
     */
    App.getQueryParam =  function(name)
    {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if(results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    /**
     * Model for all Storys. This will be
     * represented in our uidevtest-data.js file
     */
    App.Story = Ember.Object.extend({
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
     * Controller for Stories within the application.
     */
    App.storiesController = Ember.ArrayController.create({

        content: [],
        initialData: {},

        /**
         * Load application data.
         */
        load: function(){
            $.getJSON('../js/uidevtest-data.js', $.proxy(function(data){

                /**
                 * Convert data to an array of Story objects.
                 */
                $.each(data.objects, $.proxy(function(key, value){
                    value.pub_date = moment(value.pub_date).format('h:mm a dddd, MMM, D, YYYY');
                    value.updated = moment(value.updated).format('h:mm a dddd, MMM, D, YYYY');

                    if(value.id == this.initialData.storyId)
                        History.pushState(value, "Story::"+this.initialData.storyId,
                                            "?story="+this.initialData.storyId);

                    this.pushObject(App.Story.create(value));
                }, this));

                this.set('isLoaded', true);
            },this));

           // if(story)
               // History.pushState(story, "Story::"+story.id, "?story="+story.id);
        }
    });

    /**
     * The render items for each story in the
     * Story List View.
     */
    App.StoryItemView = Ember.View.extend({

        tagName: 'div',

        // The item story instance
        story: null,

        templateName: 'story-item-view',

        // Item click action handler
        itemClick: function(){
            var data = this.get('story');
            History.pushState(data, "Story::"+data.id, "?story="+data.id);
        }
    });

    /**
     * View that displays a list of Stories.
     * This is the main view for the application.
     */
    App.StoryListView = Ember.View.extend({

        templateName: "story-list-view"

    });


    /**
     * Controller for a single story selections.
     */
    App.storyController = Ember.Controller.create({

        selectedStory: null

    });


    /**
     * Full view of an Story after it is clicked
     * in the list view.
     */
    App.StoryView = Ember.View.extend({

        templateName: "story-view",

        //Navigate back to home.
        homeClick: function(){;
            History.pushState(null, "Home", "index.html");
        }

    });

    /**
     * Manages the state of the application
     * when a routed url is set.
     */
    App.stateManager = Ember.StateManager.create({
       // Application root
       rootElement: '#views',

       // State that show the application list view
       list: Ember.ViewState.create({
         view: App.StoryListView.create()
       }),

       // State that handles showing a single story
       story: Ember.ViewState.create({
           view: App.StoryView.create()
       })
    });

    /**
     * Checks to see what state should be displayed.
     */
    App.changeViewState = function(state){
        if(state.data.id){
            App.stateManager.goToState('story');
            App.storyController.set('selectedStory', state.data);
        } else {
            var storyId = App.getQueryParam('story');

            if(storyId){
                App.storiesController.set('initialData', {storyId: storyId});

            } else {
                 App.stateManager.goToState('list');
            }
        }
    };


    /**
     * Handler for application stateChange event.
     */
    History.Adapter.bind(window,'statechange',function(){

        var state = History.getState();
        App.changeViewState(state);

       // console.log('statechange:', State.data, State.title, State.url);
    });

    // Filter for category content.
    Handlebars.registerHelper('categoryContent', function() {
        var content = this.categories_name.join(' / ').toString();
        return content;
    });

    // Filter for author content.
    Handlebars.registerHelper('authorContent', function(story) {
        var author = this.author.toString();
        return author;
    });

    // Filter for story content.
    Handlebars.registerHelper('storyContent', function() {
        return new Handlebars.SafeString(this.story);
    });

})(window);