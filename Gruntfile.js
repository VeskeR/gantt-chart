'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      serve: {
        options: {
          browserifyOptions: {
            debug: true
          }
        },
        files: {
          '.tmp/scripts/main.js': ['app/scripts/main.js']
        }
      },
      dist: {
        files: {
          'dist/scripts/main.js': ['app/scripts/main.js']
        }
      }
    },
    clean: {
      serve: {
        src: ['.tmp/']
      },
      dist: {
        src: ['dist/']
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: true
      },
      serve: {
        options: {
          open: 'http://localhost:9000/app/index.html',
          base: [
            '.',
            'app',
            '.tmp'
          ]
        }
      },
      dist: {
        options: {
          livereload: false,
          keepalive: true,
          open: 'http://localhost:9000/dist/index.html',
          base: [
            '.'
          ]
        }
      }
    },
    copy: {
      options: {
        encoding: 'utf-8'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'app',
          src: '**/*.html',
          dest: 'dist'
        }]
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({ browsers: ['last 2 versions', 'ie 8', 'ie 9'] })
        ]
      },
      serve: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: 'styles/**/*.css',
          dest: '.tmp'
        }]
      },
      dist: {
        options: {
          map: false
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: 'styles/**/*.css',
          dest: 'dist'
        }]
      }
    },
    sass: {
      serve: {
        options: {
          sourceMap: true
        },
        files: {
          '.tmp/styles/main.css': ['app/styles/main.scss']
        }
      },
      dist: {
        files: {
          'dist/styles/main.css': ['app/styles/main.scss']
        }
      }
    },
    watch: {
      options: {
        interrupt: true
      },
      bower: {
        files: ['bower.json'],
        tasks: [
          'wiredep'
        ]
      },
      js: {
        files: ['app/**/*.js'],
        tasks: [
          'browserify:serve'
        ]
      },
      sass: {
        files: ['app/**/*.{scss,sass}'],
        tasks: [
          'sass:serve',
          'postcss:serve'
        ]
      },
      serve: {
        options: {
          livereload: '<%= connect.options.livereload %>',
          interrupt: false
        },
        files: [
          '.tmp/**/*.{js,css,html,jpg,png,svg,gif,json}',
          'app/**/*.html'
        ]
      }
    },
    wiredep: {
      options: {
        ignorePath: /^(\.\.\/)*\.\./
      },
      task: {
        src: ['app/**/*.html']
      }
    },
  });

  grunt.registerTask('serve', [
    'clean',
    'browserify:serve',
    'sass:serve',
    'postcss:serve',
    'connect:serve',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'browserify:dist',
    'sass:dist',
    'postcss:dist',
    'copy:dist'
  ]);

  grunt.registerTask('serve:dist', [
    'build',
    'connect:dist'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
}
