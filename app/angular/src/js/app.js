(function (root){
    'use strict';

    var App;

    /**
     * Create global object namespace for the UI Developer Test
     * application
     */
    root.App = App = angular.module('App', []);

    /**
     * Service used for cross controller communication
     */
    App.factory('appContext', function($rootScope){
        var context = {};
        context.data = null;
        context.initialData = {};

        context.setInitialData = function(value){
            context.initialData = value;
        };

        context.setData = function(value){
            context.data = value;
        };

        context.dispatch = function(type){
            $rootScope.$broadcast(type);
        };

        return context;
    });


    var ApplicationController = function($scope, $location, appContext){

        /**
         * List of application templates with url
         * and enabled flag.
         */

        $scope.templates = [
            {url: 'views/story-list-view.html', enabled: false},
            {url: 'views/story-view.html', enabled: false}
        ];

        /**
         * Parse uri query string parameters
         * @param name
         * @return {String}
         */
        $scope.getQueryParam =  function(name)
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
         * Checks to see what state should be displayed.
         */
        $scope.changeViewState = function(state){
            if(state.data.id){
                appContext.setData(state.data);
                appContext.dispatch('itemChanged');

                $scope.templates[0].enabled = false;
                $scope.templates[1].enabled = true;
            } else {

                var storyId = $scope.getQueryParam('story');

                if(storyId){
                    appContext.setInitialData({storyId: storyId});

                    //$scope.templates[0].enabled = false;
                   //$scope.templates[1].enabled = true;

                } else {
                    $scope.templates[0].enabled = true;
                    $scope.templates[1].enabled = false;
                }

            }
        };

        /**
         * Handler for application stateChange event.
         */
        History.Adapter.bind(window,'statechange',function(){

            var state = History.getState();
            $scope.changeViewState(state);
        });

       var state = History.getState();
       $scope.changeViewState(state);
    };

    App.controller('ApplicationController', ['$scope', '$http', 'appContext', ApplicationController]);

    /**
     * Controller for Stories within the application.
     */
    var StoriesController = function($scope, $http, appContext){
        $scope.content = [];
        $scope.selectedStory = null;

        $scope.itemClick = function(){
            History.pushState(this.story, "Story::"+this.story.id, "?story="+this.story.id);
        }

        /**
         * Load application data.
         */
        $http.get('../js/uidevtest-data.js').success(function(data){
            var story;
            var storyId = appContext.initialData.storyId;

            angular.forEach(data.objects, function(value, key){
                value.pub_date = moment(value.pub_date).format('h:mm a dddd, MMM, D, YYYY');
                value.updated = moment(value.updated).format('h:mm a dddd, MMM, D, YYYY');

                if(value.id == storyId)
                    story = value;
                $scope.content.push(value);

            }, this);

            if(story)
                History.pushState(story, "Story::"+story.id, "?story="+story.id);
        });
    };

    // App.module('controller', 'StoriesController', ['$scope','$http', StoriesController]);
    App.controller('StoriesController', ['$scope', '$http', 'appContext', StoriesController]);


    /**
     * Controller for a single story selections.
     */
    var StoryController = function($scope, appContext){

        $scope.selectedStory = appContext.data;

        $scope.$on('itemChanged', function(){
            $scope.selectedStory = appContext.data;
        });

        $scope.homeClick = function(){
            History.pushState(null, "Home", "index.html");
        }

    };

    App.controller('StoryController', ['$scope', 'appContext', StoryController]);

    // Filter for category content.
    App.filter('categoryFilter', function(){
        return function(){
            var content = this.story.categories_name.join(' / ').toString();
            return content;
        }
    });

    // Filter for author content.
    App.filter('authorFilter', function(){
        return function(){
            var author = "";

            if(this.selectedStory)
                author = this.selectedStory.author.toString();

            return author;
        }
    });


    /**
     * Handler for application stateChange event.
     */
    History.Adapter.bind(window,'statechange',function(){

        var state = History.getState();
       // App.changeViewState(state);

       // console.log('statechange:', State.data, State.title, State.url);
    });

})(window);