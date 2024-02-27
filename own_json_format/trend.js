var Trend_data
=[{"year": 1951, "population": 2543130380},
{"year": 1952, "population": 2590270899},
{"year": 1953, "population": 2640278797},
{"year": 1954, "population": 2691979339},
{"year": 1955, "population": 2746072141},
{"year": 1956, "population": 2801002631},
{"year": 1957, "population": 2857866857},
{"year": 1958, "population": 2916108097},
{"year": 1959, "population": 2970292188},
{"year": 1960, "population": 3019233434},
{"year": 1961, "population": 3068370609},
{"year": 1962, "population": 3126686743},
{"year": 1963, "population": 3195779247},
{"year": 1964, "population": 3267212338},
{"year": 1965, "population": 3337111983},
{"year": 1966, "population": 3406417036},
{"year": 1967, "population": 3475448166},
{"year": 1968, "population": 3546810808},
{"year": 1969, "population": 3620655275},
{"year": 1970, "population": 3695390336},
{"year": 1971, "population": 3770163092},
{"year": 1972, "population": 3844800885},
{"year": 1973, "population": 3920251504},
{"year": 1974, "population": 3995517077},
{"year": 1975, "population": 4069437231},
{"year": 1976, "population": 4142505882},
{"year": 1977, "population": 4215772490},
{"year": 1978, "population": 4289657708},
{"year": 1979, "population": 4365582871},
{"year": 1980, "population": 4444007706},
{"year": 1981, "population": 4524627658},
{"year": 1982, "population": 4607984871},
{"year": 1983, "population": 4691884238},
{"year": 1984, "population": 4775836074},
{"year": 1985, "population": 4861730613},
{"year": 1986, "population": 4950063339},
{"year": 1987, "population": 5040984495},
{"year": 1988, "population": 5132293974},
{"year": 1989, "population": 5223704308},
{"year": 1990, "population": 5316175862},
{"year": 1991, "population": 5406245867},
{"year": 1992, "population": 5492686093},
{"year": 1993, "population": 5577433523},
{"year": 1994, "population": 5660727993},
{"year": 1995, "population": 5743219454},
{"year": 1996, "population": 5825145298},
{"year": 1997, "population": 5906481261},
{"year": 1998, "population": 5987312480},
{"year": 1999, "population": 6067758458},
{"year": 2000, "population": 6148898975},
{"year": 2001, "population": 6230746982},
{"year": 2002, "population": 6312407360},
{"year": 2003, "population": 6393898365},
{"year": 2004, "population": 6475751478},
{"year": 2005, "population": 6558176119},
{"year": 2006, "population": 6641416218},
{"year": 2007, "population": 6725948544},
{"year": 2008, "population": 6811597272},
{"year": 2009, "population": 6898305908},
{"year": 2010, "population": 6985603105},
{"year": 2011, "population": 7073125425},
{"year": 2012, "population": 7161697921},
{"year": 2013, "population": 7250593370},
{"year": 2014, "population": 7339013419},
{"year": 2015, "population": 7426597537},
{"year": 2016, "population": 7513474238},
{"year": 2017, "population": 7599822404},
{"year": 2018, "population": 7683789828},
{"year": 2019, "population": 7764951032},
{"year": 2020, "population": 7840952880},
{"year": 2021, "population": 7909295151}
];
var er=Trend_data.map((d)=> { return [d.year,d.population]}).reverse();
var area_chart2={};
area_chart2["color"]={"Trend":"#dc7062"};
area_chart2["index"]={"year":0,"population":1};
area_chart2["x_domain"]=[1951 , 2021];
area_chart2["y_domain"]=[2543130380,7909295151];
area_chart2["data"]=[
        {"Trend":er}
];
area_chart2["start"]=2021;
area_chart2["legend_class"]='legend_area';
 var chart =new Area_chart('#root>#content>#group1>#populationChart',area_chart2)


    
