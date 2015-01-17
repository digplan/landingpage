// Generated on 2013-11-16 using generator-webapp 0.4.4
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    //require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            options: {
                spawn: false
            },
            sass: {
                files: ['app/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer'],
            },
            styles: {
                files: ['app/styles/{,*/}*.css'],
                options: {
                    livereload: true
                }
            },
            html: {
                options: {
                    livereload: true
                },
                files: [
                    'app/*.html',
                    '{.tmp,app}/scripts/{,*/}*.js',
                ]
            }
        },
        browser_sync: {
            files: {
                src : [
                    'app/styles/*.css',
                    'app/scripts/*.js',
                    "*.html"
                ]
            },
            options: {
                //host : 192.168.2.33,
                ghostMode : {
                    scroll : false,
                    links : false,
                    forms : true
                }
            }
        },
        sass: {
            options: {
                loadPath: 'app/styles'
            },
//             files: {
//                 'app/styles/main.css': 'app/styles/main.scss',
//                 'app/styles/loader.css': 'app/styles/loader.scss'
//             },
            dist: {
                options: {
                    loadPath: 'app/styles',
                    style: 'expanded'
                },
                files: {
                    'app/styles/main.css': 'app/styles/main.scss',
                    'app/styles/loader.css': 'app/styles/loader.scss'
                },
            },
            server: {
                options: {
                    loadPath: 'app/styles',
                    style: 'expanded',
                    sourcemap: true
                },
                files: {
                    'app/styles/main.css': 'app/styles/main.scss',
                    'app/styles/loader.css': 'app/styles/loader.scss'
                },
            }
        },
        useminPrepare: {
            options: {
                dest: 'dist',
                flow: {
                    steps: {
                        'js': ['concat', 'uglifyjs'],
                        'css': ['concat', 'cssmin']
                    }, post: {}
                }
            },
            html: 'app/*.html'
        },
        usemin: {
            options: {
                assetsDirs: [
                    'dist/images/',
                    'dist/styles/',
                    'dist/scripts/'
                ]
            },
            html: ['dist/{,*/}*.html'],
            css: ['dist/styles/{,*/}*.css']
        },

        imagemin: {
            dist: {
                options: {
                    pngquant: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/images',
                        src: '{,*/}*.{gif,jpeg,jpg,png}',
                        dest: 'dist/images'
                    }
                ]
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: 'app/images',
                        dest: 'dist/images',
                        src: '{,*/}*.{gif,jpeg,jpg,png}'
                    },
                    {
                        expand: true,
                        dot: true,
                        filter: 'isFile',
                        cwd: 'app/',
                        dest: 'dist/',
                        src: '*'
                    },
                    {
                        expand: true,
                        dot: true,
                        filter: 'isFile',
                        cwd: 'app/',
                        dest: 'dist/',
                        src: 'inc/**/*'
                    },
                    {
                        expand: true,
                        dot: true,
                        filter: 'isFile',
                        cwd: 'app/',
                        dest: 'dist/',
                        src: 'video/**/*'
                    },
                     {
                        expand: true,
                        dot: true,
                        filter: 'isFile',
                        cwd: '.tmp/concat',
                        dest: 'dist/',
                        src: '**/*'
                    },
                    {
                        dest: 'dist/styles/custom.css',
                        src: 'app/styles/custom.css'
                    },
                ]
            }
        },

        // cssmin: {
        //     options: {
        //         restructure: true,
        //         report: 'gzip'
        //     }
        // },

        cssmin: {
            options: {
                keepSpecialComments: 0,
                report: 'gzip'
            }
        },

        // sass: {
        //     dist: {
        //         options: {
        //             style: 'compressed',
        //             //compass: true
        //         },
        //         files: {
        //             'app/styles/main.css': 'app/styles/main.scss'
        //         },
        //     },
        //     server: {
        //         options: {
        //             style: 'expanded',
        //             //compass: true,
        //             sourceComments: 'map'
        //         },
        //         files: {
        //             'app/styles/main.css': 'app/styles/main.scss'
        //         },
        //     }
        // },

        autoprefixer: {
            options: {
                browsers: ['last 3 versions', 'android 2.3', '> 1%', 'ie 8'],
                map: true
            },
            files: {
                expand: true,
                cwd: 'app/styles',
                src: '{,*/}*.css',
                dest: 'app/styles'
            }
        },
        modernizr: {
            devFile: 'dist/scripts/modernizr.custom.min.js',
            outputFile: 'dist/scripts/modernizr.custom.min.js',
            files: [
                'dist/scripts/**/*.js',
                'dist/styles/**/*.css'
            ],
            uglify: true
        },
        concurrent: {
            //target1: ['watch', 'browser_sync'],
            //target2: ['jshint', 'mocha']
             target: {
                tasks: ['watch', 'browser_sync'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-browser-sync');
    //grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-sass');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'watch'
    ]);

    //grunt.task.renameTask('csso', 'cssmin');

    grunt.registerTask('dist', [
        'sass:dist',
        'autoprefixer',
        'copy',
        'imagemin:dist',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'usemin',
        'modernizr',
    ]);
};
