class Area_chart {
    constructor(parent, data) {
        create_legend(data, parent, this);
        this.draw_chart(parent, data, {});
    }
    create_svg(parent) {
        var svg = d3.select(parent).append('svg').attr('width', '90%').attr('height', "90%");
        var vw = document.querySelector(parent + '>svg').clientWidth;
        var vh = document.querySelector(parent + '>svg').clientHeight
        var viewBox = '0 0 ' + vw + ' ' + vh;
        svg.attr('viewBox', viewBox);
        return svg;
    }
    draw_chart(parent, data, legend) {
        d3.select(parent + '>svg').remove();
        var svg = this.create_svg(parent);
        var x_scale = this.create_x_axis(svg, data.x_domain, parent);
        var y_scale = this.create_y_axis(svg, data.y_domain, parent);
        var line = d3.line()
            .x(function (d) { return x_scale(d[0]) })
            .y(function (d) { return y_scale(d[1]) }).curve(d3.curveCardinal.tension(0.5))
        var lines_array = data.data;
        for (var i = 0; i < lines_array.length; i++) {
            var line_data = Object.values(lines_array[i])[0];
            var name = Object.keys(lines_array[i])[0];
            var cl = 'y_axis ' + name;
            if (!Object.keys(legend).includes(name)) {
                svg.append('path').attr('class', cl).attr('stroke', data.color[name]).attr('stroke-width', 2).datum(line_data).attr('d', line).attr('fill', 'none')
            };
        }
        var values = Object.values(data.data[0])[0];
        var diff = x_scale(values[0][0]) - x_scale(values[1][0]);
        var yl = 0;
        for (var i = values.length - 1; i >= 0; i--) {
            var svg_size = document.querySelector(parent + '>svg').clientHeight;
            var transform_size = (10 / 100) * svg_size;
            var scale_size = svg_size - transform_size;
            var rect = svg.append('rect').attr('x', yl).attr('y', 0).attr('width', diff).attr('height', scale_size).attr('class', 'y_axis').attr('fill', 'transparent');
            ((year, rect) => {
                rect.on('mouseover', () => {
                    var country_names = [];
                    var values = [];
                    var content = document.querySelector(parent + '>svg').getBoundingClientRect();
                    var span_head = document.querySelector('#bold');
                    span_head.innerHTML = Object.keys(data.index)[0] +' : '+ year;
                    var tool_area = document.querySelector('.tool-area> #cont');
                    tool_area.innerHTML = ''
                    for (var k = 0; k < data.data.length; k++) {
                        var index = data["start"] - year;
                        var country = Object.keys(data.data[k])[0];
                        var result_array = data.data[k][country][index];
                        values.push(result_array[1]);
                        country_names.push(country);
                    }
                    for (var k = 0; k < values.length; k++) {
                        for (var k1 = k + 1; k1 < values.length; k1++) {
                            if (values[k] < values[k1]) {
                                var temp = values[k];
                                values[k] = values[k1];
                                values[k1] = temp;
                                var temp1 = country_names[k];
                                country_names[k] = country_names[k1];
                                country_names[k1] = temp1;
                            }
                        }
                    }
                    for (var k = 0; k < values.length; k++) {
                        var color_div = create_elements('div', '', '', 'color_div', '', data.color[country_names[k]], '');
                        var span =values.length!=1? create_elements('span', '', first_letter(country_names[k].replace('_',' ')),):create_elements('span', '',first_letter(Object.keys(data.index)[1])+' :',);
                        var span_div = create_elements('div', '', '', 'name', '', '', [span]);
                        var result_span = create_elements('span', '', values[k].toLocaleString());
                        var result = create_elements('div', '', '', 'result', '', '', [result_span]);
                        var arr=[];
                        values.length==1 ? arr.push(span_div):arr.push(color_div,span_div);
                        arr.push(result);
                        var tool_row = !Object.keys(legend).includes(country_names[k]) ? create_elements('div', 'row', '', name, '', '',arr) : '';
                        tool_row ? tool_area.appendChild(tool_row) : '';
                        !Object.keys(legend).includes(country_names[k]) ? svg.append('circle').attr('cx', x_scale(year)).attr('cy', y_scale(values[k])).attr('r', 3).attr('fill', data.color[country_names[k]]).attr('class', 'y_axis') : '';
                    }

                    svg.append('line').attr('x1', x_scale(year)).attr('y1', 0).attr('x2', x_scale(year)).attr('y2', scale_size).attr('stroke', '#666').attr('stroke-width', 1).attr('class', 'y_axis lines').attr('stroke-dasharray', 5, 5);
                    document.querySelector('.tool-area').classList.add('show');
                    var height = document.querySelector('.tool-area').clientHeight;
                    var y =  d3.event.clientY ;
                    console.log(y+"--"+content.bottom);
                    var y_line = y+height < content.bottom ? y : content.bottom-height;
                    var width = document.querySelector('.tool-area').clientWidth;
                    var x =d3.event.clientX+width;
                    var svg_width=document.querySelector(parent+'>svg').clientWidth;
                    var x_line = svg_width < x ? d3.event.pageX  - width- (2*diff)  :d3.event.pageX + diff ;
                    document.querySelector('.tool-area').style.transform = 'translate(' + (x_line) + 'px,' + y_line + 'px)';
                })
            })(values[i][0], rect)
            yl += diff;
            ((rect) => {
                rect.on('mouseout', () => {
                    var tool = document.querySelector(".tooltip");
                    tool.classList.remove('show');
                    rect.attr('class', 'y_axis');
                    document.querySelector('.tool-area').classList.remove('show');
                    svg.selectAll('circle').remove();
                    svg.selectAll('.lines').remove();
                })
            })(rect);
        }

    }
    add_blur(index, data, parent) {
        var key = Object.keys(data.color);
        var path = document.querySelectorAll(parent + '> svg >.' + key[index]);

        path[0] ? path[0].classList.add('color_change') : "";
    }
    remove_blur(index, data, parent) {
        var key = Object.keys(data.color);
        var path = document.querySelectorAll(parent + '> svg >.' + key[index]);
        path[0] ? path[0].classList.remove('color_change') : "";
    }
    create_y_axis(svg, domain, parent) {
        var svg_size = document.querySelector(parent + '>svg').clientHeight;
        var transform_size = (10 / 100) * svg_size;
        var scale_size = svg_size - transform_size - ((2 / 100) * svg_size);
        var y_scale = d3.scaleLinear().domain(domain).range([scale_size, 0]);
        svg.append('g').call(d3.axisLeft(y_scale).ticks(6).tickFormat(d => {
            return `${(d / 100000000).toFixed(0)}B`;
        })).attr('class', 'y_axis');
        return y_scale;
    }
    create_x_axis(svg, domain, parent) {
        var vw = document.querySelector(parent + '> svg').clientWidth;
        var range = [0, vw - (10 / 100) * vw];
        var x_scale = d3.scaleLinear().domain(domain).range(range);
        console.log(range);
        svg.append('g').call(d3.axisBottom(x_scale).ticks(8).tickFormat(d => { return d })).attr('class', 'x_axis');
        svg.append('text').text('Year').attr('x', '50%').attr('y', '99%').attr('class', 'scale');
        svg.append("text")
            .attr("x", "5%")
            .attr("y", "25%").attr('class', 'y_label')
            .text("Population");
        return x_scale;
    }
}

