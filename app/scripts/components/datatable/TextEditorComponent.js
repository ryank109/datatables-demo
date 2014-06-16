define(function() {
    return Ember.Component.extend({
        // tagName: 'input',
        // attributeBindings: ['value', 'style'],
        // value: null,
        // style: 'display:block;width:100%',
        layoutName: 'textEditor',

        didInsertElement: function() {
debugger;
            var input = $(this.get('element'));

            input.on('keydown', function(event) {
                debugger;
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
        }
    });
});
