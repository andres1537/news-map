google.setOnLoadCallback(runQuery);
google.load('visualization', '1', 
	{
		'packages':['corechart', 'geochart']
	}
);

function runQuery() {	
	var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1gE9YOW9dGRD52yS35iLdW9qmVrD202HwqOiP4h3533Y/gviz/tq');
	query.setQuery("SELECT D, E, F, G");
	query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}
	
	var options = {
		region: 'CO',
		resolution : 'provinces',
		displayMode: 'markers',
		backgroundColor: '#81d4fa',
		colorAxis:{ colors:['red','green', 'blue'], minValue: 1, maxValue: 3 },
		legend: 'none',
		tooltip: { isHtml: true }
	};

	var dataTable = response.getDataTable();
	dataTable.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});	
	for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
		var dpto = dataTable.getValue(i, 0);
		var victima = dataTable.getValue(i, 2);
		var muertes = dataTable.getValue(i, 3);
		dataTable.setCell(i, 4, createTooltipContent(dpto, getStringVictima(victima), muertes));	
	}
	dataTable.removeColumn(0);
	var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
	chart.draw(dataTable, options);
}

function getStringVictima(value) {
	if (value == '1') {
		return "Guerrilleros del ELN";
	} else if (value == '2') {
		return "Militares";
	} else if (value == '3') {
		return "Civiles";
	}
}

function createTooltipContent(dpto, victima, muertes) {
return '<div>' +
        '<p>' + muertes + ' ' + victima + '</p>' +
	   '</div>';
}