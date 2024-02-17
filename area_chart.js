class Area_chart {
    constructor(parent, data) {
        this.draw_chart(parent, data, {});
        create_legend(data, parent, this);
    }
    create_svg(parent) {
        var svg = d3.select(parent).append('svg').attr('width', '90%').attr('height', "100%");
        var vw = document.querySelector(parent + '>svg').clientWidth;
        var vh = document.querySelector(parent + '>svg').clientHeight
        var viewBox = '0 0 ' + vw + ' ' + vh;
        svg.attr('viewBox', viewBox);
        return svg;
    }
    draw_chart(parent, data, legend) {
        d3.select(parent + '>svg').remove();
        this.svg = this.create_svg(parent);
        var x_scale = this.create_x_axis(this.svg, data.x_domain, parent);
        var y_scale = this.create_y_axis(this.svg, data.y_domain, parent);
        var line_function = d3.line()
            .x(function (d) { return x_scale(d[0]) })
            .y(function (d) { return y_scale(d[1]) }).curve(d3.curveCardinal.tension(0.5))
        var paths_data = data.data;
        
        for (var i = 0; i < paths_data.length; i++) {
            var path_data = Object.values(paths_data[i])[0];
            var path_class = Object.keys(paths_data[i])[0];
            var classname = 'y_axis ' + path_class;
            if (!Object.keys(legend).includes(path_class)) {
                
                this.svg.append('path').attr('class', classname).attr('stroke', data.color[path_class]).attr('stroke-width', 2).datum(path_data).attr('d',  line_function).attr('fill', 'none')
            };
        }
        var values = Object.values(data.data[0])[0]; //[2024,...,1950] 
        var diff__between_xscale = x_scale(values[0][0]) - x_scale(values[1][0]);
        var start_rect_position = 0;
        for (var i = values.length - 1; i >= 0; i--) {
            var svg_size = document.querySelector(parent + '>svg').clientHeight;
            var transform_size = (15 / 100) * svg_size;
            var scale_size = svg_size - transform_size;
            var rect = this.svg.append('rect').attr('x', start_rect_position).attr('y', 0).attr('width', diff__between_xscale).attr('height', scale_size).attr('class', 'y_axis').attr('fill', 'transparent');
            ((year, rect) => {
                rect.on('mouseover', () => {
                    var data_keys = []; // for country
                    var data_values = []; // for growth for particular yea
                    var svg_position = document.querySelector(parent + '>svg').getBoundingClientRect();
                    var tooltip_head = document.querySelector('#bold');
                    tooltip_head.innerHTML = Object.keys(data.index)[0] +' : '+ year;
                    var tooltip_content = document.querySelector('.tool-area> #cont');
                    tooltip_content.innerHTML = ''
                    for (var k = 0; k < data.data.length; k++) {
                        var index = data["start"] - year;
                        var result_key = Object.keys(data.data[k])[0];
                        var result_array = data.data[k][result_key][index];
                        data_values.push(result_array[1]);
                        data_keys.push(result_key);
                    }
                    for (var k = 0; k < data_values.length; k++) {
                        for (var k1 = k + 1; k1 < data_values.length; k1++) {
                            if (data_values[k] <data_values[k1]) {
                                var temp =data_values[k];
                               data_values[k] =data_values[k1];
                               data_values[k1] = temp;
                                var temp1 = data_keys[k];
                                data_keys[k] = data_keys[k1];
                                data_keys[k1] = temp1;
                            }
                        }
                    }
                    for (var k = 0; k < data_values.length; k++) {
                        var legend_color = create_elements('div', '', '', 'color_div', '', data.color[data_keys[k]], '');
                        var legend_name_span  =data_values.length!=1? create_elements('span', '', first_letter(data_keys[k].replace('_',' ')),):create_elements('span', '',first_letter(Object.keys(data.index)[1])+' :',);
                        var legend_name_div = create_elements('div', '', '', 'name', '', '', [legend_name_span]);
                        var result_span = create_elements('span', '',data_values[k].toLocaleString());
                        var result = create_elements('div', '', '', 'result', '', '', [result_span]);
                        var arr=[];
                        data_values.length==1 ? arr.push(legend_name_div):arr.push(legend_color,legend_name_div);
                        arr.push(result);
                        var tooltip_row = !Object.keys(legend).includes(data_keys[k]) ? create_elements('div', 'row', '', path_class, '', '',arr) : '';
                        tooltip_row ? tooltip_content.appendChild(tooltip_row) : '';
                        !Object.keys(legend).includes(data_keys[k]) ? this.svg.append('circle').attr('cx', x_scale(year)).attr('cy', y_scale(data_values[k])).attr('r', 3).attr('fill', data.color[data_keys[k]]).attr('class', 'y_axis') : '';
                    }
                    this.svg.append('line').attr('x1', x_scale(year)).attr('y1', 0).attr('x2', x_scale(year)).attr('y2', scale_size).attr('stroke', '#666').attr('stroke-width', 1).attr('class', 'y_axis lines').attr('stroke-dasharray', 5, 5);
                    document.querySelector('.tool-area').classList.add('show');
                    var tooltip_height = document.querySelector('.tool-area').clientHeight;
                    var y_pos =  d3.event.clientY ;
                    // console.log(y_pos+"--"+svg_position.bottom);
                    var y_axis_line = y_pos+tooltip_height < svg_position.bottom ? y_pos : svg_position.bottom-tooltip_height;
                    var tooltip_width = document.querySelector('.tool-area').clientWidth;
                    var x_pos =d3.event.clientX+tooltip_width;
                    var svg_width=document.querySelector(parent+'>svg').clientWidth;
                    var x_line = svg_width < x_pos ? d3.event.pageX  -tooltip_width - (2*diff__between_xscale)  :d3.event.pageX + diff__between_xscale ;
                    document.querySelector('.tool-area').style.transform = 'translate(' + (x_line) + 'px,' + y_axis_line + 'px)';
                })
            })(values[i][0], rect)
            start_rect_position += diff__between_xscale;
            ((rect) => {
                rect.on('mouseout', () => {
                    document.querySelector('.tool-area').classList.remove('show');
                    this.svg.selectAll('circle').remove();
                    this.svg.selectAll('.lines').remove();
                })
            })(rect);
        }
    }
    legend_add_highlight(index, data) {
        var key = Object.keys(data.color);
        this.svg.select('.'+key[index]).attr('class','y_axis color_change')
    }
    legend_remove_highlight(index, data) {
        var key = Object.keys(data.color);
        this.svg.select('.color_change').attr('class','y_axis ' +key[index]);
    }
    create_y_axis(svg, domain, parent) {
        var svg_size = document.querySelector(parent + '>svg').clientHeight;
        var transform_size = (15 / 100) * svg_size;
        var scale_size = svg_size - transform_size ;
        var y_scale = d3.scaleLinear().domain(domain).range([scale_size, 0]);
        svg.append('g').call(d3.axisLeft(y_scale).ticks(6).tickFormat(d => {
            return `${(d / 100000000).toFixed(0)}B`;
        })).attr('class', 'y_axis');
        return y_scale;
    }
    create_x_axis(svg, domain, parent) {
        var vw = document.querySelector(parent + '> svg').clientWidth;
        var range = [0, vw - (11 / 100) * vw];
        var x_scale = d3.scaleLinear().domain(domain).range(range);
        svg.append('g').call(d3.axisBottom(x_scale).ticks(8).tickFormat(d => { return d })).attr('class', 'x_axis');
        svg.append('text').text('Year').attr('x', '50%').attr('y', '96%').attr('class', 'x_label');
        svg.append("text")
            .attr("x", "5%")
            .attr("y", "25%").attr('class', 'y_label')
            .text("Population");
        return x_scale;
    }
}

