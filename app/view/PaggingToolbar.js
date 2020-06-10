Ext.define('Custom.view.PaggingToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Ext.toolbar.TextItem',
        'Ext.form.field.Number'
    ],
    xtype: 'PaggingToolbar',
    mixins: [
        'Ext.util.StoreHolder'
    ],
    
    lastPageSize: 100,
    displayInfo: false,

    prependButtons: false,

    displayMsg : 'Displaying {0} - {1} of {2}',

    emptyMsg : 'No data to display',

    beforePageText : 'Page',
   
    afterPageText : 'of {0}',
   
    firstText : 'First Page',
    
    prevText : 'Previous Page',
    
    nextText : 'Next Page',
    
    lastText : 'Last Page',
    
    refreshText : 'Refresh',
    
    inputItemWidth : 30,
    
    screenReady:false,

    

    emptyPageData: {
        total: 0,
        currentPage: 0,
        pageCount: 0,
        toRecord: 0,
        fromRecord: 0
    },

   
    defaultBindProperty: 'store',

    
    getPagingItems: function() {
        var me = this,
            inputListeners = {
                scope: me,
                blur: me.onPagingBlur
            };
        
        inputListeners[Ext.supports.SpecialKeyDownRepeat ? 'keydown' : 'keypress'] = me.onPagingKeyDown;
        
        return [];
    },

    initComponent : function(){
        var me = this,
            userItems = me.items || me.buttons || [],
            pagingItems;

        me.bindStore(me.store || 'ext-empty-store', true);
        pagingItems = me.getPagingItems();
        
        if (me.prependButtons) {
            me.items = userItems.concat(pagingItems);
        } else {
           // me.items = pagingItems.concat(userItems);
        }
        delete me.buttons;

        if (me.displayInfo) {
            //me.items.push('->');
            //me.items.push({xtype: 'tbtext', itemId: 'displayItem'});
        }

        me.callParent();
    },
    
    beforeRender: function() {
        this.callParent(arguments);
        this.updateBarInfo();  
    },

    updateBarInfo: function() {
        var me = this;
        if (!me.store.isLoading()) {
            me.calledInternal = true;
            me.onLoad();    
            me.calledInternal = false;
        }  
    },
    
    // @private
    updateInfo : function(){ //update here if count is zero
        var me = this,
            displayItem = me.child('#displayItem'),
            store = me.store,
            pageData = me.getPageData(),
            count, msg;

        if (displayItem) {
            count = store.getCount();
            if (count === 0) {
                msg = me.emptyMsg;  
            } else {
                msg = Ext.String.format(
                    me.displayMsg,
                    pageData.fromRecord,
                    pageData.toRecord,
                    pageData.total
                );
            }
            displayItem.setText(msg);
        }
    },

    // @private
    onLoad : function(){ 
        var me = this,
            pageData,
            currPage,
            pageCount,
            afterText,
            count,
            isEmpty,
            item;

        count = me.store.getCount();
        isEmpty = count === 0;
        if (!isEmpty) {
            pageData = me.getPageData();
            currPage = pageData.currentPage;
            pageCount = pageData.pageCount;
        } else {
            currPage = 0;
            pageCount = 0;
            afterText = Ext.String.format(me.afterPageText, 0);
            return true;
        }
        
        Ext.suspendLayouts();
        
        item = me.addBtn();
         
        me.removeAll();
        
        
        me.add({ xtype: 'button', itemId: 'btnTool-prev-'+currPage, scope: me, text: 'prev', handler: me.movePrevious , enableToggle: true, toggleGroup: me, hidden:currPage===1?true:false });
        
        if(currPage>4){
            
            me.add({ xtype: 'button', itemId: 'btnTool-1', scope: me, text: '1', handler: me.btnHandler, enableToggle: true, toggleGroup: me });
        }
        
       
        if(currPage>4){
           me.add({ xtype: 'tbtext', text: '......', scope: me });
        }
        
        for (var y = 0; y < item.start.length; y++) {
           
            me.add({ xtype: 'button', itemId: 'btnTool-'+item.start[y].toString(), scope: me, text: item.start[y], handler: me.btnHandler, enableToggle: true, toggleGroup: me });
        }
        

            
            if ((currPage + 1) === pageCount) {
            //me.add({xtype: 'tbtext', text: '......', scope: me});
        } else if ((currPage + 2) === pageCount) {
            //me.add({xtype: 'tbtext', text: '......', scope: me});
        } else if ((currPage + 3) === pageCount) {
            //me.add({xtype: 'tbtext', text: '......', scope: me});
        } else if(currPage===pageCount){
            
        }else{
            me.add({xtype: 'tbtext', text: '......', scope: me});
        }
        
        
        me.add({ xtype: 'button', itemId: 'btnTool-last-'+pageCount, scope: me, text: pageCount, handler: me.moveLast, enableToggle: true, toggleGroup: me});
        
        
        me.add({ xtype: 'button', itemId: 'btnTool-next-'+currPage, scope: me, text: 'next', handler: me.moveNext, enableToggle: true, toggleGroup: me,hidden:currPage===pageCount?true:false });
       

        me.add('->');
        
        var totalPageSize=me.store.pageSize;
        
        if(totalPageSize < 90){
            me.lastPageSize=totalPageSize;
        }
        
        if (totalPageSize === 10 ) {
            me.add({xtype: 'button', itemId: 'btnTool-recordOnPage-' + totalPageSize, scope: me, text: totalPageSize, handler: me.changePageSize, enableToggle: true, toggleGroup: me});
            me.add({xtype: 'button', itemId: 'btnTool-recordOnPage-' + (totalPageSize + 10), scope: me, text: totalPageSize + 10, handler: me.changePageSize, enableToggle: true, toggleGroup: me});
            me.add({xtype: 'button', itemId: 'btnTool-recordOnPage-' + (totalPageSize + 20), scope: me, text: totalPageSize + 20, handler: me.changePageSize, enableToggle: true, toggleGroup: me});
        } else if(totalPageSize > 90){
            var lastPageSize=me.lastPageSize;
            me.add({xtype: 'button', itemId: 'btnTool-recordOnPage-' + lastPageSize, scope: me, text: lastPageSize, handler: me.changePageSize, enableToggle: true, toggleGroup: me});
            me.add({xtype: 'button', itemId: 'btnTool-recordOnPage-' + (lastPageSize + 10), scope: me, text: lastPageSize+10, handler: me.changePageSize, enableToggle: true, toggleGroup: me});
            me.add({xtype: 'button', itemId: 'btnTool-recordOnPage-' + (lastPageSize + 20), scope: me, text: lastPageSize + 20, handler: me.changePageSize, enableToggle: true, toggleGroup: me});
        }else{
            me.add({xtype: 'button', itemId: 'btnTool-recordOnPage-' + (totalPageSize - 10), scope: me, text: totalPageSize - 10, handler: me.changePageSize, enableToggle: true, toggleGroup: me});
            me.add({xtype: 'button', itemId: 'btnTool-recordOnPage-' + totalPageSize, scope: me, text: totalPageSize, handler: me.changePageSize, enableToggle: true, toggleGroup: me});
            me.add({xtype: 'button', itemId: 'btnTool-recordOnPage-' + (totalPageSize + 10), scope: me, text: totalPageSize + 10, handler: me.changePageSize, enableToggle: true, toggleGroup: me});
        }
        
        me.add({ xtype: 'tbtext', text:'per page' });
        me.add({ xtype: 'tbtext', itemId: 'displayItem' });
        me.doLayout();
        
        me.btnpress(currPage,pageCount);
        
        me.pageCountBtnPress(totalPageSize);

       // me.updateInfo();

        Ext.resumeLayouts(true);

        if (me.rendered) {
            me.fireEvent('change', me, pageData);
        };
         
    },
    
    
    btnpress: function (curntpage,pageCount) {
        var me = this;
        
        if (pageCount === curntpage) {
            var curntpage = "btnTool-last-" + pageCount;

            if (me.getComponent(curntpage)) {
                me.getComponent(curntpage).pressed = true;
            }
            
        } else {
            var curntpage = "btnTool-" + curntpage;

            if (me.getComponent(curntpage)) {
                me.getComponent(curntpage).pressed = true;
            }

        }
    },
    
    pageCountBtnPress: function (count) {
        var me = this;
        var pageCountBtn = "btnTool-recordOnPage-" + count;
        if (me.getComponent(pageCountBtn) && count !== 0) {
            me.getComponent(pageCountBtn).pressed = true;
        }
    },
    addBtn: function () {
        var me = this,
        getPage = me.getPageData(),
        currnPage = getPage.currentPage,
        PageCount = getPage.pageCount;
        var startArr = [];
        
        
        if (currnPage < 5) {
            for (var i = 1; i < 6; i++) {
                startArr.push(i);
            }
        } else if (currnPage === PageCount) {

            var pageNumber = parseInt(currnPage);
            startArr.push(pageNumber - 4);

            pageNumber = parseInt(currnPage);
            startArr.push(pageNumber - 3);

            pageNumber = parseInt(currnPage);
            startArr.push(pageNumber - 2);
            pageNumber = parseInt(currnPage);
            startArr.push(pageNumber - 1);
        } else {


            var pageNumber = parseInt(currnPage);
            startArr.push(pageNumber - 2);

            pageNumber = parseInt(currnPage);
            startArr.push(pageNumber - 1);
            
            
            if ((pageNumber + 1) === PageCount) {
                startArr.push(currnPage);
            } else if ((pageNumber + 2) === PageCount) {
                startArr.push(currnPage);
                startArr.push(parseInt(currnPage)+1);
            } else if ((pageNumber + 3) === PageCount) {
                startArr.push(currnPage);
                startArr.push(parseInt(currnPage)+1);
                startArr.push(parseInt(currnPage)+2);
                
                
            } else {
                startArr.push(currnPage);
                pageNumber = parseInt(currnPage);
                startArr.push(pageNumber + 1);
                pageNumber = parseInt(currnPage);
                startArr.push(pageNumber + 2);
            }
        }
        
        return {
            start: startArr
        };
    },
    
    setChildDisabled: function(selector, disabled){
        var item = this.child(selector);
        if (item) {
            item.setDisabled(disabled);
        }
    },

    // @private
    getPageData : function(){
        var store = this.store,
            totalCount = store.getTotalCount();

        return {
            total : totalCount,
            currentPage : store.currentPage,
            pageCount: Math.ceil(totalCount / store.pageSize),
            fromRecord: ((store.currentPage - 1) * store.pageSize) + 1,
            toRecord: Math.min(store.currentPage * store.pageSize, totalCount)

        };
    },

    // @private
    onLoadError : function(){
        this.setChildDisabled('#refresh', false);
    },
    
    getInputItem: function(){
        return this.child('#inputItem');
    },

    // @private
    readPageFromInput : function(pageData){
        var inputItem = this.getInputItem(),
            pageNum = false,
            v;

        if (inputItem) {
            v = inputItem.getValue();
            pageNum = parseInt(v, 10);
            if (!v || isNaN(pageNum)) {
                inputItem.setValue(pageData.currentPage);
                return false;
            }
        }
        return pageNum;
    },

    // @private
    onPagingBlur : function(e){
        var inputItem = this.getInputItem(),
            curPage;
            
        if (inputItem) {
            curPage = this.getPageData().currentPage;
            inputItem.setValue(curPage);
        }
    },

    // @private
    onPagingKeyDown : function(field, e){
        this.processKeyEvent(field, e);
    },
    
    processKeyEvent: function(field, e) {
        var me = this,
            key = e.getKey(),
            pageData = me.getPageData(),
            increment = e.shiftKey ? 10 : 1,
            pageNum;

        if (key === e.RETURN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum !== false) {
                pageNum = Math.min(Math.max(1, pageNum), pageData.pageCount);
                if (pageNum !== pageData.currentPage && me.fireEvent('beforechange', me, pageNum) !== false) {
                    me.store.loadPage(pageNum);
                }
            }
        } else if (key === e.HOME || key === e.END) {
            e.stopEvent();
            pageNum = key === e.HOME ? 1 : pageData.pageCount;
            field.setValue(pageNum);
        } else if (key === e.UP || key === e.PAGE_UP || key === e.DOWN || key === e.PAGE_DOWN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum) {
                if (key === e.DOWN || key === e.PAGE_DOWN) {
                    increment *= -1;
                }
                pageNum += increment;
                if (pageNum >= 1 && pageNum <= pageData.pageCount) {
                    field.setValue(pageNum);
                }
            }
        }    
    },

    // @private
    beforeLoad : function() {
        this.setChildDisabled('#refresh', true);
    },
    
    btnHandler: function (id) {
        var me = this,
                pageNo;
        pageNo = id.itemId;
        me.screenReady=true;
        pageNo=pageNo.split('-');
        if (this.fireEvent('beforechange', me, parseInt(pageNo[1])) !== false) {
            me.store.loadPage(parseInt(pageNo[1]));

        }
    },
   
    doRefresh : function(){
        var me = this,
            store = me.store,
            current = store.currentPage;

        if (me.fireEvent('beforechange', me, current) !== false) {
            store.loadPage(current);
            return true;
        }
        return false;
    },
    
    getStoreListeners: function() {
        return {
            beforeload: this.beforeLoad,
            load: this.onLoad,
            exception: this.onLoadError
        };
    },

    onBindStore: function() {
        if (this.rendered) {
            this.updateBarInfo();
        }
    },

    // @private
    onDestroy : function(){
        this.bindStore(null);
        this.callParent();
    },
    
    moveNext : function(){
        var me = this,
            store = me.store,
            total = me.getPageData().pageCount,
            next = parseInt(store.currentPage) + 1;

        if (next <= total) {
            if (me.fireEvent('beforechange', me, next) !== false) {
                store.nextPage();
                return true;
            }
        }
        return false;
    },
    
    movePrevious : function(){
        var me = this,
            store = me.store,
            prev = parseInt(store.currentPage) - 1;

        if (prev > 0) {
            if (me.fireEvent('beforechange', me, prev) !== false) {
                store.previousPage();
                return true;
            }
        }
        return false;
    },
    
    moveLast : function(){
        var me = this,
            last = me.getPageData().pageCount;

        if (me.fireEvent('beforechange', me, last) !== false) {
            me.store.loadPage(last);
            return true;
        }
        return false;
    },
    
    changePageSize:function(btn){
        
        var me = this,
            store = me.store,
            current = store.currentPage;
            var pageSize=btn.text;
            me.store.setPageSize(parseInt(pageSize));

        if (me.fireEvent('beforechange', me, current) !== false) {
            
            store.loadPage(current);
            return true;
        }
        return false;
        
    }

});