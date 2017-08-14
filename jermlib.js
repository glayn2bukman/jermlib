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
            if (round_edges=="true"){title.style.borderRadius="20px";}
            
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
    if (round_edges=="true"){title.style.borderRadius="20px";}
    
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


// init all jermlib custom elements/classes...
function jermlibInitAll()
{
    jermInitCollapse();
    jermInitTabbedPanel();
    jermInitMenu(); // tabbed_panels contain menus so you wanna init them first...
}
