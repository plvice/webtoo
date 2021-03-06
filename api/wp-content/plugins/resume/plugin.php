<?php

/**
 * @package webtoo-resume
 * @version 1.0
 */
/*
Plugin Name: Webtoo
Plugin URI: -

Description: Plugin adds some features to "Webtoo resume".
The general addictions are:
- REST-API support with custom end-points
- new post type: "Project"

Author: Piotr Baluk
Version: 1.0
Author URI: https://twitter.com/mtb_rocks
*/


function wpdocs_codex_project_init() {
    $labels = array(
        'name'                  => _x( 'Projects', 'Post type general name', 'textdomain' ),
        'singular_name'         => _x( 'Project', 'Post type singular name', 'textdomain' ),
        'menu_name'             => _x( 'Projects', 'Admin Menu text', 'textdomain' ),
        'name_admin_bar'        => _x( 'Project', 'Add New on Toolbar', 'textdomain' ),
        'add_new'               => __( 'Add New', 'textdomain' ),
        'add_new_item'          => __( 'Add New Project', 'textdomain' ),
        'new_item'              => __( 'New Project', 'textdomain' ),
        'edit_item'             => __( 'Edit Project', 'textdomain' ),
        'view_item'             => __( 'View Project', 'textdomain' ),
        'all_items'             => __( 'All Projects', 'textdomain' ),
        'search_items'          => __( 'Search Projects', 'textdomain' ),
        'parent_item_colon'     => __( 'Parent Projects:', 'textdomain' ),
        'not_found'             => __( 'No Projects found.', 'textdomain' ),
        'not_found_in_trash'    => __( 'No Projects found in Trash.', 'textdomain' ),
        'featured_image'        => _x( 'Project Cover Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'textdomain' ),
        'set_featured_image'    => _x( 'Set cover image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
        'remove_featured_image' => _x( 'Remove cover image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
        'use_featured_image'    => _x( 'Use as cover image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
        'archives'              => _x( 'Project archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'textdomain' ),
        'insert_into_item'      => _x( 'Insert into Project', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'textdomain' ),
        'uploaded_to_this_item' => _x( 'Uploaded to this book', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'textdomain' ),
        'filter_items_list'     => _x( 'Filter Projects list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'textdomain' ),
        'items_list_navigation' => _x( 'Projects list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'textdomain' ),
        'items_list'            => _x( 'Projects list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'textdomain' ),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array( 'slug' => 'project' ),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => null,
        'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'attachments' ),
    );

    register_post_type( 'project', $args );
}

add_action( 'init', 'wpdocs_codex_project_init' );


/**
 * Grab latest post title by an author!
 *
 * @param array $data Options for the function.
 * @return string|null Post title for the latest,  * or null if none.
 */

 function resume_get_project( $data ) {
 	$id = $data['id'];
 	$project = null;

     $posts = get_posts( array(
         'include' => $id,
 		'post_type' => 'project'
     ));

     if ( empty( $posts ) ) {
         return null;
     }

 	$project_type = get_post_custom_values('type', $id);

 	if ( empty($project_type) ) {
 		$project_type = [''];
 	}

 	$post_attachments = get_post_custom_values('attachments', $id);

    if ( !empty($post_attachments) ) {
        $post_attachments = json_decode($post_attachments[0])->attachments;

     	foreach ($post_attachments as $key => $value) {
     		$project_attachments[$key]['url'] = wp_get_attachment_image_url($value->id, 'large');
     		$project_attachments[$key]['siteUrl'] = $value->fields->caption;
     	}
    } else {
        $project_attachments = false;
    }

 	$post = $posts[0];

 	$project['title'] = $post->post_title;
 	$project['content'] = apply_filters('the_content', $post->post_content);
 	$project['id'] = $post->ID;
 	$project['type'] = $project_type[0];
 	$project['attachments'] = $project_attachments;

     return $project;
 }

 add_action('rest_api_init', function () {
     register_rest_route( 'resume/v1', '/project/(?P<id>\d+)', array(
         'methods' => 'GET',
         'callback' => 'resume_get_project',
     ) );
 } );

 ?>
