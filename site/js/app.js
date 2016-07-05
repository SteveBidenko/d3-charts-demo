'use strict';
(function($, params) {
    const
        w = 780,
        h = 350,
        margin = 30,
        upperRangeX = 5,
        upperRangeY = 100,
        duration = 1000,
        idHtmlElement = '#entity-chart',
        yRange = [0 + margin, h - 2 * margin],
        xRange = [0 + margin, w + 50],
        ease = 'cubic-out';

    var vis = null,
        lastNumber = params.length - 1, dataY,
        label1X = ['4/23', '5/23', '', '', '4/23'],
        label2X = ['day 0', 'day 30', '', '', 'day x'],
        titleColors = ['red', 'orange', 'green', 'green', 'green'],
        y = d3.scale.linear().domain([0, upperRangeY]).range(yRange),
        x = d3.scale.linear().domain([0, upperRangeX]).range(xRange),
        g, current;

    $(document).ready(function() {
        normalizeDataY();
        subMetricChange();
        draw();
    });
    function normalizeDataY() {
        dataY = params.map(function(el) {
            return el;
        });
        dataY.splice(lastNumber + 1, 0, params[lastNumber], params[lastNumber]);
        console.log(dataY);
    }
    // Draw the chart at the start of application
    function firstDraw() {
        vis = d3.select(idHtmlElement)
            .append('svg:svg')
            .attr('width', w)
            .attr('height', h);

        g = vis.append('svg:g')
            .attr('transform', 'translate(0, ' + (h - margin) + ')');
        // Lower line
        g.append('svg:line')
            .attr('class', 'intermediate-lines')
            .attr('x1', x(0))
            .attr('y1', -1 * y(0))
            .attr('x2', x(w))
            .attr('y2', -1 * y(0));
        var xLabels = g.selectAll('.xLabel').data(x.ticks(upperRangeX));
        // X labels
        xLabels.enter().append('svg:text')
            .attr('class', 'xLabel')
            .text(function(d, i) { return label1X[i - 1]; })
            .attr('x', function(d) { return x(d - 1) + margin; })
            .attr('y', 0)
            .attr('text-anchor', 'middle');
        // X labels (line 2)
        xLabels.enter().append('svg:text')
            .attr('class', 'xLabel')
            .style('font-weight', 'bold')
            .text(function(d, i) { return label2X[i - 1]; })
            .attr('x', function(d) { return x(d - 1) + margin; })
            .attr('y', 20)
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
                    var res = x(i) + margin;
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
        }
        // Upper green line
        var upperLine = -1 * y(d3.max(dataY));
        g.append('svg:line')
            .attr('class', 'upper-line')
            .attr('x1', x(0))
            .attr('y1', upperLine)
            .attr('x2', x(w))
            .attr('y2', upperLine);
        // Draw two lines
        g.append('svg:line')
            .attr('class', 'primary-line')
            .attr('x1', x(0) + margin)
            .attr('x2', x(1) + margin)
            .attr('y1', 0)
            .attr('y2', 0)
            .transition().duration(duration).ease(ease)
            .attr('y1', -1 * y(dataY[0]))
            .attr('y2', -1 * y(dataY[1]));

        g.append('svg:line')
            .attr('class', 'line-to-future')
            .attr('x1', x(1) + margin)
            .attr('x2', x(4) + margin)
            .attr('y1', 0)
            .attr('y2', 0)
            .transition().duration(duration).ease(ease)
            .attr('y1', -1 * y(dataY[1]))
            .attr('y2', -1 * y(dataY[lastNumber]));
        // Draw three dots
        g.append('svg:circle')
            .attr('class', 'circle-0')
            .style('stroke', titleColors[0])
            .attr('title', dataY[0])
            .attr('r', 6.5)
            .attr('cx', x(0) + margin)
            .attr('cy', 0)
            .transition().duration(duration).ease(ease)
            .attr('cy', -1 * y(dataY[0]));

        g.append('svg:circle')
            .attr('class', 'circle-1')
            .style('stroke', titleColors[1])
            .attr('title', dataY[1])
            .attr('r', 6.5)
            .attr('cx', x(1) + margin)
            .attr('cy', 0)
            .transition().duration(duration).ease(ease)
            .attr('cy', -1 * y(dataY[1]));

        g.append('svg:circle')
            .attr('class', 'circle-1')
            .style('stroke', titleColors[lastNumber])
            .attr('title', dataY[lastNumber])
            .attr('r', 6.5)
            .attr('cx', x(4) + margin)
            .attr('cy', 0)
            .transition().duration(duration).ease(ease)
            .attr('cy', -1 * y(dataY[lastNumber]));

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
        params = [];

        for (var i = 0; i <= lastNumber; i++) {
            params.push(parseInt(Math.random() * upperRangeY));
        }
        normalizeDataY();
    }

    function subMetricChange() {
        $('button[type="submit"]').on('click', function(e) {
            d3.selectAll('circle')
                .transition().duration(duration).ease(ease)
                .attr('cy', 0)
                .attr('r', 0)
                .remove();
            d3.selectAll('line.upper-line').remove();
            d3.selectAll('line.primary-line').remove();
            d3.selectAll('line.line-to-future').remove();

            $(this).parent().addClass('active');
            generateOtherData();
            draw();
            e.preventDefault();
        });
    }
}(jQuery, [17, 33, 79]));
