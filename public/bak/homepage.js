/**
 * Created by dennis on 1-12-15.
 */
$(document).ready(function () {
    //select all the elements
    var alerts_element = $('#alerts');
    var search_field = $('#search-field');
    var pager_prev = $('#pager .previous');
    var pager_next = $('#pager .next');
    var result_accordion = $('#result-accordion');

    //show the error when it occurs
    var process_error = function (xhr, textStatus) {
        if (textStatus == "timeout") {
            var alert_class = "alert-warning";
            var message = "Bad internet connection, please try again later (timeout)";
        } else if (textStatus == "error") {
            if (xhr.status == 429) {
                var alert_class = "alert-warning";
                var message = "Server overloaded, please try again later (HTTP 429)";
            } else if (xhr.status == 0) {
                var alert_class = "alert-danger";
                var message = "No internet connection, please try again later";
            } else {
                var alert_class = "alert-danger";
                var message = "An error occurred while downloading the data (HTTP " + xhr.status + ")";
            }
        }
        alerts_element.empty();
        $('<div>', {class: 'alert ' + alert_class, text: message}).appendTo(alerts_element);
    }

    //custom api wrapper
    //this function pre-fetches the genres and setups the api
    var api = new API(function () {
        //when the api is loaded enable the search bar
        search_field.prop('disabled', false);
        search_field.prop('placeholder', "Type to search");
    }, process_error);

    //when the search query is finished
    function process_results(data) {
        alerts_element.empty();

        //Set the pagers if applicable
        if (data['page'] < data['total_pages']) {
            pager_next.show();
        } else {
            pager_next.hide();
        }
        if (data['page'] > 1) {
            pager_prev.show();
        } else {
            pager_prev.hide();
        }

        //fill the results list
        result_accordion.empty();
        if (data['results'].length > 0) {
            for (var i = 0; i < data['results'].length; i++) {
                var movie = data['results'][i];
                result_accordion.append(create_result_element(movie));
            }
        } else {
            $('<div>', {class: 'panel panel-info'}).append(
                $('<div>', {class: 'panel-body', text: "No results found"})
            ).appendTo(result_accordion);
        }
    }

    function create_result_element(movie) {
        //create a panel with header and body
        var panel = $("<div>", {class: 'panel panel-default'});
        var header = $("<div>", {class: 'panel-heading clearfix'}).appendTo(panel);
        var body_wrapper = $("<div>", {class: 'panel-collapse collapse'}).appendTo(panel);
        var body = $("<div>", {class: 'panel-body'}).appendTo(body_wrapper);

        //add the title
        var title = movie['title'] + ' (' + movie['release_date'].substring(0, 4) + ')';
        $("<h4>", {class: 'panel-title pull-left', text: title}).appendTo(header);

        //add the description
        if (movie['overview'] == '') {
            $('<p>', {text: "No further information known..."}).appendTo(body);
        } else {
            $('<p>', {text: movie['overview']}).appendTo(body);
        }

        //add the poster
        var posterUrl = api.getPosterUrl(movie);
        if (posterUrl != null) {
            ($('<img>', {
                    src: posterUrl,
                    class: 'poster img-thumbnail'
                })
            ).prependTo(body);
        }

        //add the vote avergae
        if (movie['vote_average'] != 0) {
            $('<blockquote>', {class: 'vote', text: movie['vote_average']}).appendTo(body);
        }

        //retrieve extra info when an element is toggled open
        var get_extra_info = function () {
            if (body.find('.extra-info').length != 0) {
                //the extra info was already there
                return;
            }
            //do some extra call, possible other APIs can be called here
            api.getMovie(movie.id, function (data) {
                //setup the extra info element
                var extra_info = body.find('.extra-info');
                if (extra_info.length == 0) {
                    extra_info = $("<p>", {
                        class: "extra-info"
                    }).appendTo(body);
                } else {
                    //the call was already made, just fill it with the latest data
                    extra_info = extra_info.clear();
                }

                //add two links
                if (data.homepage) {
                    $("<a>", {
                        href: data.homepage,
                        text: "Movie homepage",
                        target: "_blank"
                    }).appendTo(extra_info);
                    $('<br>').appendTo(extra_info);
                }
                if (data.imdb_id) {
                    $("<a>", {
                        href: "http://www.imdb.com/title/" + data.imdb_id + "/",
                        text: "IMDB",
                        target: "_blank"
                    }).appendTo(extra_info);
                    $('<br>').appendTo(extra_info);
                }
            });
        };

        //add the toggle functionality (bootstrap)
        body_wrapper.collapse({
            parent: result_accordion,
            toggle: false
        });
        header.click(function () {
            body_wrapper.collapse('toggle');
        });
        body_wrapper.on('show.bs.collapse', get_extra_info);

        //add the genre badges
        if (movie['genre_ids'].length > 0) {
            var badges = $('<div>', {class: "btn-group pull-right"}).appendTo(header);
            for (var i = 0; i < movie['genre_ids'].length; i++) {
                var genre = api.getGenre(movie['genre_ids'][i]);
                if (genre != null) {
                    $("<span>", {class: "badge", text: genre}).appendTo(badges);
                }
            }
        }

        return panel;
    }

    //manage when to call the api for a new search
    var cached_value = null;
    var page = 1;
    search_field.on("keyup", function (event) {
        var code = event.keyCode || event.which;
        var previous_value = cached_value;
        cached_value = $(this).val();
        page = 1;
        if (cached_value != previous_value || code === 13) {
            //if enter is pressed or a new search query is entered, initiate the api call
            api.search(cached_value, process_results, page);
        }
    });

    //when a pager is pressed, do the same query but with a new page number
    pager_prev.click(function () {
        page--;
        api.search(cached_value, process_results, page);
    });
    pager_next.click(function () {
        page++;
        api.search(cached_value, process_results, page);
    });
});