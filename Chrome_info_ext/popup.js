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

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
		var serial_num = '';
		var asset_id = '';
		var email = '';
		chrome.storage.managed.get(['primary_domain', 'fields', 'remote_url'], function(values) {
			primary_domain = values.primary_domain;
			if (typeof values.primary_domain == 'undefined') {
				chrome.identity.getProfileUserInfo(function(user_info) {
					identity_domain = user_info.email.split("@")[1];
					console.log('Identity Domain: ' + identity_domain);
					if (typeof identity_domain != 'undefined') {
						primary_domain = identity_domain;
					}
				});
			}
		
			fields = values.fields;
			if (typeof values.fields == 'undefined') {
				fields = 'annotatedAssetId,annotatedLocation,serialNumber';
			}
			fields = fields.split(',');
			var remote_data = [];
			fields.forEach(function(item) {
				switch ( item ) {
					case 'serialNumber':
						chrome.enterprise.deviceAttributes.getDeviceSerialNumber(function(sn) {
						serial_num = sn;	
						addToTable({'Serial Number': sn});
					});
					break;
					case 'annotatedAssetId':
						chrome.enterprise.deviceAttributes.getDeviceAssetId(function(aid) {
						asset_id = aid;	
						addToTable({'Asset ID': aid});
					});
					break;
					default:
						remote_data.push(item);
					}
			}); 
				
		});

		if (document.readyState === "interactive") {
			chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
				email = info.email;
				addToTable({'User': email});
			});
		}
		
		callPHP(email, serial_num, asset_id);
	}	

	function callPHP(email, serial_num, asset_id) {

		// Set up an asynchronous AJAX POST request
		var xhr = new XMLHttpRequest();
		var data = encodeURIComponent(email+serial_num+asset_id);
		//var params = 'user=' + user;
		// The URL to POST our data to
		var postUrl = 'http://str-webdev-svr/Example/test3.php';
		
		xhr.open('POST', postUrl, true);
		// Send the request and set status
		xhr.send(data);

		// Handle request state change events
		xhr.onreadystatechange = function() { 
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				console.log("Got response 200!");
			}
		};
	}
};
