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
define(function() {
    var router = Ember.Router.extend();
    router.map(function () {
        this.resource('grid');
    });

    return router;
});
