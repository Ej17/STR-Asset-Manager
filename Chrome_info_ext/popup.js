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
						addToTable({'Serial Number': sn});
					});
					break;
					case 'annotatedAssetId':
						chrome.enterprise.deviceAttributes.getDeviceAssetId(function(aid) {
						addToTable({'Asset ID': aid});
					});
					break;
					case 'annotatedLocation':
						chrome.enterprise.deviceAttributes.getDeviceAnnotatedLocation(function(loc) {
						addToTable({'Location': loc});
					});
					break;
					default:
						remote_data.push(item);
					}
			}); 
				
		});
		
		chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
			var email = info.email;
			addToTable({'User': email});
		});
	}
};
