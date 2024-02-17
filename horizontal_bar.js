class Horizontal_bar {
    constructor(parent, data) {
        this.data = data;
        this.draw_chart(parent, {});
    }
    create_svg(parent) {
        var svg = d3.select(parent).append('svg').attr('width', '90%').attr('height', "100%");
        var svg_width = document.querySelector(parent + '>svg').clientWidth;
        var svg_height = document.querySelector(parent + '>svg').clientHeight
        var viewBox = '0 0 ' + svg_width + ' ' + svg_height;
        svg.attr('viewBox', viewBox);
        return svg;
    }
    draw_chart(parent, legend) {
        d3.select(parent + '>svg path').remove()
        this.svg = this.create_svg(parent);
        var y_scale = this.create_y_scale();
        var multiple_x_scales = this.data.metadata.axes.x;
        legend = Object.keys(legend);
        var main_group = this.svg.append('g').attr('class', 'horizontal_group');
        var x_scales = [];
        var sub_scales = [];
        var scale_size = 0;
        var minus_value = 0;
        multiple_x_scales.forEach((x_data, i) => {
            var min_value = 1000000;
            var max_value = -1000000;
            x_data.forEach(x_data_index => {
                var get_data = this.data.columns[x_data_index];
                sub_scales.push(get_data.columnname);
                if (!legend.includes(get_data.columnname)) {
                    var get_data_result = this.data.seriesdata.chartdata[x_data_index - 1].data;
                    get_data_result.forEach(element => {
                        min_value = Math.min(min_value, element[get_data.dataindex]);
                        max_value = Math.max(max_value, element[get_data.dataindex]);
                    });
                }
            });
            var svg_width = this.svg.node().scrollWidth;
            var svg_height = this.svg.node().scrollHeight;
            scale_size = svg_width - (11 / 100) * svg_width;
            var translateX = Math.abs(min_value) * svg_width / max_value;
            var translateY = 85 / 100 * svg_height;
            if (min_value < 0) {
                scale_size -= translateX;
            }
            minus_value = translateX;
            var translate = `translate(${translateX},${translateY})`;
            var range = [0, scale_size];
            var chart_axis_label = this.data.chart.axes.xaxis[i]
            var x_scale = d3.scaleLinear().domain([0, max_value]).range(range);
            chart_axis_label.show ? (min_value < 0 ? main_group.append('g').call(d3.axisBottom(x_scale)).attr('transform', translate)
                : this.svg.append('g').call(d3.axisBottom(x_scale)).attr('class', chart_axis_label.label.class)
                , this.svg.append('text').text(chart_axis_label.label.text).attr('x', '50%').attr('y', '96%').attr('class', 'x_label')) : ''
            x_scales.push(x_scale);
        });
        var y_sub_scale = d3.scaleBand().domain(sub_scales).range([0, y_scale.bandwidth()]);
        var data = this.data.seriesdata.chartdata;
        data.forEach((element, i) => {
            var x_axis_scale = element.yaxiscolumnorder // get xaxiscolumnorder ex:-[0,0] index 0 refers to x_scales[0] and index 1 refers to get x_axis[[1,2]] x_scale[0][index1]
            var get_scale = this.data.metadata.axes.x[x_axis_scale[0]];
            var x_scale = x_scales[x_axis_scale[0]];  //get a particular scale
            var rect_classname = this.data.columns[get_scale[x_axis_scale[1]]].columnname; //get a columname;----
            if (!legend.includes(rect_classname)) {
                element.data.forEach(result => {
                    var value = result[this.data.columns[get_scale[x_axis_scale[1]]].dataindex]; //get index of a value...
                    var translate = `translate(${minus_value},${0})`
                    var color = this.data.legend.colors[i];
                    var rect = main_group.append('rect')
                        .attr('x', x_scale(value) < 0 ? x_scale(value) : 0)
                        .attr('y', y_scale(result[0]) + y_sub_scale(rect_classname))
                        .attr('width', Math.abs(x_scale(value)))
                        .attr('height', y_sub_scale.bandwidth())
                        .attr('fill', color)
                        .attr('class', rect_classname).attr('transform', translate)
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
                });
            }
        });
    }
    create_y_scale() {
        var get_Array = this.data.seriesdata.chartdata[0].data; // like['India','0.89'],['china','.09'];
        var y_domain_data = get_Array.map(d => d[0]);
        var svg_size = this.svg.node().clientHeight;
        var transform_size = (15 / 100) * svg_size;
        var scale_size = svg_size - transform_size;
        var y_scale = d3.scaleBand().domain(y_domain_data).range([scale_size, 0]).padding(0.1);
        var chart_axis_label = this.data.chart.axes.yaxis //get a y-axis lable and if its is show or not
        // console.log(chart_axis_label.label.text);
        chart_axis_label.show ? (this.svg.append('g').call(d3.axisLeft(y_scale).ticks(6)).attr('class', 'y_axis'),
            this.svg.append('text').text(chart_axis_label.label.text).attr("x", "5%").attr("y", "25%").attr('class', 'y_label')) : '';
        return y_scale;
    }
}
// var y_sub_scale = d3.scaleBand().domain(sub_scales).range([0, y_scale.bandwidth()])
// x_data.forEach((x_data_index) => {
//     let get_data = this.data.columns[x_data_index];
//     if (!legend.includes(get_data.columnname)) {
//         var get_data_index = this.data.columns[x_data_index].dataindex;
//         var get_data_result = this.data.seriesdata.chartdata[get_data_index].data;
//         get_data_result.forEach(element => {
//             var value = element[1];
//             var sub_scale = get_data.columnname;
//             var x_pos =  x_scale(value) < 0 ? x_scale(value) : 1;
//             var color= this.data.legend.colors[x_data_index-1];
//             var rect = main_group.append('rect')
//                 .attr('x',x_pos)
//                 .attr('y', y_scale(element[0]) + y_sub_scale(sub_scale))
//                 .attr('width', Math.abs(x_scale(value)))
//                 .attr('height', y_sub_scale.bandwidth())
//                 .attr('fill', color)
//                 .attr('class',get_data.columnname)
//         var y_axis_result = create_elements('div', '', this.data.columns[0].columnname + ' : ' + element[0]);
//         var x_axis_result = create_elements('div', '', sub_scale + " : " + value);
//         var tooltip_content = create_elements('div', '', '', '', '', '', [y_axis_result, x_axis_result]);
//         ((color, letter, rect) => {
//             rect.on('mousemove', () => {
//                 var px = (1 / 100) * window.innerWidth;
//                 var x_px = (3 / 100) * innerWidth;
//                 var position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';
//                 show_tooltip(position, color, letter, 'area');
//                 rect.attr('class', 'add_opacity');
//             })
//         })(color, tooltip_content, rect);
//         ((rect, j) => {
//             rect.on('mouseleave', () => {
//                 var tool = document.querySelector(".tooltip");
//                 tool.classList.remove('show');
//                 rect.attr('class', j);
//             })
//         })(rect, get_data.columnname);
//         });
//     }
// });