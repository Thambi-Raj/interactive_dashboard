class Area_char {
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
                this.svg.append('path').attr('class', classname).attr('stroke', data.color[path_class]).attr('stroke-width', 2).datum(path_data).attr('d', line_function).attr('fill', 'none')
            };
        }
        var svg_size = document.querySelector(parent + '>svg');
        var svg_position=document.querySelector(parent+'>svg').getBoundingClientRect();
        var y_axis_position =document.querySelector(parent+'>svg'+'>.y_axis').getBoundingClientRect();
        var x_axis_position =document.querySelector(parent+'>svg'+'>.x_axis').getBoundingClientRect();
        var transform_size = (10 / 100) * svg_size.clientWidth;
        var rect = this.svg.append('rect').attr('x',0).attr('y',0).attr('width',svg_size.clientWidth-transform_size).attr('height',svg_size.clientHeight).attr('fill','transparent').attr('class','y_axis')
      rect.on('mousemove',()=>{
            var x_position =d3.event.clientX-(13/100*screen.availWidth);
            var y_position=d3.event.pageY-y_axis_position.top;
            console.log(d3.event);
            console.log(x_scale.invert(x_position));    
      })
    }
    add_blur(index, data, parent) {
        var key = Object.keys(data.color);
        this.svg.select('.'+key[index]).attr('class','y_axis color_change')
    }
    remove_blur(index, data, parent) {
        var key = Object.keys(data.color);
        this.svg.select('.color_change').attr('class','y_axis ' +key[index]);
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
        // console.log(range);
        svg.append('g').call(d3.axisBottom(x_scale).ticks(8).tickFormat(d => { return d })).attr('class', 'x_axis');
        svg.append('text').text('Year').attr('x', '50%').attr('y', '99%').attr('class', 'scale');
        svg.append("text")
            .attr("x", "5%")
            .attr("y", "25%").attr('class', 'y_label')
            .text("Population");
        return x_scale;
    }
}


// //horizontal
// draw_chart(parent, data, legend) {
//     d3.select(parent + '>svg').remove();
//     this.svg = this.create_svg(parent);
//     const y_scale = this.create_y_axis(this.svg, data.y_axis_domain, parent);
//     const legend_output = Object.keys(data.index).slice(1).filter(d => !legend[d]);
//     const y_subscale = d3.scaleBand().domain(legend_output).range([0, y_scale.bandwidth()]);
//     const main_group = this.svg.append('g').attr('class', 'horizontal_group');
//     data.map.forEach(x_scale_data => {
//         const scale_key = Object.keys(x_scale_data)[0];
//         const scale_index = data.index[scale_key];
//         const domain_data = data.data.map(d => d[scale_index]);
//         const domain = [d3.min(domain_data) - 2, d3.max(domain_data)];
//         const vw = this.svg.node().scrollWidth;
//         const range = [0, vw - (10 / 100) * vw]; // 10% minus because of translate
//         const x_scale = d3.scaleLinear().domain(domain).range(range);
//         this.svg.append('g').call(d3.axisBottom(x_scale)).attr('class', json.x_class[i]);
//         x_scale_data[scale_key].forEach(scale_value => {
//             if (legend_output.includes(scale_value)) {
//                 data.data.forEach((d, k) => {
//                     const value = d[data.index[scale_value]];
//                     const color = data.color[data.index[scale_value] - 1];
//                     const rect = main_group.append('rect')
//                         .attr('x', 2)
//                         .attr('y', y_scale(data.y_axis_domain[k]) + y_subscale(scale_value))
//                         .attr('width', x_scale(value))
//                         .attr('height', y_subscale.bandwidth())
//                         .attr('fill', color)
//                         .attr('class', scale_value);
//                     const y_axis_result = create_elements('div', '', first_letter(Object.keys(data.index)[0]) + ' : ' + first_letter(data.y_axis_domain[k]));
//                     const x_axis_result = create_elements('div', '', first_letter(scale_value) + " : " + value);
//                     const tooltip_content = create_elements('div', '', '', '', '', '', [y_axis_result, x_axis_result]);
//                     rect.on('mousemove', () => {
//                         const px = (1 / 100) * window.innerWidth;
//                         const x_px = (3 / 100) * innerWidth;
//                         const position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';
//                         show_tooltip(position, color, tooltip_content, 'area');
//                         rect.attr('class', 'add_opacity');
//                     });

//                     rect.on('mouseleave', () => {
//                         const tool = document.querySelector(".tooltip");
//                         tool.classList.remove('show');
//                         rect.attr('class', scale_value);
//                     });
//                 });
//             }
//         });
//     });
// }
// //vertical