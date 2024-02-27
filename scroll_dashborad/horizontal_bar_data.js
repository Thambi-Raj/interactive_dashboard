var horizontal_ml = {
    "metadata": {
      "axes": {
        "x": [0]
        ,
        "y": [[1,2]]
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
        "columnname": "High",
        "datatype": "numeric",
					"format": {
						"prefix": "%",
					}
      },
      {
        "dataindex": [1],
        "columnname": "Low",
        "datatype": "numeric"
      }
    ],
    "seriesdata": {
      "chartdata": [
        {
          "type": "bar",
          "seriesname": "High",
          "yaxiscolumnorder": [0, 0],
          "data": [
            ["India", 2.34],
            ["China", 2.70],
            ["United_states", 1.92]
        ]
        }, {
          "type": "bar",
          "seriesname": "Low",
          "yaxiscolumnorder": [0, 1],
          "data": [
            ["India", .68],
            ["China", -.03],
            ["United_states", .38]
        ]
        }
      ]
    }
    , "legend": {
      "colors": [
        '#ED8C8E',
        '#4AC5A7',
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
              "text": "High_and_low", "class": "y_axis"
            }, "show": true
          }],
        "rotated": true
      },
    }
  }
var bar = new Bar('#root>#content>.section>#populationChart_highest_populated>#chart_container', horizontal_ml);
