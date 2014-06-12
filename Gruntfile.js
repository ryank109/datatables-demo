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
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var salesOptimizerConfig = {
        app: 'app',
        build: 'build',
        dist: 'build/dist',
        resources: 'app/resources'
    };

    grunt.initConfig({
        salesOptimizer: salesOptimizerConfig,
        watch: {
            emberTemplates: {
                files: '<%= salesOptimizer.app %>/**/*.hbs',
                tasks: ['emberTemplates']
            },
            copy: {
                files: ['<%= salesOptimizer.resources %>/**/*'],
                tasks: ['copy:resources']
            },
            compass: {
                files: ['<%= salesOptimizer.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            requirejs: {
                files: ['<%= salesOptimizer.app %>/scripts/**/*.js'],
                tasks: ['requirejs:app']
            },
            replace: {
                files: ['<%= salesOptimizer.app %>/index.html'],
                tasks: ['replace:app']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= salesOptimizer.build %>/tmp/**/*'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, salesOptimizerConfig.build + '/bower_components'),
                            mountFolder(connect, salesOptimizerConfig.build + '/tmp')
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'test'),
                            mountFolder(connect, '<%= salesOptimizer.build %>/tmp')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, salesOptimizerConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= salesOptimizer.build %>/tmp',
                        '<%= salesOptimizer.dist %>/*',
                        '!<%= salesOptimizer.dist %>/.git*'
                    ]
                }]
            },
            server: '<%= salesOptimizer.build %>/tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= salesOptimizer.app %>/scripts/**/*.js'
            ]
        },
        compass: {
            options: {
                sassDir: '<%= salesOptimizer.app %>/styles',
                cssDir: '<%= salesOptimizer.build %>/tmp/styles',
                generatedImagesDir: '<%= salesOptimizer.build %>/tmp/images/generated',
                imagesDir: '<%= salesOptimizer.resources %>/images',
                javascriptsDir: '<%= salesOptimizer.app %>/scripts',
                fontsDir: '<%= salesOptimizer.resources %>/fonts',
                importPath: '<%= salesOptimizer.build %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/fonts',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= salesOptimizer.dist %>/scripts/{,*/}*.js',
                        '<%= salesOptimizer.dist %>/styles/{,*/}*.css',
                        '<%= salesOptimizer.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= salesOptimizer.dist %>/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= salesOptimizer.build %>/tmp/index.html',
            options: {
                dest: '<%= salesOptimizer.dist %>',
                staging: '<%= salesOptimizer.build %>/tmp'
            }
        },
        usemin: {
            html: ['<%= salesOptimizer.dist %>/{,*/}*.html'],
            css: ['<%= salesOptimizer.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= salesOptimizer.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= salesOptimizer.resources %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= salesOptimizer.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= salesOptimizer.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= salesOptimizer.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= salesOptimizer.dist %>/styles/main.css': [
                        '<%= salesOptimizer.build %>/tmp/styles/{,*/}*.css',
                        '<%= salesOptimizer.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= salesOptimizer.app %>',
                    src: '*.html',
                    dest: '<%= salesOptimizer.dist %>'
                }]
            }
        },
        replace: {
            app: {
                options: {
                    variables: {
                        ember: 'ember/ember.js',
                        ember_data: 'ember-data/ember-data.js'
                    }
                },
                files: [
                    {src: '<%= salesOptimizer.app %>/index.html', dest: '<%= salesOptimizer.build %>/tmp/index.html'}
                ]
            },
            dist: {
                options: {
                    variables: {
                        ember: 'ember/ember.prod.js',
                        ember_data: 'ember-data/ember-data.prod.js'
                    }
                },
                files: [
                    {src: '<%= salesOptimizer.app %>/index.html', dest: '<%= salesOptimizer.build %>/tmp/index.html'}
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        cwd: '<%= salesOptimizer.build %>/bower_components/',
                        dest: '<%= salesOptimizer.build %>/tmp/fonts/',
                        src: [
                            'bootstrap-sass/dist/fonts/**'
                        ]
                    }
                ]
            },
            resources: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        filter: 'isFile',
                        cwd: '<%= salesOptimizer.resources %>',
                        dest: '<%= salesOptimizer.build %>/tmp',
                        src: [
                            'fonts/**',
                            'images/**'
                        ]
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= salesOptimizer.app %>',
                        dest: '<%= salesOptimizer.dist %>',
                        src: [
                            '*.{ico,txt}',
                            '.htaccess'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= salesOptimizer.resources %>',
                        dest: '<%= salesOptimizer.dist %>',
                        src: [
                            'images/{,*/}*.{webp,gif}'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= salesOptimizer.build %>/tmp',
                        dest: '<%= salesOptimizer.dist %>',
                        src: [ 'fonts/**' ]
                    }
                ]
            }
        },
        concurrent: {
            server: [
                'emberTemplates',
                'compass:server'
            ],
            test: [
                'emberTemplates',
                'compass'
            ],
            dist: [
                'emberTemplates',
                'compass:dist',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        emberTemplates: {
            options: {
                templateName: function (sourceFile) {
                    var templatePath = salesOptimizerConfig.app + '/scripts/';
                    return sourceFile.substr(sourceFile.lastIndexOf('/') + 1);
                }
            },
            dist: {
                files: {
                    '<%= salesOptimizer.build %>/tmp/scripts/compiled-templates.js': '<%= salesOptimizer.app %>/**/*.hbs'
                }
            }
        },
        requirejs: {
            app: {
                options: {
                    mainConfigFile: '<%= salesOptimizer.app %>/config.js',
                    out: '<%= salesOptimizer.build %>/tmp/scripts/main.js',
                    name: '../config',
                    wrap: true,
                    optimize: 'none',
                    pragmasOnSave: {
                        excludeHbsParser: true,
                        excludeHbs: true,
                        excludeAfterBuild: true
                    }
                }
            },
            dist: {
                options: {
                    mainConfigFile: '<%= salesOptimizer.app %>/config.js',
                    out: '<%= salesOptimizer.dist %>/scripts/main.js',
                    name: '../config',
                    wrap: false,
                    optimize: 'uglify2',
                    pragmasOnSave: {
                        excludeHbsParser: true,
                        excludeHbs: true,
                        excludeAfterBuild: true
                    }
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'replace:app',
            'concurrent:server',
            'requirejs:app',
            'copy:fonts',
            'copy:resources',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'replace:dist',
        'useminPrepare',
        'concurrent:dist',
        'requirejs:dist',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
