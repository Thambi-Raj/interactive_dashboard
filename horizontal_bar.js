class horizontal_barchart {
    constructor(parent, vertical_data) {
        this.data = vertical_data;
        this.draw_chart(parent, vertical_data, {});
        create_legend(vertical_data, parent, this);
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
        d3.select(parent + '>svg').remove()
        this.svg = this.create_svg(parent);
        var y_scale = this.create_y_axis(this.svg, data.y_axis_domain, parent);
        let legend_output = Object.keys(data.index).slice(1).filter(d => !legend[d]);
        var y_subscale = d3.scaleBand().domain(legend_output).range([0, y_scale.bandwidth()]);
        var x_scales = data.map;
        var main_group = this.svg.append('g').attr('class', 'horizontal_group');
        for (var i = 0; i < x_scales.length; i++) {      //traverse a how many x_scale needed
            var scale_key = Object.keys(x_scales[i])[0]
            var scale_index = data.index[scale_key];
            var domain_data = data.data.map(d => d[scale_index])
            var domain = [d3.min(domain_data) - 2, d3.max(domain_data)];
            var vw = this.svg["_groups"][0][0].scrollWidth;
            var range = [0, vw - (10 / 100) * vw]; //10% minus becuse of translate...
            var x_scale = d3.scaleLinear().domain(domain).range(range);
            this.svg.append('g').call(d3.axisBottom(x_scale)).attr('class', json.x_class[i]);
            var y_axis_domain = data.y_axis_domain;
            var get_scale_values = x_scales[i][scale_key];
            for (var j = 0; j < get_scale_values.length; j++) {  // in data.map[0]=['high ,'low']  so traverse a values
                if (legend_output.includes(get_scale_values[j])) {
                    for (var k = 0; k < y_axis_domain.length; k++) {  // for traverse a y_axis....
                        var value = data.data[k][data.index[get_scale_values[j]]];
                        var color = data.color[data.index[get_scale_values[j]] - 1];
                        var rect = main_group.append('rect')
                            .attr('x', 2)
                            .attr('y', y_scale(y_axis_domain[k]) + y_subscale(get_scale_values[j])).attr('width', x_scale(value))
                            .attr('height', y_subscale.bandwidth())
                            .attr('fill', color).attr('class', get_scale_values[j]);
                        var y_axis_result = create_elements('div', '', first_letter(Object.keys(data.index)[0]) + ' : ' + first_letter(y_axis_domain[k]));
                        var x_axis_result = create_elements('div', '', first_letter(get_scale_values[j]) + " : " + value);
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
                        })(rect, get_scale_values[j]);
                    }
                }
            }
        }
    }
    legend_add_highlight(index, data) {
        var key = Object.keys(data["index"]).slice(1);
        this.svg.selectAll('.' + key[index]).attr('class', ' add_opacity');
    }
    legend_remove_highlight(index, data) {
        var key = Object.keys(data["index"]).slice(1);
        this.svg.selectAll('.add_opacity').attr('class', key[index]);
    }
    create_y_axis(svg, domain, parent) {
        var svg_size = document.querySelector(parent + '>svg').clientHeight;
        var transform_size = (15 / 100) * svg_size;
        var scale_size = svg_size - transform_size ;
        var y_scale = d3.scaleBand().domain(domain).range([scale_size, 0]).padding(.2);
        svg.append('g').call(d3.axisLeft(y_scale)).attr('class', 'y_axis');
        svg.append('text').text('Percentage %').attr('x', '50%').attr('y', '96%').attr('class', 'x_label');
        svg.append("text")
            .attr("x", "5%")
            .attr("y", "25%").attr('class', 'y_label')
            .text(first_letter(Object.keys(this.data.index)[0]));
        return y_scale;
    }
}
