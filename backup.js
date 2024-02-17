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

var data = {
    "metadata": {
        "axes": {
            "x": [0]
            ,
            "y": [[1],[2],[3]]
        }
    },
    "columns": [
        {
            "dataindex": [0],
            "columnname": "Country",
            "datatype": "ordinal"
        },
        {
            "dataindex": [1],
            "columnname": "Area",
            "datatype": "numeric"
        },
        {
            "dataindex": [1],
            "columnname": "Population",
            "datatype": "numeric"
        }
        ,{
            "dataindex": [1],
            "columnname": "Density",
            "datatype": "numeric"
        }
    ],
    "seriesdata": {
        "chartdata": [
            {
                "yaxiscolumnorder": [0, 0],
                "data": []
            }, {
                "yaxiscolumnorder": [1, 0],
                "data": []
            },{
              "yaxiscolumnorder":[2,0],
              "data":[]
            }
        ]
    }
    , "legend": {
        "colors": [
          '#FED17A',
          '#83F2CB',
          '#9CD3FE'
        ]
    },
    "chart": {
        "axes": {
            "xaxis":
            {
                "label": {
                    "text": "Country",
                    "class": "x_axis"
                }, "show": true
            }
            ,
            "yaxis": [{
                "label": {
                    "text": "Area", "class": "y_axis"
                }, "show": true
            }, {
                "label": {
                    "text": "Population"
                }, "show": true
            },{
              "label": {
                  "text": "Density"
              }, "show": true
          }],
            "rotated": true
        },
    }
  }
  // all bar back up
  class Bar {
    constructor(parent, data) {
        this.data = data;
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
        multiple_x_scales.forEach((x_data, i) => {
            var min_value = 1000000;
            var max_value = -1000000;
            x_data.forEach(x_data_index => {
                var get_data = this.data.columns[x_data_index];
                this.data.seriesdata.chartdata[x_data_index - 1].type=="bar" ? sub_scales.push(get_data.columnname):'';
                if (!legend.includes(get_data.columnname)) {
                    var get_data_result = this.data.seriesdata.chartdata[x_data_index - 1].data;
                    this.data.seriesdata.chartdata[x_data_index - 1].type!="pie"?
                    get_data_result.forEach(element => {
                        min_value = Math.min(min_value, element[get_data.dataindex]);
                        max_value = Math.max(max_value, element[get_data.dataindex]);
                    }):'';
                }
            });
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
            this.y_scales.push(y_scale);
        });
        var x_sub_scale = d3.scaleBand().domain(sub_scales).range([0, this.x_scale.bandwidth()])
        var data = this.data.seriesdata.chartdata;
        data.forEach((element, i) => {
            var y_axis_scale = !element.yaxiscolumnorder ? [0, 0] : element.yaxiscolumnorder // get xaxiscolumnorder ex:-[0,0] index 0 refers to x_scales[0] and index 1 refers to get x_axis[[1,2]] x_scale[0][index1]
            var get_scale = this.data.metadata.axes.y[y_axis_scale[0]];
            var y_scale = this.y_scales[y_axis_scale[0]];  //get a particular scale
            var rect_classname = this.data.columns[get_scale[y_axis_scale[1]]].columnname; //get a columname;----
            if (!legend.includes(rect_classname)) {
                if (element.type == "pie") {
                    draw_pie_chart(element, legend,this)
                }
                else if(element.type == "line"){
                    draw_line_chart(element,legend,this);
                }
                else{
                element.data.forEach(result => {
                    var value = result[this.data.columns[get_scale[y_axis_scale[1]]].dataindex]; //get index of a value...
                    var y_pos = y_scale(value);
                    var color = this.data.legend.colors[i];
                    var rect = main_group.append('rect')
                        .attr('x', this.x_scale(result[0]) + x_sub_scale(rect_classname))
                        .attr('y', (d) => {
                            if (y_scale(y_scale.domain()[0]) > y_scale(value)) {
                                return y_scale(value);
                            }
                            else {
                                return Math.abs(y_scale(y_scale.domain()[0]));
                            }
                        })
                        .attr('width', x_sub_scale.bandwidth()).
                        attr('height', (d) => {
                            if (y_scale(y_scale.domain()[0]) > y_scale(value)) {
                                return y_scale(y_scale.domain()[0]) - y_scale(value);
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
                });
                }
            }
        });
        this.data.chart.axes.rotated ?
            console.log(this.svg.node()) : '';
    }
    create_x_scale() {
        var get_Array = this.data.seriesdata.chartdata[0].data;
        var y_domain_data = get_Array.map(d => d[0]);
        var vw = this.svg.node().clientWidth;
        var range = [vw - (11 / 100) * vw, 0];
        var y_scale = d3.scaleBand().domain(y_domain_data).range(range).padding(0.1);
        var chart_axis_label = this.data.chart.axes.xaxis //get a y-axis lable and if its is show or not
        chart_axis_label.show ? (this.svg.append('g').call(d3.axisBottom(y_scale).ticks(6)).attr('class', 'x_axis'),
            this.svg.append('text').text(chart_axis_label.label.text).attr('x', '50%').attr('y', '96%').attr('class', 'x_label')) : '';
        return y_scale;
    }
}

var landkm_population = [
    {
        "country": "India",
        "density": 484.9067,
        "densityMi": 1255.9084,
        "population": 1441719852,
        "area": 3287590
    },
    {
        "country": "China",
        "density": 151.2174,
        "densityMi": 391.653,
        "population": 1425178782,
        "area": 9706961
    },
    {
        "country": "United States",
        "density": 37.3673,
        "densityMi": 96.7813,
        "population": 341814420,
        "area": 9372610
    },
    {
        "country": "Indonesia",
        "density": 149.0254,
        "densityMi": 385.9758,
        "population": 279798049,
        "area": 1904569
    },
    {
        "country": "Pakistan",
        "density": 318.0908,
        "densityMi": 823.8551,
        "population": 245209815,
        "area": 881912
    },
    {
        "country": "Nigeria",
        "density": 251.6027,
        "densityMi": 651.6511,
        "population": 229152217,
        "area": 923768
    },
    {
        "country": "Brazil",
        "density": 26.039,
        "densityMi": 67.4409,
        "population": 217637297,
        "area": 8515767
    },
    {
        "country": "Bangladesh",
        "density": 1342.1004,
        "densityMi": 3476.0401,
        "population": 174701211,
        "area": 147570
    },
    {
        "country": "Russia",
        "density": 8.7903,
        "densityMi": 22.7668,
        "population": 143957079,
        "area": 17098242
    },
    {
        "country": "Ethiopia",
        "density": 114.9415,
        "densityMi": 297.6986,
        "population": 129719719,
        "area": 1104300
    },
    {
        "country": "Mexico",
        "density": 66.5596,
        "densityMi": 172.3893,
        "population": 129388467,
        "area": 1964375
    },
    {
        "country": "Japan",
        "density": 336.4374,
        "densityMi": 871.3729,
        "population": 122631432,
        "area": 377930
    },
    {
        "country": "Philippines",
        "density": 399.4574,
        "densityMi": 1034.5948,
        "population": 119106224,
        "area": 342353
    },
    {
        "country": "Egypt",
        "density": 115.0075,
        "densityMi": 297.8695,
        "population": 114484252,
        "area": 1002450
    },
    {
        "country": "DR Congo",
        "density": 46.5914,
        "densityMi": 120.6718,
        "population": 105625114,
        "area": 2344858
    },
    {
        "country": "Vietnam",
        "density": 317.4489,
        "densityMi": 822.1926,
        "population": 99497680,
        "area": 331212
    },
    {
        "country": "Iran",
        "density": 55.3527,
        "densityMi": 143.3635,
        "population": 89809781,
        "area": 1648195
    },
    {
        "country": "Turkey",
        "density": 110.0875,
        "densityMi": 285.1267,
        "population": 86260417,
        "area": 783562
    },
    {
        "country": "Germany",
        "density": 238.2795,
        "densityMi": 617.1439,
        "population": 83252474,
        "area": 357114
    },
    {
        "country": "Thailand",
        "density": 140.707,
        "densityMi": 364.4311,
        "population": 71885799,
        "area": 513120
    },
    {
        "country": "Tanzania",
        "density": 78.3688,
        "densityMi": 202.9752,
        "population": 69419073,
        "area": 945087
    },
    {
        "country": "United Kingdom",
        "density": 280.9136,
        "densityMi": 727.5663,
        "population": 67961439,
        "area": 242900
    },
    {
        "country": "France",
        "density": 118.4933,
        "densityMi": 306.8976,
        "population": 64881830,
        "area": 551695
    },
    {
        "country": "South Africa",
        "density": 50.3015,
        "densityMi": 130.2808,
        "population": 61020221,
        "area": 1221037
    },
    {
        "country": "Italy",
        "density": 198.493,
        "densityMi": 514.0968,
        "population": 58697744,
        "area": 301336
    },
    {
        "country": "Kenya",
        "density": 98.7508,
        "densityMi": 255.7646,
        "population": 56203030,
        "area": 580367
    },
    {
        "country": "Myanmar",
        "density": 84.2151,
        "densityMi": 218.1172,
        "population": 54964694,
        "area": 676578
    },
    {
        "country": "Colombia",
        "density": 47.1751,
        "densityMi": 122.1835,
        "population": 52340774,
        "area": 1141748
    },
    {
        "country": "South Korea",
        "density": 530.1431,
        "densityMi": 1373.0705,
        "population": 51741963,
        "area": 100210
    },
    {
        "country": "Uganda",
        "density": 248.9739,
        "densityMi": 644.8425,
        "population": 49924252,
        "area": 241550
    },
    {
        "country": "Sudan",
        "density": 26.423,
        "densityMi": 68.4357,
        "population": 49358228,
        "area": 1886068
    },
    {
        "country": "Spain",
        "density": 95.031,
        "densityMi": 246.1303,
        "population": 47473373,
        "area": 505992
    },
    {
        "country": "Iraq",
        "density": 107.1658,
        "densityMi": 277.5593,
        "population": 46523657,
        "area": 438317
    },
    {
        "country": "Algeria",
        "density": 19.4306,
        "densityMi": 50.3254,
        "population": 46278751,
        "area": 2381741
    },
    {
        "country": "Argentina",
        "density": 16.8298,
        "densityMi": 43.5891,
        "population": 46057866,
        "area": 2780400
    },
    {
        "country": "Afghanistan",
        "density": 66.4995,
        "densityMi": 172.2336,
        "population": 43372950,
        "area": 652230
    },
    {
        "country": "Poland",
        "density": 131.3877,
        "densityMi": 340.2942,
        "population": 40221726,
        "area": 312679
    },
    {
        "country": "Canada",
        "density": 4.3619,
        "densityMi": 11.2973,
        "population": 39107046,
        "area": 9984670
    },
    {
        "country": "Morocco",
        "density": 85.6183,
        "densityMi": 221.7515,
        "population": 38211459,
        "area": 446550
    },
    {
        "country": "Ukraine",
        "density": 65.4778,
        "densityMi": 169.5874,
        "population": 37937821,
        "area": 603500
    },
    {
        "country": "Angola",
        "density": 30.3238,
        "densityMi": 78.5385,
        "population": 37804634,
        "area": 1246700
    },
    {
        "country": "Saudi Arabia",
        "density": 17.4322,
        "densityMi": 45.1495,
        "population": 37473929,
        "area": 2149690
    },
    {
        "country": "Uzbekistan",
        "density": 80.9572,
        "densityMi": 209.6792,
        "population": 35673804,
        "area": 447400
    },
    {
        "country": "Yemen",
        "density": 66.7081,
        "densityMi": 172.7739,
        "population": 35219853,
        "area": 527968
    },
    {
        "country": "Mozambique",
        "density": 44.3277,
        "densityMi": 114.8087,
        "population": 34858402,
        "area": 801590
    },
    {
        "country": "Ghana",
        "density": 152.8461,
        "densityMi": 395.8713,
        "population": 34777522,
        "area": 238533
    },
    {
        "country": "Peru",
        "density": 27.0964,
        "densityMi": 70.1798,
        "population": 34683444,
        "area": 1285216
    },
    {
        "country": "Malaysia",
        "density": 105.53,
        "densityMi": 273.3228,
        "population": 34671895,
        "area": 330803
    },
    {
        "country": "Nepal",
        "density": 217.9303,
        "densityMi": 564.4396,
        "population": 31240315,
        "area": 147181
    },
    {
        "country": "Madagascar",
        "density": 53.3802,
        "densityMi": 138.2548,
        "population": 31056610,
        "area": 587041
    },
    {
        "country": "Ivory Coast",
        "density": 93.0921,
        "densityMi": 241.1087,
        "population": 29603302,
        "area": 322463
    },
    {
        "country": "Venezuela",
        "density": 33.3262,
        "densityMi": 86.3147,
        "population": 29395334,
        "area": 916445
    },
    {
        "country": "Cameroon",
        "density": 62.1828,
        "densityMi": 161.0535,
        "population": 29394433,
        "area": 475442
    },
    {
        "country": "Niger",
        "density": 22.2933,
        "densityMi": 57.7397,
        "population": 28238972,
        "area": 1267000
    },
    {
        "country": "Australia",
        "density": 3.4711,
        "densityMi": 8.9901,
        "population": 26699482,
        "area": 7692024
    },
    {
        "country": "North Korea",
        "density": 217.9602,
        "densityMi": 564.5168,
        "population": 26244582,
        "area": 120538
    },
    {
        "country": "Syria",
        "density": 132.593,
        "densityMi": 343.4159,
        "population": 24348053,
        "area": 185180
    },
    {
        "country": "Mali",
        "density": 19.682,
        "densityMi": 50.9764,
        "population": 24015789,
        "area": 1240192
    },
    {
        "country": "Taiwan",
        "density": 661.663,
        "densityMi": 1713.7071,
        "population": 23950214,
        "area": 36193
    },
    {
        "country": "Burkina Faso",
        "density": 87.1354,
        "densityMi": 225.6807,
        "population": 23840247,
        "area": 272967
    },
    {
        "country": "Sri Lanka",
        "density": 354.8217,
        "densityMi": 918.9881,
        "population": 21949268,
        "area": 65610
    },
    {
        "country": "Malawi",
        "density": 227.7892,
        "densityMi": 589.9739,
        "population": 21475962,
        "area": 118484
    },
    {
        "country": "Zambia",
        "density": 28.4302,
        "densityMi": 73.6341,
        "population": 21134695,
        "area": 752612
    },
    {
        "country": "Kazakhstan",
        "density": 7.3446,
        "densityMi": 19.0225,
        "population": 19828165,
        "area": 2724900
    },
    {
        "country": "Chile",
        "density": 26.4398,
        "densityMi": 68.4791,
        "population": 19658839,
        "area": 756102
    },
    {
        "country": "Romania",
        "density": 85.2703,
        "densityMi": 220.8501,
        "population": 19618996,
        "area": 238391
    },
    {
        "country": "Chad",
        "density": 14.9676,
        "densityMi": 38.766,
        "population": 18847148,
        "area": 1284000
    },
    {
        "country": "Somalia",
        "density": 29.8194,
        "densityMi": 77.2323,
        "population": 18706922,
        "area": 637657
    },
    {
        "country": "Ecuador",
        "density": 73.9949,
        "densityMi": 191.6467,
        "population": 18377367,
        "area": 276841
    },
    {
        "country": "Guatemala",
        "density": 171.3179,
        "densityMi": 443.7135,
        "population": 18358430,
        "area": 108889
    },
    {
        "country": "Senegal",
        "density": 94.6427,
        "densityMi": 245.1247,
        "population": 18221567,
        "area": 196722
    },
    {
        "country": "Netherlands",
        "density": 524.8329,
        "densityMi": 1359.3173,
        "population": 17671125,
        "area": 41850
    },
    {
        "country": "Cambodia",
        "density": 96.9966,
        "densityMi": 251.2213,
        "population": 17121847,
        "area": 181035
    },
    {
        "country": "Zimbabwe",
        "density": 43.9972,
        "densityMi": 113.9528,
        "population": 17020321,
        "area": 390757
    },
    {
        "country": "Guinea",
        "density": 59.1273,
        "densityMi": 153.1398,
        "population": 14528770,
        "area": 245857
    },
    {
        "country": "Rwanda",
        "density": 584.3093,
        "densityMi": 1513.361,
        "population": 14414910,
        "area": 26338
    },
    {
        "country": "Benin",
        "density": 124.8676,
        "densityMi": 323.4071,
        "population": 14080072,
        "area": 112622
    },
    {
        "country": "Burundi",
        "density": 529.2701,
        "densityMi": 1370.8096,
        "population": 13591657,
        "area": 27834
    },
    {
        "country": "Bolivia",
        "density": 11.601,
        "densityMi": 30.0465,
        "population": 12567336,
        "area": 1098581
    },
    {
        "country": "Tunisia",
        "density": 80.8747,
        "densityMi": 209.4654,
        "population": 12564689,
        "area": 163610
    },
    {
        "country": "Haiti",
        "density": 430.5889,
        "densityMi": 1115.2252,
        "population": 11867030,
        "area": 27750
    },
    {
        "country": "Belgium",
        "density": 386.9146,
        "densityMi": 1002.1088,
        "population": 11715774,
        "area": 30528
    },
    {
        "country": "Dominican Republic",
        "density": 236.6799,
        "densityMi": 613.0009,
        "population": 11434005,
        "area": 48671
    },
    {
        "country": "Jordan",
        "density": 128.2172,
        "densityMi": 332.0827,
        "population": 11384922,
        "area": 89342
    },
    {
        "country": "South Sudan",
        "density": 17.8455,
        "densityMi": 46.2198,
        "population": 11277092,
        "area": 619745
    },
    {
        "country": "Cuba",
        "density": 107.655,
        "densityMi": 278.8264,
        "population": 11174587,
        "area": 109884
    },
    {
        "country": "Honduras",
        "density": 96.1606,
        "densityMi": 249.0559,
        "population": 10759406,
        "area": 112492
    },
    {
        "country": "Sweden",
        "density": 26.207,
        "densityMi": 67.8761,
        "population": 10673669,
        "area": 450295
    },
    {
        "country": "Papua New Guinea",
        "density": 23.2208,
        "densityMi": 60.142,
        "population": 10515788,
        "area": 462840
    },
    {
        "country": "Czech Republic",
        "density": 136.0614,
        "densityMi": 352.399,
        "population": 10503734,
        "area": 78865
    },
    {
        "country": "Azerbaijan",
        "density": 126.599,
        "densityMi": 327.8915,
        "population": 10462904,
        "area": 86600
    },
    {
        "country": "Tajikistan",
        "density": 74.4399,
        "densityMi": 192.7993,
        "population": 10331513,
        "area": 143100
    },
    {
        "country": "Greece",
        "density": 79.928,
        "densityMi": 207.0135,
        "population": 10302720,
        "area": 131990
    },
    {
        "country": "Portugal",
        "density": 111.6018,
        "densityMi": 289.0486,
        "population": 10223349,
        "area": 92090
    },
    {
        "country": "Hungary",
        "density": 109.5222,
        "densityMi": 283.6624,
        "population": 9994993,
        "area": 93028
    },
    {
        "country": "United Arab Emirates",
        "density": 135.0585,
        "densityMi": 349.8015,
        "population": 9591853,
        "area": 83600
    },
    {
        "country": "Belarus",
        "density": 46.5811,
        "densityMi": 120.6451,
        "population": 9455037,
        "area": 207600
    },
    {
        "country": "Israel",
        "density": 430.2982,
        "densityMi": 1114.4722,
        "population": 9311652,
        "area": 20770
    },
    {
        "country": "Togo",
        "density": 170.2678,
        "densityMi": 440.9935,
        "population": 9260864,
        "area": 56785
    },
    {
        "country": "Sierra Leone",
        "density": 124.3831,
        "densityMi": 322.1522,
        "population": 8977972,
        "area": 71740
    },
    {
        "country": "Austria",
        "density": 108.7874,
        "densityMi": 281.7595,
        "population": 8977139,
        "area": 83871
    },
    {
        "country": "Switzerland",
        "density": 223.9961,
        "densityMi": 580.15,
        "population": 8851431,
        "area": 41284
    },
    {
        "country": "Laos",
        "density": 33.5211,
        "densityMi": 86.8198,
        "population": 7736681,
        "area": 236800
    },
    {
        "country": "Hong Kong",
        "density": 7139.6962,
        "densityMi": 18491.8131,
        "population": 7496681,
        "area": 1104
    },
    {
        "country": "Nicaragua",
        "density": 59.3529,
        "densityMi": 153.724,
        "population": 7142529,
        "area": 130373
    },
    {
        "country": "Serbia",
        "density": 81.146,
        "densityMi": 210.1681,
        "population": 7097028,
        "area": 88361
    },
    {
        "country": "Libya",
        "density": 3.958,
        "densityMi": 10.2511,
        "population": 6964197,
        "area": 1759540
    },
    {
        "country": "Paraguay",
        "density": 17.4862,
        "densityMi": 45.2893,
        "population": 6947270,
        "area": 406752
    },
    {
        "country": "Kyrgyzstan",
        "density": 35.6601,
        "densityMi": 92.3596,
        "population": 6839606,
        "area": 199951
    },
    {
        "country": "Bulgaria",
        "density": 60.9673,
        "densityMi": 157.9054,
        "population": 6618615,
        "area": 110879
    },
    {
        "country": "Turkmenistan",
        "density": 14.0405,
        "densityMi": 36.365,
        "population": 6598071,
        "area": 488100
    },
    {
        "country": "El Salvador",
        "density": 308.7012,
        "densityMi": 799.5361,
        "population": 6396289,
        "area": 21041
    },
    {
        "country": "Republic of the Congo",
        "density": 18.2856,
        "densityMi": 47.3598,
        "population": 6244547,
        "area": 342000
    },
    {
        "country": "Singapore",
        "density": 8429.9568,
        "densityMi": 21833.5882,
        "population": 6052709,
        "area": 710
    },
    {
        "country": "Denmark",
        "density": 148.4924,
        "densityMi": 384.5953,
        "population": 5939695,
        "area": 43094
    },
    {
        "country": "Central African Republic",
        "density": 9.4957,
        "densityMi": 24.5938,
        "population": 5915627,
        "area": 622984
    },
    {
        "country": "Slovakia",
        "density": 116.3013,
        "densityMi": 301.2202,
        "population": 5702832,
        "area": 49037
    },
    {
        "country": "Finland",
        "density": 18.2598,
        "densityMi": 47.2929,
        "population": 5549886,
        "area": 338424
    },
    {
        "country": "Liberia",
        "density": 57.4849,
        "densityMi": 148.886,
        "population": 5536949,
        "area": 111369
    },
    {
        "country": "Norway",
        "density": 15.1378,
        "densityMi": 39.2069,
        "population": 5514477,
        "area": 323802
    },
    {
        "country": "Palestine",
        "density": 912.7846,
        "densityMi": 2364.112,
        "population": 5494963,
        "area": 6220
    },
    {
        "country": "New Zealand",
        "density": 20.0142,
        "densityMi": 51.8368,
        "population": 5269939,
        "area": 270467
    },
    {
        "country": "Costa Rica",
        "density": 102.7559,
        "densityMi": 266.1377,
        "population": 5246714,
        "area": 51100
    },
    {
        "country": "Lebanon",
        "density": 510.1705,
        "densityMi": 1321.3415,
        "population": 5219044,
        "area": 10452
    },
    {
        "country": "Ireland",
        "density": 73.8783,
        "densityMi": 191.3449,
        "population": 5089478,
        "area": 70273
    },
    {
        "country": "Mauritania",
        "density": 4.8452,
        "densityMi": 12.549,
        "population": 4993922,
        "area": 1030700
    },
    {
        "country": "Oman",
        "density": 15.2296,
        "densityMi": 39.4446,
        "population": 4713553,
        "area": 309500
    },
    {
        "country": "Panama",
        "density": 61.0402,
        "densityMi": 158.0941,
        "population": 4527961,
        "area": 75417
    },
    {
        "country": "Kuwait",
        "density": 244.073,
        "densityMi": 632.1489,
        "population": 4349380,
        "area": 17818
    },
    {
        "country": "Croatia",
        "density": 71.2407,
        "densityMi": 184.5133,
        "population": 3986627,
        "area": 56594
    },
    {
        "country": "Eritrea",
        "density": 31.5402,
        "densityMi": 81.6891,
        "population": 3817651,
        "area": 117600
    },
    {
        "country": "Georgia",
        "density": 53.4958,
        "densityMi": 138.5542,
        "population": 3717425,
        "area": 69700
    },
    {
        "country": "Mongolia",
        "density": 2.2431,
        "densityMi": 5.8096,
        "population": 3493629,
        "area": 1564110
    },
    {
        "country": "Uruguay",
        "density": 19.5596,
        "densityMi": 50.6593,
        "population": 3423316,
        "area": 181034
    },
    {
        "country": "Moldova",
        "density": 101.2591,
        "densityMi": 262.2611,
        "population": 3329865,
        "area": 33846
    },
    {
        "country": "Puerto Rico",
        "density": 368.5233,
        "densityMi": 954.4754,
        "population": 3268802,
        "area": 8870
    },
    {
        "country": "Bosnia and Herzegovina",
        "density": 62.3902,
        "densityMi": 161.5906,
        "population": 3194378,
        "area": 51209
    },
    {
        "country": "Gambia",
        "density": 280.8106,
        "densityMi": 727.2994,
        "population": 2841803,
        "area": 10689
    },
    {
        "country": "Albania",
        "density": 103.1394,
        "densityMi": 267.1311,
        "population": 2826020,
        "area": 28748
    },
    {
        "country": "Jamaica",
        "density": 260.8253,
        "densityMi": 675.5375,
        "population": 2824738,
        "area": 10991
    },
    {
        "country": "Armenia",
        "density": 97.5757,
        "densityMi": 252.721,
        "population": 2777979,
        "area": 29743
    },
    {
        "country": "Qatar",
        "density": 238.2124,
        "densityMi": 616.9702,
        "population": 2737061,
        "area": 11586
    },
    {
        "country": "Botswana",
        "density": 4.7989,
        "densityMi": 12.4292,
        "population": 2719694,
        "area": 582000
    },
    {
        "country": "Lithuania",
        "density": 43.0022,
        "densityMi": 111.3757,
        "population": 2692798,
        "area": 65300
    },
    {
        "country": "Namibia",
        "density": 3.2137,
        "densityMi": 8.3235,
        "population": 2645805,
        "area": 825615
    },
    {
        "country": "Gabon",
        "density": 9.6424,
        "densityMi": 24.9738,
        "population": 2484557,
        "area": 267668
    },
    {
        "country": "Lesotho",
        "density": 77.6048,
        "densityMi": 200.9965,
        "population": 2356083,
        "area": 30355
    },
    {
        "country": "Guinea-Bissau",
        "density": 78.1347,
        "densityMi": 202.369,
        "population": 2197149,
        "area": 36125
    },
    {
        "country": "Slovenia",
        "density": 105.2306,
        "densityMi": 272.5472,
        "population": 2118965,
        "area": 20273
    },
    {
        "country": "North Macedonia",
        "density": 82.5815,
        "densityMi": 213.8861,
        "population": 2082706.0000000002,
        "area": 25713
    },
    {
        "country": "Latvia",
        "density": 29.0895,
        "densityMi": 75.3418,
        "population": 1810240,
        "area": 64559
    },
    {
        "country": "Equatorial Guinea",
        "density": 62.5666,
        "densityMi": 162.0475,
        "population": 1754993,
        "area": 28051
    },
    {
        "country": "Trinidad and Tobago",
        "density": 299.8441,
        "densityMi": 776.5961,
        "population": 1538200,
        "area": 5130
    },
    {
        "country": "Bahrain",
        "density": 1909.1873,
        "densityMi": 4944.795,
        "population": 1498712,
        "area": 765
    },
    {
        "country": "Timor-Leste",
        "density": 92.7964,
        "densityMi": 240.3428,
        "population": 1379883,
        "area": 14874
    },
    {
        "country": "Estonia",
        "density": 30.8548,
        "densityMi": 79.9138,
        "population": 1319041,
        "area": 45227
    },
    {
        "country": "Mauritius",
        "density": 641.3685,
        "densityMi": 1661.1443,
        "population": 1301978,
        "area": 2040
    },
    {
        "country": "Cyprus",
        "density": 137.28,
        "densityMi": 355.5551,
        "population": 1268467,
        "area": 9251
    },
    {
        "country": "Eswatini",
        "density": 71.0509,
        "densityMi": 184.0218,
        "population": 1222075,
        "area": 17364
    },
    {
        "country": "Djibouti",
        "density": 49.7122,
        "densityMi": 128.7546,
        "population": 1152329,
        "area": 23200
    },
    {
        "country": "Reunion",
        "density": 393.8495,
        "densityMi": 1020.0703,
        "population": 989350,
        "area": 2511
    },
    {
        "country": "Fiji",
        "density": 51.6186,
        "densityMi": 133.6922,
        "population": 943072,
        "area": 18272
    },
    {
        "country": "Comoros",
        "density": 466.2037,
        "densityMi": 1207.4675,
        "population": 867605,
        "area": 1862
    },
    {
        "country": "Guyana",
        "density": 4.1635,
        "densityMi": 10.7836,
        "population": 819594,
        "area": 214969
    },
    {
        "country": "Bhutan",
        "density": 20.7756,
        "densityMi": 53.8088,
        "population": 792382,
        "area": 38394
    },
    {
        "country": "Solomon Islands",
        "density": 27.0337,
        "densityMi": 70.0173,
        "population": 756673,
        "area": 28896
    },
    {
        "country": "Macau",
        "density": 21674.2249,
        "densityMi": 56136.2426,
        "population": 713082,
        "area": 32.9
    },
    {
        "country": "Luxembourg",
        "density": 256.9796,
        "densityMi": 665.5772,
        "population": 661594,
        "area": 2586
    },
    {
        "country": "Suriname",
        "density": 4.0307,
        "densityMi": 10.4394,
        "population": 628785,
        "area": 163820
    },
    {
        "country": "Montenegro",
        "density": 46.5503,
        "densityMi": 120.5654,
        "population": 626102,
        "area": 13812
    },
    {
        "country": "Cape Verde",
        "density": 149.8788,
        "densityMi": 388.186,
        "population": 604461,
        "area": 4033
    },
    {
        "country": "Western Sahara",
        "density": 2.2496,
        "densityMi": 5.8264,
        "population": 598385,
        "area": 266000
    },
    {
        "country": "Malta",
        "density": 1677.3125,
        "densityMi": 4344.2394,
        "population": 536740,
        "area": 316
    },
    {
        "country": "Maldives",
        "density": 1726.29,
        "densityMi": 4471.0911,
        "population": 517886.99999999994,
        "area": 300
    },
    {
        "country": "Brunei",
        "density": 86.5006,
        "densityMi": 224.0365,
        "population": 455858,
        "area": 5765
    },
    {
        "country": "Belize",
        "density": 18.2664,
        "densityMi": 47.3099,
        "population": 416656,
        "area": 22966
    },
    {
        "country": "Bahamas",
        "density": 41.4808,
        "densityMi": 107.4353,
        "population": 415223,
        "area": 13943
    },
    {
        "country": "Guadeloupe",
        "density": 243.4558,
        "densityMi": 630.5505,
        "population": 396346,
        "area": 1628
    },
    {
        "country": "Iceland",
        "density": 3.7458,
        "densityMi": 9.7016,
        "population": 377689,
        "area": 103000
    },
    {
        "country": "Martinique",
        "density": 324.8369,
        "densityMi": 841.3275,
        "population": 366416,
        "area": 1128
    },
    {
        "country": "Mayotte",
        "density": 925.123,
        "densityMi": 2396.0686,
        "population": 345996,
        "area": 374
    },
    {
        "country": "Vanuatu",
        "density": 28.0824,
        "densityMi": 72.7335,
        "population": 342325,
        "area": 12189
    },
    {
        "country": "French Guiana",
        "density": 3.8283,
        "densityMi": 9.9154,
        "population": 319796,
        "area": 83534
    },
    {
        "country": "French Polynesia",
        "density": 89.7099,
        "densityMi": 232.3486,
        "population": 311383,
        "area": 4167
    },
    {
        "country": "New Caledonia",
        "density": 16.1907,
        "densityMi": 41.9339,
        "population": 295966,
        "area": 18575
    },
    {
        "country": "Barbados",
        "density": 656.5326,
        "densityMi": 1700.4193,
        "population": 282309,
        "area": 430
    },
    {
        "country": "Sao Tome and Principe",
        "density": 246.2302,
        "densityMi": 637.7362,
        "population": 236381,
        "area": 964
    },
    {
        "country": "Samoa",
        "density": 82.3619,
        "densityMi": 213.3172,
        "population": 228966,
        "area": 2842
    },
    {
        "country": "Curacao",
        "density": 434.6059,
        "densityMi": 1125.6292,
        "population": 192965,
        "area": 444
    },
    {
        "country": "Saint Lucia",
        "density": 296.4016,
        "densityMi": 767.6802,
        "population": 180805,
        "area": 616
    },
    {
        "country": "Guam",
        "density": 322.4333,
        "densityMi": 835.1023,
        "population": 174114,
        "area": 549
    },
    {
        "country": "Kiribati",
        "density": 167.6086,
        "densityMi": 434.1064,
        "population": 135763,
        "area": 811
    },
    {
        "country": "Grenada",
        "density": 373.1971,
        "densityMi": 966.5804,
        "population": 126887,
        "area": 344
    },
    {
        "country": "Micronesia",
        "density": 166.1429,
        "densityMi": 430.31,
        "population": 116300,
        "area": 702
    },
    {
        "country": "Jersey",
        "density": 940.3583,
        "densityMi": 2435.5281,
        "population": 112843,
        "area": 116
    },
    {
        "country": "Tonga",
        "density": 150.9486,
        "densityMi": 390.9569,
        "population": 108683,
        "area": 747
    },
    {
        "country": "Seychelles",
        "density": 235.3543,
        "densityMi": 609.5678,
        "population": 108263,
        "area": 452
    },
    {
        "country": "Aruba",
        "density": 589.8722,
        "densityMi": 1527.7691,
        "population": 106177,
        "area": 180
    },
    {
        "country": "Saint Vincent and the Grenadines",
        "density": 265.8538,
        "densityMi": 688.5615,
        "population": 103683,
        "area": 389
    },
    {
        "country": "United States Virgin Islands",
        "density": 282.5793,
        "densityMi": 731.8803,
        "population": 98055,
        "area": 347
    },
    {
        "country": "Antigua and Barbuda",
        "density": 215.4909,
        "densityMi": 558.1215,
        "population": 94816,
        "area": 442
    },
    {
        "country": "Isle of Man",
        "density": 148.9544,
        "densityMi": 385.7919,
        "population": 84904,
        "area": 572
    },
    {
        "country": "Andorra",
        "density": 170.9383,
        "densityMi": 442.7302,
        "population": 80341,
        "area": 468
    },
    {
        "country": "Dominica",
        "density": 97.824,
        "densityMi": 253.3642,
        "population": 73368,
        "area": 751
    },
    {
        "country": "Cayman Islands",
        "density": 291.1875,
        "densityMi": 754.1756,
        "population": 69885,
        "area": 264
    },
    {
        "country": "Bermuda",
        "density": 1183.9815,
        "densityMi": 3066.512,
        "population": 63935,
        "area": 54
    },
    {
        "country": "Guernsey",
        "density": 1012.5079,
        "densityMi": 2622.3956,
        "population": 63788,
        "area": 78
    },
    {
        "country": "Greenland",
        "density": 0.1384,
        "densityMi": 0.3583,
        "population": 56789,
        "area": 2166086
    },
    {
        "country": "Faroe Islands",
        "density": 39.1245,
        "densityMi": 101.3323,
        "population": 53444,
        "area": 1393
    },
    {
        "country": "Northern Mariana Islands",
        "density": 108.75,
        "densityMi": 281.6625,
        "population": 50025,
        "area": 464
    },
    {
        "country": "Saint Kitts and Nevis",
        "density": 184.0269,
        "densityMi": 476.6297,
        "population": 47847,
        "area": 261
    },
    {
        "country": "Turks and Caicos Islands",
        "density": 48.9778,
        "densityMi": 126.8526,
        "population": 46431,
        "area": 948
    },
    {
        "country": "Sint Maarten",
        "density": 1303.2059,
        "densityMi": 3375.3032,
        "population": 44309,
        "area": 34
    },
    {
        "country": "American Samoa",
        "density": 217.72,
        "densityMi": 563.8948,
        "population": 43544,
        "area": 199
    },
    {
        "country": "Marshall Islands",
        "density": 235.6389,
        "densityMi": 610.3047,
        "population": 42415,
        "area": 181
    },
    {
        "country": "Liechtenstein",
        "density": 248.8875,
        "densityMi": 644.6186,
        "population": 39822,
        "area": 160
    },
    {
        "country": "Monaco",
        "density": 18078.5,
        "densityMi": 46823.315,
        "population": 36157,
        "area": 2.02
    },
    {
        "country": "San Marino",
        "density": 560.2333,
        "densityMi": 1451.0043,
        "population": 33614,
        "area": 61
    },
    {
        "country": "Gibraltar",
        "density": 4811.4706,
        "densityMi": 12461.7088,
        "population": 32718.000000000004,
        "area": 6.8
    },
    {
        "country": "Saint Martin",
        "density": 646.74,
        "densityMi": 1675.0566,
        "population": 32337.000000000004,
        "area": 53
    },
    {
        "country": "British Virgin Islands",
        "density": 211.7533,
        "densityMi": 548.4411,
        "population": 31763,
        "area": 151
    },
    {
        "country": "Palau",
        "density": 39.2413,
        "densityMi": 101.635,
        "population": 18051,
        "area": 459
    },
    {
        "country": "Cook Islands",
        "density": 71.1333,
        "densityMi": 184.2353,
        "population": 17072,
        "area": 240
    },
    {
        "country": "Anguilla",
        "density": 175.1209,
        "densityMi": 453.5631,
        "population": 15936,
        "area": 91
    },
    {
        "country": "Nauru",
        "density": 644.2,
        "densityMi": 1668.478,
        "population": 12884,
        "area": 21
    },
    {
        "country": "Tuvalu",
        "density": 382.6,
        "densityMi": 990.934,
        "population": 11478,
        "area": 26
    },
    {
        "country": "Wallis and Futuna",
        "density": 41.7482,
        "densityMi": 108.1278,
        "population": 11439,
        "area": 274
    },
    {
        "country": "Saint Barthelemy",
        "density": 440.76,
        "densityMi": 1141.5684,
        "population": 11019,
        "area": 21
    },
    {
        "country": "Saint Pierre and Miquelon",
        "density": 24.0289,
        "densityMi": 62.2349,
        "population": 5815,
        "area": 242
    },
    {
        "country": "Montserrat",
        "density": 42.8627,
        "densityMi": 111.0145,
        "population": 4372,
        "area": 102
    },
    {
        "country": "Falkland Islands",
        "density": 0.3124,
        "densityMi": 0.8091,
        "population": 3803,
        "area": 12173
    },
    {
        "country": "Niue",
        "density": 7.4138,
        "densityMi": 19.2017,
        "population": 1935,
        "area": 261
    },
    {
        "country": "Tokelau",
        "density": 191.5,
        "densityMi": 495.985,
        "population": 1915,
        "area": 12
    },
    {
        "country": "Vatican City",
        "density": 1195.4545,
        "densityMi": 3096.2273,
        "population": 526,
        "area": 0.44
    }
]
var data = {
    "metadata": {
        "axes": {
            "x": [0]
            ,
            "y": [[1 ,2 ],[3]]
        }
    },
    "columns": [
        {
            "dataindex": [0],
            "columnname": "Country",
            "datatype": "ordinal"
        },
        {
            "dataindex": [1],
            "columnname": "Area",
            "datatype": "numeric"
        },
        {
            "dataindex": [1],
            "columnname": "Population",
            "datatype": "numeric"
        }
        , {
            "dataindex": [1],
            "columnname": "Density",
            "datatype": "numeric"
        }
    ],
    "seriesdata": {
        "chartdata": [
            {
                "type": "pie",
                "yaxiscolumnorder": [0, 0],
                "data": []
            }, {
                "type": "bar",
                "yaxiscolumnorder": [0,1],
                "data": []
            }, {
                "type": "line",
                "yaxiscolumnorder": [1, 0],
                "data": []
            }
        ]
    }
    , "legend": {
        "colors": [
            '#FED17A',
            '#83F2CB',
            '#9CD3FE'
        ]
    },
    "chart": {
        "axes": {
            "xaxis":
            {
                "label": {
                    "text": "Country",
                    "class": "y_axis"
                }, "show": true
            },

            "yaxis":
                [{
                    "label": {
                        "text": "Area", "class": "y_axis"
                    }, "show": true
                }, {
                    "label": {
                        "text": "Population",
                        "class": "y_axis"
                    }, "show": false
                }, {
                    "label": {
                        "text": "Density",
                        "class": "y_axis"
                    }, "show": false
                }],
            "rotated": true
        },
    }
}
var dat = [];
dat = landkm_population.sort((a, b) => {
    return b[name] - a[name];
})
var population_array = dat.map(d => [d['country'], d['population']]);
var landkm_array = dat.map(d => [d['country'], d['area']]);
var dens = dat.map(d => [d['country'], d['density']]);
data.seriesdata.chartdata[0]["data"] = landkm_array.slice(0, 10);
data.seriesdata.chartdata[1]["data"] = population_array.slice(0, 10);
data.seriesdata.chartdata[2]["data"] = dens.slice(0, 10);
var a = new Bar('body>#container', data);
