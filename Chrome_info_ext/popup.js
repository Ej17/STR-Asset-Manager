var serial_num = '';
var asset_id = '';
var email = '';
var items = {};
var string = "";

function addToTable(rows) {
    var table = document.getElementById("data");
    for ( var index in rows ) {
		var row = table.insertRow(-1);
		row.style = "white-space:nowrap";
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		cell1.innerHTML = '<b>'+index+'</b>';
		cell2.innerHTML = rows[index];
   }
}

function callPHP(items) {
	console.log(items);
	console.log(items[0]);
	var xhr = new XMLHttpRequest();
	var data = items;
	var postUrl = 'https://str-webdev-svr/Example/test3.php';
	xhr.open('POST', postUrl, true);
	xhr.send(JSON.stringify({
		items:data
	}));
	
	xhr.onreadystatechange = function() { 
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			console.log("Got response 200!");
		}
	};				
}

function getUserInfo(){
	chrome.storage.managed.get(['primary_domain', 'fields', 'remote_url'], function(values) {
		var primary_domain = values.primary_domain;
		var fields = values.fields;
		if (typeof values.fields == 'undefined') {
			fields = 'annotatedAssetId,annotatedLocation,serialNumber';
		}
		fields = fields.split(',');
		var remote_data = [];
		fields.forEach(function(item) {
			switch (item) {
				case 'serialNumber':
					chrome.enterprise.deviceAttributes.getDeviceSerialNumber(function(sn) {
						serial_num = sn;	
						addToTable({'Serial Number': sn});
						items.Serial_Number = sn;
				});
				break;
				case 'annotatedAssetId':
					chrome.enterprise.deviceAttributes.getDeviceAssetId(function(aid) {
						asset_id = aid;	
						addToTable({'Asset ID': aid});
						items.Asset_ID = aid;
				});
				break;
				default:
					remote_data.push(item);
				}
		}); 
	});
	
	chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
		email = info.email;
		addToTable({'User': email});
		items.User = email;
	});
	
}


document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
		getUserInfo();
		setTimeout(function(){
			callPHP(items);			
		}, 10000);	
	}		
};	