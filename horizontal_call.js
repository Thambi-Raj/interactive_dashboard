var dat = {
  "metadata": {
      "axes": {
          "x": [[1, 2]]
          ,
          "y": [0]
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
          "datatype": "numeric"
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
            "yaxiscolumnorder": [0, 0],
              "data": [
                  ["India", 2.34],
                  ["China", 2.70],
                  ["United_states", 1.92]
              ]
          }, {
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
          "xaxis": [
              {
                  "label": {
                      "text": "High , Low",
                      "class":"x_axis"
                  }, "show": true
              },
              {
                  "label": {
                      "text": "High , Low"
                  }, "show": true
              }
          ],
          "yaxis": {
              "label": {
                  "text": "Country"
              }, "show": true
          }
      }
  }
}

var bar = new Horizontal_bar('#root>#content>.section>#populationChart_highest_populated>#chart_container', dat);
