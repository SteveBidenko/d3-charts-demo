'use strict';
(function($) {
    const
        w = 780,
        h = 350,
        margin = 30,
        upperRangeX = 5,
        upperRangeY = 100,
        duration = 1000,
        idHtmlElement = '#entity-chart',
        yRange = [0 + margin, h - 60],
        xRange = [0 + margin, w + 50];

    var vis = null,
        dataY = [17, 33, 79, 79, 79],
        titleColors = ['red', 'orange', 'green', 'green', 'green'],
        y = d3.scale.linear().domain([0, upperRangeY]).range(yRange),
        x = d3.scale.linear().domain([0, upperRangeX]).range(xRange),
        g,
        current,
        ease = 'cubic-out',
        reset = [0, 0, 0, 0, 0];

    $(document).ready(function() {
        subMetricChange();
        draw();
    });
    // Draw the chart at the start of application
    function firstDraw() {
        vis = d3.select(idHtmlElement)
            .append('svg:svg')
            .attr('width', w)
            .attr('height', h);

        g = vis.append('svg:g')
            .attr('transform', 'translate(0, ' + h + ')');
        // Lower line
        g.append('svg:line')
            .attr('x1', x(0))
            .attr('y1', -1 * y(0))
            .attr('x2', x(w))
            .attr('y2', -1 * y(0));
        // X labels
        g.selectAll('.xLabel')
            .data(x.ticks(upperRangeX))
            .enter().append('svg:text')
            .attr('class', 'xLabel')
            .text(String)
            .attr('x', function(d) { return x(d - 1); })
            .attr('y', 0)
            .attr('text-anchor', 'middle');
        // Y labels
        g.selectAll('.yLabel')
            .data(y.ticks(10))
            .enter().append('svg:text')
            .attr('class', 'yLabel')
            .text(String)
            .attr('x', 0)
            .attr('y', function(d) { return -1 * y(d - 1); })
            .attr('text-anchor', 'right');
        // Intermediate lines
        g.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(' + margin + ', ' + (margin - h) + ')')
            .call(makeYAxis());
    }
    // Draw Intermediate lines
    function makeYAxis() {
        return d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(10)
            .tickSize(-w, 0, 0)
            .tickFormat('');
    }
    // Draw a chart
    function draw(id) {
        var line = d3.svg.line()
                .x(function(d, i) {
                    var res = x(i);
                    // console.log(res);
                    return res;
                })
                .y(function(d) {
                    var res = -1 * y(d);
                    // console.log(res);
                    return res;
                });

        vis = d3.select(idHtmlElement).select('svg').select('g');

        if (vis.empty()) {
            firstDraw();
        } else {
            dataY = generateOtherData();
            console.log('Do another trend');
        }

        g.append('svg:path')
            .attr('class', id)
            .attr('d', line(reset))
            // .style('filter', 'url(#drop-shadow)')
            .transition().duration(duration).ease(ease)
            .attr('d', line(dataY));

        g.selectAll('dot')
            .data(dataY)
            .enter().append('circle')
            .attr('class', id)
            .attr('r', 6.5)
            .attr('cx', function(d, i) { return x(i); })
            .attr('cy', 0)
            .transition().duration(duration).ease(ease)
            .attr('cy', function(d) { return -1 * y(d); })
            .attr('title-color', function(d, i) {
                return titleColors[i];
            })
            .attr('title', function(d, i) {
                return dataY[i];
            });

        current = id;
        console.log('current = ' + current, 'data = ' + dataY);

        $('svg circle').tipsy({
            gravity: 's',
            html: true,
            fade: true,
            // trigger: 'manual',
            opacity: 0.85
        });
    }

    function generateOtherData() {
        var data = [];

        for (var i = 0; i < upperRangeX; i++) {
            data.push(parseInt(Math.random() * upperRangeY));
        }
        return data;
    }

    function subMetricChange() {
        $('button[type="submit"]').on('click', function(e) {
            d3.selectAll('circle')
                .transition().duration(duration).ease(ease)
                .attr('cy', 0)
                .attr('r', 0)
                .remove();
            d3.selectAll('path').remove();

            $(this).parent().addClass('active');
            dataY = generateOtherData();
            draw();
            e.preventDefault();
        });
    }
}(jQuery));
