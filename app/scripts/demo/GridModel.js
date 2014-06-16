define(function() {
    return Ember.Object.extend({
        columns: null,
        rows: null,

        init: function() {
            this._super();

            var columns = [];
            for (var i = 0; i < 500; i++) {
                columns.push({
                    sName: 'col' + i,
                    sTitle: 'Col' + i
                });
            }

            this.set('columns', columns);
            this.set('rows', []);
        }
    });
});
