	function listInstancesDataJira(result){
		var listDataHTML = "";
		var unauthListDataHTML="";
		var roomname="No";
		var temp="";
		authInstanceCount = 0;
		unAuthInstanceCount = 0;
		listResultData=result;
		if(listResultData.length>0){
			console.log("LIST > 0");
			var listarray = '[';
			$.each(listResultData, function(i, instance) {
				var configData=JSON.parse(instance.configJson);
				//if(configData.twoway!=undefined && configData.twoway)
					authInstanceCount++;
				//else
					//unAuthInstanceCount += 1;
				listarray+='"'+instance.channelId+'",';
			});
			listarray = listarray.substring(0,listarray.lastIndexOf(","));
			listarray+=']';
			getroomlist = '{"userId":"'+user_id+'","spaceIds":'+listarray+'}';
			getroomlist = JSON.parse(getroomlist);
			globleinstance = "";
			getInstanceRoomList();
					
			if(globleinstance == undefined || globleinstance == ""){
				listDataHTML ="";
				//unauthListDataHTML = "";
				$.each(listResultData, function(i, instance) {
					var configData=JSON.parse(instance.configJson);
					
					/*if(configData.twoway==undefined || !configData.twoway){
						unauthListDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						unauthListDataHTML+='<div class="large-8 medium-8 columns integration-details">';
						unauthListDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
						var encodedMsg = $('<div />').text(configData.displayName).html();
						unauthListDataHTML+='<label>'+encodedMsg+'</label>';
						unauthListDataHTML+='<label class="room"></label>';
						unauthListDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
						unauthListDataHTML+='</div>';
						unauthListDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
						unauthListDataHTML+='<span class="edit-loading"><p id="fakehide">&nbsp;</p></span>'
						unauthListDataHTML+='</div>';
					}else {*/
						listDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						listDataHTML+='<div class="large-8 medium-8 columns integration-details">';
						listDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
						var encodedMsg = $('<div />').text(configData.displayName).html();
						listDataHTML+='<label>'+encodedMsg+'</label>';
						listDataHTML+='<label class="room"></label>';
						listDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
						listDataHTML+='</div>';
						if(!(configData.twoway==undefined || !configData.twoway)){
							console.log("JJJJJ")
							if(isAccountExpired){
								listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
								listDataHTML+='<span class="instance_room_loading"><p id="fakehide">&nbsp;</p></span>'
								listDataHTML+='</div>';	
							}else{
								if(isClientAppTokenValid){
									console.log("KKK")
									listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
									listDataHTML+='<span class="edit-loading"><p id="fakehide">&nbsp;</p></span>'
									listDataHTML+='</div>';	
								}else{
									console.log("LLLL")
									listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
									listDataHTML+='<span class="instance_room_loading"><p id="fakehide">&nbsp;</p></span>'
									listDataHTML+='</div>';	
								}
							}
							
						}
						
					//}
					
					listDataHTML+='</div>';	
					//unauthListDataHTML+='</div>';
				 });
				 $("#instance-list-block").html(listDataHTML);
				// $("#unauth-instance-list-block").html(unauthListDataHTML);
				 listDataHTML="";
				 unauthListDataHTML="";
				 resize();			
			}
			
			var display_template = window.setInterval(function(){
				if(globleinstance!="" && globleinstance!=undefined){
					globleinstance = globleinstance['spaceDetailsResponse'];
					var arrayRoomsId = [];
					var arrayRoomsObj = [];
					$.each(globleinstance, function(id,obj){
						arrayRoomsId.push(obj.id);
						arrayRoomsObj.push(obj.title);
					});
					rooms = globleinstance;
					
					listDataHTML = "";
					unauthListDataHTML="";
					window.clearInterval(display_template);
					$.each(listResultData, function(i, instance) {
						var configData=temp=JSON.parse(instance.configJson);
						roomname = "No";
						if(arrayRoomsId.indexOf(instance.channelId)>=0){
							roomname = arrayRoomsObj[arrayRoomsId.indexOf(instance.channelId)];
							roomname = $('<div />').text(roomname).html();
						}
						
						
						/*if(configData.twoway==undefined || !configData.twoway){
							unauthListDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
							unauthListDataHTML+='<div class="large-8 medium-8 columns integration-details">';
							unauthListDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
							unauthListDataHTML+='<label>'+configData.displayName+'</label>';
							console.log("Room in 1way"+roomname);
							if(roomname == "No")
								unauthListDataHTML+='<label class="room"></label>';
							else
								unauthListDataHTML+='<label class="room">Space: '+roomname+'</label>';
							
							unauthListDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
							unauthListDataHTML+='</div>';
							unauthListDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
							unauthListDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
							unauthListDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
							unauthListDataHTML+='</div>';
						}else {*/
							listDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
							listDataHTML+='<div class="large-8 medium-8 columns integration-details">';
							listDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
							listDataHTML+='<label>'+configData.displayName+'</label>';
							if(configData.isPrivate)
								listDataHTML+='<label class="room">Space: Private</label>';
							else if(roomname == "No")
								listDataHTML+='<label class="room"></label>';
							else
								listDataHTML+='<label class="room">Space: '+roomname+'</label>';
							
							listDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
							listDataHTML+='</div>';
							if(!(configData.twoway==undefined || !configData.twoway)){
								if(isClientAppTokenValid || isAccountExpired){
									listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
									listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
									listDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
									listDataHTML+='</div>';
								}else{
									console.log("ZZZZZZZZZZZZ");
									listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
									listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
									listDataHTML+='<a class="apprevoke_notfound" id='+instance.instanceId+'>Edit</a>';
									listDataHTML+='</div>';
								}
							}else{
								listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
								listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
								listDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
								listDataHTML+='</div>';
							}
							
						//}
						listDataHTML+='</div>';	
						//unauthListDataHTML+='</div>';	
					});
					
					if(authInstanceCount==0){
						 listDataHTML='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						 listDataHTML+='<div class="no-config-msg">You have no configurations. Click Add buttons to set up one.</div></div>';
					}
					/*if(unAuthInstanceCount==0){
						 unauthListDataHTML='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
						 unauthListDataHTML+='<div class="no-config-msg">You have no configurations. Click Add buttons to set up one.</div></div>';
					}*/
					$("#instance-list-block").html(listDataHTML);
					//$("#unauth-instance-list-block").html(unauthListDataHTML);
					$(".apprevoke_notfound").css("display","none");
					$(".instance_room_loading").css("display","none");
					
					if(isAccountExpired){
						$(".edit-config").css("display","none");
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
			}
			$("#instance-list-block").html(listDataHTML);
			resize();
		}
	}