module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['rea.js'],
      options: {
        boss: true,
        smarttabs: true,
        globals: {
            window: true,
            document: true
        }
      }
    },

    uglify: {
        my_target: {
          files: {
              'rea.min.js': 'rea.js'
          },
          options: {
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                      '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
          }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
};