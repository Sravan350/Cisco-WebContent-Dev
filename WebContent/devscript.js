
var cookies="";
var userName="";
var userId = "";
var integrationId="";
var sparkTokenCode = false;
var pageSource = "";
var action = "CONNECT";
var url = window.location.href;
var code = "";
var sparkAccesstokenPayload = ""
var isOauthApp = false;
var isSparkCode = false;
var tokenSaveStatus = false;

/*  management  calls  */
var spark_token_url = "https://cisco-spark-integration-management-new-dev.cloudhub.io/api/clients/tokens";
var token_base_url = "https://cisco-spark-integration-management-new-dev.cloudhub.io/api/integrations/";



var outhAppIds1 = '{"bitbucket": "Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0M5N2Y4OGZhMjEzYWRiMWNlMzkwNmNjYWZhNDMwN2QxYWJkMWU0NzI1YmJhYTEzN2ZjMTlhYWRjZDE3ZDRhODNj","github": "Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0MzZTFmZmY0OTU5MzNmYWFiOTQ1MGQ1Yjg0NDY5MTU2M2QwNzk2NDNiNmNiOTViNmU0ZDg4ZDk2NWVlMjhkYTYz","pagerduty": "Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0M1YzkzYjk5NTU4MzZjODVlM2UwMjgyOTE5ZWJiM2FlMDZkZDQ4YWQyMTBlYzY0OGYwNDQyODE5ZmUzYzYwN2Uy","codeship": "Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0MyM2UxYjkyYjEzODVkMGI4YTQ4NjM5NTY5MjgxMDYxY2NlM2IzYTg3OGI5NjAwZjIyZWE0ZWNmN2E1MzNkOTEy","box": "Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0MwYTM3MTUyYWZjNjJkNTZhN2RkZTYwOTdlZjI1OTQ2YmU0NDY3NTcxMWZlZmE4MmNmYzQ3NjY5MjU1NzllZWQy","jira": "Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0M4MDhhY2YzNTA1NjFiNjg5NmNkYWJhOWEzMjg5MDYwYWU2Y2E5YWRmODZmNDVlNGZlMzQ3ZTgxNDY4NWQ2ODA3","trello": "Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0M4ODIwNTU1MzlhMzdhOWU5NjFlNzViNDFhODI5ZDExOGMzYzBhNjZlMmJlZTFiZmEwYzBjZGMxOTc3OTI0MzUw","mailchimp": "Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0NlYzFiMzYyM2ExNWQ3ZDgzNjc4Y2NmMWNjZjczMzYxODcxNDA4ZTVjNTEzNmY4YzAzNTJlYjY0MTc3YmQwMTE2"}';
var outhAppIds = '[{"id":"Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0M5N2Y4OGZhMjEzYWRiMWNlMzkwNmNjYWZhNDMwN2QxYWJkMWU0NzI1YmJhYTEzN2ZjMTlhYWRjZDE3ZDRhODNj","name":"bitbucket"},{"id":"Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0MwYTM3MTUyYWZjNjJkNTZhN2RkZTYwOTdlZjI1OTQ2YmU0NDY3NTcxMWZlZmE4MmNmYzQ3NjY5MjU1NzllZWQy","name":"box"},{"id":"Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0MzZTFmZmY0OTU5MzNmYWFiOTQ1MGQ1Yjg0NDY5MTU2M2QwNzk2NDNiNmNiOTViNmU0ZDg4ZDk2NWVlMjhkYTYz","name":"github"}]';


$(document).ready(function(){
	outhAppIds = JSON.parse(outhAppIds);
	$('.integration-page').hide();
	$('#action-btn').css("margin-left","35px");
	console.log("Dev script loaded.......");
	$(document).foundation();
	cookies = document.cookie;
	userName = cookies.substring(0,cookies.indexOf('='));
	userId =  cookies.substring(cookies.indexOf('=')+1,cookies.length);
	console.log("Cookies "+cookies+" userId : "+userId);
	
	$('#action-btn').on('click',function(){
		console.log("Action Button clicked...");
		action = "DISCONNECT";
	});
});
//Opens specific integration page
function openIntegrationPage(intId){
	console.log("Integration id in openIntegrationPage() "+ intId);
	var isUserLoggedIn = getCookie(userName);
	if(isUserLoggedIn ==""){
		//window.location.href = "https://183.82.99.100:8443/CiscoWebcontent/new-dev.html";
		$('#userId-modal').foundation('open');
	}else{
		console.log(" Cookies found on the page "+isUserLoggedIn);
		$('.integrations-home').hide();
		$('.integration-page').show();
		
		var sparkCodeStatus = getCode(url,'state');
		if(intId==sparkCodeStatus){
			sparkTokenCode = true;
		} 
		
		console.log("Action :: "+action+" iNTEGRATIONid :: "+intId+" userId :: "+userId);
		if(intId=="Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0M1YzkzYjk5NTU4MzZjODVlM2UwMjgyOTE5ZWJiM2FlMDZkZDQ4YWQyMTBlYzY0OGYwNDQyODE5ZmUzYzYwN2Uy"){
			//window.location.href = domain+'pagerduty.html';
			$('#integration-icon').attr('src',"https://d24wgzqqegxpap.cloudfront.net/api/images/pagerduty/pagerduty.png");
		}
		if(intId=="Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0M5N2Y4OGZhMjEzYWRiMWNlMzkwNmNjYWZhNDMwN2QxYWJkMWU0NzI1YmJhYTEzN2ZjMTlhYWRjZDE3ZDRhODNj"){
			$('#integration-icon').attr('src',"https://d24wgzqqegxpap.cloudfront.net/api/images/bitbucket/bitbucket.png");
		}
		if(intId=="Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0MwYTM3MTUyYWZjNjJkNTZhN2RkZTYwOTdlZjI1OTQ2YmU0NDY3NTcxMWZlZmE4MmNmYzQ3NjY5MjU1NzllZWQy"){
			$('#integration-icon').attr('src',"https://d24wgzqqegxpap.cloudfront.net/api/images/box/box.png");
		}
		$('#integrations-frame').attr('src','https://cisco-spark-integration-management-new-dev.cloudhub.io/api/integrations/htmlContent?action='+action+'&integrationId='+intId+'&userId='+userId);
		$('#action-btn').text("DISCONNECT");
	}	
}
/* **************** cookies handlers ***** */	
function getCookie(cname){
	console.log("Get the Cookies");
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
function setCookie(userName, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = userName + "=" + cvalue + ";" + expires + ";path=/";
}

/* *************************************** */

/* **** Spark AccessTokens Handlers **** */
function getSparkToken(){
	$.ajax({
			url: spark_token_url+"?userId="+userId+"&integrationId="+integrationId,
			async: false,
			success: function(result){
				console.log("Spark token Response : "+JSON.stringify(result)+" reslut list : "+result.length);
				if(result.length!=undefined){
					validateSparkToken();
				}else{
					console.log("Spark token not found....");
					generateSparkToken();
				}
			},
			 error:  function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					alert("We are facing some difficulty... Try again");
				}
			}
		});
	}
	function validateSparkToken(){
		console.log("In spark token validation method...");
		$.ajax({
				url: token_base_url+integrationId+"/uiSettings"+"?userId="+userId+"&integrationId="+integrationId,
				async: false,
				success: function(result){
					if(result.sparkRoomSettings.items != undefined && result.sparkRoomSettings.items.length !=0){
						console.log("validation success....");
						isSparkCode = false;
						sessionStorage.setItem('isSparkCode',isSparkCode);
						action = "LIST";
						openIntegrationPage(integrationId);
					}else{
						console.log("Spark token found in DB is not valid");
						generateSparkToken();
					}
				},
				 error:  function(xmlHttpRequest,error) {
				   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
					   return;
				   }else{
						alert("We are facing some difficulty... Try again");
					}
				}
			});	
	}
function generateSparkToken(){
	console.log("integartionId : "+integrationId);
	isSparkCode = true;
	sessionStorage.setItem('isSparkCode',isSparkCode);
	if(url.indexOf("code")==-1){
		//window.location.href = "https://api.ciscospark.com/v1/authorize?client_id=C7332ec16a9a29ac2def59e02cf58984cf934cbe97c6b4f3d6c078f395f864767&response_type=code&redirect_uri=https%3A%2F%2F183.82.99.100%3A444%2FCiscoWebcontent%2Fnew-dev.html&scope=spark%3Amessages_write%20spark%3Arooms_read%20spark%3Amessages_read%20spark%3Arooms_write%20spark%3Akms&state="+integrationId;	
		window.location.href = "https://api.ciscospark.com/v1/authorize?client_id=C7332ec16a9a29ac2def59e02cf58984cf934cbe97c6b4f3d6c078f395f864767&response_type=code&redirect_uri=https%3A%2F%2F183.82.99.100%3A8443%2FCiscoWebcontent%2Fspark1.html&scope=spark%3Amessages_write%20spark%3Arooms_read%20spark%3Amessages_read%20spark%3Arooms_write%20spark%3Akms&state="+integrationId;	
	}else{
		code=getCode(url, 'code');
		console.log("code : "+code);
		generateSparkAccessToken(code);
	}
}
function generateSparkAccessToken(code){
	console.log("In generateSparkAccessToken : code = "+code);
	  var settings = {
	  "async": false,
	  "crossDomain": true,
	  "url": "https://api.ciscospark.com/v1/access_token",
	  "method": "POST",
	  "headers": {
		"content-type": "application/x-www-form-urlencoded",
	  },
	  "data": {
		"grant_type": "authorization_code",
		"client_id": "C7332ec16a9a29ac2def59e02cf58984cf934cbe97c6b4f3d6c078f395f864767",
		"client_secret": "1ecf736fb49fb5f4a363a14d9875720fb51d9ec13427bcfd312876dcf991d953",
		"code": code,
		"redirect_uri": "https://183.82.99.100:8443/CiscoWebcontent/spark1.html"
	  }
	}

	$.ajax(settings).done(function (response) {
		sparkAccesstokenPayload=response;
		console.log("response "+JSON.stringify(response));
		if(response.access_token != undefined){
			console.log("******");
			saveSparkToken(sparkAccesstokenPayload);
		} 
	}); 
}
function saveSparkToken(sparkAccesstokenPayload){
	var jsonObject={};
	jsonObject["accessToken"] = sparkAccesstokenPayload.access_token;
	jsonObject["expires"]=getDateTime1(sparkAccesstokenPayload.expires_in);//getDateTime(7776000);
	jsonObject["integrationId"] = getCode(url, 'state');
	jsonObject["refreshToken"] = sparkAccesstokenPayload.refresh_token;
	jsonObject["refreshExpires"]=getDateTime1(sparkAccesstokenPayload.refresh_token_expires_in);//getDateTime(7776000);
	jsonObject["userId"]=userId;
	jsonString=JSON.stringify(jsonObject);
	console.log("jsonString::: "+jsonString);
		//$.ajax({url:"https://cisco-spark-integration-management-new-dev.cloudhub.io/api/clients/tokens",
		$.ajax({url:"https://183.82.99.100:444/api/clients/tokens",
			async:true,
			type: "POST",
			data: jsonString,
			crossDomain: true,
			contentType: "application/json",
			dataType: "json",
			headers: {
				'Access-Control-Allow-Origin':'*',
				'Access-Control-Allow-Headers': 'x-requested-with',
				'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS'
			}, 
			success: function(result){
				console.log("result!!"+JSON.stringify(result));
				var intId = getCode(url, 'state');
				openIntegrationPage(intId);
			},
			error: function (error) {
				alert("Problem in Saving Cisco Spark AccessToken... try again"+JSON.stringify(error));
			}
		});	
}
/* **************** cookies handlers ***** */	
	function getCookie(cname){
		console.log("Checking cookie  with name .... "+cname);
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for(var i = 0; i <ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}
	function setCookie(userName, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = userName + "=" + cvalue + ";" + expires + ";path=/";
	}
	
function getCode(url, name) {
	name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
	var regexS = "[\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( url );		
	if( results == null )
		return "";
	else
		return results[1];
}

/* Supported handlers */
function getDateTime1 (expireTime) {
		var current = new Date();
		var newDate = new Date(current.getTime() + (expireTime*1000));
		year = "" + newDate.getFullYear();
		month = "" + (newDate.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
		day = "" + newDate.getDate(); if (day.length == 1) { day = "0" + day; }
		hour = "" + newDate.getHours(); if (hour.length == 1) { hour = "0" + hour; }
		minute = "" + newDate.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
		second = "" + newDate.getSeconds(); if (second.length == 1) { second = "0" + second; }
		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	}