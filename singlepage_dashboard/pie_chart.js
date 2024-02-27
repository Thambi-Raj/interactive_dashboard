class Pie_chart {
    constructor(parent, data) {
        this.draw_chart(parent, data, {})
        create_legend(data, parent, this)
    }
    create_svg(parent) {
        var svg = d3.select(parent).append('svg').attr('width', '90%').attr('height', "100%");
        var vw = document.querySelector(parent + '>svg').clientWidth;
        var vh = document.querySelector(parent + '>svg').clientHeight;
        var viewBox = '0 0 ' + vw + ' ' + vh;
        svg.attr('viewBox', viewBox);
        return svg;
    }
    draw_chart(parent, data, legend) {
        d3.select(parent + '> svg').remove();
        this.svg = this.create_svg(parent);
        var legend_output = Object.keys(legend);
        var legend_result_data = data.data.filter((f) => { return !legend_output.includes(f[0])});
        var pie = d3.pie().sort(null).value((d) => d[1])(legend_result_data);
        var arc = d3.arc().innerRadius(2).outerRadius(100).padAngle(0.01);
        var pie_group = this.svg.append('g').attr('class', 'center_align');
        var arcs = pie_group.selectAll("arc")
            .data(pie)
            .enter();
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d) => {
                return data.color[d.data[0]];
            })
            .on('mousemove', function (d) {
                var px = (1 / 100) * window.innerWidth;
                var x_px = (3 / 100) * innerWidth;
                var position = 'translate(' + (d3.event.clientX - x_px) + 'px,' + (d3.event.clientY + px) + 'px)';
                var tooltip_content = Object.keys(data.index)[0] + ':' + d.data[0] + '<br>' + d.data[1].toLocaleString();
                show_tooltip(position, data.color[d.data[0]], tooltip_content);
                d3.select(this).attr('class',   ' add_opacity');
            })
            .on('mouseout', function (d) {
                var tool = document.querySelector(".tooltip");
                tool.classList.remove('show');
                 d3.select(this).attr('class', d.data[0]);
            }).attr('class',d=> d.data[0]);
        arcs.append("line").attr("x1", function (d) {
                return arc.centroid(d)[0]*2;
            })
            .attr("y1", function (d) {
                return arc.centroid(d)[1]*2;
            })
            .attr("x2", function (d) {
                var c = arc.centroid(d),
                h = Math.sqrt(c[0] * c[0] + c[1] * c[1]);
                return (c[0] / h) * 120; 
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
                        x=((x / h) * 150)+20;
                    }
                    else{
                        x=((x / h) * 150)-20;
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
    legend_add_highlight(index, data) {
        var key = Object.keys(data["color"]);
        this.svg.selectAll('.' + key[index]).attr('class', ' add_opacity');
    }
    legend_remove_highlight(index, data) {
        var key = Object.keys(data["color"]);
        this.svg.selectAll('.add_opacity').attr('class', key[index]);
    }
}
var pie_charty_1 = {
    "metadata": {
      "axes": {
        "x": [0]
        ,
        "y": [[1]]
      }
    },
    "columns": [
      {
        "dataindex": [0],
        "columnname": "Cateogory",
        "datatype": "ordinal"
      },
      {
        "dataindex": [1],
        "columnname": "count",
        "datatype": "numeric","format":{
            "suffix":'B',
            "func":(b)=> Math.ceil(b/100000000),
            "decimal":0
          }
      },
    ],
    "seriesdata": {
      "chartdata": [
        {
          "type": "pie",
          "seriesname": "Category",
          "data": [["Children", 1439491717],
          ["Youth", 1028208369,],
          ["middle_Aged", 3084625108],
          ["senior_citizen", 1020299074], ["super_senior", 1328761585]]
        }
      ]
    }
    , "legend": {
      "colors": [
        "#ED8C8E",
        '#559FE0',
        '#C1ABA6',
        '#77BAB8',
        '#4AC5A7'
      ]
    },
    "chart": {
      "axes": {
        "xaxis":
        {
          "label": {
            "text": "Category",
            "class": "y_axis"
          }, "show": false
        },
  
        "yaxis":
          [{
            "label": {
              "text": "Area", "class": "y_axis"
            }, "show":false
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
        "rotated": false
      },
    }
  }
  var pie_charty_2 = {
    "metadata": {
      "axes": {
        "x": [0]
        ,
        "y": [[1]]
      }
    },
    "columns": [
      {
        "dataindex": [0],
        "columnname": "Category",
        "datatype": "ordinal"
      },
      {
        "dataindex": [1],
        "columnname": "count",
        "datatype": "numeric"
      },
    ],
    "seriesdata": {
      "chartdata": [
        {
          "type": "pie",
          "seriesname": "Category",
          "data": [["Male", 3801409659],
          ["Female", 3679925456],
          ["Others", 643624915]]
        }
      ]
    }
    , "legend": {
      "colors": [
        "#ED8C8E",
        '#559FE0',
        '#C1ABA6'
      ]
    },
    "chart": {
      "axes": {
        "xaxis":
        {
          "label": {
            "text": "Category",
            "class": "y_axis"
          }, "show": false
        },
  
        "yaxis":
          [{
            "label": {
              "text": "Area", "class": "y_axis"
            }, "show": false
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
        "rotated": false
      },
    }
  }
  var pie_charty_3 = {
    "metadata": {
      "axes": {
        "x": [0]
        ,
        "y": [[1]]
      }
    },
    "columns": [
      {
        "dataindex": [0],
        "columnname": "Category",
        "datatype": "ordinal"
      },
      {
        "dataindex": [1],
        "columnname": "count",
        "datatype": "numeric"
      },
    ],
    "seriesdata": {
      "chartdata": [
        {
          "type": "pie",
          "seriesname": "Category",
          "data": [["Poor", 2437488009],
          ["Middle_class", 3249984012],
          ["Rich", 1218744004], ["Super_rich", 406248001]]
        }
      ]
    }
    , "legend": {
      "colors": [
        "#ED8C8E",
        '#559FE0',
        '#C1ABA6',
        '#77BAB8'
      ]
    },
    "chart": {
      "axes": {
        "xaxis":
        {
          "label": {
            "text": "Category",
            "class": "y_axis"
          }, "show": false
        },
  
        "yaxis":
          [{
            "label": {
              "text": "Area", "class": "y_axis"
            }, "show": false
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
var pie = new Chart('#root>#content>#chart_view_container>#age_group>#chart_container', pie_charty_1);
var pie1 = new Chart('#root>#content>#chart_view_container>#gender_dis>#chart_container', pie_charty_2);
var pie2 = new Chart('#root>#content>#chart_view_container>#quality>#chart_container', pie_charty_3);
