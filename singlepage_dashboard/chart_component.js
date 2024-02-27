class Chart {
    constructor(parent, data) {
        this.data = data;
        this.x_scale = 0;
        this.y_scales = [];
        this.x_sub_scale = 0;
        this.legend = [];
        this.chart_config = {};
        this.chartdata = this.data.seriesdata.chartdata;
        this.parent = parent;
        this.call_legend(parent);
        this.draw_chart(parent);  
    }
    draw_chart(parent) {
        this.svg = this.create_svg(parent);
        this.initializeXScales();
        this.initializeYScales();
        this.chartdata.forEach((element, i) => {
            if (element.type == "pie") {
                this.draw_pie_chart(element, i)
            }
            else if (element.type == "line") {
                this.draw_line_chart(element, i);
            }
            else {
                this.draw_bar_Chart(element, i);
            }
        })
    }
    create_svg(parent) {
        d3.select(parent + '>svg').remove();
        var svg_width = this.data.svg_width +'%';
        var svg = d3.select(parent).append('svg').attr('width',svg_width).attr('height', "95%");
        var vw = document.querySelector(parent + '>svg').clientWidth;
        var vh = document.querySelector(parent + '>svg').clientHeight;
        var viewBox = '0 0 ' + (vw+3) + ' ' + (vh+3)
        svg.attr('viewBox', viewBox);
        svg.append('g').attr('class', 'horizontal_group');
        this.chart_config["svg"] = { "width": vw, "height": vh };
        return svg;
    }

    create_x_scale(domain, label, format) {
        var scale_size = this.get_scale_size("xaxis", 14, domain);
        var translate = this.calculate_translate(domain);
        var x_scale = typeof domain[0] == "number" ? d3.scaleLinear().domain([label.start ? domain[0] : 0, domain[1]]).range([0, scale_size]) :
            d3.scaleBand().domain(domain).range([0, scale_size]).padding(.1);
        if (label.show) {
            this.svg.append('g').call(d3.axisBottom(x_scale).ticks(4).tickValues(this.set_ticks(domain,4,label.start ? "year":"oop")).tickFormat(d => { return this.set_ticksformat(format, d) }).tickPadding([7]))
                .attr('class', this.set_class_x_scale(domain)).attr('transform', translate)
            this.svg.append('text').text(label.label.text).attr('x', '50%').attr('y', '98%').attr('class', 'x_label');
        }
        this.chart_config["x_scale"] = x_scale;
        this.chart_config["x_scale_size"] = scale_size;
        return [scale_size, x_scale];
    }

    create_y_scale(domain, label, format) {
        var scale_size = this.get_scale_size("yaxis", 20, domain);
        var y_scale = typeof domain[1] == "number" ? d3.scaleLinear().domain([0, domain[1]]).range([scale_size, 0]) :
            d3.scaleBand().domain(domain).range([scale_size, 0]).padding(.1);
        if (label.show) {
            this.svg.append('g').call(d3.axisLeft(y_scale).ticks(3).tickValues(this.set_ticks(domain,3,label.start ? "year":"oop")).tickFormat(d => {
                return this.set_ticksformat(format, d);
            }))
            .attr('class', label.label.class)
            this.svg.append('text').text(label.label.text).attr('x', '6%').attr('y', '15%').attr('class', 'y_label')
        }
        this.chart_config["y_scale"] ? this.chart_config["y_scale"].push(y_scale) : this.chart_config["y_scale"] = [y_scale];
        this.chart_config["y_scale_size"] ? this.chart_config["y_scale_size"].push(scale_size) : this.chart_config["y_scale_size"] = [scale_size];
        return [scale_size, y_scale];
    }

    get_scale_size(axis_type, translate, domain) {
        var vw = this.svg.node().clientWidth;
        var vh = this.svg.node().clientHeight;
        var scale_size = axis_type == "xaxis" ? vw - (translate / 100) * vw
            : vh - (translate / 100) * vh;
        if (domain[0] < 0) {
            this.chart_config["x_scale_translate"] = (Math.abs(domain[0]) * vw / domain[1]);
            scale_size -= (Math.abs(domain[0]) * vw / domain[1]);
        }
        return scale_size;
    }

    calculate_translate(domain) {
        var vw = this.svg.node().clientWidth;
        var vh = this.svg.node().clientHeight;
        var translateX = domain[0] < 0 ? Math.abs(domain[0]) * vw / domain[1] + (13 / 100 * vw) : 0;
        var translateY = 81 / 100 * vh;
        var translate = `translate(${translateX},${translateY})`;
        return translate;
    }

    set_class_x_scale(domain) {
        if (domain[0] < 0) {
            return 'path_line'
        }
        else {
            return 'x_axis'
        }
    }

        set_ticks(domain,n,scale){
        var result =[];
        if(scale == "year"){
            var div_number =(domain[1]-domain[0])/n;
            for(var i=domain[0];i<=domain[1];i+=div_number){
                result.push(i.toFixed(0));
            }
            return result
        }
        else if(typeof domain[0] == 'number'){
            var div_number =domain[1]/n;
            for(var i=0;i<=domain[1];i+=div_number){
                result.push(i.toFixed(1));
            }
            return result;
        } 
        else{
            return domain;
        }
        }
    set_ticksformat(format, d) {
        var form = format && format.func ? format.func(d) : d
        var suffix = format && format.suffix ? form + format.suffix : form;
        var prefix = format && format.prefix ? suffix + format.prefix : suffix;
        return prefix;
    }

    rotate_x_scale(domain, label, format) {
        if (!this.data.chart.axes.rotated) {
            return this.create_x_scale(domain, label, format);
        } else {
            return this.create_y_scale(domain, label, format)
        }
    }

    rotate_y_scale(domain, label, format) {
        if (this.data.chart.axes.rotated) {
            return this.create_x_scale(domain, label, format);
        } else {
            return this.create_y_scale(domain, label, format)
        }
    }

    initializeXScales() {
        var label = this.data.chart.axes.xaxis;
        var min_max = this.data.columns[0].datatype == "ordinal" ? this.find_string_domain(this.chartdata[0], 0) :
            this.find_min_max([0], [], "x_axis");
        var format = this.find_format_for_axis([0])
        this.x_scale = this.rotate_x_scale(min_max, label, format);
        this.x_sub_scale = (this.data.columns[0].datatype == "ordinal") ? d3.scaleBand().domain(this.find_subscales()).range([0, this.x_scale[1].bandwidth()]) : undefined;
        this.chart_config["subscale"] = this.x_sub_scale;
    }

    initializeYScales() {
        var multiple_y_scales = this.data.metadata.axes.y;
        var label = this.data.chart.axes.yaxis;
        if (this.data.seriesdata.type == "line") {
            var format = this.find_format_for_axis([1]);
            var min_max = this.find_multiple_linechart_min_max(this.chartdata);
            var y_scale = this.rotate_y_scale(min_max, label[0], format);
            var data_index = this.data.columns[1].dataindex;
            this.chart_config["data_index"] ? this.chart_config["data_index"].push(data_index) : this.chart_config["data_index"] = [data_index];
            this.y_scales.push(y_scale);
        }
        else {
            multiple_y_scales.forEach((x_data, i) => {
                var min_max = this.find_min_max(x_data);
                var format = this.find_format_for_axis(x_data);
                var y_scale = this.rotate_y_scale(min_max, label[i], format);
                this.y_scales.push(y_scale);
                var data_index = this.data.columns[i + 1].dataindex;
                this.chart_config["data_index"] ? this.chart_config["data_index"].push(data_index) : this.chart_config["data_index"] = [data_index];
            })
        }
    }

    find_multiple_linechart_min_max(data) {
        var min_value = Number.MAX_VALUE;
        var max_value = Number.MIN_VALUE;
        data.forEach(element => {
            if (!this.legend.includes(element.seriesname)) {
                element.data.forEach(result_data => {
                    min_value = Math.min(min_value, result_data[1]);
                    max_value = Math.max(max_value, result_data[1]);
                });
            }
        });
        return [min_value, max_value];
    }

    find_min_max(x_data, xaxis) {
        var min_value = Number.MAX_VALUE;
        var max_value = Number.MIN_VALUE;
        x_data.forEach(x_data_index => {
            var get_data = this.data.columns[x_data_index];
            var get_data_result = x_data_index != 0 ? this.data.seriesdata.chartdata[x_data_index - 1].data : this.data.seriesdata.chartdata[x_data_index].data;
            var series_name = x_data_index != 0 ? this.data.seriesdata.chartdata[x_data_index - 1].seriesname : undefined;
            get_data_result.forEach(element => {
                if (xaxis || ((series_name && !this.legend.includes(series_name)) || (series_name && this.data.seriesdata.chartdata[x_data_index - 1].type == "pie" && !this.legend.includes(element[0])))) {
                    min_value = Math.min(min_value, xaxis ? element[0] : element[get_data.dataindex]);
                    max_value = Math.max(max_value, xaxis ? element[0] : element[get_data.dataindex]);
                }
            })
        });
        return [min_value, max_value];
    }

    find_format_for_axis(index) {
        var format;
        index.forEach(element => {
            if (this.data.columns[element].format) {
                format = this.data.columns[element].format;
            }
        });
        return format;
    }

    find_string_domain(data, index) {
        var domain = data.data.map(d => d[index])
        return domain;
    }

    find_subscales() {
        var chart_data = this.data.seriesdata.chartdata;
        var result = [];
        chart_data.forEach(element => {
            element.type == "bar" && !this.legend.includes(element.seriesname) ? result.push(element.seriesname) : '';
        });
        return result;
    }


    draw_bar_Chart(json_data, index) {
        this.barchart_config(json_data, index);
        var y_scale = this.chart_config.bar_chart_config[index].y_scale;
        if (!this.legend.includes(json_data.seriesname)) {
            json_data.data.forEach((result) => {
                var value = result[this.chart_config.bar_chart_config[index].dataIndex];
                if (this.data.chart.axes.rotated) {
                    this.horizontal_bar_chart(index, result, y_scale, value);
                }
                else {
                    this.vertical_bar_chart(index, result, y_scale, value);
                }
            });
        }
    }

    barchart_config(json_data, index) {
        var columnorder = json_data.yaxiscolumnorder ? json_data.yaxiscolumnorder : [0, 0];
        if (!this.chart_config["bar_chart_config"]) {
            this.chart_config["bar_chart_config"] = {}; // Initialize as array if not already initialized
        }
        var bar_chart_config = {};
        bar_chart_config["y_scale"] = this.y_scales[columnorder[0]];
        bar_chart_config["dataIndex"] = this.data.columns[columnorder[0] + 1].dataindex;
        bar_chart_config["classname"] = json_data.seriesname;
        bar_chart_config["color"] = this.data.legend.colors[index];
        this.chart_config["bar_chart_config"][index] = bar_chart_config;
    }

    horizontal_bar_chart(index, result, y_scale, value) {
        var x = value < 0 ? 0 : this.chart_config.x_scale_translate;
        var y = this.x_scale[1](result[0]) + this.x_sub_scale(this.chart_config.bar_chart_config[index].classname);
        var width = Math.abs(y_scale[1](value));
        var height = this.x_sub_scale.bandwidth();
        var rect = this.draw_rectangle(x, y, width, height, this.chart_config.bar_chart_config[index].color, this.chart_config.bar_chart_config[index].classname, this)
        this.create_tooltip_content(this.chart_config.bar_chart_config[index].color, [this.data.columns[0].columnname, result[0]], [this.chart_config.bar_chart_config[index].classname, value], rect);
    }


    vertical_bar_chart(index, result, y_scale, value) {
        var x = this.x_scale[1](result[0]) + this.x_sub_scale(this.chart_config.bar_chart_config[index].classname);
        var y = y_scale[1](0) > y_scale[1](value) ? (y_scale[1](0) - y_scale[1](value) < 10 ? y_scale[1](value) - 10
            : y_scale[1](value))
            : Math.abs(y_scale[1](0));
        var width = this.x_sub_scale.bandwidth();
        var height = y_scale[1](0) > y_scale[1](value) ? ((y_scale[1](0) - y_scale[1](value) < 10) ? y_scale[1](0) - y_scale[1](value) + 10
            : y_scale[1](0) - y_scale[1](value))
            : Math.abs(y_scale[1](0) - y_scale[1](value));
        var rect = this.draw_rectangle(x, y, width, height, this.chart_config.bar_chart_config[index].color, this.chart_config.bar_chart_config[index].classname, this);
        this.create_tooltip_content(this.chart_config.bar_chart_config[index].color, [this.data.columns[0].columnname, result[0]], [this.chart_config.bar_chart_config[index].classname, value], rect);
    }


    draw_rectangle(x, y, width, height, color, clas) {
        var main_group = this.svg.select('.horizontal_group');
        var rect = main_group.append('rect').attr('x', x).attr('y', y).attr('width', width).attr('height', height).attr('fill', color).attr('class', clas);
        return rect;
    }

    create_tooltip_content(color, result1, result2, element) {
        var x_axis_result = this.create_elements('div', '', result1[0] + " : " + result1[1]);
        var y_axis_result = this.create_elements('div', '', result2[0] + ' : ' + result2[1]);
        var tooltip_content = this.create_elements('div', '', '', '', '', '', [y_axis_result, x_axis_result]);
        ((color, letter, rect) => {
            rect.on('mousemove', () => {
                var px = (1 / 100) * window.innerWidth;
                var x_px = (3 / 100) * innerWidth;
                var position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';
                this.show_tooltip(position, color, letter);
                rect.attr('class', 'add_opacity');
            })
        })(color, tooltip_content, element);
        ((rect, j) => {
            rect.on('mouseleave', () => {
                var tool = document.querySelector(".tooltip");
                tool.classList.remove('show');
                rect.attr('class', j);
            })
        })(element, result2[1]);
    }


    draw_pie_chart(json_data, index) {
        this.piechart_config(json_data, index);
        var pie_cnfig = this.chart_config.pie_chart_config[index];
        var pie = d3.pie().sort(null).value((d) => d[1])(pie_cnfig.data);
        var radius = 40 /100 * Math.min(this.chart_config.svg.height,this.chart_config.svg.width);
        var arc = d3.arc().innerRadius(2).outerRadius(radius).padAngle(0.01);
        var pie_group = this.svg.append('g').attr('class', 'center_align');
        var ref = this;
        var arcs = pie_group.selectAll("arc")
            .data(pie)
            .enter();
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d) => {
                return d.data[2];
            }).attr('class', d => d.data[0])
            .on('mousemove', function (d) {
                var px = (1 / 100) * window.innerWidth;
                var x_px = (3 / 100) * innerWidth;
                var x_axis_result = ref.create_elements('div', '', ref.data.columns[0].columnname + ':' + d.data[0]);
                var y_axis_result = ref.create_elements('div', '', d.data[0] + ':' + d.data[1].toLocaleString());
                var tooltip_content = ref.create_elements('div', '', '', '', '', '', [y_axis_result, x_axis_result]);
                var position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';
                ref.show_tooltip(position, d.data[2], tooltip_content);
                d3.select(this).attr('class', ' add_opacity');
            })
            .on('mouseout', function (d) {
                var tool = document.querySelector(".tooltip");
                tool.classList.remove('show');
                d3.select(this).attr('class', d.data[0]);
            })
        this.pie_label_line(arcs, arc,radius);
        this.pie_label_text(arcs, arc,radius);
    }

    piechart_config(json_data, index) {
        var data = !json_data.yaxiscolumnorder ? this.getdata_for_piechart(json_data, 1) :
            this.getdata_for_piechart(json_data, json_data.yaxiscolumnorder[0] + 1);
        !json_data.yaxiscolumnorder ? this.combineColorToData(data, this.data.legend.colors) :
            this.combineColorToData(data, this.getRandomColor(data.length));
        if (!this.chart_config["pie_chart_config"]) {
            this.chart_config["pie_chart_config"] = {}; // Initialize as array if not already initialized
        }

        var pie_chart_config = {};
        pie_chart_config["data"] = data;
        this.chart_config["pie_chart_config"][index] = pie_chart_config;
    }

    getdata_for_piechart(json_data, index) {
        var dataindex = this.data.columns[index].dataindex;
        var result_data = json_data.data.filter(d => {
            if (!this.legend.includes(d[0])) {
                return [d[0], d[dataindex]]
            }
        });
        return result_data;
    }


    combineColorToData(data, color) {
        for (var i = 0; i < data.length; i++) {
            data[i].push(color[i]);
        }
    }


    getRandomColor(n) {
        var letters = '0123456789ABCDEF';
        var res = [];
        for (var j = 0; j < n; j++) {
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            res.push(color);
        }
        return res;
    }
    
    
    pie_label_text(arcs, arc,radius) {
        radius =radius + 20/100 *radius;
        arcs.append("text")
        .attr("transform", function (d) {
            var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    h = Math.sqrt(x * x + y * y);
                x = x / h * radius;
                y = y / h * radius;
                return "translate(" + x + "," + y + ")";
            })
            .attr("text-anchor", (d) => {
                if (arc.centroid(d)[0] > -15 && arc.centroid(d)[0] < 15) {
                    return "middle";
                }
                else if (arc.centroid(d)[0] < 0) {
                    return "end";
                } else {
                    return "start";
                }
            })
            .text((d) => {
                var percentage = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
                return percentage.toFixed(1) + '%';
            })
            .attr('fill', (d) => {
                return d.data[2];
            });
    }

    pie_label_line(arcs, arc,radius) {
        radius =radius +(12/100*radius);
        arcs.append("line").attr("x1", function (d) {
            return arc.centroid(d)[0] * 2;
        })
            .attr("y1", function (d) {
                return arc.centroid(d)[1] * 2;
            })
            .attr("x2", function (d) {
                var c = arc.centroid(d),
                    h = Math.sqrt(c[0] * c[0] + c[1] * c[1]);
                return (c[0] / h) * radius;
            })
            .attr("y2", function (d) {
                var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    h = Math.sqrt(x * x + y * y);
                return (y / h) * radius;
            })
            .attr('stroke', '#777')
            .attr('stroke-width', 1);
    }

    line_chart_configuration(json_data, index) {
        var columnorder = json_data.yaxiscolumnorder ? json_data.yaxiscolumnorder : [0, 0];
        if (!this.chart_config["line_chart_config"]) {
            this.chart_config["line_chart_config"] = {}; // Initialize as array if not already initialized
        }
        var line_chart_config = {};
        line_chart_config["y_scale"] = this.y_scales[columnorder[0]];
        line_chart_config["dataIndex"] = this.data.columns[columnorder[0] + 1].dataindex;
        line_chart_config["classname"] = json_data.seriesname;
        line_chart_config["color"] = this.data.legend.colors[index];
        this.chart_config["line_chart_config"][index] = line_chart_config;
    }

    draw_line_chart(json_data, index) {
        this.line_chart_configuration(json_data, index);
        var line_chart_data = this.chart_config.line_chart_config[index];
        var line_function = d3.line()
            .x((d) => { return this.x_scale[1](d[0]) })
            .y((d) => { return line_chart_data.y_scale[1](d[1]) }).curve(d3.curveCardinal.tension(0.5));
        if (!this.legend.includes(json_data.seriesname)) {
            this.svg.select('.horizontal_group').append('path').attr('class', json_data.seriesname).attr('stroke', line_chart_data.color).attr('stroke-width', 2).datum(json_data.data).attr('d', line_function).attr('fill', 'none')
        }
        if (json_data.add_rect) {
            this.add_rect_for_linechart(json_data, index)
        }
    }

    add_rect_for_linechart(json_data) {
        var values = json_data.data;
        var diff__between_xscale = this.x_scale[1](values[0][0]) - this.x_scale[1](values[1][0]);
        var start_rect_position = 0;
        var scale_size = this.y_scales[0][0];
        for (var i = values.length - 1; i >= 0; i--) {
            var rect = this.svg.append('rect').attr('x', start_rect_position).attr('y', 0).attr('width', diff__between_xscale).attr('height', scale_size).attr('class', 'y_axis').attr('fill', 'transparent');
            start_rect_position += diff__between_xscale;
            ((year, rect) => {
                rect.on('mouseover', () => {
                    this.getData_to_area_tooltip(year);
                    var y_position = d3.event.clientY;
                    var x_position = d3.event.clientX;
                    this.tooltip_position_fixing(x_position, y_position, diff__between_xscale);
                })
            })(values[i][0], rect)
            rect.on('mouseout', () => {
                document.querySelector('.tool-area').classList.remove('show');
                this.svg.selectAll('circle').remove();
                this.svg.selectAll('.lines').remove();
            })

        }
    }

    getData_to_area_tooltip(year) {
        var chart_data = this.data.seriesdata.chartdata;
        var index = chart_data[0].data[0][0] - year;
        var get_year_based_values = this.get_data_for_particular_year(chart_data, index);
        var data_keys = get_year_based_values[0];
        var data_values = get_year_based_values[1];
        this.sorting_count_based(data_keys, data_values);
        this.addData_to_area_tooltip(data_keys, data_values, year);
        this.svg.append('line').attr('x1', this.x_scale[1](year)).attr('y1', 0).attr('x2', this.x_scale[1](year)).attr('y2', this.y_scales[0][0]).attr('stroke', '#666').attr('stroke-width', 1).attr('class', 'y_axis lines').attr('stroke-dasharray', 5, 5);
    }

    get_data_for_particular_year(data, index) {
        var data_keys = []; // for country
        var data_values = []; // for growth for particular year
        for (var i = 0; i < data.length; i++) {
            var result_key = data[i].seriesname;
            var result_value = data[i].data[index][1];
            if (!this.legend.includes(result_key)) {
                data_values.push(result_value);
                data_keys.push(result_key);
            }
        }
        return [data_keys, data_values];
    }


    sorting_count_based(data_keys, data_values) {
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
    }

    addData_to_area_tooltip(data_keys, data_values, year) {
        var tooltip_head = document.querySelector('#bold');
        tooltip_head.innerHTML = this.data.columns[0].columnname + ' : ' + year;
        var tooltip_content = document.querySelector('.tool-area> #cont');
        tooltip_content.innerHTML = ''
        for (var k = 0; k < data_values.length; k++) {
            var get_parent_id = this.svg.node().parentElement.parentElement.id;
            var get_path = document.querySelector('#' + get_parent_id + '>#chart_container > svg > .horizontal_group>.' + data_keys[k]);
            var color = get_path.getAttribute('stroke')
            var legend_color = this.create_elements('div', '', '', 'color_div', '', color, '');
            var legend_name_span = data_values.length != 1 ? this.create_elements('span', '', data_keys[k].replace('_', ' ')) : this.create_elements('span', '', this.data.columns[1].columnname + ' :',);
            var legend_name_div = this.create_elements('div', '', '', 'name', '', '', [legend_name_span]);
            var result_span = this.create_elements('span', '', data_values[k].toLocaleString());
            var result = this.create_elements('div', '', '', 'result', '', '', [result_span]);
            var arr = [];
            data_values.length == 1 ? arr.push(legend_name_div) : arr.push(legend_color, legend_name_div);
            arr.push(result);
            var tooltip_row = !this.legend.includes(data_keys[k]) ? this.create_elements('div', 'row', '', get_path.getAttribute('class'), '', '', arr) : '';
            tooltip_row ? tooltip_content.appendChild(tooltip_row) : '';
            !this.legend.includes(data_keys[k]) ? this.svg.append('circle').attr('cx', this.x_scale[1](year)).attr('cy', this.y_scales[0][1](data_values[k]) - 5).attr('r', 3).attr('fill', color).attr('class', 'y_axis') : '';
        }
    }

    tooltip_position_fixing(x_posi, y_pos, diff) {
        document.querySelector('.tool-area').classList.add('show');
        var svg_position = this.svg.node().getBoundingClientRect();
        var svg_width = this.svg.node().clientWidth;
        var tooltip_width = document.querySelector('.tool-area').clientWidth;
        var tooltip_height = document.querySelector('.tool-area').clientHeight;
        var y_axis_line = y_pos + tooltip_height < svg_position.bottom ? y_pos : svg_position.bottom - tooltip_height;
        var x_pos = x_posi + tooltip_width;
        var x_line = svg_width < x_pos ? x_posi - tooltip_width - (2 * diff) : x_posi + diff;
        document.querySelector('.tool-area').style.transform = 'translate(' + (x_line) + 'px,' + y_axis_line + 'px)';
    }

    show_tooltip(position, color, letter) {
        var tool = document.querySelector(".tooltip");
        tool.innerHTML = '';
        tool.classList.add('show');
        tool.style.transform = position;
        tool.style.backgroundColor = color;
        tool.appendChild(letter);
        tool.style.color = '#444';
    }

    create_elements(type, className, innerText, id, color, backgroundColor, children) {
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
    call_legend(parent) {
        var data = this.data.seriesdata.chartdata;
        var legend_domain = [];
        var legend_color = [];
        data.forEach((element, i) => {
            element.type != "pie" ?
                (legend_domain.push(element.seriesname), legend_color.push(this.data.legend.colors[i])) : '';
        })
        var ref = document.querySelector(parent);
        legend_domain = this.data.seriesdata.chartdata.length == 1 && this.data.seriesdata.chartdata[0].type == "pie" ?
            this.data.seriesdata.chartdata[0].data.map(d => d[0]) : legend_domain;

        legend_color = this.data.seriesdata.chartdata.length == 1 && this.data.seriesdata.chartdata[0].type == "pie" ?
            this.data.legend.colors : legend_color
        this.show_legend_data(legend_domain, legend_color, ref);
    }

    show_legend_data(domain, color, parent) {
        this.data.svg_width =95;
        var group = this.create_legend_area(parent);
        var legend_container = parent.querySelector('div');
        var legend_class = legend_container.getAttribute('class')
        if (domain.length > 1) {
            for (var i = 0; i < domain.length; i++) {
                var id = domain[i].replace(' ', '_');
                var legend_color = this.create_elements('div', 'legend_icon', '', '', '', !color[i] ? 'black' : color[i], '');
                var legend_name = this.create_elements('span', '', id);
                var legend_row = this.create_elements('div', 'legend_row', '', id, '', '', [legend_color, legend_name]);
                legend_container.appendChild(legend_row);
                ((element) => {
                    element.addEventListener('mouseenter', () => {
                        var select_match_path = '#chart_container > svg>.' + group + '>.' + element.getAttribute('id');
                        (document.querySelector(select_match_path) && document.querySelector(select_match_path).tagName != "path") || group == "center_align" ?
                            d3.selectAll(select_match_path).attr('class', 'add_opacity') : d3.selectAll(select_match_path).attr('class', 'color_change')
                    })
                })(legend_row);
                ((element) => {
                    element.addEventListener('mouseleave', () => {
                        var select_match_path = document.querySelector('#chart_container>svg>.' + group + '>.add_opacity') != undefined ?
                            '#chart_container>svg>.' + group + '>.add_opacity' :
                            '#chart_container>svg>.' + group + '>.color_change'
                        d3.selectAll(select_match_path).attr('class', element.getAttribute('id'));
                    })
                })(legend_row);

                ((id, y) => {
                    legend_row.addEventListener('click', () => {
                        var select_match_path = '#chart_container>.' + legend_class + '>#' + id + '>.legend_icon';
                        if (!this.legend.includes(id) && this.legend.length != y - 1) {
                            document.querySelector(select_match_path).classList.add('opact');
                            this.legend.push(id);
                        }
                        else {
                            document.querySelector(select_match_path).classList.remove('opact');
                            var lege = this.legend.filter(d => d != id);
                            this.legend = lege
                        }
                         this.x_scale=0;
                         this.y_scales=[];
                        this.draw_chart(this.parent);
                    });
                })(id, domain.length);
            }
            this.data.svg_width = 89;
        }
        else{
            legend_container.setAttribute('class','disable_legend_area');
        }
        parent.appendChild(legend_container);
    }
    create_legend_area(parent) {
        var legend_class = this.chartdata.length == 1 && this.data.seriesdata.chartdata[0].type == "pie" ? "legend_area_pie" : 'legend_area';
        var legend_container = this.create_elements('div', legend_class);
        parent.appendChild(legend_container)
        var select_group = this.chartdata.length == 1 && this.data.seriesdata.chartdata[0].type == "pie" ? 'center_align' : 'horizontal_group';
        return select_group;
    }
}