class horizontal_barchart {
    constructor(parent, vertical_data) {
        this.data=vertical_data;
        create_legend(vertical_data, parent,this);
        this.draw_chart(parent, vertical_data, {});
    }
    create_svg(parent) {
        var svg = d3.select(parent).append('svg').attr('width', '90%').attr('height', "90%");            
        var vw = document.querySelector(parent+'>svg').clientWidth;
        var vh = document.querySelector(parent+'>svg').clientHeight
        var viewBox='0 0 '+vw+' '+vh;
        svg.attr('viewBox',viewBox);
        return svg;
    }
    draw_chart(parent, data, legend) {
        d3.select(parent+'>svg').remove()
        var svg = this.create_svg(parent);
        var y_scale = this.create_y_axis(svg, data.y_axis_domain,parent);
        let re_domain = Object.keys(data.index).slice(1).filter(d => !legend[d]);
        var y_subscale = d3.scaleBand().domain(re_domain).range([0, y_scale.bandwidth()]);
        var x_scales = data.map;
        var main_group = svg.append('g').attr('class', 'horizon_group');
        for (var i = 0; i < x_scales.length; i++) {
            var scale_index = data.index[Object.keys(x_scales[i])]; 
            var domain_data = data.data.map(d => d[scale_index])
            var domain = [-2, d3.max(domain_data)];
            var vw =document.querySelector(parent+'> svg').clientWidth;
            var range=[0,vw-(10/100)*vw];
            var x_scale = d3.scaleLinear().domain(domain).range(range);
            svg.append('g').call(d3.axisBottom(x_scale)).attr('class', json.x_class[i]);
            var y_domain = data.y_axis_domain;
            var get = x_scales[i][Object.keys(x_scales[i])]; 
            for (var j = 0; j < get.length; j++) {
                if (re_domain.includes(get[j])) {
                    for (var k = 0; k < y_domain.length; k++) {
                        var g = main_group.append('g');
                        var value = data.data[k][data.index[get[j]]];
                        var color = data.color[data.index[get[j]] - 1];
                        var rect = g.append('rect')
                            .attr('x', 2)
                            .attr('y', y_scale(y_domain[k]) + y_subscale(get[j])).attr('width', x_scale(value))
                            .attr('height', y_subscale.bandwidth())
                            .attr('fill', color).attr('class',get[j]);
                        var span=create_elements('div','',first_letter(Object.keys(data.index)[0]) + ' : ' + first_letter(y_domain[k]));
                        var span1=create_elements('div','',first_letter(get[j]) + " : " + value);
                        var string =create_elements('div','','','','','',[span,span1]);
                        ((color, letter,rect) => {
                            g.on('mousemove', () => {
                                var px=(1/100)*window.innerWidth;
                                var x_px=(3/100)*innerWidth;
                                var position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';
                               show_tooltip(position, color, letter,'area');
                                rect.attr('class','opact_element');
                            })
                        })(color, string,rect);
                        ((rect,j)=>{g.on('mouseleave', () => {
                            var tool = document.querySelector(".tooltip");
                            tool.classList.remove('show');
                            rect.attr('class',j);
                        })})(rect,get[j]);
                    }
                }
            }
        }
    }
     add_blur(index,data,parent){
           var key=Object.keys(data["index"]).slice(1);
           var path = document.querySelectorAll(parent+'> svg  .'+key[index]);
           for(var i=0;i<path.length;i++){
             path[i].classList.add('opact_element');
           }
    }
    remove_blur(index,data,parent){
        var key=Object.keys(data["index"]).slice(1);
           var path = document.querySelectorAll(parent+'> svg  .'+key[index]);
           for(var i=0;i<path.length;i++){
             path[i].classList.remove('opact_element');
           }
    }
    create_y_axis(svg, domain,parent) {
        var  svg_size = document.querySelector(parent + '>svg').clientHeight;
        var  transform_size = (10/100)*svg_size;
        console.log(this.data);
        var scale_size=svg_size-transform_size-((2/100)*svg_size);
        var y_scale = d3.scaleBand().domain(domain).range([scale_size, 0]).padding(.2);
        svg.append('g').call(d3.axisLeft(y_scale)).attr('class', 'y_axis');
        svg.append('text').text('Percentage %').attr('x','50%').attr('y','99%').attr('class','scale');
        svg.append("text")
        .attr("x", "5%")
        .attr("y", "25%").attr('class','y_label')
        .text(first_letter(Object.keys(this.data.index)[0]));
        return y_scale;
    }
}
