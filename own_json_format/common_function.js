const json = {
    "vertical_bar": {
        "x_axis_domain": "",
        "x_subgroup": [],
        "is_need": false,
        "map": [],
        "color": [],
        "data": [],
        "index": {},
        "legend_class":'legend_area'
    },
    "horizontal_bar": {
        "y_axis_domain": "",
        "y_subgroup": [],
        "is_need": true,
        "map": [],
        "color": [],
        "data": [],
        "index": {},
        "legend_class":'legend_area'
    },
    "pie_chart": {
        "color": {},
        "index": {},
        "data": [],
        "legend_class":'legend_area_pie'
    },
    "area_chart":{
       "color":{},
       "data":[],
       "index":{},
       "x_domain":[],
       "y_domain":[],
       "legend_class":'legend_area'
    },
    "y_class": ["y_axis", "y_axis1"],
    "x_class": ["x_axis", "x_axis1"]
}

function show_tooltip(position, color, letter,area) {
    var tool = document.querySelector(".tooltip");
    tool.innerHTML='';
    tool.classList.add('show');
    tool.style.transform = position;
    tool.style.backgroundColor = color;
    area ?tool.appendChild(letter):tool.innerHTML=letter;
    tool.style.color = '#444';
}
function create_legend(data, parent, chart_ref) {
    var color = Object.values(data.color);
    var legend_data = !data.map ? Object.keys(data.color) : Object.keys(data.index).slice(1);
    var pie = !data.map;
    var div = document.createElement('div')
    div.setAttribute('class', data.legend_class);
    if(legend_data.length>1){
    for (var i = 0; i < legend_data.length; i++) {
        var div1 = document.createElement('div');
        var id=legend_data[i].replace(' ','_');
        div1.setAttribute('id', id);
        var div2 = document.createElement('div');
        div2.setAttribute('class', 'legend_icon');
        div2.style.backgroundColor = pie ? color[i] : color[data.index[legend_data[i]] - 1];
        var span = document.createElement('span');
        var text=legend_data[i].replace('_',' ');
        span.innerText = first_letter(legend_data[i].replace('_',' '));
        div1.appendChild(div2);
        div1.appendChild(span);
        div1.setAttribute('class', 'legend_row');
        ((element,x)=>{
             element.addEventListener('mousemove',()=>{
                chart_ref.add_blur(x,data,parent)   
             })
        })(div1,i);
        ((element,x)=>{
            element.addEventListener('mouseout',()=>{
               chart_ref.remove_blur(x,data,parent)   
            })
       })(div1,i);
        div.append(div1);
        var res = {};
        ((id, y) => {
            div1.addEventListener('click', () => {
                if (!res[id] && Object.keys(res).length != y - 1) {
                    document.querySelector(parent + '>.'+ data.legend_class+'>#'+id+'>.legend_icon').classList.add('opact');
                    res[id] = id;
                } else {
                    document.querySelector(parent + '>.'+ data.legend_class+'>#'+id+'>.legend_icon').classList.remove('opact');
                    delete res[id]
                }
                chart_ref.draw_chart(parent, data, res);
            });
        })(id, legend_data.length);
    }
    document.querySelector(parent).append(div);
}
}
function first_letter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function create_elements(type, className, innerText, id, color,backgroundColor, children) {
    var element = document.createElement(type);
    className ? element.setAttribute('class', className) : '';
    id ? element.setAttribute('id', id) : '';
    innerText ? (element.innerHTML = innerText) : '';
    color ? element.style.color = color : '';
    backgroundColor?element.style.backgroundColor=backgroundColor:'';
    children ? children.forEach(child => {
        element.appendChild(child);
    }) : '';
    return element
}