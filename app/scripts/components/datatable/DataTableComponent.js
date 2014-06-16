define([
    'components/datatable/TextEditorComponent'
], function(
    TextEditorComponent) {

    return Ember.Component.extend({
        tagName: 'table',

        attributeBindings: ['name'],

        name: null,

        isElementReady: false,

        data: null,

        columns: null,

        selectedRow: null,

        selectedRowContent: null,

        didInsertElement: function() {
            this.toggleProperty('isElementReady');
        },

        initializeDataTable: function() {
            var self = this;
            var name = this.get('name');
            var data = this.get('data');
            var columns = this.get('columns');
            var isDataTable = $.fn.DataTable.isDataTable('[name=' + name + ']');

            if (data && columns && !isDataTable) {

                var grid = $('[name=' + name + ']').dataTable({
                    aoColumns: columns,
                    data: data,
                    // processing: true,
                    // serverSide: true,
                    // ajax: {
                    //     url: 'http://localhost:8000/serverprocessing'
                    // },
                    // scrollY: '100%',

                    fnRowCallback: function(row, rowData, displayIndex, displayIndexFull) {
                        var tr = $(row);
                        tr.on('click', function(event) {
                            if (self.get('selectedRow') !== tr) {

                                var selectedRowContent = self.get('selectedRowContent');
                                if (self.get('selectedRow')) {
                                    self.get('selectedRow').children().each(function(index, child) {
                                        var td = $(child);
                                        var value = td.contents().val();
                                        td.contents().remove();
                                        td.append(value); // selectedRowContent[index]);
                                    });
                                }

                                self.set('selectedRow', tr);

                                var rowContent = [];

                                var colIdx = $(event.target).index();
                                tr.children().each(function(index, child) {
                                    //debugger;
                                    var td = $(child);
                                    var value = td.text();

                                    rowContent.push(td.contents());
                                    var value = td.contents().text();
                                    td.contents().remove();

                                    var editor = self.createChildView(TextEditorComponent, {value: value});

                                    // var editor = TextEditorComponent.create({
                                    //     value: value
                                    // });

                                    // var buffer = Ember.RenderBuffer();
                                    // editor.render(buffer);
                                    // var editorElement = editor.renderToBuffer();
                                    // var input = $(buffer.buffer);
                                    // editor.set('element', input);
                                    // editor.didInsertElement();
                                    // td.append(input);
                                    // editor.didInsertElement();

                                    // editor.appendTo(td);

                                    // var container = Ember.ContainerView.create({
                                    //     childViews: [editor]
                                    // });
                                    // container.pushObject(editor);
                                    // self.container.children.appendObject(td);
                                    // var childView = self.createChildView(TextEditorComponent, {value: value});
                                    // self.$().appendTo(target);
                                    // childView.appendTo(child);
                                    // editor.appendTo(child);

                                    var input = $('<input style="width:100%; display:block;" type="text" value="' + value + '"/>');
                                    td.append(input);


                                    input.on('keydown', function(event) {
                                        // tab
                                        if (event.keyCode === 9 && !event.shiftKey && tr.children().length - 1 === index) {
                                            var nextRow = tr.next();
                                            if (nextRow) {
                                                nextRow.children().first().click();
                                                event.preventDefault();
                                            }
                                        }
                                        // shift+tab
                                        else if (event.keyCode === 9 && event.shiftKey && index === 0) {
                                            var prevRow = tr.prev();
                                            if (prevRow) {
                                                prevRow.children().last().click();
                                                event.preventDefault();
                                            }
                                        }
                                        // enter
                                        else if (event.keyCode === 13) {

                                            var selectedRowContent = self.get('selectedRowContent');
                                            if (self.get('selectedRow')) {
                                                self.get('selectedRow').children().each(function(index, child) {
                                                    var td = $(child);
                                                    var value = td.contents().val();
                                                    td.contents().remove();
                                                    td.append(value); // selectedRowContent[index]);
                                                });

                                                self.set('selectedRow', null);
                                                self.set('selectedRowContent', null);
                                            }
                                            event.preventDefault();
                                        }
                                        // esc
                                        else if (event.keyCode === 27) {
                                            var selectedRowContent = self.get('selectedRowContent');
                                            if (self.get('selectedRow')) {
                                                self.get('selectedRow').children().each(function(index, child) {
                                                    var td = $(child);
                                                    var value = td.contents().val();
                                                    td.contents().remove();
                                                    td.append(value); // selectedRowContent[index]);
                                                });

                                                self.set('selectedRow', null);
                                                self.set('selectedRowContent', null);
                                            }
                                        }
                                    });

                                    input.focusout(function(event) {
                                        if ($('[name=' + name + '] tbody').find(event.relatedTarget).length === 0) {
                                            var selectedRowContent = self.get('selectedRowContent');
                                            if (self.get('selectedRow')) {
                                                self.get('selectedRow').children().each(function(index, child) {
                                                    var td = $(child);
                                                    var value = td.contents().val();
                                                    td.contents().remove();
                                                    td.append(value); // selectedRowContent[index]);
                                                });

                                                self.set('selectedRow', null);
                                                self.set('selectedRowContent', null);
                                                // debugger;
                                            }
                                        }
                                    });

                                    if (index === colIdx) {
                                        input.focus();
                                    }
                                });

                                self.set('selectedRowContent', rowContent);
                            }
                        });
                    }
                });
            }
        }.observes('isElementReady', 'data', 'columns')
    });
});
