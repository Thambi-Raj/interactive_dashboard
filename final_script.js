class Bar {
    constructor(parent, data) {
        this.data = data;
        this.call_legend(parent);
        this.draw_chart(parent, {});
    }
    create_svg(parent) {
        var svg = d3.select(parent).append('svg').attr('width', '90%').attr('height', "100%");
        var vw = document.querySelector(parent + '>svg').clientWidth;
        var vh = document.querySelector(parent + '>svg').clientHeight
        var viewBox = '0 0 ' + vw + ' ' + vh;
        svg.attr('viewBox', viewBox);
        return svg;
    }
    add_scale_in_svg(min_value, max_value, i) {
        var scale_size = 0;
        var vh = this.svg.node().scrollHeight;
        var transform_size = (15 / 100) * vh;
        scale_size = vh - transform_size;
        if (min_value < 0) {
            var minus_val = Math.abs(min_value) * vh / max_value;
            scale_size -= minus_val;
        }
        var y_scale = d3.scaleLinear().domain([0, max_value]).range([scale_size, 0]);
        var chart_axis_label = this.data.chart.axes.yaxis[i]
        chart_axis_label.show ? (this.svg.append('g').call(d3.axisLeft(y_scale)).attr('class', chart_axis_label.label.class)
            , this.svg.append('text').text(chart_axis_label.label.text).attr('x', '5%').attr('y', '25%').attr('class', 'y_label')) : ''
        return [scale_size, y_scale];
    }
    draw_chart(parent, legend) {
        d3.select(parent + '>svg').remove();
        this.svg = this.create_svg(parent);
        this.x_scale = this.create_x_scale();
        var multiple_x_scales = this.data.metadata.axes.y;
        legend = Object.keys(legend);
        var main_group = this.svg.append('g').attr('class', 'horizontal_group');
        this.y_scales = [];
        var sub_scales = [];
        var scale_size = 0;
        if (multiple_x_scales.length != 1) {
            multiple_x_scales.forEach((x_data, i) => {
                var min_value = 1000000;
                var max_value = -1000000;
                x_data.forEach(x_data_index => {
                    var get_data = this.data.columns[x_data_index];
                    // console.log(legend);
                    // console.log(get_data.columnname);
                    this.data.seriesdata.chartdata[x_data_index - 1].type == "bar" && !legend.includes(get_data.columnname)   ? sub_scales.push(get_data.columnname) : '';
                    if (!legend.includes(get_data.columnname)) {
                        var get_data_result = this.data.seriesdata.chartdata[x_data_index - 1].data;
                        this.data.seriesdata.chartdata[x_data_index - 1].type != "pie" ?
                            get_data_result.forEach(element => {
                                min_value = Math.min(min_value, element[get_data.dataindex]);
                                max_value = Math.max(max_value, element[get_data.dataindex]);
                            }) : '';
                    }   
                });
                var scale_and_scalesize = this.add_scale_in_svg(min_value, max_value, i);
                scale_size = scale_and_scalesize[0];
                this.y_scales.push(scale_and_scalesize[1]);
            });
        }
        else {
            var result_data = this.data.seriesdata.chartdata;
            var min_value = 1000000;
            var max_value = -1000000;
            result_data.forEach(element => {
                element.type == "bar" ? sub_scales.push(element.seriesname) : '';
                if (!legend.includes(element.seriesname)) {
                    element.data.forEach(data => {
                        min_value = Math.min(min_value, data[1]);
                        max_value = Math.max(max_value, data[1]);
                    });
                }
            });
            var scale_and_scalesize = this.add_scale_in_svg(min_value, max_value, 0);
            scale_size = scale_and_scalesize[0];
            this.y_scales.push(scale_and_scalesize[1]);
        }
        var x_sub_scale = this.data.columns[0].datatype=="ordinal" ? d3.scaleBand().domain(sub_scales).range([0, this.x_scale.bandwidth()]):'';
        var data = this.data.seriesdata.chartdata;
        var bool=true;
        data.forEach((element, i) => {
            var y_axis_scale = element.yaxiscolumnorder ? element.yaxiscolumnorder : [0, 0] // get xaxiscolumnorder ex:-[0,0] index 0 refers to x_scales[0] and index 1 refers to get x_axis[[1,2]] x_scale[0][index1]
            var get_scale = element.yaxiscolumnorder ? this.data.metadata.axes.y[y_axis_scale[0]] : [0];
            var y_scale = this.y_scales[y_axis_scale[0]];  //get a particular scale
            var rect_classname = element.seriesname; //get a columname;----
            if (!legend.includes(rect_classname)) {
                if (element.type == "pie") {
                    draw_pie_chart(element, legend, this)
                }
                else if (element.type == "line") {
                    element["add_rect"]=bool;
                    bool=false;
                    draw_line_chart(element, legend, this,i);
                }
                else {
                    element.data.forEach(result => {
                        var value = element.yaxiscolumnorder ? result[this.data.columns[get_scale[y_axis_scale[1]]].dataindex] :
                                                               result[1]; //get index of a value..
                        var min=Math.max(20,(scale_size -y_scale(value)))
                        var color = this.data.legend.colors[i];
                        var rect = main_group.append('rect')
                        .attr('x', this.x_scale(result[0]) + x_sub_scale(rect_classname))
                        .attr('y', (d) => {
                            if (y_scale(y_scale.domain()[0]) > y_scale(value)) {
                                if(y_scale(y_scale.domain()[0])-y_scale(value)<10){
                                   return y_scale(value)-10;
                                }
                                else{
                                    return y_scale(value)
                                }
                            }
                            else {
                                return Math.abs(y_scale(y_scale.domain()[0]));
                            }
                        })
                        .attr('width', x_sub_scale.bandwidth()).
                        attr('height', (d) => {
                            if (y_scale(y_scale.domain()[0]) > y_scale(value)) {
                                if(y_scale(y_scale.domain()[0])-y_scale(value)<10){
                                return y_scale(y_scale.domain()[0]) - y_scale(value)+10;
                                }
                                else{
                                    return y_scale(y_scale.domain()[0]) - y_scale(value)
                                }
                            }
                            else {
                                return Math.abs(y_scale(y_scale.domain()[0]) - y_scale(value));
                            }
                        })
                        .attr('fill', color)
                        var y_axis_result = create_elements('div', '', this.data.columns[0].columnname + ' : ' + result[0]);
                    var x_axis_result = create_elements('div', '', rect_classname + " : " + value);
                    var tooltip_content = create_elements('div', '', '', '', '', '', [y_axis_result, x_axis_result]);
                    ((color, letter, rect) => {
                        rect.on('mousemove', () => {
                            var px = (1 / 100) * window.innerWidth;
                            var x_px = (3 / 100) * innerWidth;
                            var position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';
                            show_tooltip(position, color, letter, 'area');
                            rect.attr('class', 'add_opacity');
                        })
                    })(color, tooltip_content, rect);
                    ((rect, j) => {
                        rect.on('mouseleave', () => {
                            var tool = document.querySelector(".tooltip");
                            tool.classList.remove('show');
                            rect.attr('class', j);
                        })
                    })(rect, rect_classname);
                    })
                }
            }
        })

    }
    create_x_scale() {
        var get_Array = this.data.seriesdata.chartdata[0].data;
        var scale_type = this.data.columns[0].datatype;
        var y_domain_data = get_Array.map(d => d[0]);
        var max = Math.max.apply(null, y_domain_data);
        var min = Math.min.apply(null, y_domain_data);
        var vw = this.svg.node().clientWidth;
        var range = [vw - (11 / 100) * vw, 0];
        y_domain_data=y_domain_data.reverse();

        var y_scale =  scale_type != "numeric" ? d3.scaleBand().domain(y_domain_data).range(range).padding(0.1):
                       d3.scaleLinear().domain([max,min]).range(range);
        var chart_axis_label = this.data.chart.axes.xaxis //get a y-axis lable and if its is show or not
        chart_axis_label.show ? (this.svg.append('g').call(d3.axisBottom(y_scale).ticks(6)).attr('class', 'x_axis'),
            this.svg.append('text').text(chart_axis_label.label.text).attr('x', '50%').attr('y', '96%').attr('class', 'x_label')) : '';
        return y_scale;
    }
    call_legend(parent){
        var data = this.data.seriesdata.chartdata;
        var legend_domain=[];
        var legend_color=[];
        data.forEach((element,i)=>{
          element.type!="pie"?
            (legend_domain.push(element.seriesname),legend_color.push(this.data.legend.colors[i])):'';
        })
        var ref = document.querySelector(parent);
        legend_domain = this.data.seriesdata.chartdata.length==1 && this.data.seriesdata.chartdata[0].type=="pie" ?
                        this.data.seriesdata.chartdata[0].data.map(d=> d[0]):legend_domain;
           
        legend_color = this.data.seriesdata.chartdata.length==1 && this.data.seriesdata.chartdata[0].type=="pie" ?
                       this.data.legend.colors:legend_color
       
         legend_data(legend_domain,legend_color,this,ref);
    }
}