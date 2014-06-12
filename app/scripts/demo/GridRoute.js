/*
 * $Revision$
 *
 * Copyright (c) 2014 by PROS, Inc.  All Rights Reserved.
 * This software is the confidential and proprietary information of
 * PROS, Inc. ("Confidential Information").
 * You may not disclose such Confidential Information, and may only
 * use such Confidential Information in accordance with the terms of
 * the license agreement you entered into with PROS.
 */
define([
    'demo/GridModel'
], function(
    GridModel) {

    return Ember.Route.extend({
        model: function() {
            var model = GridModel.create();
            this.setData(model);

            return model;
        },

        setData: function(model) {
            var rows = model.get('rows');

            for (var rowNum = 0; rowNum < 10; rowNum++) {
                var row = [];
                for (var i = 0; i < model.get('columns.length'); i++) {
                    row.push('Data ' + rowNum + '_' + i);
                }
                rows.push(row);
            }
        }
    });
});
