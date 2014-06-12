define(function() {
    return Ember.Component.extend({
        tagName: 'table',

        attributeBindings: ['name'],

        name: null,

        isElementReady: false,

        data: null,

        columns: null,

        didInsertElement: function() {
            this.toggleProperty('isElementReady');
        },

        initializeDataTable: function() {
            var name = this.get('name');
            var data = this.get('data');
            var columns = this.get('columns');
            var isDataTable = $.fn.DataTable.isDataTable('[name=' + name + ']');

            if (data && columns && !isDataTable) {

                var grid = $('[name=' + name + ']').dataTable({
                    aoColumns: columns,
                    data: data,
                    processing: true,
                    serverSide: true,
                    ajax: {
                        url: 'http://localhost:8000/serverprocessing'
                    },
                    scrollY: '100%',

                    fnRowCallback: function(row, rowData, displayIndex, displayIndexFull) {
                        var tr = $(row);
                        tr.on('click', function(event) {
                            var colIdx = tr.index();
                            // tr.children().forEach(function(value) {

                            // })

                            $(event.target).editable(function(value, settings) {
                                rowData[colIdx] = value;
                                return value;
                            },
                            {
                                onblur: 'submit'
                            });
                        });
                    }
                })
            }
        }.observes('isElementReady', 'data', 'columns')
    });
});
