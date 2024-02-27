var data = [{ 'Country': 'India', 'high': 1, 'low': .3 },
{ 'Country': 'Japan', 'high': .7, 'low': .1 },
{ 'Country': 'China', 'high': 1.4, 'low': .2 }
]
var JSON = {
    "first": {
        "type": "vertical_bar",
        "svg_class": "sv",
        "parent_ref": "#root>#content>#group2>#pop_den",
        "x_axis_domain": ["United States", "Indonesia", "Pakistan"],
        "y_axis_key": ["landAreaKm", "pop1980", "density"],
        "color": ["red", "green", "orange"],
        "data": [{ "pop1980": 2231, "country": 'United States', "landAreaKm": 9147, "density": 37.3673, "increase_rate": 34.718957146395404 },
        { "pop1980": 1481, "country": 'Indonesia', "landAreaKm": 1877, "density": 149.0254, "increase_rate": 47.04141200069626 },
        { "pop1980": 8062, "country": 'Pakistan', "landAreaKm": 7708, "density": 318.0908, "increase_rate": 67.1203793371811 }],
        "y_axis_scale": [
            "y_axis", "y_axis1", "y_axis2"
        ]
    },
    "second": {
        "type": "pie",
        "parent_ref": "#root>#content>#group3>#gender_dis",
        "svg_class": "svg_2",
        "head": "gender",
        "data": [{
            "gender": "male",
            "count": 100000,
            "color": "red"
        }, {
            "gender": "female",
            "count": 90090,
            "color": "green",
        }, { "gender": "both_sexes", "count": 50000, "color": "orange" }, { "gender": "mon", "count": 10000 }]
    }, "third": {
        "type": "pie",
        "parent_ref": "#root>#content>#group3>#age_group",
        "head": "categories",
        "data": [{ "categories": "children", "count": 1000, "color": "red" }
            , { "categories": "teenagers", "count": 2000, "color": "green" },
        { "categories": "youth", "count": 2500, "color": "orange" },
        { "categories": "middle aged", "count": 3000, "color": "violet" },
        { "categories": "senior citizen ", "count": 800, "color": "blue" },
        { "categories": "super seniors", "count": 700, "color": "yellow" }

        ]
    },
    "four": {
        "type": "pie",
        "parent_ref": "#root>#content>#group3>#quality",
        "head": "categories",
        "data": [{ "categories": "below poverty line", "count": 1000, "color": "red" }
            , { "categories": "poor", "count": 2000, "color": "green" },
        { "categories": "middle class", "count": 2500, "color": "orange" },
        { "categories": "rich", "count": 3000, "color": "violet" },
        { "categories": "super rich ", "count": 800, "color": "blue" }
        ]
    },
    "fifth": {
        "type": "vertical",
        "parent_ref": "#root>#content>#group1>#populationChart_highest_populated",
        "y_axis": "Country",
        "data": [{ 'Country': 'India', 'high': 1, 'low': .3 },
        { 'Country': 'Japan', 'high': .7, 'low': .1 },
        { 'Country': 'China', 'high': 1.4, 'low': .2 }
        ],
        "head": "Country",
        "y_axis_subgroup": ["low", "high"],
        "color": ["orange", "red"],
        "multi_axis": false,
        "x_axis_class": [
            "x_axis",
            "x_axis1",
            "x_axis2"
        ]
    }

}

function create_vertical_bar(json_data) {
    var svg = d3.select(json_data.parent_ref)
        .append('svg')
        .attr('width', '70%')
        .attr('height', '80%')
        .attr('viewBox', '0 0 1200 600')
        .attr('preserveAspectRatio', 'none')
        .attr('class', json_data.svg_class);

    var x_axis = d3.scaleBand()
        .domain(json_data.x_axis_domain)
        .range([0, 1000]);
    svg.append('g').call(d3.axisBottom(x_axis));
    console.log(json_data.y_axis_key);
    var x_sub_group = d3.scaleBand()
        .domain(json_data.y_axis_key)
        .range([0, x_axis.bandwidth()])
        .padding(0.1);
    var y_axis_array = json_data.y_axis_key;
    for (var i = 0; i < y_axis_array.length; i++) {
        var data_domain = json_data.data.map(d => d[y_axis_array[i]]);
        var y_axis = d3.scaleLinear()
            .domain([0, d3.max(data_domain)])
            .range([0, 550]);
        svg.append('g')
            .call(d3.axisLeft(y_axis))
            .attr('class', json_data.y_axis_scale[i]);

        for (var j = 0; j < json_data.x_axis_domain.length; j++) {
            console.log(json_data.x_axis_domain[j]);
            console.log(y_axis_array[i]);
            var rect = svg.append('rect')
            rect.attr('x', x_axis(json_data.x_axis_domain[j]) + x_sub_group(y_axis_array[i]))
                .attr('y', 0)
                .attr('width', x_sub_group.bandwidth())
                .attr('height', y_axis(data_domain[j])).attr('fill', json_data.color[i])
            svg.append('text')
                .attr('x', x_axis(json_data.x_axis_domain[j]) + x_sub_group(y_axis_array[i]) + x_sub_group.bandwidth() / 2)
                .attr('y', y_axis(data_domain[j]) + 20)
                .attr('text-anchor', 'middle')
                .text(data_domain[j]);
            ((x, y, z, color) => {
                rect.on('mouseover', () => {
                    var string = x + '<br>' + y + ' : ' + z;
                    var position = 'translate(' + d3.event.clientX + 'px,' + d3.event.clientY + 'px)';
                    show_tooltip(position, color, string);
                })
            })(json_data.x_axis_domain[j], y_axis_array[i], data_domain[j], json_data.color[i]);
            rect.on('mouseleave', () => {
                var tool = document.querySelector(".tooltip");
                tool.classList.remove('show');
            })
        }
    }
}

function pie_chart(json) {
    var svg = d3.select(json.parent_ref)
        .append('svg')
        .attr('class', data.svg_class)
        .attr('width', '95%')
        .attr('height', '90%').attr('viewBox', '0 0 1 700');
    var pie = d3.pie().value((d) => d.count)(json.data);
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(300).padAngle(.01);
    console.log(arc(1000));
    let g = svg.append("g").attr('class', 'pie_center').on('mouseout', function () {
        // var tool = document.querySelector(".tooltip");
        // tool.classList.remove('show');
    }); 
    var arcs = g.selectAll("arc")
        .data(pie)
        .enter()
    arcs.append('g').append("path").attr("fill", (d) => d.data.color)
        .attr("d", arc)
        .on('mousemove', function (d) {
            var position = 'translate(' + d3.event.clientX + 'px,' + d3.event.clientY + 'px)';
            var string = d.data[json.head] + '<br>' + d.value;
            show_tooltip(position, d.data['color'], string);
            // d3.select(this).attr('transform', 'translate(0,10)');
        })
}
function horizontal_bar(json_data) {
    var svg = d3.select(json_data.parent_ref).append('svg').attr('width', '80%').attr('height', '80%').attr('viewBox', '0  0 1200 450').attr('preserveAspectRatio', 'none')
    var y_domain = json_data.data.map(d => d.Country);
    var y_scale = d3.scaleBand().domain(y_domain).range([0, 450])
    svg.append('g').call(d3.axisLeft(y_scale)).attr('class', 'y_axis')
    var y_subscale = d3.scaleBand().domain(json_data.y_axis_subgroup).range([0, y_scale.bandwidth()]).padding(.05);
    var x_axis_array = json_data.y_axis_subgroup;
    var group = svg.append('g').attr('class', 'y_axis');
    for (var i = 0; i < x_axis_array.length; i++) {
        var x_name = x_axis_array[i];
        var x_domain = json_data.data.map(d => {
            return d[x_name];
        });
        var range = [0, d3.max(x_domain) + 1];
        var x_scale = d3.scaleLinear().domain(range).range([0, 1000]);
        svg.append('g').call(d3.axisBottom(x_scale)).attr('class', json_data.x_axis_class[i]);
        for (var j = 0; j < json_data.data.length; j++) {
            var dat = json_data.data[j][x_axis_array[i]];
            var rect = group.append('rect')
            rect.attr('x', 0).attr('y', y_scale(json_data.data[j][json_data.head]) + y_subscale(x_axis_array[i])).attr('width', x_scale(dat)).attr('height', y_subscale.bandwidth()).attr('fill', json_data.color[i]);
            var content = json_data.head + ' : ' + json_data.data[j][json_data.head] + '<br>' + x_axis_array[i] + ':' + dat;
            ((x, y) => {
                rect.on('mouseover', () => {
                    var position = 'translate(' + d3.event.clientX + 'px,' + d3.event.clientY + 'px)';
                    show_tooltip(position, y, x);
                })
            })(content, json_data.color[i]);
        
                rect.on('mouseout', () => {
                    var tool = document.querySelector(".tooltip");
                    tool.classList.remove('show');
                    console.log('opop');
                })
            
        }
    }

}
function area_chart(){
    var arr=[];
    for(var i=1950;i<2023;i++){
        arr.push(i);
    }
    var x_scale=d3.scaleLinear().domain([1950,2022]).range([0,1000]);
    var svg = d3.select('body').append('svg').attr('width', '80%').attr('height', '80%').attr('viewBox', '0  0 1200 450').attr('preserveAspectRatio', 'none')
    svg.call(d3.axisBottom(x_scale));

}
area_chart();
horizontal_bar(JSON.fifth)
create_vertical_bar(JSON.first);
pie_chart(JSON.third);
pie_chart(JSON.second);
pie_chart(JSON.four)
