$(document).ready(function () {
    $(".find-a-course-page:first").each(function () {
        var urlParams = new URLSearchParams(window.location.search);
        var distance = urlParams.get('D');
        var searchTerm = urlParams.get('searchTerm');
        if (searchTerm == null) {
            searchTerm = urlParams.get('SearchTerm');
        }
        showHideDistanceInput(distance != null && distance === "1");
        generateClearLink(distance != null && distance === "1" ? 1 : 0);
        showHideClearFilters(anyFiltersSelected(getParams()), searchTerm);
    });

    $('.find-a-course-page #distance-select, .find-a-course-page #startdate-select').on('change', function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #orderBy-Input').on('change', function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #search-input').keypress(function (e) {
        if (e.which === 13) {
            makeAjaxCall(getParams());
            e.preventDefault();
            return false;
        }
    });

    $('.find-a-course-page #search-input').on("blur", function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #location-input').keypress(function (e) {
        if (e.which === 13) {
            makeAjaxCall(getParams());
            e.preventDefault();
            return false;
        }
    });

    $('.find-a-course-page #location-input').on("blur", function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #courseType input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });
    $('#courseHours input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });
    $('.find-a-course-page #courseStudyTime input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $("#fac-search-course-form, #fac-filter-form").submit(function (e) {
        return false;
    });

    $("#applyfilters-button").hide();
});

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function generateClearLink(d) {
    $('#fac-result-list a').each(function () {
        this.href = this.href.replace('&D=0', '').replace('&D=1', '') + '&D=' + d;
    });
}

function showHideDistanceInput(show) {
    if (show === true) {
        $('.find-a-course-page #distance-block').show();
        if ($(".find-a-course-page #orderBy-Input option[value='Distance']").length < 1) {
            $("#orderBy-Input")[0].options.add(new Option("Distance", "Distance"));
        }
    }
    else {
        $('.find-a-course-page #distance-block').hide();
        $(".find-a-course-page #orderBy-Input option[value='Distance']").remove();
    }
}

function showHideClearFilters(show, searchTerm) {
    if (show === true) {
        $(".fac-filters-block").html("<p id='fac-clear-filters'><a href='/find-a-course/searchcourse?searchTerm=" + searchTerm + "' aria-label='ClearFilters'>Clear filters</a></p>");
        $(".fac-filters-block").show();
    }
    else {
        $(".fac-filters-block").hide();
    }
}

function anyFiltersSelected(paramValues) {
    if (paramValues.Town != '' ||
        paramValues.StartDate != 'Anytime' ||
        paramValues.CourseType.length > 1 ||
        paramValues.CourseHours.length > 1 ||
        paramValues.CourseStudyTime.length > 1) {
        return true;
    }

    return false;
}

function makeAjaxCall(paramValues) {
    var stringifield = JSON.stringify(paramValues);
    var apiCall = {
        url: '/api/Ajax/Action',
        path: 'find-a-course',
        method: 'Ajax'
    };

    $.ajax({
        type: "GET",
        url: apiCall.url,
        contentType: "application/json",
        dataType: "json",
        data: { path: apiCall.path, method: apiCall.method, appData: stringifield },
        success: function (data) {
            var replacementMarkup = data.offlineHtml;
            var resultCount = "no ";
            var showDistanceSelector = false;
            if (data.isHealthy === true && data.payload != null) {
                var parsedData = JSON.parse(data.payload);
                replacementMarkup = parsedData.html;
                resultCount = parsedData.count;
                showDistanceSelector = parsedData.isPostcode || parsedData.showDistanceSelector;
                /* Once this code and the FAC app with location is fully deployed the  parsedData.isPostcode can be removed */
            }
            $('#fac-result-list').html("");
            $('#fac-result-list').html(replacementMarkup);
            $('.fac-result-count').html("");
            $('.fac-result-count').html(addCommas(resultCount));
            showHideClearFilters(anyFiltersSelected(paramValues), paramValues.SearchTerm);
            paramValues.D = showDistanceSelector === true ? 1 : 0;
            showHideDistanceInput(showDistanceSelector);
            generateClearLink(paramValues.D);

            var updatedUrl = getUpdatedUrl(paramValues);
            window.history.pushState({ path: updatedUrl }, '', updatedUrl);
        },
        failure: function () {
            console.log('Failure, in ajax call');
        },
        error: function () {
            console.log('Error, calling ajax call');
        }
    });
}

function getUpdatedUrl(paramValues) {
    var query = "searchTerm=" + paramValues.SearchTerm + "&" +
        "distance=" + paramValues.Distance + "&" +
        "town=" + paramValues.Town + "&" +
        "orderByValue=" + paramValues.OrderByValue + "&" +
        "startDate=" + paramValues.StartDate + "&" +
        "courseType=" + paramValues.CourseType + "&" +
        "courseHours=" + paramValues.CourseHours + "&" +
        "courseStudyTime=" + paramValues.CourseStudyTime + "&" +
        "filterA=" + paramValues.FilterA + "&" +
        "page=" + paramValues.Page + "&" +
        "D=" + paramValues.D + "&" +
        "coordinates=" + paramValues.Coordinates;

    return "/find-a-course/page?" + query;
}

function getParams() {
    $('.find-a-course-page #RequestPage').val(1);
    var orderByValue = $('.find-a-course-page #orderBy-Input').val();
    var searchTerm = $('.find-a-course-page #search-input').val();
    var distance = $('.find-a-course-page #distance-select').val();
    var town = $('.find-a-course-page #location-input').val();
    var page = $('.find-a-course-page #RequestPage').val();
    var startDate = $('.find-a-course-page #startdate-select').val();
    var courseType = [];
    var courseHours = [];
    var courseStudyTime = [];
    var coordinates = $('.find-a-course-page #coordinates').val();
    $('.find-a-course-page #courseType input[type=checkbox]:checked').each(function () {
        courseType.push(this.value);
    });
    $('.find-a-course-page #courseHours input[type=checkbox]:checked').each(function () {
        courseHours.push(this.value);
    });
    $('.find-a-course-page #courseStudyTime input[type=checkbox]:checked').each(function () {
        courseStudyTime.push(this.value);
    });

    var paramValues = {
        SearchTerm: searchTerm,
        Distance: distance,
        Town: town,
        OrderByValue: orderByValue,
        StartDate: startDate,
        CourseType: courseType.toString(),
        CourseHours: courseHours.toString(),
        CourseStudyTime: courseStudyTime.toString(),
        FilterA: true,
        Page: parseInt(page),
        D: 0,
        Coordinates: coordinates
    };

    return paramValues;
}

//Location suggest code
if (window.location.href.indexOf("find-a-course") > -1) {
    $(document).ready(function () {
        $("#location-input").autocomplete({
            source: function (request, response) {
                $('#coordinates').val('')
                //Do not make call to location search, if this may be a postcode
                if (!isEnteringPostCode(request.term)) {
                    getLocations(request, response)
                }
            },
            minLength: 3,
            position: {
                my: "left top",
                at: "left bottom"
            },
            select: function (event, ui) {
                $('#location-input').val(ui.item.label); // display the selected text
                $('#coordinates').val(ui.item.value); // save selected id to hidden input
                makeAjaxCall(getParams());
                return false;
            },
            focus: function (event, ui) {
                event.preventDefault(); // or return false;
            }
        });
    });

    //close autoselect if return is pressed on the input
    $("#location-input").keypress(function (e) {
        if (!e) e = window.event;
        if (e.keyCode == '13') {
            $('#location-input').autocomplete('close');
            return false;
        }
    });
}

function isEnteringPostCode(term) {
    var regex = /\d/g;
    return regex.test(term);
}

var locationData;
function getLocations(request, response) {

    var apiCall = {
        url: '/api/Ajax/Action',
        path: 'find-a-course',
        method: 'Ajax-Location'
    };

    $.ajax({
        type: "GET",
        url: apiCall.url,
        contentType: "application/json",
        dataType: "json",
        data: { path: apiCall.path, method: apiCall.method, appData: request.term },
        success: function (data) {
            if (data.isHealthy === true && data.payload != null) {
                locationData = JSON.parse(data.payload)
                response(locationData)
            }
        },
        failure: function () {
            console.log('Failured to get locations');
        },
        error: function () {
            console.log('Error getting locations');
        }
    });
}