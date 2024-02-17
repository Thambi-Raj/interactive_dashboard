const json = {
    "vertical_bar": {
        "x_axis_domain": "",
        "x_subgroup": [],
        "map": [],
        "color": [],
        "data": [],
        "index": {},
        "legend_class": 'legend_area'
    },
    "horizontal_bar": {
        "y_axis_domain": "",
        "y_subgroup": [],
        "is_need": true,
        "map": [],
        "color": [],
        "data": [],
        "index": {},
        "legend_class": 'legend_area'
    },
    "pie_chart": {
        "color": {},
        "index": {},
        "data": [],
        "legend_class": 'legend_area_pie'
    },
    "area_chart": {
        "color": {},
        "data": [],
        "index": {},
        "x_domain": [],
        "y_domain": [],
        "legend_class": 'legend_area'
    },
    "y_class": ["y_axis", "y_axis1"],
    "x_class": ["x_axis", "x_axis1"]
}

function show_tooltip(position, color, letter, area) {
    var tool = document.querySelector(".tooltip");
    tool.innerHTML = '';
    tool.classList.add('show');
    tool.style.transform = position;
    tool.style.backgroundColor = color;
    area ? tool.appendChild(letter) : tool.innerHTML = letter;
    tool.style.color = '#444';
}
function create_legend(data, parent, chart_ref) {
    var color = Object.values(data.color);
    var legend_data = !data.map ? Object.keys(data.color) : Object.keys(data.index).slice(1);
    var multi_axis = !data.map;
    var legend_container = document.createElement('div')
    legend_container.setAttribute('class', data.legend_class);
    if (legend_data.length > 1) {
        for (var i = 0; i < legend_data.length; i++) {
            var legend_row = document.createElement('div');
            var id = legend_data[i].replace(' ', '_');
            legend_row.setAttribute('id', id);
            var legend_color = document.createElement('div');
            legend_color.setAttribute('class', 'legend_icon');
            legend_color.style.backgroundColor = multi_axis ? color[i] : color[data.index[legend_data[i]] - 1];
            var legend_name = document.createElement('span');
            legend_name.innerText = first_letter(legend_data[i].replace('_', ' '));
            legend_row.appendChild(legend_color);
            legend_row.appendChild(legend_name);
            legend_row.setAttribute('class', 'legend_row');
            ((element, x) => {
                element.addEventListener('mouseenter', () => {
                    chart_ref.legend_add_highlight(x, data)
                })
            })(legend_row, i);
            ((element, x) => {
                element.addEventListener('mouseout', () => {
                    chart_ref.legend_remove_highlight(x, data)
                })
            })(legend_row, i);
            legend_container.append(legend_row);
            var res = {};
            ((id, y) => {
                legend_row.addEventListener('click', () => {
                    if (!res[id] && Object.keys(res).length != y - 1) {
                        document.querySelector(parent + '>.' + data.legend_class + '>#' + id + '>.legend_icon').classList.add('opact');
                        res[id] = id;
                    } else {
                        document.querySelector(parent + '>.' + data.legend_class + '>#' + id + '>.legend_icon').classList.remove('opact');
                        delete res[id]
                    }
                    chart_ref.draw_chart(parent, data, res);
                });
            })(id, legend_data.length);
        }
        document.querySelector(parent).append(legend_container);
    }
}
function create_elements(type, className, innerText, id, color, backgroundColor, children) {
    var element = document.createElement(type);
    className ? element.setAttribute('class', className) : '';
    id ? element.setAttribute('id', id) : '';
    innerText ? (element.innerHTML = innerText) : '';
    color ? element.style.color = color : '';
    backgroundColor ? element.style.backgroundColor = backgroundColor : '';
    children ? children.forEach(child => {
        element.appendChild(child);
    }) : '';
    return element
}
function draw_pie_chart(json_data, legend, reference) {
    var data_scale = json_data.yaxiscolumnorder ? json_data.yaxiscolumnorder : [0, 0]; //like [2,0]  for y:[[1][2][3]] y[2] refer to index of main array,, y[2][0] refer to subarray index
    var get_column_index = json_data.yaxiscolumnorder ? reference.data.metadata.axes.y[data_scale[0]][data_scale[1]] : 0;
    var get_data = reference.data.seriesdata.chartdata[get_column_index != 0 ? get_column_index - 1 : 0].data;
    var get_domain = get_data.map(d => d[0]);
    var get_values = json_data.yaxiscolumnorder ? get_data.map(d => d[reference.data.columns[get_column_index - 1].dataindex]) :
        get_data.map(d => d[reference.data.columns[1].dataindex])
    var result_json_array = [];
    var sum = 0;
    var get_color = reference.data.legend.colors;
    for (let index = 0; index < get_domain.length; index++) {
        var result = [];
        if (!legend.includes(get_domain[index])) {
            result.push(get_domain[index]);
            result.push(get_values[index]);
            result.push(get_color[index]);
            sum += get_values[index];
        }
        result.length != 0 ? result_json_array.push(result) : '';
    }
    var pie = d3.pie().sort(null).value((d) => d[1])(result_json_array);
    var arc = d3.arc().innerRadius(2).outerRadius(100).padAngle(0.01);
    var pie_group = reference.svg.append('g').attr('class', 'center_align');
    var chart_data = reference.data;
    var arcs = pie_group.selectAll("arc")
        .data(pie)
        .enter();
    arcs.append('path')
        .attr('d', arc)
        .attr('fill', (d) => {
            return d.data[2];
        })
        .on('mousemove', function (d) {
            var px = (1 / 100) * window.innerWidth;
            var x_px = (3 / 100) * innerWidth;
            var position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';
            var tooltip_content = chart_data.columns[0].columnname + ':' + d.data[0] + '<br>' + chart_data.columns[get_column_index != 0 ? get_column_index : 1].columnname + ':' + d.data[1].toLocaleString();
            show_tooltip(position, d.data[2], tooltip_content);
            d3.select(this).attr('class', ' add_opacity');
        })
        .on('mouseout', function (d) {
            var tool = document.querySelector(".tooltip");
            tool.classList.remove('show');
            d3.select(this).attr('class', d.data[0]);
        }).attr('class', d => d.data[0]);
    arcs.append("line").attr("x1", function (d) {
        return arc.centroid(d)[0] * 2;
    })
        .attr("y1", function (d) {
            return arc.centroid(d)[1] * 2;
        })
        .attr("x2", function (d) {
            var c = arc.centroid(d),
                h = Math.sqrt(c[0] * c[0] + c[1] * c[1]);
            return (c[0] / h) * 120;
        })
        .attr("y2", function (d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                h = Math.sqrt(x * x + y * y);
            return (y / h) * 120;
        })
        .attr('stroke', '#777')
        .attr('stroke-width', 1);
    arcs.append("text")
        .attr("transform", function (d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                h = Math.sqrt(x * x + y * y);
            if (x < 0) {
                x = ((x / h) * 150) + 20;
            }
            else {
                x = ((x / h) * 150) - 20;
            }
            return "translate(" + x + ',' + (y / h) * 130 + ")";
        })
        .attr("text-anchor", (d) => {
            if (arc.centroid(d)[0] < 0) {
                return "end";
            } else {
                return "start";
            }
        })
        .text((d) => {
            return d.data[0] + ":" + (d.data[1] / sum * 100).toFixed(1) + '%';
        })
        .attr('fill', (d => {

            return d.data[2]
        }))
}
function draw_line_chart(json_data, legend, reference, index) {
    var y_axis_scale = !json_data.yaxiscolumnorder ? [0, 0] : json_data.yaxiscolumnorder // get xaxiscolumnorder ex:-[0,0] index 0 refers to x_scales[0] and index 1 refers to get x_axis[[1,2]] x_scale[0][index1]    
    var x_scale = reference.x_scale;
    var y_scale = reference.y_scales[y_axis_scale[0]];  //get a particular scale
    var line_function = d3.line()
        .x(function (d) { return x_scale(d[0]) })
        .y(function (d) { return y_scale(d[1]) }).curve(d3.curveCardinal.tension(0.5))
    var color = reference.data.legend.colors
    reference.svg.select('.horizontal_group').append('path').attr('class', json_data.seriesname).attr('stroke', color[index]).attr('stroke-width', 2).datum(json_data.data).attr('d', line_function).attr('fill', 'none')
    if (json_data.add_rect) {
        var values = json_data.data;
        var diff__between_xscale = x_scale(values[0][0]) - x_scale(values[1][0]);
        var start_rect_position = 0;
        var svg_size = reference.svg.node().clientHeight;
        var transform_size = (15 / 100) * svg_size;
        var scale_size = svg_size - transform_size;
        for (var i = values.length - 1; i >= 0; i--) {
            var rect = reference.svg.append('rect').attr('x', start_rect_position).attr('y', 0).attr('width', diff__between_xscale).attr('height', scale_size).attr('class', 'y_axis').attr('fill', 'transparent');
            start_rect_position += diff__between_xscale;
            ((year, rect) => {
                rect.on('mouseover', () => {
                    var data_keys = []; // for country
                    var data_values = []; // for growth for particular yea
                    var svg_position = reference.svg.node().getBoundingClientRect();
                    var tooltip_head = document.querySelector('#bold');
                    tooltip_head.innerHTML = reference.data.columns[0].columnname + ' : ' + year;
                    var tooltip_content = document.querySelector('.tool-area> #cont');
                    tooltip_content.innerHTML = ''
                    var t = reference.data.seriesdata.chartdata;
                    for (var k = 0; k < t.length; k++) {
                        var index = t[k].data[0][0] - year;
                        var result_key = t[k].seriesname;
                        var result_value = t[k].data[index][1];
                        if(!legend.includes(result_key)){
                        data_values.push(result_value);
                        data_keys.push(result_key);
                        }
                    }
                    for (var k = 0; k < data_values.length; k++) {
                        for (var k1 = k + 1; k1 < data_values.length; k1++) {
                            if (data_values[k] < data_values[k1]) {
                                var temp = data_values[k];
                                data_values[k] = data_values[k1];
                                data_values[k1] = temp;
                                var temp1 = data_keys[k];
                                data_keys[k] = data_keys[k1];
                                data_keys[k1] = temp1;
                            }
                        }
                    }
                    for (var k = 0; k < data_values.length; k++) {
                        var get_parent_id = reference.svg.node().parentElement.parentElement.id;
                        var get_path = document.querySelector('#' + get_parent_id + '>#chart_container > svg > .horizontal_group>.' + data_keys[k]);
                        var color = get_path.getAttribute('stroke')
                        var legend_color = create_elements('div', '', '', 'color_div', '', color, '');
                        var legend_name_span = data_values.length != 1 ? create_elements('span', '', data_keys[k].replace('_', ' ')) : create_elements('span', '', reference.data.columns[1].columnname + ' :',);
                        var legend_name_div = create_elements('div', '', '', 'name', '', '', [legend_name_span]);
                        var result_span = create_elements('span', '', data_values[k].toLocaleString());
                        var result = create_elements('div', '', '', 'result', '', '', [result_span]);
                        var arr = [];
                        data_values.length == 1 ? arr.push(legend_name_div) : arr.push(legend_color, legend_name_div);
                        arr.push(result);
                        var tooltip_row = !Object.keys(legend).includes(data_keys[k]) ? create_elements('div', 'row', '', get_path.getAttribute('class'), '', '', arr) : '';
                        tooltip_row ? tooltip_content.appendChild(tooltip_row) : '';
                        !Object.keys(legend).includes(data_keys[k]) ? reference.svg.append('circle').attr('cx', x_scale(year)).attr('cy', y_scale(data_values[k])).attr('r', 3).attr('fill', color).attr('class', 'y_axis') : '';
                    }
                    reference.svg.append('line').attr('x1', x_scale(year)).attr('y1', 0).attr('x2', x_scale(year)).attr('y2', scale_size).attr('stroke', '#666').attr('stroke-width', 1).attr('class', 'y_axis lines').attr('stroke-dasharray', 5, 5);
                    document.querySelector('.tool-area').classList.add('show');
                    var tooltip_height = document.querySelector('.tool-area').clientHeight;
                    var y_pos = d3.event.clientY;
                    var y_axis_line = y_pos + tooltip_height < svg_position.bottom ? y_pos : svg_position.bottom - tooltip_height;
                    var tooltip_width = document.querySelector('.tool-area').clientWidth;
                    var x_pos = d3.event.clientX + tooltip_width;
                    var svg_width = reference.svg.node().clientWidth;
                    var x_line = svg_width < x_pos ? d3.event.pageX - tooltip_width - (2 * diff__between_xscale) : d3.event.pageX + diff__between_xscale;
                    document.querySelector('.tool-area').style.transform = 'translate(' + (x_line) + 'px,' + y_axis_line + 'px)';
                })
            })(values[i][0], rect)
            rect.on('mouseout', () => {
                document.querySelector('.tool-area').classList.remove('show');
                reference.svg.selectAll('circle').remove();
                reference.svg.selectAll('.lines').remove();
            })

        }
    }
}
function legend_data(data, color,reference,parent) {
    var legend_parent_container =parent ? parent:reference.svg.node().parentElement;
    var set_legend_class = legend_parent_container.parentElement.getAttribute('class') =='half_width'?'legend_area_pie':'legend_area';
    var legend_container =create_elements('div',set_legend_class);
    var get_parent_id = legend_parent_container.parentElement.getAttribute('id');
    var select_group = legend_parent_container.parentElement.getAttribute('class') =='half_width'?'center_align':'horzontal_group';
    if(data.length>1){
        
        for(var i=0;i<data.length;i++){
            var id = data[i].replace(' ', '_');
            var legend_color= create_elements('div','legend_icon','','','',!color[i]?'black':color[i],'');
            var legend_name = create_elements('span','',id);
            var legend_row = create_elements('div','legend_row','',id,'','',[legend_color,legend_name]);       
            legend_container.appendChild(legend_row);
            ((element, ) => {
                element.addEventListener('mouseenter', () => {
                    var select_match_path ='#'+get_parent_id+'>#chart_container>svg>.'+select_group+'>.'+element.getAttribute('id');
                    d3.selectAll(select_match_path).attr('class','add_opacity');
                })
            })(legend_row);
            ((element) => {
                element.addEventListener('mouseout', () => {
                    var select_match_path ='#'+get_parent_id+'>#chart_container>svg>.'+select_group+'>.add_opacity';
                    d3.selectAll(select_match_path).attr('class',element.getAttribute('id'));
                })
            })(legend_row);
            var res = {};
            ((id, y) => {
                legend_row.addEventListener('click', () => {
                    var select_match_path ='#'+get_parent_id+'>#chart_container>.'+set_legend_class+'>#'+id+'>.legend_icon';
                    if (!res[id] && Object.keys(res).length != y - 1) {
                        document.querySelector(select_match_path).classList.add('opact');
                        console.log(id);
                        res[id] = id;
                    } else {
                        document.querySelector(select_match_path).classList.remove('opact');
                        delete res[id]
                    }
                    reference.draw_chart('#'+get_parent_id+'>#chart_container', res);
                });
            })(id, data.length);
        }
    }
   legend_parent_container.children.length==0?legend_parent_container.appendChild(legend_container):'';  
}