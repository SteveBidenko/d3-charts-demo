/**
 * Created by steve on 7/8/16.
 */
'use strict';
(function($) {
    $(document).ready(function() {
        setTimeout(function() {
            // console.log('Launch popup retrieving');
            $.post({
                url: '/promotionalpopup/index/view',
                success: function(data) {
                    console.log(data);
                }
            }, {id: 3});
        }, 2000);
    });
}(jQuery));