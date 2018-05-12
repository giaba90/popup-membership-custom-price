<?php
/*
Plugin Name:  Popup membership custom price
Plugin URI:   https://github.com/giaba90
Description:  Addon for membership custom price plugin for create a popup
Version:      0.1
Author:       Gianluca Barranca
Author URI:   http://www.gianlucabarranca.it
License:      GPL2
Text Domain:  popup_mpc
Domain Path:  /languages
*/

require_once(plugin_dir_path( __FILE__ ).'includes/custom-ajax.php');

// Register Custom Post Type
function mpc_setup_post_type() {

	$labels = array(
		'name'                  => _x( 'Popups', 'Post Type General Name', 'popup_mpc' ),
		'singular_name'         => _x( 'Popup', 'Post Type Singular Name', 'popup_mpc' ),
		'menu_name'             => __( 'Popup mpc', 'popup_mpc' ),
		'name_admin_bar'        => __( 'Post Type', 'popup_mpc' ),
		'archives'              => __( 'Item Archives', 'popup_mpc' ),
		'attributes'            => __( 'Item Attributes', 'popup_mpc' ),
		'parent_item_colon'     => __( 'Parent Item:', 'popup_mpc' ),
		'all_items'             => __( 'Tuttti i popup', 'popup_mpc' ),
		'add_new_item'          => __( 'Aggiungi nuovo popup', 'popup_mpc' ),
		'add_new'               => __( 'Aggiungi popup', 'popup_mpc' ),
		'new_item'              => __( 'Nuovo popup', 'popup_mpc' ),
		'edit_item'             => __( 'Modifica popup', 'popup_mpc' ),
		'update_item'           => __( 'Aggiorna popup', 'popup_mpc' ),
		'view_item'             => __( 'Vedi popup', 'popup_mpc' ),
		'view_items'            => __( 'Vedi popups', 'popup_mpc' ),
		'search_items'          => __( 'Cerca popup', 'popup_mpc' ),
		'not_found'             => __( 'Not found', 'popup_mpc' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'popup_mpc' ),
		'featured_image'        => __( 'Featured Image', 'popup_mpc' ),
		'set_featured_image'    => __( 'Set featured image', 'popup_mpc' ),
		'remove_featured_image' => __( 'Remove featured image', 'popup_mpc' ),
		'use_featured_image'    => __( 'Use as featured image', 'popup_mpc' ),
		'insert_into_item'      => __( 'Insert into item', 'popup_mpc' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'popup_mpc' ),
		'items_list'            => __( 'Items list', 'popup_mpc' ),
		'items_list_navigation' => __( 'Items list navigation', 'popup_mpc' ),
		'filter_items_list'     => __( 'Filter items list', 'popup_mpc' ),
	);
	$args = array(
		'label'                 => __( 'Popup', 'popup_mpc' ),
		'description'           => __( 'Popup of membership custom price', 'popup_mpc' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'custom-fields' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'menu_icon'             => 'dashicons-testimonial',
		'show_in_admin_bar'     => false,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => true,
		'publicly_queryable'    => true,
		'capability_type'       => 'page',
	);
	register_post_type( 'popup_mpc', $args );

}
add_action( 'init', 'mpc_setup_post_type', 0 );

function mpc_install() {
    // trigger our function that registers the custom post type
    mpc_setup_post_type();

    // clear the permalinks after the post type has been registered
    flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'mpc_install' );

function mpc_deactivation() {
    // unregister the post type, so the rules are no longer in memory
    unregister_post_type( 'popup_mpc' );
    // clear the permalinks to remove our post type's rules from the database
    flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'mpc_deactivation' );

/**
 *  Enqueue scripts and styles.
 */
function mpc_theme_name_scripts() {
    wp_enqueue_style( 'popup_mpc_style', plugins_url( 'public/css/style.css', __FILE__ ) );
    wp_enqueue_script( 'popup_mpc_js',   plugins_url( 'public/js/script.js', __FILE__ ) , array('jquery'), false, true );
}

add_action( 'wp_enqueue_scripts', 'mpc_theme_name_scripts' );

function mpc_inject_popup(){

	if( is_product() && mpc_get_user_role() != member_role ){

	global $product;
	$id = $product->get_id();
	//get language
	$my_current_lang = apply_filters( 'wpml_current_language', NULL );
	//get normal price
	$price = intval($product->get_price());
	//get member price
	if($my_current_lang == 'da'){
		$special_price = intval(get_field('mpc_price_dkk',$id));
	}
	else if($my_current_lang == 'en'){
		$special_price = intval(get_field('mpc_price_euro',$id));
	}
	else if($my_current_lang == 'sv'){
		$special_price = intval(get_field('mpc_price_sek',$id));
	}

	$risp = $price - $special_price;
	//get popup text
	$args = array(
    	'post_type'=> 'popup_mpc',
    	'numberposts' => 1,
    	'suppress_filters' => false,
    	'orderby' => 'ID',
    	'order' => 'DESC'
    	);

	$the_query = new WP_Query( $args );

	if($the_query->have_posts() ){
		while ( $the_query->have_posts() ){
			$the_query->the_post();
		?>
		<div id="popup_mpc" style="display: none">
		<div class="pop-bg"></div><div class="pop-wrap"><p class="pop-x">X</p><div class="pop-content"><span id="popup_mpc_risparmio"><? echo __('Stai risparmiando ','popup_mpc'). wc_price($risp); ?></span><?php the_content(); ?></div></div>
		</div>
		<?php
		}
	}
	wp_reset_query();
    wp_reset_postdata();

	}


}

add_action('wp_footer','mpc_inject_popup');
