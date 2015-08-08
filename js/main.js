$(document).ready(function(){
	
	var isOpenTabMenu=false;
	var openTab=0;//contain the currect hash
	var numOpenTab=0;// contain the position of the currect tab in tabsElement array
	var tabURLsLists=[[],[],[],[]];//
	var menuTabInputElement=[{},{},{},{}];
	var userInformation={};//element the contain the data that save to local storage , also use to reload the local storage from the local computer

	const tabsName=['#quick-reports','#my-folders','#my-team-folders','#public-folders'];//contain the hash name of each tab
	const tabsElement=[$('#quick-reports-panel'),$('#my-folders-panel'),$('#my-team-folders-panel'),$('#public-folders-panel')];//array. each cell is panel element

	var iframeElements=[];//pointers of the frame for quick access/
	var tabList= $('.tabs>ul');
	var tabListElements=[];


	const notificationsElement=$('.notifications');
	const selectsElement=[tabsElement[0].find('select'),tabsElement[2].find('select')];
	

	const settingLinksNumber=3;//num of link i want to save
	
	

	///preproccess functions save the poiners to the elements for quick access

	function findIframes(){
		for(var i=0;i<tabsElement.length;i++){
			iframeElements.push(tabsElement[i].find("iframe"));
		}
	};
	function findTabListElement(){
		
		for(var i=0;i<tabsElement.length;i++){
			tabListElements.push(tabList.find('li:nth-child('+(i+1)+')'));
		}
	};

	function initFormInputsObject(elem){
		//get menu form and return the pointers of the input text in the form
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
    
	//helper function:

	//save data to local storage
	function saveDataToLocalStorage(){
		userInformation={'openTab':openTab,'numOpenTab':numOpenTab,'tabURLsLists':tabURLsLists};
		localStorage.setItem("userInformation",JSON.stringify(userInformation));
	};

	

	//hide all  tab-panels
	function hideAllTabs(){
		for(var i=0;i<tabsElement.length;i++)
		tabsElement[i].hide();
		
	};
	
	//get number of tab and return hash name that suitable him.
	function fromNumToIdTab(numOpenTab)
	{
		return tabsName[numOpenTab];
	};


	//get hash-name and return the position in tabsElement that suitable to the hash.
	function fromHrefTonumOpenTab(href)
	{
		for(var i=0;i<tabsName.length;i++){
			if (href==tabsName[i])
				return i;
		}
		
	};

	//get hash-name and open the panel that suitable him
	function openTabHtml(href){
		openTab=href;
		numOpenTab=fromHrefTonumOpenTab(href);
		hideAllTabs();
		tabsElement[numOpenTab].show();
		var currTabItem=tabListElements[numOpenTab];
		for (i=0;i<tabListElements.length;i++){
			tabListElements[i].removeClass("active");
		}
		currTabItem.addClass("active");
		

		if (numOpenTab==0 || numOpenTab==2){
			if (tabURLsLists[numOpenTab].length==0)
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
	
	//close the menu of the URL list in the panel
	function closeMenuTop3()
	{
		tabsElement[numOpenTab].find('.top-3').hide();
		tabsElement[numOpenTab].find('.set-setting').removeClass('openMenu');
		isOpenTabMenu=false;
	}

	//open the menu of the URL list in the panel
	function openMenuTop3()
	{
			
		tabsElement[numOpenTab].find('.set-setting').addClass('openMenu');
		var urlList=tabURLsLists[numOpenTab];
		var currMenu=menuTabInputElement[numOpenTab];
		var i;
		for(i=0;i<settingLinksNumber && i<urlList.length;i++){
			currMenu[i].siteURL.val(urlList[i].siteURL);
			currMenu[i].siteName.val(urlList[i].siteName);
			currMenu[i].siteURL.removeClass("errorInput");
			currMenu[i].siteName.removeClass("errorInput");
		}
		for(var j=i;j<settingLinksNumber;j++){
			currMenu[j].siteURL.val("");
			currMenu[j].siteName.val("");
			currMenu[j].siteURL.removeClass("errorInput");
			currMenu[j].siteName.removeClass("errorInput");
			
		}
		
		tabsElement[numOpenTab].find('.top-3').show();
		currMenu[0].siteName.focus();
		isOpenTabMenu=true;
		
	};

	//after click on save this function update the url list, show/hide external tab and update the src of iframe
	function updateIframeAndOption(numTab){
		var currTab=tabsElement[numTab];
		var currMenu=menuTabInputElement[numTab];
		var currTabSites = tabURLsLists[numTab];
		var siteSelectOptions=currTab.find("select");
		var externalTab=currTab.find(".external-tab");
		siteSelectOptions.empty();
		if(currTabSites.length != 0)
		{
			iframeElements[numTab].attr("src", currTabSites[0].siteURL);
			for(var i=0; i< currTabSites.length; i++){
				siteSelectOptions.append('<option value="'+currTabSites[i].siteURL+'"">'+currTabSites[i].siteName+'</option>');
			}
			siteSelectOptions.show();
			externalTab.show();

		}else
		{
			iframeElements[numOpenTab].removeAttr("src");
			siteSelectOptions.hide();
			externalTab.hide();
		}
		

	};

	//check if the url the user entered is valid
	function validateURL(text) {
      var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      return urlregex.test(text);
    };

	//events:
	//click set-sitting button
	$('.set-setting').click(function(e){
		e.preventDefault();
		if (isOpenTabMenu==false)
		{
			openMenuTop3();
			isOpenTabMenu=true;

		}
		else
		{
			isOpenTabMenu=false;
			closeMenuTop3();
		}
		
    });


	//click external button
	$('.external-tab').click(function(e){
		e.preventDefault();
		var win = window.open(iframeElements[numOpenTab].attr('src'), '_blank');
  		win.focus();
	});
	
	//click on tab item
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
		}
	});

	
	//submit the form
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

		tabURLsLists[numOpenTab] = newTabsSite;
		saveDataToLocalStorage();
		updateIframeAndOption(numOpenTab);	
		closeMenuTop3();
		
	});

	$(".search-box").submit(function(e){
		e.preventDefault();
		val=$(this).find("input").val();
		if(val=="")
			return;
		for(var i=0;i<3;i+=2){
			oneUrlList=tabURLsLists[i];
			for(j=0;j<oneUrlList.length;j++){
				if(oneUrlList[j].siteName.indexOf(val) > -1){
					selectsElement[i/2].val(oneUrlList[j].siteURL);
					iframeElements[i].attr('src',oneUrlList[j].siteURL);
					window.location.hash=tabsName[i];
					notificationsElement.addClass("invisible");
					return;
				}
			}

		}
		notificationsElement.removeClass("invisible");
		notificationsElement.text('The searched report "'+val+'" was not found.');
		

	});

	// press Cancel
	$('.top-3 button').click(function(e){
		closeMenuTop3();
		return false;	
	});
	
	//press ESC
	$('.top-3').keyup(function(e){
		if (e.keyCode == 27) {
			closeMenuTop3(); 
    	}	
    	
	});


	$("select").change(function(){
		iframeElements[numOpenTab].attr('src',$(this).find("option:selected").val());
		
	});

	//change hash
	$(window).on('hashchange',function(e){
		e.preventDefault();
		var urlTabPage=window.location.hash;
		var numTab=fromHrefTonumOpenTab(urlTabPage);
		if (numTab!=undefined){
			openTabHtml(window.location.hash);
		}
		else{
			window.location.hash=userInformation.openTab;
		}
    		
	});

	//functions that call when page loading
	function loadPage(){
		//preproccess 
		findIframes();
		findTabListElement();
		menuTabInputElement[0]=initFormInputsObject(tabsElement[0]);
		menuTabInputElement[2]=initFormInputsObject(tabsElement[2]);
		//start load page
		hideAllTabs();
		notificationsElement.addClass("invisible");

		var urlTabPage=window.location.hash;
		var numTab=fromHrefTonumOpenTab(urlTabPage);

		var localObject=localStorage.getItem("userInformation");
		
		if (localObject!=null){
			tabURLsLists = JSON.parse(localObject).tabURLsLists;
			if (tabURLsLists==undefined)
				tabURLsLists=[[],[],[],[]];
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
			 //window.scroll(0,0);
		}
		tabListElements[numOpenTab].addClass("active");
	}
	
	$.getJSON("data/config.json", function(json) {
    	//notification
    	if (json.notification!=undefined){
    		notificationsElement.text(json.notification);
			notificationsElement.removeClass("invisible");
		}
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
				iframeElements[i].attr("src",jsonTabsList[i].options.url);
		}
		
	});

	loadPage();

	
});

