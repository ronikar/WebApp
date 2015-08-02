$(document).ready(function(){
	//alert(localStorage.getItem("lastname"));
	var isOpenTabMenu=false;
	var openTab=0;
	var numOpenTab=0;
	var tabsUrlList=[[],[],[],[]];
	var menuTabInputElement=[{},{},{},{}];
	var userInformation={};
	const tabsName=['#quick-reports','#my-folders','#my-team-folders','#public-folders'];
	const tabsElement=[$('#quick-reports'),$('#my-folders'),$('#my-team-folders'),$('#public-folders')];
	const settingLinksNumber=3;

    $.getJSON("data/config.json", function(json) {
    	//notification
    	$('.notifications').text(json.notification);
		
    	//quickActions
    	var quickActions = json.quickActions;
		

    	for(var i=0; i<quickActions.length; i++){
			
			var sectionSelector=$(".nav-section:nth-child("+(i+1)+")");
			sectionSelector.css('background-image', "url(img/icons/"+quickActions[i].icon+".png)");
			var labelSection=sectionSelector.find(">p");
			labelSection.empty();
			labelSection.append(quickActions[i].label);
			
			//addd actionsLabel
			labelSection=sectionSelector.find(" .menu-caption p");
			labelSection.empty();
			labelSection.append(quickActions[i].actionsLabel);
			
			//add actions list
			var actionList=sectionSelector.find('.action-list');
    		actionList.empty();
    		for(var j=0; j< quickActions[i].actions.length; j++){
    			actionList.append('<li><a href="'+quickActions[i].actions[j].url+'">'+quickActions[i].actions[j].label+'</a></li>');
    		}
    	}
		//tabs
		var jsonTabsList=json.tabsList;
		for(i=0;i<jsonTabsList.length;i++){
			if(jsonTabsList[i].options.url!=null)
				tabsElement[i].find("iframe").attr("src",jsonTabsList[i].options.url);
		}
		


	});

	function saveDataToLocalStorage(){
		userInformation={'openTab':openTab,'numOpenTab':numOpenTab,'tabsUrlList':tabsUrlList};
		localStorage.setItem("userInformation",JSON.stringify(userInformation));
	};

	function initFormInputsObject(elem){
		//alert(elem.attr('id'));
		var formInput=[];
		for(var i=1; i<= settingLinksNumber; i++){
			var obj = {
				siteName : elem.find(".top-3 li:nth-child("+i+") input[name^='WebsiteName']"),
				siteURL : elem.find(".top-3 li:nth-child("+i+") input[name^='WebsiteUrl']")
			};
			formInput.push(obj);
		}
		return formInput;
	}

	function loadPage(){
		hideAllTabs();
		var urlTabPage=window.location.hash;
		var numTab=fromHrefTonumOpenTab(urlTabPage);
		var localObject=localStorage.getItem("userInformation");
		menuTabInputElement[0]=initFormInputsObject(tabsElement[0]);
		menuTabInputElement[2]=initFormInputsObject(tabsElement[2]);
		if (localObject!=null){
			tabsUrlList = JSON.parse(localObject).tabsUrlList;
		}
		updateIframeAndOption(0);
		updateIframeAndOption(2);
		if (numTab==undefined){
			if (localStorage.getItem("userInformation")!=null){
				userInformation=JSON.parse(localStorage.getItem("userInformation"));
				window.location=userInformation.openTab;
				//openTabHtml(userInformation.openTab);

			}else
			{
				window.location=tabsName[0];
				//openTabHtml(tabsName[0]);
			}
		}
		else{
			 openTabHtml(urlTabPage);
			 window.scroll(0,0);
		}
		$('.tabs ul').find('li:nth-child('+(numOpenTab+1)+')').css("background-color","lightgrey");
		

	}
	
	loadPage();
	function hideAllTabs(){
		$('#quick-reports').hide();
		$('#my-folders').hide();
		$('#my-team-folders').hide();
		$('#public-folders').hide();
		
	};
	
	function fromNumToIdTab(numOpenTab)
	{
		return tabsName[numOpenTab];
	};


	function fromHrefTonumOpenTab(href)
	{
		for(var i=0;i<tabsName.length;i++){
			if (href==tabsName[i])
				return i;
		}
		
	};

	
	function openTabHtml(href){
		openTab=href;
		numOpenTab=fromHrefTonumOpenTab(href);
		hideAllTabs();
		var currTab=$(href);
		switch(href) {
			case "#quick-reports":
				
				
				currTab.show();
				$(this).css("background-color","lightgrey");
				closeMenuTop3();
				//openTab=1;
				break;
			case "#my-folders":
				$('#my-folders').show();
			
				//openTab=2;
				break;
			case "#my-team-folders":
				$('#my-team-folders').show();
			
				//openTab=3;
				break;
			case "#public-folders":
				$('#public-folders').show();
				//openTab=4;
				break;
	   
		}
		$(".tabs >ul>li").css("background-color","grey");
		var currTab=$('.tabs >ul>li:nth-child('+(numOpenTab+1)+')');
		currTab.css("background-color","lightgrey");
		currTab.focus();

		if (numOpenTab==0 || numOpenTab==2){
			if (tabsUrlList[numOpenTab].length==0)
				openMenuTop3();
			else
			{
				closeMenuTop3();
			}
		}else{
			isOpenTabMenu=false;
		}
		saveDataToLocalStorage();
	};
	
	function closeMenuTop3()
	{
		tabsElement[numOpenTab].find('.top-3').hide();
		tabsElement[numOpenTab].find('.set-setting').css("background-color","lightgrey");
		isOpenTabMenu=false;
	}
	function openMenuTop3()
	{
			
		tabsElement[numOpenTab].find('.set-setting').css("background-color","white");
		var urlList=tabsUrlList[numOpenTab];
		var currMenu=menuTabInputElement[numOpenTab];
		var i;
		for(i=0;i<settingLinksNumber && i<urlList.length;i++){
			currMenu[i].siteURL.val(urlList[i].siteURL);
			currMenu[i].siteName.val(urlList[i].siteName);
		}
		for(var j=i;j<settingLinksNumber;j++){
			currMenu[j].siteURL.val("");
			currMenu[j].siteName.val("");
			currMenu[j].siteURL.removeClass("errorInput");
			currMenu[j].siteName.removeClass("errorInput");
			
		}
		currMenu[0].siteName.focus();
		tabsElement[numOpenTab].find('.top-3 input[type="submit"]').removeAttr('disabled');
		tabsElement[numOpenTab].find('.top-3').show();
		isOpenTabMenu=true;
		
	};



	$('.set-setting').click(function(e){
		e.preventDefault();
		$('.top-3').toggle();
		if (isOpenTabMenu==false)
		{
			openMenuTop3();
		}
		else
		{
			isOpenTabMenu=false;
			$(this).css("background-color","lightgrey");
		}
		
    });
	$('.external-tab').click(function(e){
		e.preventDefault();
		var win = window.open($(openTab +" iframe").attr('src'), '_blank');
  		win.focus();
	});
	
	$(".tabs >ul>li").click(function(e){
		e.preventDefault();
		me=$(this);
		hash = me.find( "a" ).attr("href");
		
		if (openTab==hash)
		{
			return;
		}
		else
		{
			window.location = hash;
			 //openTabHtml(hash);
		}
	});

	function updateIframeAndOption(numTab){
		var currTab=tabsElement[numTab];
		var currMenu=menuTabInputElement[numTab];
		var currTabSites = tabsUrlList[numTab];
		var siteSelectOption=currTab.find("select");
		var externalTab=currTab.find(".external-tab");
		siteSelectOption.empty();
		if(currTabSites.length != 0)
		{
			currTab.find("iframe").attr("src", currTabSites[0].siteURL);
			for(var i=0; i< currTabSites.length; i++){
				siteSelectOption.append('<option value="'+currTabSites[i].siteURL+'"">'+currTabSites[i].siteName+'</option>');
			}
			siteSelectOption.show();
			externalTab.show();

		}else
		{
			currTab.find("iframe").removeAttr("src");
			siteSelectOption.hide();
			externalTab.hide();
		}
		

	};
	
	$('.top-3 input[type="submit"]').click(function(e){
		e.preventDefault();
		var currMenu=menuTabInputElement[numOpenTab];
		var newTabsSite = [];
			
		var flag = true;

			for(var i=0; i < settingLinksNumber; i++){	
				var siteNameElement = currMenu[i].siteName;
				var siteURLElement = currMenu[i].siteURL;
				var siteName=siteNameElement.val();
				var siteURL=siteURLElement.val();

				siteURLElement.removeClass("errorInput");
				siteNameElement.removeClass("errorInput");
				var flagValidUrl=validateURL(siteURL);
				if (siteURL!="" && ((siteURL.indexOf("http://") == -1)&&(siteURL.indexOf("https://") == -1)) && !flagValidUrl){
					 siteURL="http://"+siteURL;
					 flagValidUrl=validateURL(siteURL);
					// alert(siteURL);
				}
				if((siteURL!="" && siteName=="") || (siteURL=="" && siteName!="") ||
					(siteURL!="" && !flagValidUrl)){
					if (siteName=="")
					{
						if (flag)
							siteNameElement.focus();
						siteNameElement.addClass("errorInput");
						flag=false;
					}
					if(siteURL=="" || !validateURL(siteURL)){
						if (flag)
							siteURLElement.focus();
						siteURLElement.addClass("errorInput");
						flag=false;
					}
				}
				else{
					if(currMenu[i].siteName.val()!= "" && currMenu[i].siteName.val()!=""){

						newTabsSite.push(JSON.parse('{"siteName":"'+ siteName+'","siteURL":"'+siteURL+'"}'));
					}
				}
					
					

			}
			

			if(!flag)
				return;

		tabsUrlList[numOpenTab] = newTabsSite;
		saveDataToLocalStorage();
		updateIframeAndOption(numOpenTab);	
		closeMenuTop3();
		
	});

	$(".search-box").submit(function(e){
		e.preventDefault();
		val=$(this).find("input").val();
		$('.notifications').text(val);

	});
	$('.top-3 button').click(function(e){
		closeMenuTop3();
		return false;

	
	});
	
	///////////////////////////////////////////////////////////////
	function validateURL(text) 
	//check if the url the user entered is valid
	{
      var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      return urlregex.test(text);
    };

	$('.top-3').keyup(function(e){
		if (e.keyCode == 27) {
			closeMenuTop3(); 
    	}	
    	
	});
	$("select").change(function(){
		tabsElement[numOpenTab].find("iframe").attr('src',$(this).find("option:selected").val());
		
	});
	$(window).on('hashchange',function(e){
		e.preventDefault();
		var urlTabPage=window.location.hash;
		var numTab=fromHrefTonumOpenTab(urlTabPage);
		if (numTab!=undefined){
			openTabHtml(window.location.hash);
		}
    		
	});
	
});

