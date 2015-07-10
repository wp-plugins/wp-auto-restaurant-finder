<?php
 
/*
Plugin Name:  WP Auto Restaurant Finder
Plugin URI: http://www.luciaintelisano.it/wp-auto-Restaurant-finder
Description: A plugin to get/find Restaurants on google maps in a very easy way
Version: 1.0.0
Author: Lucia Intelisano
Author URI: http://www.luciaintelisano.it
*/

/*  Copyright 2015  WP Auto Restaurant Finder  (email : lucia.intelisano@gmail.com) */

  	// init plugin
	wparf_init();
	
	
	
	 
 	 
	/* Extract text inside two tags */
	function getRow1234($cnt, $tagStart, $tagEnd) {
		$start = 0;
		$end = strlen($cnt);
		if (!(strpos($cnt, $tagStart)===false)) {
			$start = strpos($cnt, $tagStart)+strlen($tagStart);
		}	
		if (!(strpos($cnt, $tagEnd)===false)) {
			$end = strpos($cnt, $tagEnd);
		}
		$row = substr($cnt, $start, $end-$start);	
		return $row;
	}
		
	/**
 		* Function for adding header style sheets and js
 	*/
	function wparf_theme_name_scripts() {	 
		wp_enqueue_style('default_style_wparf_1', plugins_url('css/stylemap.css', __FILE__), false, time());
		wp_enqueue_script( 'default_scripts_wparf_1', "https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places,geometry", array(), '', false );
		wp_enqueue_script( 'default_scripts_wparf_2', plugins_url('js/scriptmap.js', __FILE__), array(), time(), true );
	} 
		
		
	/**
 	* Function for adding a link on main menu of wp
 	*/	
	function wparf_plugin_setup_menu(){
       add_options_page('WP Auto Restaurant Finder', 'WP Auto Restaurant Finder', 'administrator', __FILE__, 'wparf_settings_page',plugins_url('/images/icon.png', __FILE__));
	}
	
	
	/**
 	* Function for init plugin
 	*/
	function wparf_init(){
		add_action( 'wp_enqueue_scripts', 'wparf_theme_name_scripts' ); 
	 	add_action('admin_menu', 'wparf_plugin_setup_menu');
	 	add_action( 'admin_init', 'wparf_register_mysettings' );   
	 	add_filter( 'the_content', 'wparf_my_the_post_action' );
		add_shortcode('wparf', 'wparf_createMap');
		add_action('media_buttons', 'add_my_media_button');
	}	
		
		
	/**
 * Function for creation map
 */	
	function wparf_createMap($atts) {
			$atts = shortcode_atts( array(
				'title' => '',
				'lat' => '',
				'lng' => '',
				'location' => '',
				'searchform' => true
			), $atts, 'wmhf' );			
			$dir = plugin_dir_path( __FILE__ );
			$cnt = file_get_contents($dir."template/map.html");
			$cnt = str_replace('{TITLE}',strip_tags($atts["title"]),$cnt);
			$cnt = str_replace('{LAT}',$atts["lat"],$cnt);
			$cnt = str_replace('{LNG}',$atts["lng"],$cnt);
			$cnt = str_replace('{LOCATION}',strip_tags($atts["location"]),$cnt);
			$cnt = str_replace('{IMGDEFAULT}',plugins_url('img/pin.png', __FILE__),$cnt);
			$cnt = str_replace('{IMG1}',plugins_url('img/bgh.png', __FILE__),$cnt);
			$cnt = str_replace('{SEARCH}',get_option('wparf_autocomplete_search'),$cnt);			 
			return $cnt;
	}

	
	 
	 
	 
	 
 

	/**
 * Function for register settings
 */
function wparf_register_mysettings() {
	register_setting( 'wparf-settings-group', 'wparf_autocomplete_search' );
	register_setting( 'wparf-settings-group', 'wparf_view_on_cat' );
	register_setting( 'wparf-settings-group', 'wparf_view_on_tag' );
	register_setting( 'wparf-settings-group', 'wparf_lat' );
	register_setting( 'wparf-settings-group', 'wparf_default_title' );
	register_setting( 'wparf-settings-group', 'wparf_lng' );
	register_setting( 'wparf-settings-group', 'wparf_location' );
	register_setting( 'wparf-settings-group', 'wparf_start_html_tag' );
	register_setting( 'wparf-settings-group', 'wparf_end_html_tag' );
	register_setting( 'wparf-settings-group', 'wparf_title' );
	register_setting( 'wparf-settings-group', 'wparf_exclude_from_title' );
}

	/**
 * Function for view settings page 
 */
function wparf_settings_page() {
?>
<div class="wrap">
<h2>WP Auto Restaurant Finder</h2>

<form method="post" action="options.php">
    <?php 
    	settings_fields( 'wparf-settings-group' );  
    	do_settings_sections( 'wparf-settings-group' ); 
    ?>
    <table class="form-table">
        <tr valign="top">
        <th scope="row">Autocomplete searching input?</th>
        <td><input type="checkbox" name="wparf_autocomplete_search" <?php checked( '1', get_option('wparf_autocomplete_search')) ; ?> value="1" /></td>
        </tr>
         
        <tr valign="top">
        <th scope="row">View on post of categories</th>
        <td><input type="text" name="wparf_view_on_cat" value="<?php echo esc_attr( get_option('wparf_view_on_cat') ); ?>" /> (es. cat1,cat2,...)</td>
        </tr>
        
        <tr valign="top">
        <th scope="row">View on post of tags</th>
        <td><input type="text" name="wparf_view_on_tag" value="<?php echo esc_attr( get_option('wparf_view_on_tag') ); ?>" /> (es. tag1,tag2,...)</td>
        </tr>
          <tr valign="top">
        <th scope="row">Default title for map</th>
        <td><input type="text" name="wparf_default_title" value="<?php echo esc_attr( get_option('wparf_default_title') ); ?>" /></td>
        </tr>
        <tr valign="top">
        <th scope="row">Default lat</th>
        <td><input type="text" name="wparf_lat" value="<?php echo esc_attr( get_option('wparf_lat') ); ?>" /></td>
        </tr>
        <tr valign="top">
        <th scope="row">Default long</th>
        <td><input type="text" name="wparf_lng" value="<?php echo esc_attr( get_option('wparf_lng') ); ?>" /></td>
        </tr>
         <tr valign="top">
        <th scope="row">Default location</th>
        <td><input type="text" name="wparf_location" value="<?php echo esc_attr( get_option('wparf_location') ); ?>" /></td>
        </tr>
        <tr valign="top">
        <th scope="row">Get location from html tag inside content</th>
        <td>start tag <input type="text" name="wparf_start_html_tag" value="<?php echo esc_attr( get_option('wparf_start_html_tag') ); ?>" />
        end tag <input type="text" name="wparf_end_html_tag" value="<?php echo esc_attr( get_option('wparf_end_html_tag') ); ?>" />
        
        </td>
        </tr>
        <tr valign="top">
        <th scope="row">Get location from title</th>
        <td><input type="checkbox" name="wparf_title" <?php checked( '1', get_option('wparf_title')) ; ?> value="1" /></td>
        </tr>
         <tr valign="top">
        <th scope="row">Exclude word from title</th>
        <td><input type="text" name="wparf_exclude_from_title" value="<?php echo esc_attr( get_option('wparf_exclude_from_title') ); ?>" /></td>
        </tr>
    </table>
    
    <?php submit_button(); ?>

</form>
</div>
<?php
}


	/**
 * Function for add map on post 
 */
function wparf_my_the_post_action( $content ) {
 if ( is_single() ) {
	$cats = strtolower(get_option('wparf_view_on_cat'));
	$attachok=0;
	if  ($cats!="") {
		 $arrCat = split(",",$cats);
		 $categories = get_the_category();
		 if($categories){
			foreach($categories as $category) {
					foreach($arrCat as $cat) {
						if (strtolower($category->name)==$cat) {
							$attachok=1;
					 	}
					}
			}
		}	
	}
	$tagnames = trim(strtolower(get_option('wparf_view_on_tag')));	 
	if ($tagnames!="") {
		 
		$posttags = get_the_tags();
		if ($posttags!="") {
 			 $arrTags = split(",",$tagnames);
		  foreach($posttags as $tagpost) {
	 			foreach($arrTags as $tagname) {
					if (trim(strtolower($tagpost->name))==$tagname) {
							$attachok=1;
					}	 
				}
		  }
		}
	}	
	if ($attachok==1) {
			global $post, $wp_query;
    		$post_id = $post->ID;
    		$atts = array();
    		$atts["title"] = strip_tags(get_option('wparf_default_title')); 
    		$lat = get_option('wparf_lat');
    		$lng = get_option('wparf_lng');
    		$loc =  strip_tags(get_option('wparf_location'));
    		if ($lat=="" || $lng=="") {
    			if ($loc=="") {
    			 
    				$start_html_tag =  get_option('wparf_start_html_tag');
    				$end_html_tag =  get_option('wparf_end_html_tag');
    				if ($start_html_tag!="") {
    					$loc = getRow($post->post_content, $start_html_tag, $end_html_tag); 
    				}  
    				
    				if ($loc=="" && get_option('wparf_title')==true) {
    				 		 $loc = strtolower($post->post_title);
    				}
    				$exclude = get_option('wparf_exclude_from_title');
    				$exclude = str_replace(" ",",",$exclude);
    				$arrD = split(",",$exclude);
    				foreach($arrD as $k => $w) {
    					$w = strtolower(trim($w));
    					$loc = str_replace($w,"",$loc);
    				}	 
    			}
    		
    		}
    		$loc = str_replace("+"," ",$loc);
    		$loc = str_replace("-",",",$loc);
    		 
    		$atts["lat"] = $lat; 
    		$atts["lng"] = $lng;
    		$atts["location"] = $loc; 
			$cnt = wparf_createMap($atts);
			$content.=$cnt;
	}
}	
	return $content;
 

	 
    
}
 function add_my_media_button() {
    echo '<a href="javascript:wp.media.editor.insert(\'[wparf location= lat= lng=]\');" id="insert-my-media" class="button">Add restaurant map</a>';
}
 
 
?>
