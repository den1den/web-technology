/**
 * Created by dennis on 28-11-15.
 */
function API(on_load, on_error) {
    //permanent api settings
    var key = "f260b6f56ad2d55f09a8935a464719b3";
    var base_url = "http://api.themoviedb.org/3";
    var img_base_url = "http://image.tmdb.org/t/p/";
    var timeout = 2000;

    var ajax = null;
    //from these calls only the last issued call is needed. All previous calls are aborted as soon as a new one arrives
    var onlyLatestApiCall = function (path, query, success) {
        if (ajax != null) {
            ajax.abort();
        }
        ajax = callApi(path, query, success, function (xhr, textStatus) {
            if (textStatus == "abort") {
                //the abort was intentionally thus no error should be reported
            } else {
                on_error(xhr, textStatus);
            }
        });
    };

    //do an actual api call
    var callApi = function (path, query, success) {
        //set the key
        query.api_key = key;
        //X-RateLimit could be implemented here
        return $.ajax(base_url + path, {
            dataType: 'json',
            headers: {},
            data: query,
            method: 'GET',
            success: success,
            error: on_error,
            timeout: timeout
        });
    };

    //do a search api call
    this.search = function (keyword, success, page) {
        if (keyword != "") {
            onlyLatestApiCall("/search/movie", {
                'query': keyword,
                'page': page
            }, success, on_error);
        }
    };

    //initiate the genres object
    var genres_obj = {};
    callApi('/genre/movie/list', {}, function (data) {
        //change the representation to a more simple dict
        for (var i in data['genres']) {
            var genre_id = data['genres'][i]['id'];
            var genre_name = data['genres'][i]['name'];
            genres_obj[genre_id] = genre_name;
        }
        on_load();
    }, on_error);

    //used to convert from a genre id to a genre name
    this.getGenre = function (id) {
        if (id in genres_obj) {
            return genres_obj[id];
        } else {
            return null;
        }
    }

    //retrieve the poster url
    this.getPosterUrl = function (movie) {
        if (movie['poster_path'] != null) {
            return img_base_url + 'w500' + movie['poster_path'];
        }
        return null;
    };

    //get more info about a movie with the API
    this.getMovie = function(movie_id, success){
        onlyLatestApiCall('/movie/'+movie_id, {}, success);
    }
}