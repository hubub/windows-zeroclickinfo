
var sets;

function setHeight (element)
{ 
  var result = document.getElementById("ddg_zeroclick");
  var h = element.style.height;
  //document.getElementById("search_button").value = h;
  
  with (document.body.style)
  {
  	height = h + "px";
  }
}

function nothingFound(query)
{
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
      ddg_result.innerHTML = '<img style="float: left;" src="../css/imgs/icon_16.png"/>' + 
                                'No zero click results found.' + 
                                '<a id="nothing_found_more" href="https://duckduckgo.com/?q='+
                                    encodeURIComponent(query)
                                +'"> See DuckDuckGo results </a>';
    }
    setHeight(ddg_result)
}

function hideZeroClick()
{
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
        ddg_result.style.display = 'none';
    }
}

function showZeroClick()
{
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
        ddg_result.style.display = 'block';
    }
}


function createResultDiv()
{  
    var result = document.getElementById("results");
    var ddg_result = document.getElementById("ddg_zeroclick");
    showZeroClick();
    if (ddg_result === null) {
        result.innerHTML = '<div id="ddg_zeroclick"></div>';
        ddg_result = document.getElementById("ddg_zeroclick");
    }
    return ddg_result;
}

function displayAnswer(answer)
{
    if (answer === '') {
        return;
    }
    
    var ddg_result = createResultDiv();
    ddg_result.className = "ddg_answer";
    ddg_result.innerHTML = answer;
    setHeight(ddg_result);
}

function displaySummary(res, query) {
    var result = ''

    var img_url = res['AbstractURL'];
    var official_site = '';
    var first_category = ''
    var hidden_categories = '';


    if (res['Results'].length !== 0) {
        if(res['Results'][0]['Text'] === "Official site") {
            official_site = ' | ' + res['Results'][0]['Result'];
            img_url = res['Results'][0]['FirstURL'];
        }
    }
    

    for (var i = 0; i < res['RelatedTopics'].length; i++){
        if (res['RelatedTopics'].length === 0)
            break;
        
        var link = res['RelatedTopics'][i]['Result'].
                    match(/<a href=".*">.*<\/a>/);
        
        if (i < 2) {
            var first = (i === 0)? 'first_category': '';

            first_category += '<div class="ddg_zeroclick_category '+ first +
                '" onmouseover="this.className+=\' ddg_selected\'" onmouseout="this.className=\'ddg_zeroclick_category '+ first +'\'"   onclick="window.location.href=this.firstChild.href">' +
                                link +
                              '</div>';
        } else {
            hidden_categories += '<div id="ddg_zeroclick_category">' +
                                link +
                              '</div>';
        }
    }

    if (hidden_categories !== '') {
        hidden_categories = '<div id="ddg_zeroclick_more">' +
                                '<a href="javascript:;" onclick="' +
                                    "this.parentElement.style.display='none';" +
                                    "this.parentElement.nextElementSibling.style.display='block'" +
                                '"> More related topics </a>' +
                             '</div>' +
                                '<div style="display:none">' +
                                    hidden_categories +
                                '</div>';
    
    }

    result += '<div id="ddg_zeroclick_header">' +
                '<a href="' + res['AbstractURL'] + '">'+
                    (res['Heading'] === ''? "&nbsp;": res['Heading']) +
                '</a>' +
                '<a class="ddg_more" href="https://duckduckgo.com/?q='+
                    encodeURIComponent(query)
                +'"> See DuckDuckGo results </a>' +
                '</div>';
    
    
    var source_base_url = res['AbstractURL'].match(/http.?:\/\/(.*?\.)?(.*\..*?)\/.*/)[2];

    result += '<div id="ddg_zeroclick_abstract">' +
                '<div onmouseover="this.className+=\' ddg_selected\'" onmouseout="this.className=\'\'" onclick="window.location.href=\''+ 
                res['AbstractURL'] +'\'"/>' +

                '<p>' + res['Abstract'] + '</p></div>' +
                '<div id="ddg_zeroclick_official_links">' +
                    '<img src="http://duckduckgo.com/i/'+ source_base_url +'.ico" />' +
                    '<a href="' + res['AbstractURL'] + '"> More at ' +
                        res['AbstractSource'] +
                    '</a>' + official_site +
                '</div></div>' +
                 /*first_category +
                 hidden_categories +*/
              '</div><div class="clear"></div>';

    if (res['Image']) {
        result += '<div id="ddg_zeroclick_image">' +
                    '<a href="' + img_url +'">' +
                        '<img class="ddg_zeroclick_img" src="' + res['Image'] + '"/>' +
                    '</a>' +
                  '</div>';
    }

    var ddg_result = createResultDiv();
    ddg_result.className = '';
    ddg_result.innerHTML = result;
    setHeight(ddg_result);
}

function displayDisambiguation(res, query){
    
    var result = '';
    result += '<div id="ddg_zeroclick_header"> <a href="https://duckduckgo.com/?q=' + 
                      encodeURIComponent(query) +'"> Meanings of ' +
                    res['Heading'] +

                '<a class="ddg_more" href="https://duckduckgo.com/?q='+
                    encodeURIComponent(query)
                +'"> See DuckDuckGo results </a>' +

              '</div>';

    var disambigs = ''
    var hidden_disambigs = '';
    var others = '';
    var nhidden = 0;

   for (var i = 0; i < res['RelatedTopics'].length; i++){
        if (res['RelatedTopics'].length === 0)
            break;

        // other topics
        if(res['RelatedTopics'][i]['Topics']) {
            var topics = res['RelatedTopics'][i]['Topics'];
            var output = '';
            for(var j = 0; j < topics.length; j++){
                output += '<div class="wrapper">' +
                            '<div class="icon_disambig">' +
                                '<img src="' + topics[j]['Icon']['URL'] +'" />' +
                            '</div>' +
                            '<div class="ddg_zeroclick_disambig"  onmouseover="this.className+=\'disambig_selected\'" onmouseout="this.className=            \'ddg_zeroclick_disambig\'" onclick="window.location.href=this.firstChild.href">' +
                                topics[j]['Result'] +
                            '</div>' +
                          '</div>';
            }
            /*others += '<div class="disambig_more" onmouseover="this.className+=\' disambig_selected\'" onmouseout="this.className=\'disambig_more\'" onclick="this.firstChild.onclick();this.className=\'disambig_more\';this.onmouseover=function(){}">' +
                                '<a href="javascript:;" onclick="' +
                                    "this.parentElement.nextElementSibling.style.display='block';this.onmouseover=null;" +
                                    "this.parentElement.innerHTML = '" + res['RelatedTopics'][i]['Name'] + "<hr>';" +
                                '"> ' + res['RelatedTopics'][i]['Name'] + ' ('+ topics.length + ')</a>' +
                             '</div>' +
                                '<div style="display:none">' +
                                    output +
                                '</div>';*/
            

            continue;
        }
            
 
        if (i <= 3) {
            disambigs += '<div class="wrapper">' +
                            '<div class="icon_disambig">' +
                                '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />' +
                            '</div>' +
                            '<div class="ddg_zeroclick_disambig">' +
                                res['RelatedTopics'][i]['Result'] +
                            '</div>' +
                          '</div>';
        } else {
            hidden_disambigs += '<div class="wrapper">' +
                                    '<div class="icon_disambig">' +
                                        '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />' +
                                    '</div>' +
                                    '<div class="ddg_zeroclick_disambig">' +
                                        res['RelatedTopics'][i]['Result'] +
                                    '</div>' +
                                  '</div>';
            nhidden++;
        }
    }
    
    if (hidden_disambigs!== '') {
        hidden_disambigs = '<div class="disambig_more">' +
                                '<a href="javascript:;" onclick="' +
                                    "this.parentElement.style.display='none';" +
                                    "this.parentElement.nextElementSibling.style.display='block'" +
                                '"> More ('+ nhidden + ')</a>' +
                             '</div>' +
                                '<div style="display:none">' +
                                    hidden_disambigs+
                                '</div>';
    }


    result += '<div id="ddg_zeroclick_abstract">' +
                  disambigs +
                  hidden_disambigs +
                  /*others +*/
              '</div><div class="clear"></div>';
              

    var ddg_result = createResultDiv();
    ddg_result.className = '';
    ddg_result.innerHTML = result;
    setHeight(ddg_result);
}

function displayCategory(res, query){
    var result = '';
    result += '<div id="ddg_zeroclick_header">' +
                    res['Heading'] +
                '<a class="ddg_more" href="https://duckduckgo.com/?q='+
                    encodeURIComponent(query)
                +'"> See DuckDuckGo results </a>' +
              '</div>';
    
    var categories = '';
    var hidden_categories = '';
    var nhidden = 0;
    for (var i = 0; i < res['RelatedTopics'].length; i++){
        if (res['RelatedTopics'].length === 0)
            break;

        if (i <= 2) {
            categories += '<div class="wrapper" onmouseover="this.className+=\' ddg_selected\'" onmouseout="this.className=\'wrapper\'" onclick="window.location.href=this.lastChild.firstChild.href;">' +
                            '<div class="icon_category">' +
                                '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />' +
                            '</div>' +
                            '<div class="ddg_zeroclick_category_item">' +
                                res['RelatedTopics'][i]['Result'] +
                            '</div>' +
                          '</div>';
        } else {
            hidden_categories += '<div class="wrapper" onmouseover="this.className+=\' ddg_selected\'" onmouseout="this.className=\'wrapper\'" onclick="window.location.href=this.lastChild.firstChild.href;">' +
                                '<div class="ddg_zeroclick_img" class="icon_category">' +
                                    '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />' +
                                '</div>' +
                                '<div class="ddg_zeroclick_category_item">' +
                                    res['RelatedTopics'][i]['Result'] +
                                '</div>' +
                              '</div>';

            nhidden++;
        }

    }
    
    /*if (hidden_categories !== '') {
        hidden_categories = '<div class="category_more"  onmouseover="this.className+=\' ddg_selected\'" onmouseout="this.className=\'category_more\'" onclick="this.firstChild.onclick();this.className=\'category_more\';this.onmouseover=function(){}">' +
                                '<a href="javascript:;" onclick="' +
                                    "this.parentElement.style.display='none';" +
                                    "this.parentElement.nextElementSibling.style.display='block'" +
                                '"> More ('+ nhidden + ')</a>' +
                             '</div>' +
                                '<div style="display:none">' +
                                    hidden_categories+
                                '</div>';
 
    }*/

    result += '<div id="ddg_zeroclick_abstract">' +
                    categories +
                    hidden_categories +
                '</div>';
                
    

    var ddg_result = createResultDiv();
    ddg_result.className = '';
    ddg_result.innerHTML = result;
    setHeight(ddg_result);
}

function renderZeroClick(res, query)
{
    // disable on images
    if (document.getElementById('isr_pps') !== null)
        return;

    if (res['AnswerType'] !== "") {
        displayAnswer(res['Answer']);
    } else if (res['Type'] == 'A' && res['Abstract'] !== "") {
        displaySummary(res, query);
    } else {
        switch (res['Type']){
            case 'E':
                displayAnswer(res['Answer']);
                break;

            case 'A':
                displayAnswer(res['Answer']);
                break;

            case 'C':
                displayCategory(res, query);
                break;

            case 'D':
                displayDisambiguation(res, query);
                break;

            default:
                createResultDiv();
                nothingFound(query);
                break;
                    
        }
    }
}

function query(q, callback){
  var req = new XMLHttpRequest();
  req.open('GET', 'http://api.duckduckgo.com?q=' + encodeURIComponent(q) + '&format=json', true);

  req.onreadystatechange = function(data) {
      if (req.readyState != 4) { return; }
      var res = JSON.parse(req.responseText);
      callback(res);
  }
  req.send(null);
}

function search(q){   
    query(q, function(response){
        renderZeroClick(response, q);
    });
}

function initDDG () {
    System.Gadget.settingsUI = "settings.html";
    System.Gadget.onSettingsClosed = setSettings;

    //nasty hack
    setInterval( function(){
        document.body.style.height = (60 + document.getElementById('results').clientHeight) + "px";
      }, 200);


    document.getElementById("search_button").onmousedown = function(){
      this.style.background = "url(css/imgs/search_active.png)";
      this.style.backgroundRepeat = "no-repeat scroll 0 0 transparent"; 
    }
    document.getElementById("search_button").onmouseup = function(){
      this.style.background = "url(css/imgs/search_inactive.png)";
      this.style.backgroundRepeat = "no-repeat scroll 0 0 transparent"; 
    }


    document.getElementById("search_button").onclick = function(){
      var el = document.getElementById('search_wrapper');
      if (el.value !== '')
          search(el.value);
      else
          return false;
    };
    document.getElementById("search_wrapper").onkeyup = function(){
      var key = event.keyCode;
      var el = document.getElementById('search_wrapper');
      if (key === 13){
        if (el.value !== ""){
          search(el.value);
        }else
          return false;
      }else 
        return false;
    };
}




/************************
 *
 *   SETTINGS
 *
 ************************/

var bckg = "red";

var colorsArr = new Array ( ["Red (default)", "red"],
                            ["Blue", "blue"],
                            ["Green", "green"],
                            ["Orange", "orange"],
                            ["Purple", "purple"],
                            ["Light Blue", "light_blue"],
                            ["Light Green", "light_green" ] );

var ddgSets;	

function loadSetts()
{
    ddgSets = new GetDDGSettings()
    var select = document.getElementById("colors");
    select.options[select.options.selectedIndex].selected = true;
	  System.Gadget.onSettingsClosing = ClosingSets;
}

function GetDDGSettings()
{
    this.background = System.Gadget.Settings.read("background");
    this.gviewed = System.Gadget.Settings.read("GadgetViewed");
}

function SaveSettings()
{  
    bckg = colors.value;    		
    System.Gadget.Settings.write("background", bckg);
    ddgSets.background = bckg;
}

function setSettings()
{
    sets = new GetDDGSettings();
    var bg = document.getElementById('header');
    bg.style.backgroundImage = 'url("css/imgs/bckgs/' + sets.background +'.png")';
    bg.style.backgroundRepeat = "repeat-x scroll 0 0 #CD473B";
}


//when the Settings are closing
function ClosingSets(event)
{
	if (event.closeAction == event.Action.commit){
		  System.Gadget.Settings.write("GadgetViewed","yes");
      SaveSettings();
	}else if(event.closeAction == event.Action.cancel){}
	event.cancel = false;
}







