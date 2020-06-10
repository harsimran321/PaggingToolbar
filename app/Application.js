Ext.define('Custom.Application', {
    extend: 'Ext.app.Application',
    name: 'Custom',
    requires: [
        'Ext.form.*',
        'Ext.grid.filters.Filters',
        'Ext.grid.feature.Grouping'
    ],
    stores: ['MessageHistory'],
    controllers: [],
    views: [],
    launch: function () {
        
        var viewport = Ext.ComponentQuery.query("viewport")[0];
        var loadMask = Ext.get('loading-mask');
        loadMask.remove();
        viewport.getEl().fadeIn({
            from: {
                opacity: 0
            },
            duration: 2000
        });

  }
});
