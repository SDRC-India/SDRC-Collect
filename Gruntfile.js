module.exports = function(grunt){
	grunt.initConfig({
		concat: {
			scss: {
				src: [
				'enketo-core-master/src/sass/core/_variables.scss',
				'enketo-core-master/src/sass/core/_mixins.scss',
				//'enketo-core-master/src/sass/core/_slider.scss',
				'enketo-core-master/src/sass/core/_buttons.scss', 
				'enketo-core-master/src/sass/core/_fonts.scss',
				'enketo-core-master/src/sass/core/_icons.scss',
				'enketo-core-master/src/sass/core/_layout.scss',
				'enketo-core-master/src/sass/core/_main.scss',
				'enketo-core-master/src/sass/core/_pages.scss',
				'enketo-core-master/src/sass/core/_print.scss',
				'enketo-core-master/src/sass/core/_reset.scss',
				'enketo-core-master/src/sass/core/_responsive.scss',
				'enketo-core-master/src/sass/core/_utilities.scss',				
				'enketo-core-master/src/sass/core/_widgets.scss',
				'enketo-core-master/src/sass/plain/plain.scss',
				'www/css/myStyle.scss'
				],
				dest:'enketo-core-master/src/sass/core/style.scss'
			}
		},
		sass: {
			dist: {
				files: {
					'www/css/style.css':'enketo-core-master/src/sass/core/style.scss'
				}
			}
		}
	});

	grunt.registerTask('default', ['concat', 'sass']);

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');	
};