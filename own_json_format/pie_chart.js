class Pie_chart {
    constructor(parent, data) {
        create_legend(data, parent, this)
        this.draw_chart(parent, data, {})
    }
    create_svg(parent) {
        var svg = d3.select(parent).append('svg').attr('width', '90%').attr('height', "90%");
        var vw = document.querySelector(parent + '>svg').clientWidth;
        var vh = document.querySelector(parent + '>svg').clientHeight;
        var viewBox = '0 0 ' + vw + ' ' + vh;
        svg.attr('viewBox', viewBox);
        return svg;
    }
    draw_chart(parent, data, legend) {
        d3.select(parent + '> svg').remove();
        var svg = this.create_svg(parent);
        var ty = Object.keys(legend);
        var d = data.data;
        var dat = d.filter((f) => { return !ty.includes(f[0]) });
        var pie = d3.pie().sort(null).value((d) => d[1])(dat);
        var arc = d3.arc().innerRadius(2).outerRadius(100).padAngle(0.01);
        var g = svg.append('g').attr('class', 'pie_trans');
        var start = [];
        var end = [];
        var arcs = g.selectAll("arc")
            .data(pie)
            .enter();//]
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d) => {
                return data.color[d.data[0]];
            })
            .on('mousemove', function (d) {
                var px = (1 / 100) * window.innerWidth;
                var x_px = (3 / 100) * innerWidth;
                var position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';
                var string = Object.keys(data.index)[0] + ':' + d.data[0] + '<br>' + d.data[1].toLocaleString();
                show_tooltip(position, data.color[d.data[0]], string);
                d3.select(this).attr('class', 'opact_element');
            })
            .on('mouseout', function (d) {
                var tool = document.querySelector(".tooltip");
                tool.classList.remove('show');
                d3.select(this).attr('class', '');
            });
        arcs.append("line").attr("x1", function (d) {
                return arc.centroid(d)[0]*2;
            })
            .attr("y1", function (d) {
                return arc.centroid(d)[1]*2;
            })
            .attr("x2", function (d) {
                var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    h = Math.sqrt(x * x + y * y);
                return (x / h) * 120; 
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
                    if(x<0){
                        x=(x / h) * 150+20;
                    }
                    else{
                        x=(x / h) * 150-20;
                    }
                    return "translate(" +x + ',' + (y / h) * 130 + ")";
            })
            .attr("text-anchor", (d) => {
                if (arc.centroid(d)[0] < 0) {
                    return "end";
                } else {
                    return "start";
                }
            })
            .text((d) => {
                return d.data[0]+":"+data.percent[d.index] + '%';
            })
            .attr('fill', (d => {
                return data.color[d.data[0]]
            }))
            .attr('class', 'lo');
    }
    
    add_blur(index, data, parent) {
        var path = document.querySelectorAll(parent + '> svg  path');
        path[index].classList.add('opact_element');
    }
    remove_blur(index, data, parent) {
        var path = document.querySelectorAll(parent + '> svg  path');
        path[index].classList.remove('opact_element');
    }
}
var pie_chart_data = {};
pie_chart_data["color"] = { "Children": "#ED8C8E", "Youth": "#559FE0", "middle_Aged": "#A1DFDF", "senior_citizen": "#77BAB8", "super_senior": "#4AC5A7" };
pie_chart_data["index"] = { "Categories": 0, "count": 1 };
pie_chart_data["data"] = [["Children", 1439491717],
["Youth", 1028208369,],
["middle_Aged", 3084625108],
["senior_citizen", 1020299074], ["super_senior", 1328761585]]
pie_chart_data["legend_class"] = 'legend_area_pie';
pie_chart_data["percent"] = [18.2, 13.0, 39.0, 12.9, 16.8];

var pie = new Pie_chart('#root>#content>#group3>#age_group', pie_chart_data)
var pie_chart_data1 = {};
pie_chart_data1["color"] = { "Male": "#ED8C8E", "Female": "#559FE0", "Others": "#A1DFDF" };
pie_chart_data1["index"] = { "Gender": 0, "count": 1 };
pie_chart_data1["data"] = [["Male", 3801409659],
["Female", 3679925456],
["Others", 643624915]];
pie_chart_data1["legend_class"] = 'legend_area_pie';
pie_chart_data1["percent"] = [47.25, 45.74, 8];
var pie1 = new Pie_chart('#root>#content>#group3>#gender_dis', pie_chart_data1);

var pie_chart_data2 = {};
pie_chart_data2["color"] = { "Below_poverty": "#ED8C8E", "Poor": "#559FE0", "Middle_class": "#A1DFDF", "Rich": "#77BAB8", "Super_rich": "#4AC5A7" };
pie_chart_data2["index"] = { "Quality": 0, "count": 1 };
pie_chart_data2["data"] = [["Below_poverty", 812496003],
["Poor", 2437488009],
["Middle_class", 3249984012],
["Rich", 1218744004], ["Super_rich", 406248001]];
pie_chart_data2["legend_class"] = 'legend_area_pie';
pie_chart_data2["percent"] = [10, 30, 40, 15, 5];
var pie1 = new Pie_chart('#root>#content>#group3>#quality', pie_chart_data2);
