/**
 * Created by dennis on 28-11-15.
 */
function API(){
    var key = "f260b6f56ad2d55f09a8935a464719b3";
    var base_url = "http://api.themoviedb.org/3";
    var timeout = 1000;

    var ajax = null;
    var onlyLatestApiCall = function(path, query, success, error){
        if(ajax != null){
            ajax.abort();
        }
        ajax = callApi(path, query, success, function(xhr, textStatus){
            if (textStatus == "abort"){
                //skip
            } else {
                error(xhr, textStatus);
            }
        });
    };
    var callApi = function(path, query, success, error){
        query.api_key = key;
        //X-RateLimit
        return $.ajax(base_url + path, {
            dataType: 'json',
            headers: {},
            data: query,
            method: 'GET',
            success: success,
            error: error,
            timeout: timeout
        });
    }

    this.search = function (keyword, success, error) {
        if(keyword != "") {
            onlyLatestApiCall("/search/movie", {
                'query': keyword
            }, success, error);
        }
    }
}