class Vertical_bar {
    constructor(parent, vertical_data) {
        create_legend(vertical_data, parent, this)
        this.draw_chart(parent, vertical_data, {})
    }
    create_svg(parent) {
        var svg = d3.select(parent).append('svg').attr('width', '90%').attr('height', "80%").attr('class','sv');            
        var vw = document.querySelector(parent+'>svg').clientWidth;
        var vh = document.querySelector(parent+'>svg').clientHeight;
        var viewBox='0 0 '+vw+' '+vh;
        svg.attr('viewBox',viewBox);
        return svg;
    }
    draw_chart(parent, data, legend) {
        d3.select(parent + '> svg').remove()
        var svg = this.create_svg(parent);
        var x_scale = this.create_x_axis(svg, data.x_axis_domain,parent);
        let re_domain = Object.keys(data.index).slice(1).filter(d => !legend[d]);
        var x_subscale = d3.scaleBand().domain(re_domain).range([0, x_scale.bandwidth()]);
        var y_scales = data.map;
        var show_scale_id = document.querySelector(parent+' .clicked').id;
        var main_group = svg.append('g').attr('class', 'main_group');
        for (var i = 0; i < y_scales.length; i++) {
            var scale_index = data.index[Object.keys(y_scales[i])]; //index of the particular like pop1980 and  create domain like [0,max(pop1980)]
            var domain_data = data.data.map(d => d[scale_index])
            var domain = [0, d3.max(domain_data)];
            var  svg_size = document.querySelector(parent + '>svg').clientHeight;
            var  transform_size = (10/100)*svg_size;
            var scale_size=svg_size-transform_size-((3/100)*svg_size);
            var y_scale = d3.scaleLinear().domain(domain).range([scale_size, 0]);
            var x_domain = data.x_axis_domain;
            var get = y_scales[i][Object.keys(y_scales[i])];
            for (var j = 0; j < get.length; j++) {
             if (re_domain.includes(get[j])) {
                    get[j]==show_scale_id? (svg.append('g').call(d3.axisLeft(y_scale)).attr('class', 'y_axis'), 
                                            svg.append('text').text(first_letter(get[j])).attr("x", "5%").attr("y", "25%").attr('class','y_label'))
                                            :''
                    for (var k = 0; k < x_domain.length; k++) {
                        var g = main_group.append('g')
                        var value = data.data[k][data.index[get[j]]];
                        var color = data.color[data.index[get[j]] - 1];
                        var min=Math.max(20,(scale_size -y_scale(value)))
                        var rect = g.append('rect')
                            .attr('x', x_scale(x_domain[k]) + x_subscale(get[j]))
                            .attr('y',min!= 20 ?y_scale(value):y_scale(value)-20).attr('width', x_subscale.bandwidth())
                            .attr('height',min!=20 ? scale_size - y_scale(value): scale_size - y_scale(value)+20)
                            .attr('fill', color).attr('class',get[j]);
                            var end = data.ends[get[j]]? data.ends[get[j]]:'';
                        var span=create_elements('div','', first_letter(Object.keys(data.index)[0]) + ' : ' + first_letter(x_domain[k]));
                        var span1=create_elements('div','',first_letter(get[j]) + " : " + value.toLocaleString()+' '+end);
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
                        ((rect)=>{g.on('mouseleave', () => {
                            var tool = document.querySelector(".tooltip");
                            tool.classList.remove('show');
                            rect.attr('class','');
                        })})(rect);
                    }
                }
            }
        }
    }
    add_blur(index,data,parent){
        var key=data["x_subgroup"];
        var rect = document.querySelectorAll(parent+'> svg  .'+key[index]);
        for(var i=0;i<rect.length;i++){
          rect[i].classList.add('opact_element');
        }
 }
 remove_blur(index,data,parent){
    var key=data["x_subgroup"];
        var path = document.querySelectorAll(parent+'> svg  .'+key[index]);
        for(var i=0;i<path.length;i++){
          path[i].classList.remove('opact_element');
        }
 }
    create_x_axis(svg, domain,parent) {
        var vw =document.querySelector(parent+'> svg').clientWidth;
        var range=[0,vw-(10/100)*vw];   
        var x_scale = d3.scaleBand().domain(domain).range(range).padding(0.2);
        svg.append('g').call(d3.axisBottom(x_scale)).attr('class','x_axis');
        svg.append('text').text('Country').attr('x','46%').attr('y','99%').attr('class','scale');
        return x_scale;
    }
}

 