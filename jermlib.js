/*
    jerm-lib logic
    - functions/methods defined here have the prefix "jerm_" to make them unique to any that may be
      defined by the library user...also, the var_name notation is used rather than the varName notation
      for EVENT HANDLERS; other methods have the varName notation
    - css classnames defined here and in jermlib.css have the prefix "jerm" to make them unique
*/

var JERM_COPPASE_DATA={};
var JERM_TABITEM_ACTIVE_COLOR = "#009494";
var JERM_TABITEM_ACTIVE_BG = "#ccc";
var JERM_TAB_RADIUS = "20px";

// this is used to create custom event-handlers...eg onchangestate for the jermSwitch
var JERM_HANDLER_STR = "try{{0}();}catch(e){console.warn(\"jermHandlerError:{0} is NOT a function!\");}";

var JERM_HANDLER = "jermDummyFunction";

// basic functions to compliment javascript
String.prototype.format = function() {
    // enable string formatting with "{i}".format(*args)
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function jermDummyFunction(){} // just a dummy function (default event-handler)


// menus
function jerm_entered_menu_item_handler()
{
                this.style.fontSize = this.jerm_font_size;
                this.style.color = this.jerm_active_color;
                this.style.backgroundColor = this.jerm_active_bg;
            };
function jerm_left_menu_item_handler ()
{
                this.style.fontSize = "100%";
                this.style.color = ""; //restore default color
                this.style.backgroundColor = "";
};

function jermInitMenu()
    /* call this function in window.onload
        - the menu-items are not bound to the onclick method so pelase do this yourself!
    */
{
    var menus = document.getElementsByClassName("jermMenu");
    
    for (var menu_index=0; menu_index<menus.length; menu_index++)
    {
        var orientation = menus[menu_index].getAttribute("orientation") || "horizontal"; // vertical, horizontal(default)
        var alignment = menus[menu_index].getAttribute("itemAlign") || "left"; // left(default), right, center
        var enlarge_active = menus[menu_index].getAttribute("enlargeActive"); // default is false
        var separator = menus[menu_index].getAttribute("separator"); // true, false(default)
        var active_color = menus[menu_index].getAttribute("activeColor") || ""; // default is none
        var active_bg = menus[menu_index].getAttribute("activeBg") || ""; // default is none

        var menu_items = menus[menu_index].children;
        for (var i=0; i<menu_items.length; i++)
        {
            menu_items[i].jerm_active_color = active_color;
            menu_items[i].jerm_active_bg = active_bg;

            menu_items[i].className += " jermMenuItem";
            var style = menu_items[i].style;
            var font_size = style.fontSize;
            var color = style.color;

            menu_items[i].jerm_font_size = font_size;

            
            style.textAlign = alignment;
            
            if (orientation=="horizontal") 
            {
                style.float="left";
                style.paddingLeft="5px";
                style.paddingRight="5px";
            }
            else {style.display="block";}
            
            if (separator=="true")
            {
                if (i>0)
                {
                    if (orientation=="horizontal"){style.borderLeft="1px solid";}
                    else {style.borderTop="1px solid";}       
                }
            }
            
            if (enlarge_active=="true"){menu_items[i].jerm_font_size = "110%";}

            menu_items[i].onmouseenter = jerm_entered_menu_item_handler;
            menu_items[i].onmouseleave = jerm_left_menu_item_handler;
        }
    }
}

function jermInsertMenuItem(menuElement, menuItemElement, index)
{
    if (menuElement==null || menuItemElement==null)
    {console.warn("jermInsertMenuItem sytax: jermInsertMenuItem(menuElement, menuItemElement, index=-1)"); return 0;}
    if (menuElement.class=="" || menuItemElement.class=="")
    {console.warn("jermInsertMenuItem sytax: jermInsertMenuItem(menuElement, menuItemElement, index=-1)"); return 0;}
    
    if (index==null){index = -1;}

    if (menuElement.getAttribute("class").indexOf("jermMenu")<0)
    {console.log("menuElement given is NOT of class \"jermMenu\""); return 0;}
    
    var orientation = menuElement.getAttribute("orientation") || "horizontal"; // vertical, horizontal(default)
    var alignment = menuElement.getAttribute("itemAlign") || "left"; // left(default), right, center
    var enlarge_active = menuElement.getAttribute("enlargeActive"); // default is false
    var separator = menuElement.getAttribute("separator"); // true, false(default)
    var active_color = menuElement.getAttribute("activeColor") || ""; // default is none
    var active_bg = menuElement.getAttribute("activeBg") || ""; // default is none

    menuItemElement.jerm_active_color = active_color;
    menuItemElement.jerm_active_bg = active_bg;

    menuItemElement.className += " jermMenuItem";
    var style = menuItemElement.style;
    var font_size = style.fontSize;
    var color = style.color;

    menuItemElement.jerm_font_size = font_size;
    
    style.textAlign = alignment;
    
    
    if (orientation=="horizontal") 
    {
        style.float="left";
        style.paddingLeft="5px";
        style.paddingRight="5px";
    }
    else {style.display="block";}
    
    if (separator=="true")
    {
        if ((index>1)||(index==-1))
        {
            if (orientation=="horizontal"){style.borderLeft="1px solid";}
            else {style.borderTop="1px solid";}       
        }
        else if (index==0)
        {
            if (orientation=="horizontal"){style.borderRight="1px solid";}
            else {style.borderBottom="1px solid";}
            
            if (menuElement.children.length>1)
            {
                if (menuElement.children[1].style.borderLeft.indexOf("1px solid")<0)
                {
                    if (orientation=="horizontal"){menuElement.children[1].style.borderLeft="1px solid";}
                    else {menuElement.children[1].style.borderBottom="1px solid";}                
                }                
            }     
        }
        else if(index==1)
        {
            if (orientation=="horizontal"){style.borderRight="1px solid";}
            else {style.borderBottom="1px solid";}       
        }
    }
        
    if (enlarge_active=="true"){menuItemElement.jerm_font_size = "110%";}

    menuItemElement.onmouseenter = jerm_entered_menu_item_handler;
    menuItemElement.onmouseleave = jerm_left_menu_item_handler;

    if (index==-1){menuElement.appendChild(menuItemElement);}
    else{menuElement.insertBefore(menuItemElement, menuElement.childdren[index]);}
}

function jermRemoveMenuItem(menuElement, menuItemIndex)
{
    if (menuElement==null || menuItemIndex==null)
    {console.warn("jermRemoveMenuItem sytax: jermRemoveMenuItem(menuElement, menuItemIndex)"); return 0;}

    if (menuElement.getAttribute("class").indexOf("jermMenu")<0)
    {console.log("menuElement given is NOT of class \"jermMenu\""); return 0;}

    var children = menuElement.children.length;
    
    if (menuItemIndex<0||menuItemIndex>=children){return 0;}
    
    menuElement.removeChild(menuElement.children[menuItemIndex]);
    if (children==menuElement.children.length)
        // on IE, there is a tendency for .removeChild to actually not remove the child...hehe
    {
        menuElement.children[menuItemIndex].style.display="none";
    }

}

// collapses
function jerm_collapse_clicked_handler()
{
    if (this.jerm_target.style.display=="none"){this.jerm_target.style.display = this.jerm_target.jerm_display;}
    else {this.jerm_target.style.display = "none";}
    
    if (this.jerm_target.jerm_group=="none"){return;}
    
    var group = this.jerm_target.jerm_group;
    
    for (var i=0; i<JERM_COPPASE_DATA[group].length; i++)
    {
        if (JERM_COPPASE_DATA[group][i]==this.jerm_target){continue;}
        JERM_COPPASE_DATA[group][i].style.display = "none";
    }
}

function jermInitCollapse()
{
    var collapses = document.getElementsByClassName("jermCollapse");
    for (var collapse_index=0; collapse_index<collapses.length; collapse_index++)
    {
        var target = collapses[collapse_index].getAttribute("for");
        
        if (target==null)
        {
            console.warn("collapse item number "+(collapse_index+1)+" has no target (<for> attribute)"); 
            continue;
        }
        
        var collapse = document.getElementById(target);
        if (collapse==null)
        {
            console.warn("target<"+target+"> for collapse item number "+(collapse_index+1)+" doesn\'t exist"); 
            continue;
        }
        
        collapse.jerm_display = collapse.style.display;
        
        collapse.jerm_group = collapses[collapse_index].getAttribute("group") || "none";
        
        if (collapse.jerm_group!="none")
        {
            if (JERM_COPPASE_DATA[collapse.jerm_group]==null){JERM_COPPASE_DATA[collapse.jerm_group] = [collapse];}
            else {JERM_COPPASE_DATA[collapse.jerm_group].push(collapse);}
        }
        
        var collapsed = collapses[collapse_index].getAttribute("collapsed") || "true";
        
        if (collapsed!="false"){collapse.style.display="none";}

        collapses[collapse_index].jerm_target = collapse;
        collapses[collapse_index].onclick = jerm_collapse_clicked_handler;
        
    }
}


// tabbed-panel
function jerm_tab_clicked()
{
    for (var i=0; i<this.mom.children.length; i++)
    {
        if (this.mom.children[i]==this)
        {
            this.jerm_tab_target.style.display = "block";
            this.style.fontWeight = "bold";
            this.style.color = this.jerm_active_color;
            this.style.backgroundColor = this.jerm_active_bg;
        }
        else 
        {
            this.mom.children[i].jerm_tab_target.style.display = "none";
            this.mom.children[i].style.fontWeight = "normal";
            this.mom.children[i].style.color = this.jerm_color;
            this.mom.children[i].style.backgroundColor = "";
        }
    }
}

function jermInitTabbedPanel()
{
    var tabbed_panels = document.getElementsByClassName("jermTabbedPanel");
    
    for (var i=0; i<tabbed_panels.length; i++)
    {
        var _tabs = [];
        
        var tabs = tabbed_panels[i].children;
        
        for (var tab_index=0; tab_index<tabs.length; tab_index++)
        {
            if (tabs[tab_index].getAttribute("title")==null)
            {
                console.warn("tabbed-panel number "+(i+1)+"; tab number "+(tab_index+1)+" has no title");
                continue;                
            }

            _tabs.push({tab:tabs[tab_index].getAttribute("title"), target:tabs[tab_index]});
            
        }
        
        if (_tabs.length==0){continue;}

        tabbed_panels[i].style.overflow = "auto";
        
        var active_color = tabbed_panels[i].getAttribute("activeColor") || JERM_TABITEM_ACTIVE_COLOR;
        var active_bg = tabbed_panels[i].getAttribute("activeBg") || JERM_TABITEM_ACTIVE_BG;
        var round_edges = tabbed_panels[i].getAttribute("roundEdges") || "false";
        var borderRadius = tabbed_panels[i].getAttribute("borderRadius") || JERM_TAB_RADIUS;
        
        var titles = document.createElement("div");
        titles.setAttribute("separator","true");
        titles.setAttribute("activeColor",active_color);
        titles.setAttribute("activeBg",active_bg);
        //titles.className += " jermMenu";
        
        titles.style.position = "absolute";
        titles.style.top = "0px";
        titles.style.left = "0px";
        titles.style.width = "99.5%";
        titles.style.overflowX = "auto";
        titles.style.whiteSpace = "nowrap";
        titles.style.height = "20px";
        titles.style.border = "1px solid";
        
        
        for (var tab=0; tab<_tabs.length; tab++)
        {
            var title = document.createElement("input");
            title.setAttribute("type", "button");
            //title.innerHTML = _tabs[tab].tab;
            title.value = _tabs[tab].tab;
            title.jerm_tab_target = _tabs[tab].target;
            title.onclick = jerm_tab_clicked;
            title.jerm_active_color = active_color;
            title.jerm_active_bg = active_bg;
            title.mom = titles;
            
            title.style.float = "left";
            title.style.height = "99%";
            title.jerm_color = title.style.color

            title.setAttribute("class",title.getAttribute("class")+" jermTabbedPanelItem");
            if (round_edges=="true"){title.style.borderRadius=borderRadius;}
            
            titles.appendChild(title);
            
            _tabs[tab].target.style.position = "absolute";
            _tabs[tab].target.style.left = "0px";
            _tabs[tab].target.style.top = "20px";
            _tabs[tab].target.style.width = "99.5%";
            _tabs[tab].target.style.height = "85%";
            _tabs[tab].target.style.border = "1px solid";
            _tabs[tab].target.style.display = "none";
        }
        
        tabbed_panels[i].insertBefore(titles, tabbed_panels[i].children[0]);
        
        var default_tab = tabbed_panels[i].getAttribute("defaultTab");
        if (default_tab!=null)
        {
            var found = false;
            for (var dt=0; dt<_tabs.length; dt++)
            {
                if (_tabs[dt].tab==default_tab)
                {
                    titles.children[dt].onclick();
                    found = true;
                    break;
                }
            }
            if (!found){titles.children[0].onclick();}
        }
        else{titles.children[0].onclick();}
        
    }
}

function jermInsertTab(tabbedPanelElement, tabElement, index, autofocus)
{
    if (tabbedPanelElement==null || tabElement==null)
    {console.warn("jermInsertTab sytax: jermInsertTab(tabbedPanelElement, tabElement, index)"); return 0;}
    if (tabbedPanelElement.class=="")
    {console.warn("jermInsertTab sytax: jermInsertTab(tabbedPanelElement, tabElement, index)"); return 0;}
    if (tabElement.title=="")
    {console.warn("jermInsertTab -> tabElement provided does not have the <title> attribute!"); return 0;}
    
    autofocus = autofocus || false;
    
    if (index==null){index = -1;}

    if (tabbedPanelElement.getAttribute("class").indexOf("jermTabbedPanel")<0)
    {console.log("tabbedPanelElement given is NOT of class \"jermTabbedPanel\""); return 0;}


    tabbedPanelElement.style.overflow = "auto";
    
    var active_color = tabbedPanelElement.getAttribute("activeColor") || JERM_TABITEM_ACTIVE_COLOR;
    var active_bg = tabbedPanelElement.getAttribute("activeBg") || JERM_TABITEM_ACTIVE_BG;
    var round_edges = tabbedPanelElement.getAttribute("roundEdges") || "false";
    var borderRadius = tabbedPanelElement.getAttribute("borderRadius") || JERM_TAB_RADIUS;
        
        
    var title = document.createElement("input");
    title.setAttribute("type", "button");
    //title.innerHTML = tabElement.title;
    title.value = tabElement.title;
    title.jerm_tab_target = tabElement;
    title.onclick = jerm_tab_clicked;
    title.jerm_active_color = active_color;
    title.jerm_active_bg = active_bg;
    title.mom = tabbedPanelElement.children[0];

    title.setAttribute("class",title.getAttribute("class")+" jermTabbedPanelItem");
    if (round_edges=="true"){title.style.borderRadius=borderRadius;}
    
    title.style.float = "left";
    title.style.height = "99%";
    title.jerm_color = title.style.color
    
    if (index==-1){tabbedPanelElement.children[0].appendChild(title);}
    else {tabbedPanelElement.children[0].insertBefore(title, tabbedPanelElement.children[0].children[index]);}
    
    
    tabElement.style.position = "absolute";
    tabElement.style.left = "0px";
    tabElement.style.top = "20px";
    tabElement.style.width = "99.5%";
    tabElement.style.height = "85%";
    tabElement.style.border = "1px solid";
    tabElement.style.display = "none";
    
    if (index==-1){tabbedPanelElement.appendChild(tabElement);}
    else
    {
        // index+1(below) as the first element of the  tabbedPanel is always the tabs-titles div
        tabbedPanelElement.insertBefore(tabElement, tabbedPanelElement.children[index+1]);
    }
    
    if(autofocus){title.onclick();}
    
}

function jermRemoveTab(tabbedPanelElement, TabIndex)
{
    if (tabbedPanelElement==null || TabIndex==null)
    {console.warn("jermRemoveTab sytax: jermRemoveTab(tabbedPanelElement, TabIndex)"); return 0;}

    if (tabbedPanelElement.getAttribute("class").indexOf("jermTabbedPanel")<0)
    {console.log("tabbedPanelElement given is NOT of class \"jermTabbedPanel\""); return 0;}

    // the tab
    var children = tabbedPanelElement.children[0].children.length;

    if (children==0){return 0;}
    if (TabIndex<0||TabIndex>=children){return 0;}

    var target = tabbedPanelElement.children[0].children[TabIndex].jerm_tab_target;
    tabbedPanelElement.children[0].removeChild(tabbedPanelElement.children[0].children[TabIndex]);
    if (children==tabbedPanelElement.children[0].children.length)
        // on IE, there is a tendency for .removeChild to actually not remove the child...hehe
    {
        tabbedPanelElement.children[0].children[TabIndex].style.display="none";
    }

    // the tab content...
    var children = tabbedPanelElement.children.length;
    tabbedPanelElement.removeChild(target); // +1 bcoz first child is the tab-titles div
    if (children==tabbedPanelElement.children.length)
        // on IE, there is a tendency for .removeChild to actually not remove the child...hehe
    {
        target.style.display="none";
    }


    var children = tabbedPanelElement.children.length;
    if (children>1) {tabbedPanelElement.children[0].children[0].onclick();}

}

// jermGause custom widget...
function jermGaugeProgress(value)
{
    value = value || this.increment;
    
    value = this.value + value;
    
    value = (this.loop && (value>this.maxValue)) ? this.minValue : value;
        
    this.setValue(value);
}
function jermGaugeShowLabel(bool)
{
    bool = bool || true;
    
    if ((typeof bool)!="boolean") {bool=true;}

    if (bool) {this.labelElement.style.diplay = "block";}
    else {this.labelElement.style.diplay = "none";}
}
function jermGaugeBorderRadius(radius)
{
    radius = radius || "0px";
    this.gaugeContainer.style.borderRadius = radius;
    this.barElement.style.borderRadius = radius;
}
function jermGaugeValue(value)
{
    if (value==null){return 0;}
    value = (value>this.maxValue) ? this.maxValue : value;
    
    this.value = value;
    
    if (this.orientation=="vertical")
    {
        this.barElement.style.height = (((this.value-this.minValue)/(this.maxValue-this.minValue))*100)+"%";
    }
    else{this.barElement.style.width = (((this.value-this.minValue)/(this.maxValue-this.minValue))*100)+"%";}

    if (this.label.show)
    {
        if (this.label.percentage)
        {
            this.labelElement.innerHTML = (((this.value-this.minValue)/(this.maxValue-this.minValue))*100).toFixed(this.label.dp)+"%";
        }
        else{this.labelElement.innerHTML = value + this.label.unit; }        

        this.setLabelColor(this.label.color); /* its possible that this value was changed through 
                                                 javascript from its initial value YET gauge.label.levels==[]!*/
    }
    
    // now change bar and label color accordingly...
    if (this.label.show && (this.label.levels.length>0))
    {
        var label_level_found = false;
        for (var i=0; i<this.label.levels.length; i++)
        {
            if (this.value<=this.label.levels[i][0])
            {
                this.setLabelColor(this.label.levels[i][1]);
                label_level_found = true;
                break;
            }
        }        
        if (!label_level_found) {this.setLabelColor(this.label.color); }
    }
    if (this.bar.levels.length>0)
    {
        var bar_level_found = false;
        for (var i=0; i<this.bar.levels.length; i++)
        {
            if (this.value<=this.bar.levels[i][0])
            {
                this.setBarColor(this.bar.levels[i][1], this.bar.levels[i][2]);
                bar_level_found = true;
                break;
            }
        }        
        if (!bar_level_found) {this.setLabelColor(this.bar.color[0], this.bar.color[1]); }
    }
    
}
function jermGaugeColor(color1, color2)
{
    if (color1==null){return 0;}
    
    if (color2==null){color2=color1;}
    
    this.gaugeContainer.style.backgroundColor = color1;

    if (this.orientation=="horizontal")
    {
        this.gaugeContainer.style.background = "linear-gradient(to right, "+color1+", "+color2+")";        
    }
    else
    {
        this.gaugeContainer.style.background = "linear-gradient(to top, "+color1+", "+color2+")";        
    }
}
function jermGaugeBarColor(color1, color2)
{
    if (color1==null){return 0;}
    
    if (color2==null){color2=color1;}

    this.barElement.style.backgroundColor = color1; // incase browser doesn support gradient colors...

    if (this.orientation=="horizontal")
    {
        this.barElement.style.background = "linear-gradient(to right, "+color1+", "+color2+")";        
    }
    else
    {
        this.barElement.style.background = "linear-gradient(to top, "+color1+", "+color2+")";        
    }
}
function jermGaugeLabelColor(color)
{
    if (color==null){return 0;}    
    this.labelElement.style.color = color;
}
function jermGaugeBorderColor(color)
{
    if (color==null){return 0;}    
    this.gaugeContainer.style.borderColor = color;
}

function jermGauge(data)
    /*
        returns jermGauge Widget. to edit properties;
        
        parent elememnt: gauge.mom
        gauge container: gauge.gaugeContainer (contains the bar and label...)
        bar: gauge.barElement
        label: gauge.labelElement

    NB: you wann set the dimensions(width n height) of the containing element in pixels!

    */
{
/*
    data={
        widget: // id of the widget(div) to contain the jermGauge
        orientation:  // horizontal||vertical
        borderRadius: // css border-radius; also used for the bar
        minValue: // minimum value
        maxValue: // maximum value        
        increment: // if gause.progress(value) is called without argument, this value is used
        loop: // bool; if value>maxValue and gauge.progress is called, value->minValue         
        value: // initial value...  
        color: // string(#hex) or array(["#hex-gradient-from", "#hex-gradient-to"])
        
        label: { // progress label
                show: // bool
                position: // below, top, center, left, right
                color: // hex color
                percentage: // bool; display %([max-value/max-min]*100%) not real value
                dp: // how many decimal places to use (if percentage==true)
                unit: // symbol(s) to be placed just after the value (just like % for percentages!)
                
                levels:[ // change attributes at given levels 
                    [LEVEL1,COLOR], // color(COLOR) when value<=LEVEL1
                    [LEVEL2,COLOR2], // color(COLOR2) when value<=LEVEL2
                    ...
                    [LEVELN,COLORN], // color(COLORN) when value<=LEVELN

                    // else(value>LEVELN), use default label-color settings
                ]
            },
            
        bar:{ // progress/gauge bar
                color:[COLOR_GRADIENT_FROM, COLOR_GRADIENT_TO], // if two values given, gradient color is used
                
                levels:[ // change attributes at given levels 
                    // the COLOR_GRADIENT_TO can be left out to use a flat color instead of a gradient
                    [LEVEL1,COLOR_GRADIENT_FROM, COLOR_GRADIENT_TO]
                    [LEVEL2,COLOR_GRADIENT_FROM2, COLOR_GRADIENT_TO2]
                    ...
                    [LEVELN,COLOR_GRADIENT_FROMN, COLOR_GRADIENT_TON]

                    // else(value>LEVELN), use default bar-color settings
                 ],
            },
                      
        });
*/

    // polish the object provided to create a new jermGauge object/widget
    try{ 
        if (data.widget==null){console.warn("invalid data provided for jermGauge! NO <widget> attribute found"); return this;}
    }
    catch(e){console.warn("invalid data provided for jermGauge! NO <widget> attribute found"); return this;}

    if (document.getElementById(data.widget)==null){console.warn("no element found with ID <"+data.widget+">, jermGauge-widget construction dumped!"); return 0;}

    data.orientation = data.orientation || "horizontal";

    data.borderRadius = data.borderRadius || "0px";
    data.borderColor = data.borderColor || "#aaa";
    data.minValue = data.minValue || 0;
    data.maxValue = data.maxValue || 100;
    data.increment = data.increment || 1;
    data.loop = (data.loop==null) ? false : ((typeof data.loop)=="boolean" ? data.loop : false);

    data.value = data.value || 0;
    data.color = data.color || ["#ddd", "#eee"];

    data.label = data.label || {};
    data.label.show = (data.label.show==null) ? false : ((typeof data.label.show)=="boolean" ? data.label.show : false);
    data.label.position = data.label.position || "center";
    data.label.color = data.label.color || "#666";
    data.label.percentage = (data.label.percentage==null) ? true : ((typeof data.label.percentage)=="boolean" ? data.label.percentage : true);
    data.label.dp = data.label.dp || 0;
    data.label.levels = data.label.levels || [];
    data.label.unit = data.label.unit || "";

    data.bar = data.bar || {};
    data.bar.color = data.bar.color || ["#444", "#ddd"];
    data.bar.levels = data.bar.levels || [];

    // methods
    data.progress = jermGaugeProgress;
    data.showLabel = jermGaugeShowLabel;
    data.setBorderRadius = jermGaugeBorderRadius;
    data.setValue = jermGaugeValue;
    data.setColor = jermGaugeColor;
    data.setLabelColor = jermGaugeLabelColor;
    data.setBarColor = jermGaugeBarColor;
    data.setBorderColor = jermGaugeBorderColor;


    // gauge.mom
    data.mom = document.getElementById(data.widget);
    
    // gauge.gaugeContainer
    data.gaugeContainer = document.createElement("div");
    data.gaugeContainer.style.position = "absolute";
    data.gaugeContainer.style.left = "0px";
    data.gaugeContainer.style.top = "0px";
    data.gaugeContainer.style.width = "100%";
    data.gaugeContainer.style.height = "100%";
    data.gaugeContainer.style.border = "1px solid";
    data.gaugeContainer.style.borderRadius = data.borderRadius;
    data.gaugeContainer.style.borderColor = data.borderColor;
    

    if ((typeof data.color)=="string")
    {
        data.gaugeContainer.style.backgroundColor = data.color;
    }
    else
    {
        data.gaugeContainer.style.background = "linear-gradient(to right, "+data.color[0]+", "+data.color[1]+")";        
    }

    // gauge.bar
    data.barElement = document.createElement("div");
    data.barElement.style.position = "absolute";
    data.barElement.style.left = "0px";
    data.barElement.style.border = "0px solid";
    data.barElement.style.borderRadius = data.borderRadius;

    if (data.orientation=="horizontal")
    {
        data.barElement.style.width = (((data.value-data.minValue)/(data.maxValue-data.minValue))*100)+"%";
        data.barElement.style.height = "100%";
        data.barElement.style.top = "0px";
    }
    else
    {
        data.barElement.style.height = (((data.value-data.minValue)/(data.maxValue-data.minValue))*100)+"%";
        data.barElement.style.width = "100%";
        data.barElement.style.bottom = "0px";
    }

    // gauge.labelElement
    data.labelElement = document.createElement("div");
    data.labelElement.style.position = "absolute";
    data.labelElement.style.left = "0px";
    data.labelElement.style.textAlign = "center";
    data.labelElement.style.fontSize = "80%";
    data.labelElement.style.height = "25px";


    if (data.label.position=="center") 
    {
        if (data.orientation=="horizontal"){data.labelElement.style.left = "48%";}
        else{data.labelElement.style.top = "48%";}
    }
    else if ((data.label.position=="bottom") || (data.labelElement.position=="left")) 
    {
        if (data.orientation!="horizontal"){data.labelElement.style.bottom = "0px";}
    }
    else if ((data.label.position=="top") || (data.labelElement.position=="right")) 
    {
        if (data.orientation=="horizontal"){data.labelElement.style.right = "100%";}
        else{data.labelElement.style.top = "0px";}
    }

    if (data.orientation=="horizontal"){data.labelElement.style.lineHeight = data.mom.style.height;}
    else {data.labelElement.style.margin = "auto"; data.labelElement.style.width="100%";}

    data.gaugeContainer.appendChild(data.barElement);
    data.gaugeContainer.appendChild(data.labelElement);
    data.mom.appendChild(data.gaugeContainer);

    // effect any changes in the bar/label due to the initial settings given...
    data.showLabel(data.label.show);
    data.setLabelColor(data.label.color);
    if ((typeof data.bar.color)=="object"){data.setBarColor(data.bar.color[0], data.bar.color[1]);}
    else{data.setBarColor(data.bar.color);}
    data.setValue(data.value);
 
    return data; 
}

// jermInitSwitch
function jermSwitchHandler()
{
    var handler = new Function(JERM_HANDLER_STR.format(this.activeHandler))
}
function jermOverSwitchValue()
{
    this.style.cursor = "pointer";
    this.style.background = this.hoverColor[0];
    this.style.background = "linear-gradient(to top, "+this.hoverColor[0]+", "+this.hoverColor[1]+")";
    this.style.opacity = this.hoverOpacity;

}
function jermLeaveSwitchValue()
{
    this.style.cursor = "";

    if (this.mom.switchValue==this.innerHTML)
    {
        this.style.background = this.activeColor[0];
        this.style.background = "linear-gradient(to top, "+this.activeColor[0]+", "+this.activeColor[1]+")";
    }
    else
    {
        this.style.background = this.normalColor[0];
        this.style.background = "linear-gradient(to top, "+this.normalColor[0]+", "+this.normalColor[1]+")";
    }

    this.style.borderColor = this.borderColor;
    this.style.opacity = "1";

}
function jermSwitchClicked()
{
    if (this.innerHTML==this.mom.switchValue){return 0;}
    
    var lastValue = this.mom.switchValue;

    for (var i=0; i<this.mom.children.length; i++)
    {
        if (this.mom.children[i].innerHTML==lastValue)
            {
                this.mom.children[i].style.fontWeight = "normal";
                this.mom.children[i].style.color = this.normalTextColor;
                this.mom.children[i].style.background = this.normalColor[0];
                this.mom.children[i].style.background = "linear-gradient(to top, "+this.normalColor[0]+", "+this.normalColor[1]+")";
            
                break;
            }
    }

    this.style.fontWeight = "bold";
    this.style.color = this.activeTextColor;
    this.style.background = this.activeColor[0];
    this.style.background = "linear-gradient(to top, "+this.activeColor[0]+", "+this.activeColor[1]+")";

    this.style.borderColor = this.borderColor;
    this.style.opacity = "1";
    
    this.mom.switchValue = this.innerHTML;

    // emit jermswtich event
    // NB: the eventHandler takes 2 arguments; lastVaue and currentvalue
    eval(this.activeHandler+"(lastValue, this.mom.switchValue)");
}

function jermInitSwitch()
{
    var switches = document.getElementsByClassName("jermSwitch");

/*
    borderRadius="15px"
    hoverColor="#666 #bbb" 
    hoverOpacity="0.6" 
    activeColor="#666 #333" 
    normalColor="#333 #666"
    activeTextColor="#fff" 
    normalTextColor="#666" 
    activeHandler="logState" -----> this will be givn two arguments; <lastValue/state> and <currentValue/state>
    states="one two three four ..."
    value = ""

    NB: you wann set the HEIGHT of the containing element in pixels!
        also, the mom MUST have an id(i used to get the value whenever it changes...)!
*/

    for (var i=0; i<switches.length; i++)
    {
        var states = switches[i].getAttribute("states") || "Off On";
        var borderRadius = switches[i].getAttribute("borderRadius") || "20px";
        var borderColor = switches[i].getAttribute("borderColor") || "#aaa";
        var hoverColor = switches[i].getAttribute("hoverColor") || "#888 #333";
        var hoverOpacity = switches[i].getAttribute("hoverOpacity") || "1";
        var activeColor = switches[i].getAttribute("activeColor") || "#666 #bbb";
        var normalColor = switches[i].getAttribute("normalColor") || "#333 #888";
        var activeTextColor = switches[i].getAttribute("activeTextColor") || "#fff";
        var normalTextColor = switches[i].getAttribute("normalTextColor") || "#111";
        var activeHandler = switches[i].getAttribute("activeHandler") || JERM_HANDLER;

        if (activeHandler.indexOf("(")>=0){activeHandler = activeHandler.split("(")[0];}

        var mom = switches[i].getAttribute("id")
        if (mom==null){console.warn("JermSwitch Element number "+(i+1)+" has no id, operation dumped!"); continue;}
        mom = document.getElementById(mom);
        
        //states
        states = states.split(" ");
        if (states.length<2){console.warn("JermSwitch Element number "+(i+1)+" has less than 2 states, operation dumped!"); continue;}

        var switchValue = switches[i].getAttribute("value") || states[0];
        mom.switchValue = switchValue;
        
        switchValueInStates = false;
        for (var check=0; check<states.length; check++)
        {
            if (switchValue==states[check]){switchValueInStates=true; break;}
        }
        if(!switchValueInStates){console.warn("JermSwitch Element number "+(i+1)+"; value("+switchValue+") not in states("+states+"), operation dumped!"); continue;}

        hoverOpacity = parseFloat(hoverOpacity);
        if (isNaN(hoverOpacity)) {console.warn("JermSwitch Element numer "+(i+1)+" has an invalid hoverOpacity, operation dumped!"); continue;}

        // do some necessary processing...
        borderRadius = borderRadius.split(" ")[0]; // only need one value...
        hoverColor = hoverColor.split(" ").length==2 ? hoverColor.split(" "): [hoverColor, hoverColor];
        activeColor = activeColor.split(" ").length==2 ? activeColor.split(" "): [activeColor, activeColor];
        normalColor = normalColor.split(" ").length==2 ? normalColor.split(" "): [normalColor, normalColor];
        activeTextColor = activeTextColor.split(" ")[0]; // only need one value...
        normalTextColor = normalTextColor.split(" ")[0]; // only need one value...
        
        for(var state=0; state<states.length; state++)
        {
            var jswitch = document.createElement("div");
            jswitch.innerHTML = states[state];

            jswitch.style.padding = "0px 2px 0px 2px";
            jswitch.style.textAlign = "center";
            jswitch.style.float = "left";
            jswitch.style.height = "100%";

            jswitch.style.borderTop = "1px solid";
            jswitch.style.borderBottom = "1px solid";

            jswitch.style.lineHeight = (switches[i]).style.height;
            
            if (states[state]==switchValue)
            {
                jswitch.style.fontWeight = "bold";
                jswitch.style.color = activeTextColor;
                jswitch.style.background = activeColor[0];
                jswitch.style.background = "linear-gradient(to top, "+activeColor[0]+", "+activeColor[1]+")";
            }
            else
            {
                jswitch.style.color = normalTextColor;
                jswitch.style.background = normalColor[0];
                jswitch.style.background = "linear-gradient(to top, "+normalColor[0]+", "+normalColor[1]+")";
            }
            
            if (state==0)
            {
                jswitch.style.borderLeft = "1px solid";
                jswitch.style.borderRadius = borderRadius+" 0px 0px "+borderRadius;
            }
            else if (state==(states.length-1))
            {
                jswitch.style.border = "1px solid";
                jswitch.style.borderRadius = "0px "+borderRadius+" "+borderRadius+" 0px";
            }
            
            if (state>0){jswitch.style.borderLeft = "1px solid";}

            jswitch.style.borderColor = borderColor; // you wann set this after setting the color property
                                                     // because border-color changes as soon as the color property changes

            jswitch.mom = mom;

            jswitch.hoverColor = hoverColor;
            jswitch.activeColor = activeColor;
            jswitch.normalColor = normalColor;
            jswitch.activeTextColor = activeTextColor;
            jswitch.normalTextColor = normalTextColor;
            jswitch.borderColor = borderColor;
            jswitch.hoverOpacity = hoverOpacity;

            jswitch.onmouseenter = jermOverSwitchValue;
            jswitch.onmouseleave = jermLeaveSwitchValue;

            jswitch.onclick = jermSwitchClicked;

            jswitch.activeHandler = activeHandler;

            switches[i].appendChild(jswitch);
        }
    }
}



// jerm-blink...
function jermBlinkShow(el)
{
    if(el.blinkTimeout>=0)
    {
        el.blinkingTime += el.showTime;
        el.blinking = (el.blinkingTime<=el.blinkTimeout) ? true : false;
    }

    //if (!el.blinking){el.style.display=el.nonBlinkDisplay; return 0;}
    if (!el.blinking){el.style.visibility="visible"; return 0;}
    
    //el.style.display = "none";
    el.style.visibility = "hidden";
    setTimeout(jermBlinkHide, el.hideTime*1000, el);
}
function jermBlinkHide(el)
{
    if(el.blinkTimeout>=0)
    {
        el.blinkingTime += el.hideTime;
        el.blinking = (el.blinkingTime<=el.blinkTimeout) ? true : false;
    }

    //if (!el.blinking){el.style.display=el.nonBlinkDisplay; return 0;}
    if (!el.blinking){el.style.visibility="visible"; return 0;}
    
    //el.style.display = el.nonBlinkDisplay;
    el.style.visibility = "visible";
    setTimeout(jermBlinkShow, el.showTime*1000, el);
}

function jermBlink(element, show_time, hide_time, timeout)
    // blink an element...each blink cycle is composed of 2 activities; show the element, then hide the element...
    // show_time, hide_time and timeout are all in seconds...
{
    if (arguments.length==0){console.warn("jermBlink: syntax is jermBlink(element, show_time=.5, hide_time=.5, timeout=-1) but no args given, operation dumped!"); return 0;}
    if ((typeof element)=="string"){element = document.getElementById(element);}
    if (element==null) {console.warn("jermBlink: syntax is jermBlink(element, show_time=.5, hide_time=.5, timeout=-1). invalid element given, operation dumped!"); return 0;}

    show_time = show_time || 0.15;
    hide_time = hide_time || 0.15;
    timeout = timeout || -1; // blink indefinetly

    if (isNaN(show_time) || isNaN(hide_time) || isNaN(timeout))
    {
        console.warn("invalid show_time or hide_time given for jermBlink; using defaults(0.5)");

        show_time = isNaN(show_time) ? 0.15 : show_time;
        hide_time = isNaN(hide_time) ? 0.15 : hide_time;
        timeout = isNaN(timeout) ? -1 : timeout;
    }

    //element.nonBlinkDisplay = element.style.display; // you wanna preserve this display, trust me    
    element.blinking = true; // set this to false to terminate the blinking effect... 

    element.showTime = show_time;
    element.hideTime = hide_time;
    element.blinkTimeout = timeout;
    element.blinkingTime = 0;

    setTimeout(jermBlinkShow, element.showTime*1000, element);
}

// init all jermlib custom elements/classes...
function jermlibInitAll()
{
    jermInitCollapse();
    jermInitTabbedPanel();
    jermInitMenu(); // tabbed_panels contain menus so you wanna init them first...
    jermInitSwitch(); 

    jermBlink("gauge2", null, null, 10);
    //setTimeout(function(){document.getElementById("gauge2").blinking = false;}, 10000);
}
