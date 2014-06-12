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
    'router',
    'store',
    'components/config',
    'demo/config'
], function(
    Router,
    Store,
    ComponentsConfig,
    GridDemoConfig) {

    var app = Ember.Application.create();
    app.Router = Router;
    app.ApplicationAdapter = Store;

    // module pattern
    $.extend(app, ComponentsConfig);
    $.extend(app, GridDemoConfig);

    return app;
});
