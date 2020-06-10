Ext.define('Custom.view.Home', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Custom.view.HomeViewControlller',
        'Custom.view.HomeViewModel',
        'Ext.tab.Panel'
    ],
    controller: 'HomeViewControlller',
    viewModel: {
        type: 'HomeViewModel'
    },
    alias: 'widget.Home',
    style: 'opacity: 0;',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
            xtype: 'grid',
            flex: 1,
            store: 'MessageHistory',
            dockedItems: [{
                    xtype: 'PaggingToolbar',
                    store: 'MessageHistory',
                    dock: 'bottom',
                    displayInfo: true
                }],
            columns: {
                defaults: {
                    flex: 1
                },
                items: [{
                        text: 'Code',
                        dataIndex: 'title'
                    }, {
                        text: 'Sender',
                        dataIndex: 'replycount'
                    }]
            }
        }]
});
