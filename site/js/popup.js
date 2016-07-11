/**
 * Created by steve on 7/8/16.
 */
'use strict';
(function($) {
    $(document).ready(function() {
        setTimeout(function() {
            // console.log('Launch popup retrieving');
            $.get('/popup').done(function(data) {
                var popup = $('div.popup')[0];
                $(popup).html(data).show();
                // $(popup).html(data);
                console.log(popup);
            });
        }, 2000);
    });
}(jQuery));