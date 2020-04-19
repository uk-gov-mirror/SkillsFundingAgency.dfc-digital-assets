$(document).ready(function () {

    if (typeof window.GOVUK === 'undefined') document.body.className = document.body.className.replace('js-enabled', '');

    //only run this is on non setting pages
    if ($("#form-cookie-settings").length === 0) {
        if (GOVUK.cookie("cookies_preferences_set")) {
            $("#global-cookie-banner").hide();
        }
        else {
            //set defaults
            GOVUK.setConsentCookie();
            //give the browser time to set the cookies before acting on them
            setTimeout(function () { GOVUK.deleteUnconsentedCookies(); }, 1000);
        }

        setGATracking();

        $("#accept-all-cookies").click(function () {

            GOVUK.approveAllCookieTypes();
            $("#cookie-message").hide();
            $("#confirmatiom-message").show();
            window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
            setTimeout(function () { setGATracking() }, 1000);
        });

        $("#hide-cookies-message").click(function () {
            $("#global-cookie-banner").hide();
        });
    }
});

function setGATracking() {
    if (!window.GOVUK.checkConsentCookie("_gid", true)) {
        window['ga-disable-UA-75241446-1'] = true;
        window['ga-disable-UA-75241446-2'] = true;
        window['ga-disable-UA-75241446-3'] = true;
        window['ga-disable-UA-75241446-4'] = true;
        window['ga-disable-UA-75241446-5'] = true;
        window['ga-disable-UA-75241446-6'] = true;
        window['ga-disable-UA-75241446-8'] = true;
        window['ga-disable-UA-75241446-9'] = true;
        window['ga-disable-UA-75241446-10'] = true;
        window['ga-disable-UA-75241446-13'] = true;
        window['ga-disable-UA-75241446-19'] = true;
    }
}

