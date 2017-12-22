	var windowProxy;
	var integration_id="";
	var user_id="";
	var spark_refresh_token="";
	var mule_token="";
	var action="";
	var listResultData="";
	var integration_app_icon_url="";
	var spark_icon_url="https://183.82.99.100:8443/CiscoWebcontent/images/spark-icon.png";
	var instanceData="";
	var formAction="add";
    var instanceId="";
	var room_modified=false;
	var selected_room_id="0";
	var room_id_old="";
	var oauthRequired=true;
	var appTokenExists=false;
	var saveSparkTokenResponse="";
	var saveIntegrationTokenResponse="";
	var postMessageToSpark = "added to this Room";
	var updateMessageToSpark = "added to this Room";
	var removeMessageToSpark = "has been removed from this Room";
	var roomsArray = [];
	var rooms="";
	var ui_settings="";
	function onMessage(messageEvent) {
		if (messageEvent.data["resize"]) {
			document.body.bgColor = messageEvent.data["resize"];
		}
	}			
    function gup(url, name) {
        name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
        var regexS = "[\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );		
        if( results == null )
            return "";
        else
            return results[1];
    }
    function resize(){       
		var height = document.body.scrollHeight+40;
		var width =  document.body.scrollWidth+20;
		var isChrome = !!window.chrome && !!window.chrome.webstore;
		var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		if(isChrome || isSafari){          
            height = document.documentElement.scrollHeight+60;
        }else{
			height = document.body.scrollHeight+60;
		}
		console.log("iframe resize height..."+height);
		if(height<300)height=300;
    	windowProxy.post({'resize':true,'height':height,'width':width});
    }
	function connectIntegration(){       
		console.log("connectIntegration iframe");
    	windowProxy.post({'connectIntegration':true,'statusCode':200});
    }
	function disconnectIntegration(){       
		console.log("disconnectIntegration iframe");
    	windowProxy.post({'disconnectIntegration':true,'statusCode':200});
    }
	function getDateTime (expireTime) {
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
		
	var application_auth_details_url="";
	var	token_url="";
	var save_app_token_url="";
	var save_spark_token_url="";
	var get_integration_token_url="";
	var	configuration_settings_url="";
	var save_configuration_settings_url="";
	var update_configuration_settings_url="";
	var delete_instance_url="";
	var list_integration_instances_url="";
	var removeall_integration_instances_url="";	
	var delete_spark_token_url="";
	var delete_integration_token_url="";
	
    $( document ).ready(function() {
		$('#integration-form').hide();
		$(document).foundation();
		windowProxy = new Porthole.WindowProxy("https://183.82.99.100:8443/CiscoWebcontent/proxy.html"); 
		windowProxy.addEventListener(onMessage);		
        var url = window.location.href;
        var integrationId = gup(url,"integrationId");
		user_id = gup(url,"userId");
		spark_refresh_token = gup(url,"refresh_token");
		mule_token = gup(url,"access_token");
		action = gup(url,"action");     
		integration_id =integrationId;
		setTimeout(resize, 200);				
		$.fn.serializeObject = function() {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
				if (o[this.name] !== undefined) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		};		
		$(document).on("click", "#instance-list-block .remove-config" , function() {
			instanceId=this.id;
			$.each(listResultData,function(index,value){
				if(value["instanceId"]==instanceId) {
					instanceData=value;
				}
			});
			var config=JSON.parse(instanceData.configJson);
			selectedRoomName=config.room_name;
			$("#displayName-label").html(config.displayName);
			$("#addedon-label").html("Added on: "+getDateForTimestamp(instanceData.createdDate));
			$("#remove-msg").html("Are you sure you  want to remove this configuration from "+selectedRoomName+" Room?");
			$("#remove-msg-mobile").html("Are you sure you  want to remove this configuration from "+selectedRoomName+" Room?");
			if(config.authenticated_to) {
				$("#remove-auth").html("Authenticated to: "+config.authenticated_to);				
				$("#remove-auth-mobile").html("Authenticated to: "+config.authenticated_to);	
			}
			formAction="remove";
			$('#remove-integration-btn').text("Remove");
			$('#remove-integration-btn-mobile').text("Remove");			
		});
		$('#cancel-remove-integration').click(function(e){
			e.preventDefault();
			$('#remove-integration-popup').foundation('close');
		});
		$('.remove-integration-btn').click(function(e){
			e.preventDefault();
			$('#remove-integration-popup').foundation('close');
			if(formAction=="removeAll") {
				removeAllIntegrationInstances("remove");
			} else { 
				removeIntegrationInstance(instanceId);
			}
		});
		$(document).on("click", "#remove-all-config" , function() {
			$("#displayName-label").html("");
			$("#addedon-label").html("");
			$("#remove-msg").html("Are you sure you want to remove all the configurations for this integration?");
			formAction="removeAll";
			$('#remove-integration-btn').text("Remove All");		
			$('#remove-integration-btn-mobile').text("Remove All");				
			resize();
		});
		
			$('#copy').on('click',function(){
			copyToClipboard($('#webhookURL').val());
			console.log("copyURL");
			$('#copy').text("Copied!");
			setTimeout(function()
			{
			$('#copy').text("Copy URL");
			},1500) 
		});
		var copyToClipboard = function(textToCopy){
			$("body")
			.append($('<input type="text" name="webhookurl" class="textToCopyInput"/>' )
			.val(textToCopy))
			.find(".textToCopyInput")
			.select();
			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'successful' : 'unsuccessful'; 
			} catch (err) {
				window.prompt("To copy the WebhookURL : Ctrl+C, Enter", textToCopy);
			}
			$(".textToCopyInput").remove();
		}
		
	});	
	function objLength(obj){
		var i=0;
		for (var x in obj){
			if(obj.hasOwnProperty(x)){
				i++;
			}
		} 
		return i;
	}
	function nth(d) {
		if(d>3 && d<21) return 'th'; 
		switch (d % 10) {
			case 1:  return "st";
			case 2:  return "nd";
			case 3:  return "rd";
			default: return "th";
		}
	}
	function getDateForTimestamp(timestamp) {
		var datevalues="";
		if(timestamp!=0 || timestamp!=""|| timestamp!=null){
			var date = new Date(timestamp);
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			datevalues=date.getDate()+nth(date.getDate())+" "+(months[date.getMonth()])+" "+ date.getFullYear();
		}
		return datevalues;
	}
	function saveSparkToken(){
		var jsonObject={};
		jsonObject["accessToken"] = spark_token;
		jsonObject["expires"]="";//getDateTime(7776000);
		jsonObject["integrationId"] = integration_id;
		jsonObject["refreshToken"] = spark_refresh_token;
		jsonObject["refreshExpires"]="";//getDateTime(7776000);
		var jsonString=JSON.stringify(jsonObject);
		$.ajax({url: save_spark_token_url,
			async:true,
			type: "POST",
			data: jsonString,
			contentType: "application/json",
			dataType: "json",
			success: function(result){		
				saveSparkTokenResponse="success";
			},
			error: function (error) {
				saveSparkTokenResponse="failure";
			}
		});	
	}		
	function listInstancesData(result) {
		console.log("List instance data....");
		var listDataHTML="";
		var matchflag=false;
		var unmatchflag=false;
		listResultData=result;
		//getRoomsInfo();	
		$.each(rooms, function(id,obj){
			roomsArray.push(obj.id);
		});
		$.each(listResultData, function(i, instance) {
			var roomname="";
			matchflag=false;
			unmatchflag=false;
			var configData=JSON.parse(instance.configJson);
			$.each(rooms, function(id,obj){
				if(($.inArray(instance.channelId, roomsArray)>-1)&&instance.channelId==obj.id&&matchflag==false){	
					roomname = obj.title;
					matchflag=true;
				}
				if(($.inArray(instance.channelId, roomsArray)<=-1)&&instance.channelId!=obj.id&&unmatchflag==false){								
					roomname = configData.room_name;
					unmatchflag = true;
				}
			});				
			listDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
			listDataHTML+='<div class="large-8 medium-8 columns integration-details">';
			listDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
			listDataHTML+='<label>'+configData.displayName+'</label>';
			listDataHTML+='<label class="room">'+roomname+' Room</label>';
			listDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
			listDataHTML+='</div>';
			listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
			listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
			listDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
			listDataHTML+='</div>';
			listDataHTML+='</div>';			
		});
		$("#instance-list-block").html(listDataHTML);
		/*if(listResultData.length<=1){ $("#remove-all-config").hide();}
		else { $("#remove-all-config").show();}*///remove all button functionality disabled temporary
	}
	function getRoomsInfo(){
		console.log("Get Room Details...")
		$.ajax({
			url: configuration_settings_url+"?userId="+user_id,
			async: false,
			success: function(result){
				console.log("getRoomsInfo() success call");
				ui_settings=result;
				rooms =  result["sparkRoomSettings"]["items"];
			
			},
			 error: function (error) {
				alert('Some problem occured, Please try after some time');	
			}
		});
	}
	function postAddMessageToRoom(roomId,appName){
		$.each(listResultData,function(index,value){
			if(value["channelId"]==roomId) {
				postMessageToSpark = "";
				return false;
			}else{
				postMessageToSpark = appName+" added to this Room";
			}				
		});
	}

	function listIntegrations() {
		$("#integrations-block").hide();
		$("#integration-form").hide();
		getRoomsInfo();
		$.ajax({url: list_integration_instances_url+"?userId="+user_id+"&integrationId="+integration_id,
			async:true,
			success: function(result){
				console.log("listIntegrations() success call");
				if($.isArray(result)){
					listInstancesData(result);
				} else {
					listInstancesData([]);
				}
				$("#integrations-block").show(); 
				resize();	
			},
			error: function (error) {
				$("#integrations-block").show();
				resize();
				alert('Some problem occured, Please try after some time');
			}
		});
	}	
	function validateIntegrationAppTokenDB() {
		$.ajax({url: get_app_token_url+"?userId="+user_id,
			async:false,
			type: "get",
			success: function(result){
				if(result.tokenResult.tokenId) {
					appTokenExists=true;
				} else {
					appTokenExists=false;
				}
			},
			error: function (error) {
				alert('Some problem occured, Please try after some time');
			}
		});
	}
	$(document).on("click", "#done-button" , function() {
		$('#success-integration').foundation('close');
		$("#integration-form").hide();
		listIntegrations();
	});
	function removeIntegrationInstance(instanceId) {
		$.ajax({url: delete_instance_url+instanceId+"?messageToSpark="+removeMessageToSpark,
			type:"DELETE",
			async:true,
			success: function(result){		
				listIntegrations();
			},
            error: function (error) {
				alert('Some problem occured, Please try after some time');
            }
		});
	}
	function removeAllIntegrationInstances(formAction) {
		$.ajax({url: removeall_integration_instances_url+"?integrationId="+integration_id+"&userId="+user_id+"&messageToSpark="+removeMessageToSpark,
			type:"DELETE",
			async:true,
			success: function(result){		
				$("#instance-list-block").hide();
				$("#remove-all-config").hide();
				if(formAction=="disconnect"){
					disconnectIntegrationApp();
				}
				resize();
			},
            error: function (error) {
				alert('Some problem occured, Please try after some time');
            }
		});		
	}
	function disconnectIntegrationApp() {
		var deleteSparkTokenResponse="";
		var deleteIntegrationTokenResponse="";
		$.ajax({url: delete_spark_token_url+"?userId="+user_id+"&integrationId="+integration_id,
			async:true,
			type:"DELETE",
			success: function(result){
				deleteSparkTokenResponse="success";
			},
            error: function (error) {
				deleteSparkTokenResponse="failure";
            }
		});			
		if(oauthRequired) {
			$.ajax({url: delete_integration_token_url+"?userId="+user_id+"&integrationId="+integration_id,
				async:true,
				type:"DELETE",
				success: function(result){
					deleteIntegrationTokenResponse="success";
				},
				error: function (error) {
					deleteIntegrationTokenResponse="failure";
				}
			});
		} else {
			deleteIntegrationTokenResponse="success";
		}		
		var disconnectTimer = window.setInterval(function() { 
			if(deleteSparkTokenResponse!="" & deleteIntegrationTokenResponse!=""){
				window.clearInterval(disconnectTimer);
				if(deleteSparkTokenResponse=="success" & deleteIntegrationTokenResponse=="success") {
					disconnectIntegration();
					$("#integrations-block").html("Successfully disconnected your integration");
				} else {
					alert('Some problem occured, Please try after some time');
				}			
			}
        }, 100);
	}
	