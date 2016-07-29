'use strict';
(function($) {
    const
        h = 350,
        margin = 30,
        duration = 1000,
        label2 = ['start', 'challenge 1', '', '', 'target'],
        ease = 'cubic-out';

    var charts = [{
            htmlElement: '#chart-index',
            dots: 5,
            values: [26, 27, 31],
            label1X: ['4/23', '5/23', '', '', '4/23'],
            label2X: label2,
            titleColors: ['red', 'orange', 'green', 'green', 'green'],
            bounds: [0, 100],
            type: 'linear',
            behavior: 'maximum'
        }, {
            htmlElement: '#chart-challenge',
            dots: 5,
            values: [43, 42, 41],
            label1X: ['4/23', '5/23', '', '', '4/23'],
            label2X: label2,
            titleColors: ['black', 'blue', 'blue', 'blue', 'blue'],
            bounds: [40, 50],
            // type: 'linear',
            type: 'histogram',
            behavior: 'minimum'
        }];

    $(document).ready(function() {
        charts.forEach(function(chart, idx) {
            chart.w = $(chart.htmlElement).width();
            chart.xRange = [0 + margin, chart.w - margin];
            chart.x = d3.scale.linear().domain([0, chart.dots]).range(chart.xRange);
            chart.yRange = [0 + margin, h - 2 * margin];
            chart.y = d3.scale.linear().domain(chart.bounds).range(chart.yRange);
            chart.dataY = normalizeDataY(chart.values);
            chart.idx = idx;
            if (typeof chart[chart.type] === 'function') {
                chart[chart.type]();
            }
        });
        addListenerToButtons();
        // console.log(charts);
    });

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
    // Draw histogram
    Object.prototype.histogram = function() {
        var chart = this,
            x = chart.x,
            y = chart.y,
            g, vis = d3.select(chart.htmlElement).select('svg#svg' + chart.idx).select('g');
        console.log(chart);
        if (vis.empty()) {
            prepareDraw();
        }
        // console.log('called histogram with the argument ', chart);
        // Draw base of the chart at start of the application
        function prepareDraw() {
            var label2X = chart.label2X,
                xLabels,
                vis = d3.select(chart.htmlElement)
                    .append('svg:svg')
                    .attr('id', 'svg' + chart.idx)
                    .attr('width', chart.w)
                    .attr('height', h);
            // console.log(chart);
            g = chart.g = vis.append('svg:g')
                .attr('transform', 'translate(0, ' + (h - margin) + ')');
            // Lower line
            g.append('svg:line')
                .attr('class', 'lower-line')
                .attr('x1', x(0))
                .attr('y1', -1 * y(chart.bounds[0]))
                .attr('x2', chart.w)
                .attr('y2', -1 * y(chart.bounds[0]));
            xLabels = g.selectAll('.xLabel').data(x.ticks(chart.dots)).enter();
            // X labels
            xLabels.append('svg:text')
                .attr('class', 'xLabel')
                .text(function(d, i) { return label2X[i - 1]; })
                .attr('x', function(d) { return x(d - 1) + margin; })
                .attr('y', 0)
                .attr('text-anchor', 'middle');
        }
    };
    // Draw a linear chart
    Object.prototype.linear = function() {
        var chart = this,
            x = chart.x,
            y = chart.y,
            dataY = chart.dataY,
            extremum = chart.behavior == 'maximum' ? d3.max(dataY) : d3.min(dataY),
            extremumNumber = dataY.indexOf(extremum),
            extremumLine = -1 * y(extremum),
            g, vis = d3.select(chart.htmlElement).select('svg#svg' + chart.idx).select('g');

        // console.log(y(0));
        if (vis.empty()) {
            prepareDraw(chart);
        }
        g = chart.g;
        // console.log(dataY, extremum, extremumNumber)
        // Upper green line
        g.append('svg:line')
            .attr('class', 'extremum-line dynamic')
            .style('stroke', chart.titleColors[extremumNumber])
            .attr('x1', x(0))
            .attr('y1', extremumLine)
            .attr('x2', chart.w)
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
            .attr('y2', -1 * y(dataY[dataY.length - 1]));
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
                .style('stroke', chart.titleColors[dot])
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
        // Draw base of the chart at start of the application
        function prepareDraw() {
            var label1X = chart.label1X,
                label2X = chart.label2X,
                xLabels,
                vis = d3.select(chart.htmlElement)
                    .append('svg:svg')
                    .attr('id', 'svg' + chart.idx)
                    .attr('width', chart.w)
                    .attr('height', h);

            g = chart.g = vis.append('svg:g')
                .attr('transform', 'translate(0, ' + (h - margin) + ')');
            // Lower line
            g.append('svg:line')
                .attr('class', 'lower-line')
                .attr('x1', x(0))
                .attr('y1', -1 * y(0))
                .attr('x2', chart.w)
                .attr('y2', -1 * y(0));
            xLabels = g.selectAll('.xLabel').data(x.ticks(chart.dots)).enter();
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
                        .tickSize(margin - chart.w , 0, 0)
                        .tickFormat('');
                }());
        }
    };

    function generateOtherData(bounds, howMany) {
        var data = [], minimum = bounds[0], maximum = bounds[1];

        for (var i = 0; i < howMany; i++) {
            data.push(minimum + parseInt(Math.random() * (maximum - minimum)));
        }
        return normalizeDataY(data);
    }

    function addListenerToButtons() {
        $('div.form-container button').on('click', function(button) {
            var id = $(button.target).attr('id').split('-'),
                num = id[1] ? id[1] : 0,
                chart = charts[num];
            // removeChart(num);
            d3.selectAll('#svg' + num + ' circle.dynamic')
                .transition().duration(duration).ease(ease)
                .attr('cy', 0)
                .attr('r', 0)
                .remove();
            d3.selectAll('#svg' + num + ' line.dynamic, #svg' + num + ' text.dynamic').remove();
            chart.dataY = generateOtherData(chart.bounds, chart.values.length);
            if (typeof chart[chart.type] === 'function') {
                chart[chart.type]();
            }
            button.preventDefault();
        });
    }
}(jQuery));
