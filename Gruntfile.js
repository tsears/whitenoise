/* jslint node: true */ 
'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['*.js', 'modules/*.js', 'tests/*.js'],
		},
		jsonlint: {
			config: {
				src: ['*.json']
			}

		},
		watch: {
			scripts: {
				files: '<%= jshint.files %>',
				tasks: ['jshint']
			},
			config : {
				files: '<%= jsonlint.config.src %>',
				tasks: ['jsonlint']
			}
		},
		copy: {
			build: {
				src: ['**', 
					'!**/node_modules/**', 
					'!Gruntfile.js'],
				dest: 'build',
				expand: true
			}
		},
		clean: {
			build: {
				src: ['build']
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.registerTask('default', ['jshint', 'jsonlint']);
	grunt.registerTask('build', ['clean', 'copy']);

};