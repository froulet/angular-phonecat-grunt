module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Supprime le répertoire target
		clean: {
			files: ['target']
		},

		// Compile tous les fichiers app/coffee/*.coffee vers target/js/
		coffee: {
			options: {
				bare: true
			},
			compile: {
				files: [
					{
						expand: true,
						cwd: 'app/coffee',
						src: ['*.coffee'],
						dest: 'target/js/',
						ext: '.js'
					}
				]
			}
		},

		// Minify tout les fichiers target/js/*.js pour créer target/js/phonecat.min.js
		uglify: {
			minify: {
				files: [
					{
						'target/js/phonecat.min.js': ['target/js/*.js']
					}
				]
			}
		},

		// Compile tous les fichiers app/less/*.less vers target/css/
		less: {
			compile: {
				files: [
					{
						expand: true,
						cwd: 'app/less',
						src: ['*.less'],
						dest: 'target/css/',
						ext: '.css'
					}
				]
			}
		},

		// Minify tout les fichiers target/css/*.css pour créer target/css/phonecat.min.css
		cssmin: {
			minify: {
				files: [
					{
						'target/css/phonecat.min.css': ['target/css/*.css']
					}
				]
			}
		},

		copy: {
			// Copie les fichiers HTML vers target
			html: {
				files: [
					{
						expand: true,
						cwd: 'app/partials',
						src: ['*.html'],
						dest: 'target/partials/',
						ext: '.html'
					},
					{
						src: ['app/index.html'],
						dest: 'target/index.html'
					}
				]
			},

			// Copie les fichiers JS vers target
			js: {
				files: [
					{
						expand: true,
						cwd: 'app/js',
						src: ['*.js'],
						dest: 'target/js/',
						ext: '.js'
					}
				]
			},

			// Copie les fichiers CSS vers target
			css: {
				files: [
					{
						expand: true,
						cwd: 'app/css',
						src: ['*.css'],
						dest: 'target/css/',
						ext: '.css'
					}
				]
			},

			// Copie les resources
			resources: {
				files: [
					{
						expand: true,
						cwd: 'app/phones',
						src: ['**/*'],
						dest: 'target/phones/'
					},
					{
						expand: true,
						cwd: 'app/img',
						src: ['**/*'],
						dest: 'target/img/'
					}
				]
			}
		},

		// Minify les fichiers HTML dans target
		htmlmin: {
			options: {
				removeComments: true,
				removeCommentsFromCDATA: true,
				collapseWhitespace: true,
				collapseBooleanAttributes: true
			},
			minify: {
				files: [
					{
						expand: true,
						cwd: 'target/partials',
						src: ['*.html'],
						dest: 'target/partials/',
						ext: '.html'
					},
					{
						src: ['target/index.html'],
						dest: 'target/index.html'
					}
				]
			}
		},

		// Lance un serveur sur le port 9001 avec comme dossier racine le dossier target
		connect: {
			server: {
				options: {
					port: 9001,
					base: 'target'
				}
			}
		},
		// Surveille si des fichiers ont été modifiés et lance la bonne tâche si c'est le cas
		watch: {
			coffee: {
				files: ['app/coffee/*.coffee'],
				tasks: ['coffee:compile']
			},
			js: {
				files: ['app/js/*.js'],
				tasks: ['copy:js']
			},
			less: {
				files: ['app/less/*.less'],
				tasks: ['less:compile']
			},
			css: {
				files: ['app/css/*.css'],
				tasks: ['copy:css']
			},
			html: {
				files: ['app/index', 'src/partials/*.html'],
				tasks: ['copy:html']
			}
		}
	});

	// Charge tous les plugins
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Dev : copy, compile, lance le serveur
	grunt.registerTask('dev', [
		'clean',
		'copy:js',
		'coffee:compile',
		'copy:css',
		'less:compile',
		'copy:html',
		'copy:resources',
		'connect:server',
		'watch'
	]);

	// Prod : copy, compile, minify
	grunt.registerTask('production', [
		'clean',
		'copy:js',
		'coffee:compile',
		'uglify:minify',
		'copy:css',
		'less:compile',
		'cssmin:minify',
		'copy:html',
		'htmlmin:minify',
		'copy:resources'
	]);

	grunt.registerTask('default', ['dev']);
};
