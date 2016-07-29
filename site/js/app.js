'use strict';
(function($, params) {
    const
        h = 300,
        margin = 30,
        duration = 1000,
        idHtmlElement = '#entity-chart',
        ease = 'cubic-out';

    var charts = [{
            dots: 5,
            label1X: ['4/23', '5/23', '', '', '4/23'],
            label2X: ['day 0', 'day 30', '', '', 'day x'],
            titleColors: ['red', 'orange', 'green', 'green', 'green'],
            bounds: [0, 100],
            behavior: 'maximum'
        }, {
            dots: 5,
            label1X: ['4/23', '5/23', '', '', '4/23'],
            label2X: ['day 0', 'day 30', '', '', 'day x'],
            titleColors: ['black', 'blue', 'blue', 'blue', 'blue'],
            bounds: [40, 50],
            behavior: 'minimum'
        }], w, lastNumber = params[0].length - 1;

    $(document).ready(function() {
        var widths = [
            $('#chart-index').width(),
            $('#chart-challenge').width()
        ];
        console.log('w = ', widths);
        w = $(idHtmlElement).width();
        params.forEach(function(param, idx) {
            initRanges(idx, param);
            draw(idx);
        });
        addListenerToButtons();
        console.log(charts);
    });

    function initRanges(num, params) {
        charts[num].xRange = [0 + margin, w - margin];
        console.log(charts[num].xRange);
        charts[num].x = d3.scale.linear().domain([0, charts[num].dots]).range(charts[num].xRange);
        charts[num].y = d3.scale.linear().domain(charts[num].bounds).range([0 + margin, h - 2 * margin]);
        charts[num].dataY = normalizeDataY(params);
    }
    // Normalize array of data
    function normalizeDataY(data) {
        var lastIdx = data.length - 1,
            lastValue = data[lastIdx],
            dataY = data.map(function(el) {
                return el;
            });
        dataY.splice(lastIdx + 1, 0, lastValue, lastValue);
        // console.log(dataY);
        return dataY;
    }
    // Draw the chart at the start of application
    function prepareDraw(num) {
        var label1X = charts[num].label1X,
            label2X = charts[num].label2X,
            x = charts[num].x,
            y = charts[num].y,
            xLabels, g,
            vis = d3.select(idHtmlElement)
                .append('svg:svg')
                .attr('id', 'svg' + num)
                .attr('width', w - margin)
                .attr('height', h);

        g = charts[num].g = vis.append('svg:g')
            .attr('transform', 'translate(0, ' + (h - margin) + ')');
        // Lower line
        g.append('svg:line')
            .attr('class', 'lower-line')
            .attr('x1', x(0))
            .attr('y1', -1 * y(0))
            .attr('x2', w - margin)
            .attr('y2', -1 * y(0));
        xLabels = g.selectAll('.xLabel').data(x.ticks(charts[num].dots)).enter();
        // X labels
        xLabels.append('svg:text')
            .attr('class', 'xLabel')
            .text(function(d, i) { return label1X[i - 1]; })
            .attr('x', function(d) { return x(d - 1) + margin; })
            .attr('y', 0)
            .attr('text-anchor', 'middle');
        // X labels (line 2)
        xLabels.append('svg:text')
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
            .attr('x', margin - 2)
            .attr('y', function(d) { return -1 * y(d); })
            .attr('text-anchor', 'end');
        // Draw intermediate lines
        g.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(' + margin + ', ' + (margin - h) + ')')
            .call(function() {
                return d3.svg.axis()
                    .scale(y)
                    .orient('left')
                    .ticks(10)
                    .tickSize(margin - w , 0, 0)
                    .tickFormat('');
            }());
    }
    // Draw a chart
    function draw(num) {
        var x = charts[num].x,
            y = charts[num].y,
            dataY = charts[num].dataY,
            extremum = charts[num].behavior == 'maximum' ? d3.max(dataY) : d3.min(dataY),
            extremumNumber = dataY.indexOf(extremum),
            extremumLine = -1 * y(extremum),
            g, vis = d3.select(idHtmlElement).select('svg#svg' + num).select('g');

        if (vis.empty()) {
            prepareDraw(num);
        }
        g = charts[num].g;
        // console.log(dataY, extremum, extremumNumber)
        // Upper green line
        g.append('svg:line')
            .attr('class', 'extremum-line dynamic')
            .style('stroke', charts[num].titleColors[extremumNumber])
            .attr('x1', x(0))
            .attr('y1', extremumLine)
            .attr('x2', w)
            .attr('y2', extremumLine);
        // Draw primary line #1
        g.append('svg:line')
            .attr('class', 'primary-line dynamic')
            .attr('x1', x(0) + margin)
            .attr('x2', x(1) + margin)
            .attr('y1', 0)
            .attr('y2', 0)
            .transition().duration(duration).ease(ease)
            .attr('y1', -1 * y(dataY[0]))
            .attr('y2', -1 * y(dataY[1]));
        // Draw primary line #2
        g.append('svg:line')
            .attr('class', 'line-to-future dynamic')
            .attr('x1', x(1) + margin)
            .attr('x2', x(4) + margin)
            .attr('y1', 0)
            .attr('y2', 0)
            .transition().duration(duration).ease(ease)
            .attr('y1', -1 * y(dataY[1]))
            .attr('y2', -1 * y(dataY[lastNumber]));
        // Draw lines, three dots and tooltips
        [0, 1, 4].forEach(function(dot) {
            var pointX = x(dot) + margin,
                pointY = -1 * y(dataY[dot]);
            // Draw a vertical line
            g.append('svg:line')
                .attr('class', 'vertical-line dynamic')
                .attr('x1', pointX)
                .attr('y1', -margin)
                .attr('x2', pointX)
                .attr('y2', 0)
                .transition().duration(duration).ease(ease)
                .attr('y2', pointY);
            // Draw a dot
            g.append('svg:circle')
                .attr('class', 'dynamic')
                .style('stroke', charts[num].titleColors[dot])
                .attr('title', dataY[dot])
                .attr('r', 6.5)
                .attr('cx', pointX)
                .attr('cy', 0)
                .transition().duration(duration).ease(ease)
                .attr('cy', pointY);
            // Draw a tooltip
            g.append('svg:text')
                .attr('class', 'tipsy dynamic')
                .attr('text-anchor', 'middle')
                .text(dataY[dot])
                .attr('x', pointX)
                .attr('y', 0)
                .transition().duration(duration).ease(ease)
                .attr('y', pointY - 2 * 6.5);
        });
    }

    function generateOtherData(bounds) {
        var data = [], minimum = bounds[0], maximum = bounds[1];

        for (var i = 0; i <= lastNumber; i++) {
            data.push(minimum + parseInt(Math.random() * (maximum - minimum)));
        }
        return normalizeDataY(data);
    }

    function addListenerToButtons() {
        $('div.form-container button').on('click', function(button) {
            var id = $(button.target).attr('id').split('-'),
                num = id[1] ? id[1] : 0;
            removeChart(num);
            charts[num].dataY = generateOtherData(charts[num].bounds);
            // console.log(num, charts[num].dataY);
            draw(num);
            button.preventDefault();
        });
    }

    function removeChart(num) {
        d3.selectAll('#svg' + num + ' circle.dynamic')
            .transition().duration(duration).ease(ease)
            .attr('cy', 0)
            .attr('r', 0)
            .remove();
        d3.selectAll('#svg' + num + ' line.dynamic, #svg' + num + ' text.dynamic').remove();
    }
}(jQuery, [[26, 27, 31], [43, 42, 41]]));
