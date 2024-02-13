class Vertical_bar {
    constructor(parent, vertical_data) {
        this.draw_chart(parent, vertical_data, {})
        create_legend(vertical_data, parent, this)
    }
    create_svg(parent) {
        var svg = d3.select(parent).append('svg').attr('width', '90%').attr('height', "100%").attr('class','sv');            
        var vw = document.querySelector(parent+'>svg').clientWidth;
        var vh = document.querySelector(parent+'>svg').clientHeight;
        var viewBox='0 0 '+vw+' '+vh;
        svg.attr('viewBox',viewBox);
        return svg;
    }
    draw_chart(parent, data, legend) {
        d3.select(parent + '> svg').remove()
        this.svg = this.create_svg(parent);
        var x_scale = this.create_x_axis(this.svg, data.x_axis_domain,parent);
        let legend_output = Object.keys(data.index).slice(1).filter(d => !legend[d]);
        var x_subscale = d3.scaleBand().domain(legend_output).range([0, x_scale.bandwidth()]);
        var y_scales = data.map;    
        var scale=parent.replace('>#chart_container','');
        var show_scale_id = document.querySelector(scale+' .clicked').id;
        var main_group = this.svg.append('g').attr('class', 'main_group');
        for (var i = 0; i < y_scales.length; i++) {
            var scale_key = data.index[Object.keys(y_scales[i])]; //index of the particular like pop1980 and  create domain like [0,max(pop1980)]
            var domain_data = data.data.map(d => d[scale_key])
            var domain = [0, d3.max(domain_data)];
            var  vh =this.svg.node().scrollHeight;
            var  transform_size = (15/100)*vh;
            var scale_size=vh-transform_size;
            var y_scale = d3.scaleLinear().domain(domain).range([scale_size, 0]);
            var x_domain = data.x_axis_domain;
            var get_scale_values = y_scales[i][Object.keys(y_scales[i])];
            for (var j = 0; j < get_scale_values.length; j++) {
                get_scale_values[j]==show_scale_id? (this.svg.append('g').call(d3.axisLeft(y_scale)).attr('class', 'y_axis'), 
                                        this.svg.append('text').text(first_letter(get_scale_values[j])).attr("x", "5%").attr("y", "25%").attr('class','y_label'))
                                        :''
             if (legend_output.includes(get_scale_values[j])) {
                    for (var k = 0; k < x_domain.length; k++) {
                        var value = data.data[k][data.index[get_scale_values[j]]];
                        var color = data.color[data.index[get_scale_values[j]] - 1];
                        var min=Math.max(20,(scale_size -y_scale(value)))
                        var rect = main_group.append('rect')
                            .attr('x', x_scale(x_domain[k]) + x_subscale(get_scale_values[j]))
                            .attr('y',min!= 20 ?y_scale(value):y_scale(value)-20).attr('width', x_subscale.bandwidth())
                            .attr('height',min!=20 ? scale_size - y_scale(value): scale_size - y_scale(value)+20)
                            .attr('fill', color).attr('class',get_scale_values[j]);
                        var value_ends_with = data.ends[get_scale_values[j]]? data.ends[get_scale_values[j]]:'';
                        var x_axis_result=create_elements('div','', first_letter(Object.keys(data.index)[0]) + ' : ' + first_letter(x_domain[k]));
                        var y_axis_result=create_elements('div','',first_letter(get_scale_values[j]) + " : " + value.toLocaleString()+' '+value_ends_with);
                        var string =create_elements('div','','','','','',[x_axis_result,y_axis_result]);
                        ((color, letter,rect) => {
                            rect.on('mousemove', () => {
                                var px=(1/100)*window.innerWidth;
                                var x_px=(3/100)*innerWidth;
                                var position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';    
                                show_tooltip(position, color, letter,'area');
                                rect.attr('class','add_opacity');
                            })
                        })(color, string,rect);
                        ((rect,j)=>{rect.on('mouseleave', () => {
                            var tool = document.querySelector(".tooltip");
                            tool.classList.remove('show');
                            rect.attr('class',j);
                        })})(rect,get_scale_values[j]);
                    }
                }
            }
        }
    }
    legend_add_highlight(index,data){
        var key=data["x_subgroup"];
        this.svg.selectAll('.' + key[index]).attr('class', ' add_opacity');
 }
  legend_remove_highlight(index,data){
    var key=data["x_subgroup"];
    this.svg.selectAll('.add_opacity').attr('class', key[index]);
 }
    create_x_axis(svg, domain,parent) {
        var vw =document.querySelector(parent+'> svg').clientWidth;
        var range=[0,vw-(10/100)*vw];   
        var x_scale = d3.scaleBand().domain(domain).range(range).padding(0.2);
        svg.append('g').call(d3.axisBottom(x_scale)).attr('class','x_axis');
        svg.append('text').text('Country').attr('x','50%').attr('y','96%').attr('class','x_label');
        return x_scale;
    }
}

 