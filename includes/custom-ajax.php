<?
add_action('wp_ajax_bodycommerce_ajax_add_to_cart_woo', 'bodycommerce_ajax_add_to_cart_woo_callback');
add_action('wp_ajax_nopriv_bodycommerce_ajax_add_to_cart_woo', 'bodycommerce_ajax_add_to_cart_woo_callback');

function bodycommerce_ajax_add_to_cart_woo_callback()
	{
	ob_start();
	$product_id = apply_filters('woocommerce_add_to_cart_product_id', absint($_POST['product_id']));
	$quantity = empty($_POST['quantity']) ? 1 : apply_filters('woocommerce_stock_amount', $_POST['quantity']);
	$variation_id = $_POST['variation_id'];
	$variation = $_POST['variation'];
	$passed_validation = apply_filters('woocommerce_add_to_cart_validation', true, $product_id, $quantity);
	if ($passed_validation && WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $variation))
		{
		do_action('woocommerce_ajax_added_to_cart', $product_id);
		if (get_option('woocommerce_cart_redirect_after_add') == 'yes')
			{
			wc_add_to_cart_message($product_id);
			}

		WC_AJAX::get_refreshed_fragments();
		}
	  else
		{
		$this->json_headers();
		$data = array(
			'error' => true,
			'product_url' => apply_filters('woocommerce_cart_redirect_after_error', get_permalink($product_id) , $product_id)
		);
		echo json_encode($data);
		}

	die();
	}

add_action('wp_ajax_bodycommerce_ajax_add_to_cart_woo_single', 'bodycommerce_ajax_add_to_cart_woo_single_callback');
add_action('wp_ajax_nopriv_bodycommerce_ajax_add_to_cart_woo_single', 'bodycommerce_ajax_add_to_cart_woo_single_callback');

function bodycommerce_ajax_add_to_cart_woo_single_callback()
	{
	ob_start();
	$product_id = apply_filters('woocommerce_add_to_cart_product_id', absint($_POST['product_id']));
	$quantity = empty($_POST['quantity']) ? 1 : apply_filters('woocommerce_stock_amount', $_POST['quantity']);
	$passed_validation = apply_filters('woocommerce_add_to_cart_validation', true, $product_id, $quantity);
	if ($passed_validation && WC()->cart->add_to_cart($product_id, $quantity))
		{
		do_action('woocommerce_ajax_added_to_cart', $product_id);
		if (get_option('woocommerce_cart_redirect_after_add') == 'yes')
			{
			wc_add_to_cart_message($product_id);
			}

		WC_AJAX::get_refreshed_fragments();
		}
	  else
		{
		$this->json_headers();
		$data = array(
			'error' => true,
			'product_url' => apply_filters('woocommerce_cart_redirect_after_error', get_permalink($product_id) , $product_id)
		);
		echo json_encode($data);
		}

	die();
	}
