	var windowProxy;
	var integration_id="";
	var spark_token="";
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
		//var height = $(".integration-app").height()+30;
		var height = document.body.scrollHeight+20;
		var width =  document.body.scrollWidth+20;

		var isChrome = !!window.chrome && !!window.chrome.webstore;
		if(isChrome){          
            height = document.documentElement.scrollHeight+20;
        }else{
			height = document.body.scrollHeight+20;
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
	var	configuration_settings_url="";
	var save_configuration_settings_url="";
	var update_configuration_settings_url="";
	var delete_instance_url="";
	var disconnect_integration_url="";
	var list_integration_instances_url="";
	var removeall_integration_instances_url="";	
	
    $( document ).ready(function() {
		$('#integration-form').hide();
		$(document).foundation();
		windowProxy = new Porthole.WindowProxy("https://183.82.99.100:8443/CiscoWebcontent/proxy.html"); 
		windowProxy.addEventListener(onMessage);		
        var url = window.location.href;
        var integrationId = gup(url,"integrationId");
		var token = gup(url,"token");
		action = gup(url,"action");
        console.log("integration Id = "+integrationId);
        console.log("token = "+token);        
		integration_id =integrationId;
		spark_token = token;
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
		listInstancesData();
		$(document).on("click", "#instance-list-block .remove-config" , function() {
			console.log("on click remove");
			instanceId=this.id;
			$.each(listResultData,function(index,value){
				if(value["instanceId"]==instanceId) {
					instanceData=value;
					console.log("instanceData...."+instanceData);
				}
			});
			var config=JSON.parse(instanceData.configJson);
			selectedRoomName=config.room_name;
			$("#displayName-label").html(config.displayName);
			$("#addedon-label").html("Added on: "+getDateForTimestamp(instanceData.createdDate));
			$("#remove-msg").html("Are you sure you  want to remove integration from "+selectedRoomName+" room?");
			$("#remove-msg-mobile").html("Are you sure you  want to remove integration from "+selectedRoomName+" room?");
			if(config.authenticated_to) {
				$("#remove-auth").html("Authentivcated to: "+config.authenticated_to);				
				$("#remove-auth-mobile").html("Authentivcated to: "+config.authenticated_to);	
			}
			formAction="remove";
			$('#remove-integration-btn').text("Remove");			
		});
		$('#cancel-remove-integration').click(function(e){
			e.preventDefault();
			$('#remove-integration-popup').foundation('close');
		});
		$('#remove-integration-btn').click(function(e){
			console.log("remove integration...");
			e.preventDefault();
			$('#remove-integration-popup').foundation('close');
			if(formAction=="removeAll") {
				removeAllIntegrationInstances("remove");
			} else { 
				removeIntegrationInstance(instanceId);
			}
		});
		$(document).on("click", "#remove-all-config" , function() {
			console.log("test remove all");
			$("#displayName-label").html("");
			$("#addedon-label").html("");
			$("#remove-msg").html("Are you sure you  want to remove all the integration instances?");
			formAction="removeAll";
			$('#remove-integration-btn').text("Remove All");			
			resize();
		});
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
		console.log("saveSparkToken...");
		var jsonObject={};
		jsonObject["accessToken"] = spark_token;
		jsonObject["expires"]=getDateTime(7776000);
		jsonObject["integration_id"] = integration_id;
		jsonObject["refreshToken"] = "spark_refresh_token";
		jsonObject["refreshExpires"]=getDateTime(7776000);
		var jsonString=JSON.stringify(jsonObject);
		$.ajax({url: save_spark_token_url,
			async:false,
			type: "POST",
			data: jsonString,
			contentType: "application/json",
			dataType: "json",
			success: function(result){		
				console.log("Spark token saved success");
			},
			error: function (error) {
				alert("error is: " + error);
			}
		});	
	}
		
	/*function listInstancesData() {
		var listDataHTML="";
		listResultData=result;
		$.each(listResultData, function(i, instance) {
			var configData=JSON.parse(instance.configJson);
			listDataHTML+='<div class="large-12 medium-12 columns instance-background"><br>';
			listDataHTML+='<div class="large-8 medium-8 columns integration-details">';
			listDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
			listDataHTML+='<label>'+configData.displayName+'</label>';
			listDataHTML+='<label>'+configData.room_name+'</label>';
			listDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
			listDataHTML+='</div>';
			listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
			listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
			listDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
			listDataHTML+='</div>';
			listDataHTML+='</div><hr class="instance-hr">';			
		});
		$("#instance-list-block").html(listDataHTML);
		if(listResultData.length<=1){ $("#remove-all-config").hide();}
		else { $("#remove-all-config").show();}
	}
	*/
	function listIntegrations() {
		console.log("listIntegrations...");
		$("#integration-form").hide();
		//$('#loading-block').foundation('open');		
		$.ajax({url: list_integration_instances_url+"?sparkToken="+spark_token+"&integrationId="+integration_id,
			async:true,
			success: function(result){
				if($.isArray(result)){
					listInstancesData(result);
				} else {
					listInstancesData([]);
				}
				$("#integrations-block").show(); 
				resize();	
				//$('#loading-block').foundation('close');
			},
			error: function (error) {
				//$('#loading-block').foundation('close');
				$("#integrations-block").show();
				resize();
				console.log('error while retrieving the list of integration instances..' + error);
				alert('Some problem occured, Pleaase try after some time');
			}
		});
	}
	
	$(document).on("click", "#done-button" , function() {
		$('#success-integration').foundation('close');
		$("#integration-form").hide();
		listIntegrations();
	});
	function removeIntegrationInstance(instanceId) {
		console.log("removeIntegrationInstance instanceId..."+instanceId);
		$.ajax({url: delete_instance_url+instanceId,
			type:"DELETE",
			async:true,
			success: function(result){		
				console.log("removeIntegrationInstance");
				listIntegrations();
			},
            error: function (error) {
                console.log('error while removing integration instance details..' + error);
				
				alert('Some problem occured, Pleaase try after some time');
            }
		});
	}
	function removeAllIntegrationInstances(formAction) {
		console.log("removeAllIntegrationInstances formAction..."+formAction);
		/*if(formAction=="disconnect"){
			$('.loading-second-block').html('Disconnecting the integration');
		} else {
			$('.loading-second-block').html('Removing all integration instances');
		}
		$('#loading-block').foundation('open');*/
		$.ajax({url: removeall_integration_instances_url+"?integrationId="+integration_id+"&token="+spark_token,
			type:"DELETE",
			async:true,
			success: function(result){		
				console.log("removeAllIntegrationInstances result..."+result);
				$("#instance-list-block").hide();
				$("#remove-all-config").hide();
				if(formAction=="disconnect"){
					if(oauthRequired) {
						disconnectOauthIntegrationApp();
					} else {
						disconnectIntegrationApp();
					}
				} else {
					//$('#loading-block').foundation('close');
				}
				resize();
			},
            error: function (error) {
				//$('#loading-block').foundation('close');
				//listIntegrations();
                console.log('error while removing all integration instances..' + error);
				alert('Some problem occured, Pleaase try after some time');
            }
		});		
		//$('.loading-second-block').html('');
	}
	function disconnectOauthIntegrationApp() {
		console.log("disconnectOauthIntegrationApp...");
		$.ajax({url: disconnect_integration_url+"?token="+spark_token+"&integration_id="+integration_id,
			async:true,
			type:"DELETE",
			success: function(result){
				console.log("success oauth disconnectIntegration result..."+result);
				disconnectIntegration();
				$("#integrations-block").html("Successfully disconnected your integration");
				//$('#loading-block').foundation('close');
			},
            error: function (error) {
				//$('#loading-block').foundation('close');
				//listIntegrations();
                console.log('error while disconnecting the integration..' + error);
				alert('Some problem occured, Pleaase try after some time');
            }
		});
	}
	function disconnectIntegrationApp() {
		console.log("disconnectIntegrationApp...");
		disconnectIntegration();
		$("#integrations-block").html("Successfully disconnected your integration");
		//$('#loading-block').foundation('close');
		console.log("success disconnectIntegration");
	}
	
	
	
	
	
	
	
var formData ={"Rooms":[{"id":"room1","name":"Room1"},{"id":"room2","name":"Room2"},{"id":"room3","name":"Room3"}],
			"Boards":[{"id":"board1","name":"Board1"},{"id":"board2","name":"Board2"},{"id":"board3","name":"Board3"}]};
    var selectedRoomName="";
	var formAction="";
	var description="";
	iconName="trello.png";
	var integration_token="";
	var selected_room_id="0";
	var selected_board_id="0";
	var board_modified=false;
	var board_name_old="";
    auth_url="applications";
	save_token_url = "savetokendetails";
	//form_data_url="uisettings/trello";
	form_data_url="test.html";
	//post_form_data_url="saveintegration/trello";
	post_form_data_url="test.html";
	//list_instances_url="listinstances/trello";
	list_instances_url="test.html";
	//update_form_data_url="updateintegration/trello";
	update_form_data_url="test.html";
	//delete_instance_url="deleteInstance";
	delete_instance_url="test.html";
	removeall_integration_instances_url="trello/removeallinstances";
	disconnect_integration_url="disconnectintegration";
	
	$( document ).ready(function() {
    $('#integration-form').hide();
    $(document).foundation();	
		/*if(action=="connect") {			
			$("#integrations-block").hide();
			$("#integration-form").hide();
			setTrelloAppAuthDetails(integration_id);
		} else if(action=="disconnect") {
			formAction="disconnect";
			removeAllIntegrationInstances(formAction);
		} else {//action list
			console.log("list");
			listIntegrations();
		}*/
		$("#trello #boards").on('change',function(){
			board_modified=true;
			console.log("board_modified....");
		});	
		$("#trello #rooms").on('change',function(){
			room_modified=true;
			console.log("room_modified....");
		});	

		$("#trello #submit-button").click(function (e){
			e.preventDefault();
			saveTrelloInstance();
			
		});
		$("#trello #cancel-button").click(function (e){
				e.preventDefault();			
				$('#integration-form').hide();
				$('#integrations-block').show();
				//resize();
		});
		$('#trello #add-config').click(function(e){
				e.preventDefault();	
				//formAction="add";
				$("#submit-button").text("Add Integration");
				loadTrelloForm();	
		});
	
		$(document).on("click", "#trello #instance-list-block .edit-config" , function() {
			console.log("edit instance");
			formAction="update";
			board_modified=false;
			room_modified=false;
			$("#submit-button").text("Save");
			/*instanceId=this.id;
			$.each(listResultData,function(index,value){
				if(value["instanceId"]==instanceId) {
					instanceData=value;
				}
			});
			console.log("instanceData......."+JSON.stringify(instanceData));
			console.log("instanceData.channelId..." + instanceData.channelId);
			//integration_token = instanceData.Integration_token[0].access_token;
			selected_room_id=instanceData.channelId;
			var config=JSON.parse(instanceData.configJson);
			selected_board_id=config.board_id;*/
			loadTrelloForm();
			//$('#displayName').val(config.displayName);
			//board_name_old = config.board_name;
			//room_id_old = instanceData.channel_id;
			$('#integation-form').show();
			$('#integrations-block').hide();
			var formData = localStorage.getItem("formdata");
			var json = JSON.parse(formData);
			selected_room_id=json.room;
			selected_board_id=json.boards;
			console.log("json.room " + json.room);
			console.log("From localStorage variable:"+ JSON.stringify(json));
			$('#boards').val(selected_board_id);
			$('#rooms').val(selected_room_id);
			$('#displayName').val(json.displayName);
			//var notifications=config.notifications;
			//var boardandlistnotifications = notifications.boardandlistnotifications;
			var boardandlistnotifications = json.boardandlistnotifications;
			if($.isArray(boardandlistnotifications)) {
				$.each(boardandlistnotifications,function(index,value){
					$("input[type=checkbox][value="+value+"][name=boardandlistnotifications]").prop("checked",true);
				});
			} else {
				$("input[type=checkbox][value="+boardandlistnotifications+"][name=boardandlistnotifications]").prop("checked",true);
			}			
			//var cardnotifications = notifications.cardnotifications;
			var cardnotifications = json.cardnotifications;
			if($.isArray(cardnotifications)) {
				$.each(cardnotifications,function(index,value){
					$("input[type=checkbox][value="+value+"][name=cardnotifications]").prop("checked",true);		  
				});
			}else {
				$("input[type=checkbox][value="+cardnotifications+"][name=cardnotifications]").prop("checked",true);
			}
			//var checklistsnotifications = notifications.checklistsnotifications;
			var checkListsnotifications = json.checkListsnotifications;
			if($.isArray(checkListsnotifications)) {
				$.each(checkListsnotifications,function(index,value){
					$("input[type=checkbox][value="+value+"][name=checkListsnotifications]").prop("checked",true);
				});
			} else {
				$("input[type=checkbox][value="+checkListsnotifications+"][name=checkListsnotifications]").prop("checked",true);
			}
		});	
		
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
		$(document).on("click", "#done-button" , function() {
			$('#success-integration').foundation('close');
			$("#integration-form").hide();
			listIntegrations();
	    });
		$(document).on("click", "#instance-list-block .remove-config" , function() {
			console.log("on click remove");
			/*instanceId=this.id;
			$.each(listResultData,function(index,value){
				if(value["instanceId"]==instanceId) {
					instanceData=value;
					console.log("instanceData...."+instanceData);
				}
			});
			var config=JSON.parse(instanceData.configJson);
			selectedRoomName=config.room_name;*/
			$("#description-label").html(displayName);//config.description
			$("#addedon-label").html("Added on: Jun 29th, 2016");//+instanceData.createdDate
			$("#remove-msg").html("Are you sure you  want to remove integration from "+selectedRoomName+" room?");	
			formAction="remove";
			$('#remove-integration-btn').text("Remove");			
		});	
		$('#cancel-remove-integration').click(function(e){
			e.preventDefault();
			$('#remove-integration-popup').foundation('close');
		});		
		$('#remove-integration-btn').click(function(e){
			e.preventDefault();
			$('#remove-integration-popup').foundation('close');
			if(formAction=="removeAll") {
				removeAllIntegrationInstances("remove");
			} else { 
				//removeIntegrationInstance(instanceId);
				removeIntegrationInstance();
			}
		});
		function removeIntegrationInstance(instanceId) {
			//console.log("removeIntegrationInstance instanceId..."+instanceId);
			$('.loading-second-block').html('Removing integration for the room '+ selectedRoomName);
			$('#loading-block').foundation('open');
			alert();
			$.ajax({//url: delete_instance_url+"?instanceId="+instanceId,
				url:delete_instance_url,
				//type:"DELETE",
				//async:true,
				success: function(result){		
					console.log("removeIntegrationInstance");
					localStorage.removeItem("formdata");
					$('#instance-list-block').hide();
					listIntegrations();
					$('#loading-block').foundation('close');
				},
				error: function (error) {
					$('#loading-block').foundation('close');
					console.log('error while removing integration instance details..' + error);
					alert('Some problem occured, Pleaase try after some time');
				}
			});
			$('.loading-second-block').html('');
	    }
    });
	
	/*function setTrelloAppAuthDetails(int_id) {
		console.log("int_id.."+int_id);
		$('#loading-block').foundation('open');
		$.ajax({url: auth_url+"?integration_id="+int_id,
			async:true,
			success: function(result){
			    console.log("result"+JSON.stringify(result));
				$('#loading-block').foundation('close');
				var key=result[0].clientid;
				console.log("key....." + key);
				loginWithAuthDetails(key);	
			},
			error: function (error) {
				$('#loading-block').foundation('close');
				console.log('error while getting authorization detals..' + error);
				alert('Some problem occured, Pleaase try after some time');
			}
		});		
	}
    function loginWithAuthDetails(key) {
	console.log("log in ");
		$.getScript("https://trello.com/1/client.js?key="+key ,function(){
			Trello.authorize({
				name: "Cisco Spark",
				type: "popup",
				interactive: true,
				expiration: "never",
				persist: false,
				success: function () {
				var token = Trello.token();
					console.log("trello token :"+token);
					saveIntegrationAppToken(token);
				},
				scope: { write: false, read: true },
			});
		});
    }
	
	function saveIntegrationAppToken(token) {
		integration_token = token;
		$('#loading-block').foundation('open');
		$.ajax({url: save_token_url+"?integration_id="+integration_id+"&integration_token="+integration_token+"&spark_token="+spark_token,
			async:true,
			success: function(result){
			    console.log("result"+JSON.stringify(result));
				console.log("save token url");
				$('#loading-block').foundation('close');
				connectIntegration();
				loadTrelloForm();
			},
			error: function (error) {
				$('#loading-block').foundation('close');
				console.log('error while saving token details..' + error);
				alert('Some problem occured, Pleaase try after some time');
			}
		});			
	}*/
	function loadTrelloForm(){

		//console.log("spark_token.... "+spark_token);
		//console.log("trello_token.... "+integration_token);
		$('#loading-block').foundation('open');
		document.getElementById("form").reset();
		var rooms = formData.Rooms;
		var boards = formData.Boards;
		$.ajax({//url:form_data_url+"?spark_token="+spark_token+"&integration_id="+integration_id,
		    url: form_data_url,
			//async:true,
			success: function(){
                $("#integration-form").show();
				$('#integrations-block').hide();			
				/*var profiles = $.parseJSON(result[1]);
				var rooms = result[0].items;
				var boards = $.parseJSON(result[2]);
				console.log("boards...."+JSON.stringify(boards));
				console.log("rooms...."+JSON.stringify(rooms));
				$("input#userid").val(profiles["profile"].id);
				$("input#username").val(profiles["profile"].displayName);*/	
				$("input#userid").val("1234");
				$("input#username").val("testuser");				
				//$('#rooms')[0].options.length =1;				
				$.each(rooms, function(id,obj){
					//if(obj.id!='Y2lzY29zcGFyazovL3VzL1JPT00vN2JjMjJlMjAtMTk0NS0xMWU2LWE3ZDItNjU0MTA3MjNiZTVi')
					$("#rooms").append($('<option>').text(obj.name).attr('value',obj.id));
				});	
				$('#boards')[0].options.length =1;
				$.each(boards, function(id,obj){
					$("#boards").append($('<option>').text(obj.name).attr('value',obj.id));
				}); 
				$("#rooms").val(selected_room_id);
				$("#boards").val(selected_board_id);
				selected_room_id="0";
				selected_board_id="0";
				$('#integrations-block').hide();	
				$('#integration-form').show();
				$('#loading-block').foundation('close');
				$("#rooms").customselect();
				//resize();
			},
            error: function (error) {
				$('#loading-block').foundation('close');
				$('#integration-form').hide();
				$('#integrations-block').show();
                console.log('error while loading integration form data..' + error);
				alert('Some problem occured, Pleaase try after some time');			
            }
		});
	}
	function objLength(obj){
		var i=0;
		for (var x in obj){
			if(obj.hasOwnProperty(x)){
				i++;
			}
		} 
		return i;
	}
	function saveTrelloInstance() {
	    var response = $('form').serializeObject();
		selectedRoomName=$("#rooms option:selected").text();
		displayName = $('#displayName').val();
		var res = JSON.stringify($('form').serializeObject());
		localStorage.setItem("formdata",res);
		console.log(res);
        /*
		var jsonData = {};			
		jsonData["room_id"] = $("#rooms option:selected").val();;									
		jsonData["integration_id"] = integration_id;
		jsonData["integration_token"] = integration_token;
		jsonData["spark_token"] = spark_token;
		jsonData["user_id"] = $("#userid").val();
		jsonData["config"]={};
		jsonData["config"]["room_name"]= selectedRoomName;
		jsonData["config"]["board_id"] = res.board;
		jsonData["config"]["board_name"]= ($("#boards option:selected").text());
		jsonData["config"]["user_name"] = $("#username").val();
		jsonData["config"]["displayName"]= res.displayName;
		jsonData["config"]["notifications"]={};			
		jsonData["config"]["notifications"]["boardandlistnotifications"] = res.boardandlistnotifications;
		jsonData["config"]["notifications"]["cardnotifications"] = res.cardnotifications;
		jsonData["config"]["notifications"]["checklistsnotifications"] = res.checklistsnotifications;*/
		var action_url;
		if(formAction=="update") {
			/*jsonData["instance_id"] = instanceId;
			jsonData["board_modified"] = board_modified;
			jsonData["board_name_old"] = board_name_old;
			jsonData["room_modified"] = room_modified;
			jsonData["room_id_old"] = room_id_old;*/
			action_url=update_form_data_url;
			console.log("update integration");
		} else {
			action_url=post_form_data_url;
		}
		//var jsonString = JSON.stringify(jsonData);
		var notificationslength = objLength(response.boardandlistnotifications);
		notificationslength+=objLength(response.cardnotifications);
		notificationslength+=objLength(response.checkListsnotifications);
		if($('#rooms').val()==0){ 
		    alert("Please select Room");
		}else if($('#boards').val()==0){ 
		    alert("Please select Board");
		}else if(notificationslength==0) {
			alert("Please select atleast one Event");
		} else {
			$('.loading-second-block').html('Selected Room is '+ selectedRoomName);
			$('#loading-block').foundation('open');
			alert();
			$.ajax({url: action_url,
				//async:true,
				//type: "POST",
				//data: jsonString,
				//contentType: "application/json",
				//dataType: "json",
				success: function(result){	
					$('#success-integration').foundation('open');
					$('#loading-block').foundation('close');
				},
				error: function (error) {
					listIntegrations();
					$('#loading-block').foundation('close');
					console.log('error while saving integration instance details..' + error);
					alert('Some problem occured, Pleaase try after some time');
				}
			});
			$('.loading-second-block').html('');
		}
		//console.log(jsonString);
	}
	function listIntegrations() {
		console.log("listIntegrations...");
		$("#integration-form").hide();
		$('#loading-block').foundation('open');		
		$.ajax({//url: list_instances_url+"?token="+spark_token+"&integration_id="+integration_id,
			url:list_instances_url,
			//async:true,
			success: function(result){		
				//console.log("listIntegrations result...."+result);
				listInstancesData(result);
				$('#loading-block').foundation('close');
				$("#integrations-block").show();
				//resize();
			},
			error: function (error) {
				$('#loading-block').foundation('close');
				console.log('error while retrieving the list of integration instances..' + error);
				alert('Some problem occured, Pleaase try after some time');
			}
		});	
	}
	function listInstancesData() {
	alert("test");
		$("#integrations-block").show();
			if(localStorage.getItem("formdata")!=null)
			$("#instance-list-block").show();
			var listDataHTML="";
			//listResultData=result;
			//$.each(listResultData, function(i, instance) {
				//var configData=JSON.parse(instance.configJson);
				listDataHTML+='<div class="large-12 columns instance-background"><br>';
				listDataHTML+='<div class="large-8 medium-8 columns integration-details">';
				listDataHTML+='<img src="http://183.82.99.100:7080/CiscoWebcontent/images/trello.png" alt="trello">';
				listDataHTML+='<label>displayName</label>';
				listDataHTML+='<label>selectedRoomName</label>';
				listDataHTML+='<label>Added: Jun 29th, 2016</label>';
				listDataHTML+='</div>';
				listDataHTML+='<div class="large-3 medium-3 columns edit-remove-icons">';
				listDataHTML+='<span id="1234" data-open="remove-integration-popup" class="cross-mark remove-config"></span>';
				listDataHTML+='<a id="edit-config" class="edit-config">Edit</a>';
				listDataHTML+='</div>';
				listDataHTML+='</div><hr class="instance-hr">';			
			//});
		$("#instance-list-block").html(listDataHTML);
		/*if(listResultData.length<=1){ $("#remove-all-config").hide();}
		else { $("#remove-all-config").show();}*/
	}