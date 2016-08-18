/**
 * Created by steve on 8/17/16.
 */
window.addEventListener('load', function() {
    'use strict';
    if (!d3.version) {
        return;
    }
    var looker = document.getElementById('looker'),
        d3looker = d3.select('#looker > div.row'),
        divs = d3looker.selectAll('div')[0].length,
        results = d3.selectAll('#result > div:nth-child(2)');

    results.text(divs);

    d3.select('#addDiv').on('click', function() {
        divs++;
        d3looker.append('div').attr('class', 'col-xs-3').append('span').text('Test ' + divs);
        results.text(divs);
    });

    looker.addEventListener('click', function() {
        results.text(divs);
    });

    looker.addEventListener('mouseover', function(event) {
        if (event.target.tagName === 'SPAN') {
            results.text(event.target.outerHTML);
            // console.log(event.target);
        }
    });
    // console.log(looker, results);
});
