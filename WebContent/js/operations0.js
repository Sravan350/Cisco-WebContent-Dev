	var windowProxy;        
	var integration_id="";
	var user_id=""; 
	var mule_token="";
	var action="";
	var listResultData="";
	var integration_app_icon_url="";
	var spark_icon_url="https://d24wgzqqegxpap.cloudfront.net/api/images/spark-icon.png";
	var instanceData="";
	var formAction=""; 
	var instanceId="";
	var removeRoomId = "";
	var room_modified=false;
	var selected_room_id="0";
	var selected_room_id1="0"; 
	var room_id_old="";
	var oauthRequired=true;
	var appTokenExists=false;
	var saveSparkTokenResponse="";
	var saveIntegrationTokenResponse="";
	var postMessageToSpark = "integration has been added to this space";
	var updateMessageToSpark = "integration has been added to this space";
	var removeMessageToSpark = "integration has been removed from this space";
	var roomsArray = [];
	var rooms=[];
	var rooms_list = "";
	var ui_settings="";
	var authenticated_user="";
	var allRooms= [];
	var allSpaces = [];
	var allInstances= "";
	var appName= "";
	var roomsEventResponse = false;
	var allInstancesResponse = false;
	var listCheckAllRooms = false;
	var isPrivate_config = false;
	var application_id = "";
	var popblockedMessage = "Hey there! Looks like your browser blocked pop ups for this site. Please enable pop ups in your browser settings and refresh screen to set up this integration. You can always disable it after the initial set up of this integration."
	var bannerMsg = 'We are currently investigating an issue with this integration. You may face difficulty setting it up or receiving notifications from previously set up configurations.';
	//clientauthemail = '<span class="close-btn"></span><label style="color:red">Sorry, you don not have proper permissions to set up this configuration. Please try with Spark account from non Cisco domain.';
	var clientAppRevokeMsg = "";
	var isClientAppTokenValid = true;
	var instanceList = "";
	var isMobile = false;
	var authenticationFlag = true;
	var twowayFlag = false;
	var isAccountExpired = false;
	var accountExpireMsg = "";
	var isBoxWebhookEnabled=true;
	var webhookMessageBanner = "";
	var arraybysantosh = "";
	var arraybysantosh1= "";
	var getroomlist="";
	var globleinstance = "";
	var authInstanceCount = 0;
	var unAuthInstanceCount = 0;
	var settingsUrl=""; //
	var onlyBot = false;
	var isSpaceRefresh =false;
	
	if (/Mobi/.test(navigator.userAgent)) {isMobile=true;}
	function onMessage(messageEvent) {
		if (messageEvent.data["resize"]) {
			document.body.bgColor = messageEvent.data["resize"];
		}
	}			
	var UA = navigator.userAgent,
		iOS = !!(UA.match(/iPad|iPhone/i));
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
		var height = document.body.scrollHeight+50;
		var width =  document.body.scrollWidth+20;
		var isChrome = !!window.chrome && !!window.chrome.webstore;
		var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match('CriOS');
		if(isChrome){    
            height = document.documentElement.scrollHeight+60;
        }else if(isSafari){
			height = document.documentElement.scrollHeight;
		}else{
			height = document.body.scrollHeight+60;
			if(height>5000){console.log("firefox > 5000!!!!!" + height);height=height+20;}
			
			if(height>8000){console.log("firefox > 8000!!!!!" + height);height=height+30;}
		}
		if(height<=330)height=330;
		if (/Mobi/.test(navigator.userAgent)) {
			height = document.getElementsByTagName("html")[0].scrollHeight+80;
		}	
    	windowProxy.post({'resize':true,'height':height,'width':width});
		console.log("height ..." +height);
    }
	function connectIntegration(){       
    	windowProxy.post({'connectIntegration':true,'statusCode':200});
    }
	function disconnectIntegration(){       
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
	var validate_client_url="";
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
	var getSparkSpaceDetails ="";
	
    $( document ).ready(function() {
		
		$(".warning-msg").html(bannerMsg);
		$('#integration-form').hide();
		$(document).foundation();
		windowProxy = new Porthole.WindowProxy("https://d24wgzqqegxpap.cloudfront.net/api/proxy.html"); 
		windowProxy.addEventListener(onMessage);		
        var url = window.location.href;
        var integrationId = gup(url,"integrationId");
		user_id = gup(url,"userId");
		mule_token = gup(url,"access_token");
		action = gup(url,"action");     
		integration_id =integrationId;
		getSparkRooms = "/api/integrations/"+integration_id+"/getSparkRooms";
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
		$('body').on({ 'touchstart' : function(){
			$('.tooltip.right').hide();
			}
		});	
		/*$('.select2-dropdown').on({ 'touchstart' : function(){
			alert("dropdown touched");
			$('.select2-dropdown').show();
			}
		});	*/
		/*$(document).on('click', '.select2.select2-container', function() {
			$('.select2-dropdown').show();
		});*/
		$(document).on({ 'touchstart' : function(event){
				var $trigger = $(".select2.select2-container");
				var $triggerMenu = $(".select2-dropdown.select2-dropdown--below");
				if($trigger !== event.target && $triggerMenu !== event.target && !$trigger.has(event.target).length && !$triggerMenu.has(event.target).length){
					$(".select2.select2-container").removeClass("select2-container--open");
					$(".select2.select2-container").addClass("select2-container--focus");
					$(".select2-dropdown").hide();
				}else{
					$('.select2-dropdown').show();
				}
			}
		});
		
		$(document).on('click', '.select2-selection', function(e) {
			$('.select2-results__option ul li:first-child').show();
		});
		$(document).on('keyup', '.select2-search__field', function(e) {
			var newId = "";
			var objId = "";
			$('.select2-results__options select2-results__options--nested li:first-child').show();
			if(e.keyCode == 8){
				objId = $(this).parent().parent().children("span:nth-child(2)").children("ul").attr("id");
				if(objId.indexOf('places')>-1)
				newId = $("#select2-places-results li ul li:first-child").attr('id');
				else
				newId = $("#select2-rooms-results li:first-child").attr('id');
				if(newId!=undefined)newIdArray = newId.split('-');
				var newIdValue = newIdArray[newIdArray.length - 1];
				if(newIdValue!="0"){
					$('#'+objId+' li:first-child').show();
					$('#'+newId).show();
					if($('#'+objId+' li:first-child').attr('id')!=undefined){
						var firstChildId = $('#'+objId+' li:first-child').attr('id');
						firstChildIdArray = firstChildId.split('-');
						var newFirstChildIdValue = firstChildIdArray[firstChildIdArray.length - 1];
						if(newFirstChildIdValue==0){
							$('#'+firstChildId).hide();
						}
					}
				}
			}else{
				objId = $(this).parent().parent().children("span:nth-child(2)").children("ul").attr("id");
				if(objId.indexOf('places')>-1)
				newId = $("#select2-places-results li ul li:first-child").attr('id');
				else
				newId = $("#select2-rooms-results li:first-child").attr('id');
				if(newId!=undefined)newIdArray = newId.split('-');
					var newIdValue = newIdArray[newIdArray.length - 1];
					if(newIdValue!="0"){
						$('#'+objId+' li:first-child').show();
						$('#'+newId).show();
						if($('#'+objId+' li:first-child').attr('id')!=undefined){
							var firstChildId = $('#'+objId+' li:first-child').attr('id');
							firstChildIdArray = firstChildId.split('-');
							var newFirstChildIdValue = firstChildIdArray[firstChildIdArray.length - 1];
							if(newFirstChildIdValue==0){
								$('#'+firstChildId).hide();
							}
						}
					}
			}
		});
		$(document).on("click", "#instance-list-block .remove-config, #unauth-instance-list-block .remove-config" , function() {
			//if(isMobile)
			instanceId=this.id;
			$.each(listResultData,function(index,value){
				if(value["instanceId"]==instanceId) {
					instanceData=value;
				}
			});
			console.log("insatance Data from remove :::: "+JSON.stringify(instanceData));
			var config=JSON.parse(instanceData.configJson);
			if(config.hasOwnProperty("unauthmode")){
				if(config.unauthmode || config.unauthmode==undefined)
					oauthRequired=false;
				else
					oauthRequired=true;
			}
			var selectedRoomName = "No";
			if(rooms.length!=0){
				if(allRooms.length!=0){
					$.each(allRooms, function(id,obj){
						if(instanceData.channelId==obj.id){
							selectedRoomName = obj.title;
							removeRoomId = instanceData.channelId;
							 return false; 
						}	
					});
				}else{
					$.each(rooms, function(id,obj){
						if(instanceData.channelId==obj.id){
							selectedRoomName = obj.title;
							removeRoomId = instanceData.channelId;
							return false; 
						}	
					});
				}
				selectedRoomName = $('<div/>').text(selectedRoomName).html();
			} else {
				selectedRoomName = "No";
			}
			var encodedMsg = $('<div />').text(config.displayName).html();
			$("#displayName-label").html(encodedMsg);
			$("#addedon-label").html("Added on: "+getDateForTimestamp(instanceData.createdDate));
			if(selectedRoomName == "No"){
				$("#remove-msg").html("Your configured space is not available. Are you sure you  want to remove this configuration?");
				if(config.hasOwnProperty("isPrivate")){
					$("#remove-msg").html("Are you sure you want to remove this configuration that would send private messages only to you?");
					$("#remove-msg-mobile").html("Are you sure you want to remove this configuration that would send private messages only to you?");
				}
			}else{
				$("#remove-msg").html("Are you sure you  want to remove this configuration from Space: "+selectedRoomName+"?");
				$("#remove-msg-mobile").html("Are you sure you  want to remove this configuration from Space: "+selectedRoomName+"?");
			}
			if(oauthRequired){
				$("#remove-auth").html("Authenticated as: "+authenticated_user);
				$("#remove-auth-mobile").html("Authenticated as: "+authenticated_user);
			}else{
				$("#remove-auth").html("");				
				$("#remove-auth-mobile").html("");
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
				removeIntegrationInstance(instanceId,removeRoomId);
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
		var copyToClipboard = function(textToCopy){
			$("body")
			.append($('<input type="text" name="webhookurl" class="textToCopyInput"/>' )
			.val(textToCopy))
			.find(".textToCopyInput")
			.select();
			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'successful' : 'unsuccessful'; 
				if(msg == 'unsuccessful'){
					var inp = document.querySelector($('#webhookURL')); 
				}
			} catch (err) {
				window.prompt("To copy the WebhookURL : Ctrl/Cmd+C, Enter", textToCopy);
			}
			$(".textToCopyInput").remove();
		} 
		$('#copy').on('click',function(){
			copyToClipboard($('#webhookURL').val());
			$('#copy').text("Copied!");
			setTimeout(function()
			{
			$('#copy').text("Copy URL");
			},1500) 
		});		
		$('#copy-bitbucket-unauth').on('click',function(){
			copyToClipboard($('#webhookURL1').val());
			$('#copy-bitbucket-unauth').text("Copied!");
			setTimeout(function()
			{
			$('#copy-bitbucket-unauth').text("Copy URL");
			},1500) 
		});											
		$('#applicationNameCopy').on('click',function(){
			copyToClipboard($('#applicationName').val());
			$('#applicationNameCopy').text("Copied!");
			setTimeout(function()
			{
			$('#applicationNameCopy').text("Copy Application Name");
			},1500) 
		});
		$('#serviceProviderNamecopy').on('click',function(){
			copyToClipboard($('#serviceProviderName').val());
			$('#serviceProviderNamecopy').text("Copied!");
			setTimeout(function()
			{
			$('#serviceProviderNamecopy').text("Copy Service Provider Name");
			},1500) 
		});			
		$('#consumercopy').on('click',function(){
			copyToClipboard($('#consumerKey').val());
			$('#consumercopy').text("Copied!");
			setTimeout(function()
			{
			$('#consumercopy').text("Copy Consumer Key");
			},1500) 
		});	
		$('#sharedcopy').on('click',function(){
			copyToClipboard($('#sharedSecret').val());
			$('#sharedcopy').text("Copied!");
			setTimeout(function()
			{
			$('#sharedcopy').text("Copy Service Provider");
			},1500) 
		});
		$('#reqtokencopy').on('click',function(){
			copyToClipboard($('#reqTokenURL').val());
			$('#reqtokencopy').text("Copied!");
			setTimeout(function()
			{
			$('#reqtokencopy').text("Copy URL");
			},1500) 
		});
		$('#acctokencopy').on('click',function(){
			copyToClipboard($('#accTokenURL').val());
			$('#acctokencopy').text("Copied!");
			setTimeout(function()
			{
			$('#acctokencopy').text("Copy URL");
			},1500) 
		});
		$('#authcopy').on('click',function(){
			copyToClipboard($('#authURL').val());
			$('#authcopy').text("Copied!");
			setTimeout(function()
			{
			$('#authcopy').text("Copy URL");
			},1500) 
		});
		$('#publiccopy').on('click',function(){
			copyToClipboard($('#publicKey').val());
			$('#publiccopy').text("Copied!");
			setTimeout(function()
			{
			$('#publiccopy').text("Copy URL");
			},1500) 
		});
		$('#callbackcopy').on('click',function(){
			copyToClipboard($('#callBackURL').val());
			$('#callbackcopy').text("Copied!");
			setTimeout(function()
			{
			$('#callbackcopy').text("Copy URL");
			},1500) 
		});
		
		$('.spaces-refresh').on('click',function(){
			isSpaceRefresh = true;
			console.log("Spaces refresh clicked....");
			$('.rooms-loading').show();
			getAllSparkRooms();
			loadRooms();
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
			datevalues=date.getDate()+nth(date.getDate())+" "+(months[date.getMonth()])+", "+ date.getFullYear();
		}
		return datevalues;
	}
	
	function listInstancesData1(result){
		console.log("in listInstancesData1!!!!!!!!!!!");
		var listDataHTML = "";
		var unauthListDataHTML="";
		var roomname="No";
		authInstanceCount = 0;
		unAuthInstanceCount = 0;
		listResultData=result;
		if(listResultData.length>0){
			console.log("list:: rooms length "+allRooms.length);
			var listarray = '[';
			$.each(listResultData, function(i, instance) {
				var configData=JSON.parse(instance.configJson);
				console.log("start configData.unauthmode!!!!!!!!!" + configData.unauthmode);
				if(application_id=="7"){
					if(configData.unauthmode!=undefined && !configData.unauthmode)
						authInstanceCount += 1;
					else
						unAuthInstanceCount += 1;
				}else if(configData.twoway != undefined ){
					if(configData.twoway)	authInstanceCount += 1;
					else	unAuthInstanceCount += 1;
				}else{
					if(configData.unauthmode!=undefined || !configData.unauthmode)
						authInstanceCount += 1;
					else
						unAuthInstanceCount += 1;
				}
				
				listarray+='"'+instance.channelId+'",';
			});
			listarray = listarray.substring(0,listarray.lastIndexOf(","));
			listarray+=']';
			getroomlist = '{"userId":"'+user_id+'","spaceIds":'+listarray+'}';
			getroomlist = JSON.parse(getroomlist);
			globleinstance = "";
			getInstanceRoomList();
			console.log("globleinstance "+JSON.stringify(globleinstance));
					
			if(globleinstance == undefined || globleinstance == ""){
				listDataHTML ="";
				unauthListDataHTML = "";
				$.each(listResultData, function(i, instance) {
					var configData=JSON.parse(instance.configJson);
					console.log("configData.unauthmode!!!!!!!!!" + configData.unauthmode);
					if(application_id=='7'&& configData.unauthmode==undefined || application_id=='7'&&configData.unauthmode){
						console.log("in jira unauth cond!!!!!!!!!!!!!!!!!!!!!!");
						unauthListDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						unauthListDataHTML+='<div class="large-8 medium-8 columns integration-details">';
						unauthListDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
						var encodedMsg = $('<div />').text(configData.displayName).html();
						unauthListDataHTML+='<label>'+encodedMsg+'</label>';
						unauthListDataHTML+='<label class="room"></label>';
						unauthListDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
						unauthListDataHTML+='</div>';
					}else{
						listDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						listDataHTML+='<div class="large-8 medium-8 columns integration-details">';
						listDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
						var encodedMsg = $('<div />').text(configData.displayName).html();
						listDataHTML+='<label>'+encodedMsg+'</label>';
						listDataHTML+='<label class="room"></label>';
						listDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
						listDataHTML+='</div>';
					}
					if(configData.unauthmode!=undefined && !configData.unauthmode&&!isClientAppTokenValid || application_id=="3"&&configData.unauthmode==undefined&&!isClientAppTokenValid || isAccountExpired){
						if(instance.hasOwnProperty("messageFormat")&&instance.messageFormat!="Box Webhook"&&application_id=="6"&&isBoxWebhookEnabled){
							console.log("in box condition!!!!!!! roomname=no , apprevoke=yes!!!!!!!!");
							listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
							listDataHTML+='<span class="github-edit-loading"><p id="fakehide">&nbsp;</p></span>'
							listDataHTML+='<span class="box-info-icon" title="The integration has been updated to receive notifications instantly in Spark. To use the latest version, please delete and recreate this configuration."><p>&nbsp;</p></span>'
							listDataHTML+='</div>';	
						}else{
							if(application_id=='7'&&configData.unauthmode==undefined || application_id=='7'&&configData.unauthmode){
								unauthListDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
								unauthListDataHTML+='<span class="github-edit-loading"><p id="fakehide">&nbsp;</p></span>'
								unauthListDataHTML+='</div>';	
							}else{
								listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
								listDataHTML+='<span class="github-edit-loading"><p id="fakehide">&nbsp;</p></span>'
								listDataHTML+='</div>';	
							}
						}
					}else{
						if(instance.hasOwnProperty("messageFormat")&&instance.messageFormat!="Box Webhook"&&application_id=="6"&&isBoxWebhookEnabled){
							console.log("in box condition!!!!!!! roomname=no , apprevoke=no !!!!!!!!");
							listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
							listDataHTML+='<span class="edit-loading"><p id="fakehide">&nbsp;</p></span>'
							listDataHTML+='<span class="box-info-icon" title="The integration has been updated to receive notifications instantly in Spark. To use the latest version, please delete and recreate this configuration."><p>&nbsp;</p></span>'
							listDataHTML+='</div>';	
						}else{
							if(application_id=='7'&&configData.unauthmode==undefined || application_id=='7'&&configData.unauthmode){
								unauthListDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
								unauthListDataHTML+='<span class="edit-loading"><p id="fakehide">&nbsp;</p></span>'
								unauthListDataHTML+='</div>';	
							}else{
								listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
								listDataHTML+='<span class="edit-loading"><p id="fakehide">&nbsp;</p></span>'
								listDataHTML+='</div>';	
							}
						}
					}
					listDataHTML+='</div>';	
					unauthListDataHTML+='</div>';				
				 });
				 $("#instance-list-block").html(listDataHTML);
				 $("#unauth-instance-list-block").html(unauthListDataHTML);
				 listDataHTML="";
				 unauthListDataHTML="";
				 resize();
			}
			var display_template = window.setInterval(function(){
				if(globleinstance!="" && globleinstance!=undefined){
						globleinstance = globleinstance['spaceDetailsResponse'];
						var arrayRoomsId = "";
						var arrayRoomsObj = "";
						$.each(globleinstance, function(id,obj){
							arrayRoomsId+=obj.id+",";
							arrayRoomsObj+=obj.title+",";
						});
						rooms = globleinstance;
						arrayRoomsId = arrayRoomsId.substring(0,arrayRoomsId.lastIndexOf(","))
						arrayRoomsId = arrayRoomsId.split(",");
						
						arrayRoomsObj = arrayRoomsObj.substring(0,arrayRoomsObj.lastIndexOf(","))
						arrayRoomsObj = arrayRoomsObj.split(",");
						
						listDataHTML = "";
						unauthListDataHTML="";
						window.clearInterval(display_template);
						$.each(listResultData, function(i, instance) {
							var configData=JSON.parse(instance.configJson);
							roomname = "No";
							if(arrayRoomsId.indexOf(instance.channelId)>=0){
								roomname = arrayRoomsObj[arrayRoomsId.indexOf(instance.channelId)];
								roomname = $('<div />').text(roomname).html();
							}
							if(application_id=='7'&&configData.unauthmode==undefined || application_id=='7'&&configData.unauthmode){
								console.log("in jira unauth cond!!!!!!!!!!!!!!!!!!!!!!");
								unauthListDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
								unauthListDataHTML+='<div class="large-8 medium-8 columns integration-details">';
								unauthListDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
								var encodedMsg = $('<div />').text(configData.displayName).html();
								unauthListDataHTML+='<label>'+encodedMsg+'</label>';
							}else{
								console.log("in not jira auth cond!!!!!!!!!!!!!!!!!!!!!!");
								listDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
								listDataHTML+='<div class="large-8 medium-8 columns integration-details">';
								listDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
								var encodedMsg = $('<div />').text(configData.displayName).html();
								listDataHTML+='<label>'+encodedMsg+'</label>';
							}
							
							if(roomname == "No"){
								if(application_id=='7'&&configData.unauthmode==undefined || application_id=='7'&&configData.unauthmode){
									unauthListDataHTML+='<label class="room"></label>';
								}else{
									listDataHTML+='<label class="room"></label>';
								}
							}else{
								if(application_id=='7'&&configData.unauthmode==undefined || application_id=='7'&&configData.unauthmode){
									unauthListDataHTML+='<label class="room">Space: '+roomname+'</label>';
								}else{
									listDataHTML+='<label class="room">Space: '+roomname+'</label>';
								}
							} 
							if(application_id=='7'&&configData.unauthmode==undefined || application_id=='7'&&configData.unauthmode){
								unauthListDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
								unauthListDataHTML+='</div>';
							}else{
								listDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
								listDataHTML+='</div>';
							}
							
							if(!configData.unauthmode&&!isClientAppTokenValid&&configData.unauthmode!=undefined || application_id=="3"&&configData.unauthmode==undefined&&!isClientAppTokenValid || isAccountExpired){
								if(instance.hasOwnProperty("messageFormat")&&instance.messageFormat!="Box Webhook"&&application_id=="6"&&isBoxWebhookEnabled){
									console.log("in box condition!!!!!!! roomname=yes , apprevoke=yes !!!!!!!!");
									listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
									listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
									listDataHTML+='<span class="box-info-icon" title="The integration has been updated to receive notifications instantly in Spark. To use the latest version, please delete and recreate this configuration."><p>&nbsp;</p></span>'
									listDataHTML+='<a class="github-edit-config" id='+instance.instanceId+'>Edit</a>';
									listDataHTML+='</div>';	
								}else{
									if(application_id=='7'&&configData.unauthmode==undefined || application_id=='7'&&configData.unauthmode){
										unauthListDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
										unauthListDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
										unauthListDataHTML+='<a class="github-edit-config" id='+instance.instanceId+'>Edit</a>';
										unauthListDataHTML+='</div>';
									}else{
										listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
										listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
										listDataHTML+='<a class="github-edit-config" id='+instance.instanceId+'>Edit</a>';
										listDataHTML+='</div>';
									}
								} 
							}else{
								if(instance.hasOwnProperty("messageFormat")&&instance.messageFormat!="Box Webhook"&&application_id=="6"&&isBoxWebhookEnabled){
									console.log("in box condition!!!!!!! roomname=yes , apprevoke=no !!!!!!!!");
									listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
									listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
									listDataHTML+='<span class="box-info-icon" title="The integration has been updated to receive notifications instantly in Spark. To use the latest version, please delete and recreate this configuration."><p>&nbsp;</p></span>'
									listDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
									listDataHTML+='</div>';	
								}else{
									if(application_id=='7'&&configData.unauthmode==undefined || application_id=='7'&&configData.unauthmode){
										unauthListDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
										unauthListDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
										unauthListDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
										unauthListDataHTML+='</div>';
									}else{
										listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
										listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
										listDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
										listDataHTML+='</div>';
									}
								}
							}
							listDataHTML+='</div>';	
							unauthListDataHTML+='</div>';	
						});
					
					if(authInstanceCount==0 && application_id=='7'){
						 listDataHTML='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						 listDataHTML+='<div class="no-config-msg"><label>You have no configurations. Click above link to set up one.</label></div></div>';
					}else if(unAuthInstanceCount==0&&application_id=='7'){
						 unauthListDataHTML='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						 unauthListDataHTML+='<div class="no-config-msg"><label>You have no configurations. Click above link to set up one.</label></div></div>';
					}
					$("#instance-list-block").html(listDataHTML);
					$("#unauth-instance-list-block").html(unauthListDataHTML);
					$(".github-edit-config").css("display","none"); //
					$(".github-edit-loading").css("display","none"); // 
					if(isClientAppTokenValid == false&&application_id!="3"&&application_id!="1"){
						$(".edit-config").css("display","none");
					}
					if(isAccountExpired){
						$('.account-expire-warning').show();
						$('.account-expire-warning').html(accountExpireMsg);
					}else{
						$('.account-expire-warning').hide();
					}
					resize();
				}		
			},500);	
			
		}else{
			if(!isAccountExpired){
				listDataHTML = noListMessage();
				unauthListDataHTML = noListMessage();
			}
			$("#instance-list-block").html(listDataHTML);
			$("#unauth-instance-list-block").html(unauthListDataHTML);
			resize();
		}
		console.log("authInstanceCount!!!!" + authInstanceCount);
		console.log("unAuthInstanceCount!!!!" + unAuthInstanceCount);
	}
	
	function noListMessage(){
		var noListDataHTML='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
			
			//if(application_id=='7')
				// noListDataHTML+='<div class="no-config-msg"><label>You have no configurations. Click above link to set up one.</label></div></div>';
			 
			//--------------------venkatasiva-290617-------
			if(application_id=='1')
				 noListDataHTML+='<div class="no-config-msg"><label>You have no configurations. Click on one of the above buttons to set one up.</label></div></div>';
			 
			else {
				noListDataHTML+='<div class="no-config-msg"><label>You have no configurations. Click Add to set up one.</label></div></div>';
			 }
			 
			return noListDataHTML;
	}
	function sortRooms(){
		allRooms = allRooms .sort((function (a, b) { return new Date(b.lastActivity) - new Date(a.lastActivity) }));
	}
	function validateClientAppSettings(){
		console.log("result-----------------eml");
		$.ajax({
			url: configuration_settings_url+"?userId="+user_id+"&action=list",
			async: true,
			headers: { 'userId': user_id },
			success: function(result){
				ui_settings = result;
				if(ui_settings["integrationSpecificSettings"]!=undefined && ui_settings["integrationSpecificSettings"]!="" ){
					
					if(result['sparkPersonDetails']!=undefined && application_id==7 || application_id==1 || application_id==3){
						if(result['sparkPersonDetails']['emails']!=undefined && result['sparkPersonDetails']['emails']!=null){
							var emailfalg = false;
							var emails = result['sparkPersonDetails']['emails'];
							for(var i=0;i<emails.length;i++){
								if(emails[i].indexOf('@eidiko.com')>=0){
									emailfalg=true;
									break;
								}
							}
							if(emailfalg){
								console.log("email flag true");
								$(".ciscousrhide").prop('disabled', true);
								$('.jiraAuthLinkDiv').append('<div style="position:absolute; left:0; right:0; top:0; bottom:0;" class="jira-auth-link-block"></div>');
								//$(".ciscouser").hide();
								//$('.jira-auth-link').css('opacity', '0.6');
							}else{
								console.log("email flag false");
								$(".ciscousrhide").prop('disabled', false);
							}
						}
					}
					
					if(ui_settings["integrationSpecificSettings"]["isAccountExpired"] != undefined && ui_settings["integrationSpecificSettings"]["isAccountExpired"]==true){
						isAccountExpired = true;
						console.log("***** isAccountExpired "+isAccountExpired);
						$('.account-expire-warning').html(accountExpireMsg); // 2208
						$('.account-expire-warning').show();
					}else if(ui_settings["integrationSpecificSettings"]["isValidToken"] != undefined && ui_settings["integrationSpecificSettings"]["isValidToken"]==false){
						isClientAppTokenValid = false;
						console.log("*****")
						$('.client-app-warning').html(clientAppRevokeMsg);$('.client-app-warning').show();
					}else{
						isClientAppTokenValid = true; $('.client-app-warning').hide();
					}
					getAuthUser();
				}
				resize();
			},
			 error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   } else{
					$('#instance-loading-block').hide();
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});
		
	}
	function getAllSparkRooms(){
		$.ajax({
			url: getSparkRooms+"?userId="+user_id,
			async: true,
			headers: { 'userId': user_id },
			success: function(result){
				if(isSpaceRefresh)  $('.rooms-loading').hide();
				if(result["sparkRoomSettings"]!=undefined && result["sparkRoomSettings"]!=null){
					allRooms = rooms_list = result["sparkRoomSettings"]["items"];
					sortRooms();
				}
			},
			 error: function(xmlHttpRequest, error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   } else{
					$(".rooms-loading").hide();
				}
			}
		});
	}
	function loadRooms(){
		var roomsTimer = setInterval(function(){
			if(rooms_list != ""){
				clearInterval(roomsTimer);
				setUpRooms();
			}
		},100);
	}
	function setUpRooms(){
		if(allRooms.length !=0){
			$("#rooms").find("option:gt(0)").remove();
			$("#rooms").html('<option value="0">Please select a space</option>');
			$.each(allRooms, function(id,obj){
				obj.title=$('<div />').text(obj.title).html();
				$("#rooms").append($('<option>').text(obj.title).attr('value',obj.id));
			});
			$("#rooms").val(selected_room_id);
			$('#select2-rooms-container').html($("#rooms option:selected").text());
			console.log("Selected Room Id from setUprooms "+selected_room_id);
			selected_room_id = 0; 
		}
	} 
	function getAllListInstances(){
		$.ajax({url: list_integration_instances_url+"?integrationId="+integration_id,
			async:true,
			type:"GET",
			headers: { 'userId': user_id },
			success: function(result){
			 allInstances = result;
			 allInstancesResponse =true;
			 loadAllInstancesData();	 
			},	
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					$("#integrations-block").show();
					resize();
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});
	}
	function postAddMessageToRoom(roomId,appName){
		if(listResultData.length > 0){
			$.each(listResultData,function(index,value){
				if(value["channelId"]==roomId) {
					postMessageToSpark = "";
					return false;
				}else{
					postMessageToSpark = appName+" integration has been added to this space";
				}				
			});
		}else{
			postMessageToSpark = appName+" integration has been added to this space";
		}
	}
	function listIntegrations() {
		console.log("listIntegrations() called!!!!!!");
		$("#integrations-block").hide();
		$('.config-notes').hide();
		$('.bitbucket-config-note').hide();
		$('.bitbucket-links').show();
		$(".unauth-cloud").hide();				
		$(".github-add-config").hide(); $(".bitbucket-add-config").hide();
		$("#integration-form").hide();
		$('.github-links').css('margin-left', '0px'); 
		resize();
		allInstancesResponse =false;
		roomsEventResponse =false; 
		getAllListInstances();
		if(oauthRequired ){ 
			validateClientAppSettings();
		}
		roomsEventResponse =true; 
		listCheckAllRooms = false;
		$("#integrations-block").show(); 
		$(".home").hide();
		$('#instance-loading-block').show();
		$('.instances-loading-text').html("Loading your configurations");
		if(application_id=="2")
		$('.instances-loading-text').html("Just a few seconds");
		resize();
	}	
	function loadAllInstancesData() {
	if(allInstancesResponse && roomsEventResponse) {
		$("#integrations-block").show();
		listCheckAllRooms = false;
				if($.isArray(allInstances)){
					//listInstancesData(allInstances);
					if(application_id=="7")
						listInstancesDataJira(allInstances);
					else
						listInstancesData1(allInstances);
				} else {
					if(application_id=="7")
						listInstancesDataJira([]);
					else
						listInstancesData1([]);
				}
				$('#instance-loading-block').hide(); 
				$(".config-notes").show();
				$(".jira-links").show();
				//$('.bitbucket-config-note').show();
				if(!isClientAppTokenValid){
					if(allInstances.message) $('.client-app-warning').hide();
					else $('.client-app-warning').show();
				}
				$(".home").show(); 
				if(application_id=="3"){
					if(authenticationFlag){
						if(appTokenExists){
							console.log("Displayed from operations1 ... isAppTokenExists? "+appTokenExists)
							$(".unauth").show();
							$(".github-add-config-text").html('');
							$(".github-add-config-text").html('<p>Click add to create a GitHub.com configuration.</p>'); 
							$(".github-add-config").show();
			
						}else{
							console.log("Displayed from operations1 ... isAppTokenExists? "+appTokenExists)
							$('.auth').hide();
							$('.unauth').show();
							$(".github-add-config-text").html(''); 
							$(".github-add-config-text").html('<p>Click add to authenticate your GitHub.com account with Cisco Spark.</p>');
							$(".github-add-config").show(); 
						}
					}else{
						$(".github-add-auth").hide();
						$(".note-on-permission").hide();
						$(".unauth-nonauth-link").hide();
						$(".auth").show();
						$(".github-add-config-text").html('');
						$(".github-add-config-text").html('<p>Click add to create a GitHub Enterprise configuration.</p>');
						$(".github-add-config").show();
					}
					if(!isClientAppTokenValid){
						$('.auth').hide();
						$('.client-app-warning').show();
						$('.unauth').show();
						$(".github-add-config-text").html(''); 
						$(".github-add-config-text").html('<p>Click add to authenticate your GitHub.com account with Cisco Spark.</p>');
						$(".github-add-config").show(); 
					}
				}
				if(application_id=="1"){
					$('.auth').show();
					$(".unauth").show();
					$('.bitbucket-config-note').show();
					$(".unauth-cloud").show();
					$(".note-on-permission").show();
					
				}			
		}else{
			console.log("Loading takes more time");
		}
	}
	function validateClientAppToken() {
		console.log("in validate Client App Token")
		$.ajax({
			url: configuration_settings_url+"?userId="+user_id+"&action=list",
			async: true,
			headers: { 'userId': user_id },
			success: function(result){
				ui_settings= result ;
				if(result["integrationSpecificSettings"]!=undefined || result["integrationSpecificSettings"]!=""){
					
					if(result["integrationSpecificSettings"]["isAccountExpired"] != undefined && result["integrationSpecificSettings"]["isAccountExpired"]==true){
						console.log("Account Expired...");
						isAccountExpired = true;
						
						listIntegrations();
					}else{
						if(result["integrationSpecificSettings"]["isValidToken"] != undefined && result["integrationSpecificSettings"]["isValidToken"]==false ){
							isClientAppTokenValid = false;
							$('.client-app-warning').html(clientAppRevokeMsg);
						}
						if(application_id==6&&result["integrationSpecificSettings"]["settings"]!=undefined){
							console.log("validateClientAppToken in isWebhookEnabled cond!!!!!");
							if(result["integrationSpecificSettings"]["settings"]["isWebhookEnabled"]!=undefined&&result["integrationSpecificSettings"]["settings"]["isWebhookEnabled"]==false )
							{
								isBoxWebhookEnabled=false;
								console.log("select webhook or oauth");
								$('.client-app-warning').html(webhookMessageBanner);
							}
						}
						listIntegrations();
					}
					resize();
				}else{
					 alert("We've experienced some difficulty. Try again.");
					  $("#integrations-block").hide();
				}
				resize();
			},
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   } else{
				   alert("We've experienced some difficulty. Try again.");
				   $("#integrations-block").hide();
				}
			}
		});
	}
	function validateIntegrationAppTokenDB() {
		$.ajax({url: get_app_token_url+"?userId="+user_id,
			async:true,
			type: "get",
			headers: { 'userId': user_id },
			success: function(result) {
				if(result.tokenResult.tokenId) {
					console.log("token found...")
					appTokenExists=true;
					$("#instance-loading-block").show();
					$("#integrations-block").show();
					$("#home").hide();
					validateClientAppToken();
				}else if(appName == "Zendesk"){
					$("#protocol").html(protocol);
					$("#domainName").html(domain);
					$("#authenticate-block").show();
				}else {
					appTokenExists=false;
					if(application_id=="3" || application_id=="1"){
						listIntegrations();
					}else if(application_id=="7"){
						$(".config-notes").show();
						$(".jira-links").show();
						listIntegrations();
					}else if(twowayFlag){
						var authReqMsg ="";
						authReqMsg+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						authReqMsg+='<div class="no-config-msg"><label>You are not authorized to this integration. Click Add to continue.</label></div></div>';
						$('#integrations-block').show();
						$("#instance-list-block").html(authReqMsg);
						
					}else{
						var authReqMsg ="";
						authReqMsg+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						authReqMsg+='<div class="no-config-msg"><label>You are not authorized to this integration. Click Add to continue.</label></div></div>';
						$('#integrations-block').show();
						$("#instance-list-block").html(authReqMsg);
					}
				}
				resize();
			},
			error: function(xmlHttpRequest,error) {				
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});
	}
	$(document).on("click", "#done-button" , function() {
		
		/*if(application_id==2) $('#trello-success-integration').foundation('close');*/
		$('#success-integration').foundation('close');
		
		$("#integration-form").hide();
		listIntegrations();
	
	});
	
	
	
	function removeIntegrationInstance(instanceId,removeRoomId) {
		var deleteUrl = delete_instance_url+instanceId+"?messageToSpark="+removeMessageToSpark;
		var oneWaySapceCount = 0;
		var twoWaySpaceCount = 0;
		var flagTwoWay = false;
		var roomidfordeleteinstance = "";
		$.each(listResultData,function(index,value){
			if(value["instanceId"]==instanceId) { 
				roomidfordeleteinstance = value["channelId"];
				var configJ = JSON.parse(value['configJson']);
				if(configJ['twoway']!=undefined && configJ['twoway'] && !flagTwoWay){
					removeMessageToSpark = "Hi <@personId:"+user_id+">, I have successfully removed your "+appName+" configuration from this space for you.";
					if(roomidfordeleteinstance=="isPrivate")
						removeMessageToSpark = "Hi, I have successfully removed your "+appName+" configuration from this space for you.";
					deleteUrl = delete_instance_url+instanceId+"?messageToSpark="+removeMessageToSpark+"&isBot=true";
					flagTwoWay = true;
				}else{
					console.log("one way instance remove message...");
					removeMessageToSpark = appName+" integration has been removed from this space";
					deleteUrl = delete_instance_url+instanceId+"?messageToSpark="+removeMessageToSpark;
					flagTwoWay = false;
				}
			}				
		});
		$.each(listResultData,function(index,value){
			var configJ = JSON.parse(value['configJson']);
			if(value["channelId"]==roomidfordeleteinstance ){
				if(configJ['twoway']!=undefined && configJ['twoway']) twoWaySpaceCount++;
				else oneWaySapceCount++;
			}
		});
		
		if(twoWaySpaceCount>1 && flagTwoWay) deleteUrl = delete_instance_url+instanceId+"?messageToSpark=&isBot=true";
		if(oneWaySapceCount >1 && !flagTwoWay) deleteUrl = delete_instance_url+instanceId+"?messageToSpark=";
		
		$.ajax({url: deleteUrl,
			type:"DELETE",
			async:true,
			headers: { 'userId': user_id },
			success: function(result){	
				listIntegrations();
			},
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});
	}
	function removeAllIntegrationInstances(formAction) {
		$.ajax({url: removeall_integration_instances_url+"?integrationId="+integration_id+"&userId="+user_id+"&messageToSpark="+removeMessageToSpark,
			type:"DELETE",
			async:true,
			headers: { 'userId': user_id },
			success: function(result){		
				$(".home").hide();
				$("#remove-all-config").hide();
				if(formAction=="disconnect"){
					disconnectIntegrationApp();
				}
				resize();
			},
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});		
	}
	function disconnectIntegrationApp() {
		var deleteSparkTokenResponse="";
		var deleteIntegrationTokenResponse="";
		$.ajax({url: delete_spark_token_url+"?userId="+user_id+"&integrationId="+integration_id,
			async:true,
			type:"DELETE",
			headers: { 'userId': user_id },
			success: function(result){
				deleteSparkTokenResponse="success";
			},
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					deleteSparkTokenResponse="failure";
				}
			}
		});			
		if(oauthRequired) {
			$.ajax({url: delete_integration_token_url+"?userId="+user_id+"&integrationId="+integration_id,
				async:true,
				type:"DELETE",
				headers: { 'userId': user_id },
				success: function(result){
					deleteIntegrationTokenResponse="success";
				},
				error: function(xmlHttpRequest,error) {
				   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
					   return;
				   }else{
						deleteIntegrationTokenResponse="failure";
					}
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
					alert("We've experienced some difficulty. Try again.");
				}			
			}
        }, 100);
	}
	function addInstanceValidate(response){
		console.log("formAction!!!!!!!!!!!!!!" + formAction);
		if(response.startResponse!=undefined && response.startResponse.statusCode!=500){
			$('#success-integration').foundation('open');
			$('#loading-block').foundation('close');	
		}else if(response.UpdateIntegrationResponse!=undefined && response.UpdateIntegrationResponse.statusCode!=500){
			$('#success-integration').foundation('open');
			$('#loading-block').foundation('close');	
		}else{
			$('#loading-block').foundation('close');
			alert("We've experienced some difficulty. Try again.");
		}
	}
	var getInstanceRoomList = function(){
		$.ajax({
			url: getSparkSpaceDetails,
				async:true,
				headers: { 'userId': user_id },
				type:"POST",
				data : JSON.stringify(getroomlist),
				contentType: "application/json",
				dataType: "json",
				success: function(result){
					globleinstance = result;
				},
				error: function(xmlHttpRequest,error) {
				   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
					   return;
				   }
				}
			});
	};