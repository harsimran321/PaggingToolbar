Ext.define('Custom.store.MessageHistory', {
    extend: 'Ext.data.Store',
    pageSize: 50,
    storeId: 'MessageHistory',
    fields: [
        'title', 'forumtitle', 'forumid', 'author',
        {name: 'replycount', type: 'int'},
        {name: 'lastpost', mapping: 'lastpost', type: 'date', dateFormat: 'timestamp'},
        'lastposter', 'excerpt', 'threadid'
    ],
    autoLoad: true,
    proxy: {
        type: 'jsonp',
        url: 'http://www.sencha.com/forum/topics-browse-remote.php',
        reader: {
            rootProperty: 'topics',
            totalProperty: 'totalCount'
        },
        simpleSortMode: true
    },
    sorters: [{
            property: 'lastpost',
            direction: 'DESC'
        }]
});
