var ChatView = function () { }

ChatView.prototype = {
    initialise: function () {
        var paths = ["/contact-us/chat", "/webchat/chat", "/pages/chat"];

        if (paths.indexOf(window.location.pathname.toLowerCase()) > -1) {
            this.initialisChatView();
        }
    },

    initialisChatView: function () {
        //     <iframe id="webchatframe" src="@Model.ChatUrl" title="webchat" scrolling="no" class="dfc-app-contact-us-Webchat"></iframe>
        $('.dfc-app-contact-us-IframeContainer').each(function () {
            var iFrameTag = "<iframe id='webchatframee' src='" + $(this).attr("data-chaturl") + "' title='webchat' scrolling='no' class='dfc-app-contact-us-Webchat'></iframe>";
            $(this).append(iFrameTag);
        });
    }
}

var chatView = new ChatView();
chatView.initialise();
