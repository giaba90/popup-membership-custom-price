jQuery.noConflict()(function($){
    "use strict";
$(document).ready(function() {

	$(".mcp_special_price-product-page").click(function(event){

		pop_init(event);

	});

$(".input-text.qty.text").bind('keyup mouseup', function() {
    var value = $(this).val();
    $('input[name=quantity]').val(value);

});

if (typeof wc_add_to_cart_params === 'undefined')
    return false;

$(document).on('click', '.mcp_special_price-product-page', function(e) {
    e.preventDefault();
    var variation_form = $(this).closest('.variations_form');
    var var_id = variation_form.find('input[name=variation_id]').val();
    var product_id = variation_form.find('input[name=product_id]').val();
    var quantity = variation_form.find('input[name=quantity]').val();
    $('.ajaxerrors').remove();
    var item = {},
        check = true;
   var  variations = variation_form.find('select[name^=attribute]');
    if (!variations.length) {
        variations = variation_form.find('[name^=attribute]:checked');
    }
    if (!variations.length) {
        variations = variation_form.find('input[name^=attribute]');
    }
    variations.each(function() {
            var $this = $(this),
                attributeName = $this.attr('name'),
                attributevalue = $this.val(),
                index,
                attributeTaxName;
            $this.removeClass('error');
            if (attributevalue.length === 0) {
                index = attributeName.lastIndexOf('_');
                attributeTaxName = attributeName.substring(index + 1);
                $this
                    .addClass('required error')
                    .before('Please select ' + attributeTaxName + ' ' )
                        check = false;
                    }
                else {
                    item[attributeName] = attributevalue;
                }
            });

        if (!check) {
            return false;
        }

        var $thisbutton = $(this);
        if ($thisbutton.is('.mcp_special_price-product-page')) {
            $thisbutton.removeClass('added');
            $thisbutton.addClass('loading');
            if ($(".variations_form")[0]) {
                var product_id = variation_form.find('input[name=product_id]').val();
                var quantity = variation_form.find('input[name=quantity]').val();
           //     var custom_price = variation_form.find('input[name=custom_price]').val();
             var custom_price = $thisbutton.attr("data-custom_price");
                var data = {
                    action: 'bodycommerce_ajax_add_to_cart_woo',
                    product_id: product_id,
                    quantity: quantity,
                    variation_id: var_id,
                    variation: item,
                    custom_price: custom_price
                };
            } else {
                var product_id = $('input[name=product_id]').val();
                var quantity =  $('input[name=quantity]').val();
                var custom_price = $('input[name=custom_price]').val();
                var data = {
                    action: 'bodycommerce_ajax_add_to_cart_woo_single',
                    product_id: product_id,
                    quantity: quantity,
                    custom_price: custom_price
                };
            }
            $('body').trigger('adding_to_cart', [$thisbutton, data]);
            $.post(wc_add_to_cart_params.ajax_url, data, function(response) {
                if (!response)
                    return;
                var this_page = window.location.toString();
                this_page = this_page.replace('add-to-cart', 'added-to-cart');
                if (response.error && response.product_url) {
                    window.location = response.product_url;
                    return;
                }
                if (wc_add_to_cart_params.cart_redirect_after_add === 'yes') {
                    window.location = wc_add_to_cart_params.cart_url;
                    return;
                } else {
                    $thisbutton.removeClass('loading');
                  /*  var fragments = response.fragments;
                    var cart_hash = response.cart_hash;
                    if (fragments) {
                        $.each(fragments, function(key) {
                            $(key).addClass('updating');
                        });
                    }
                    $('.shop_table.cart, .updating, .cart_totals').fadeTo('400', '0.6').block({
                        message: null,
                        overlayCSS: {
                            opacity: 0.6
                        }
                    });
                    $thisbutton.addClass('added');
                    if (fragments) {
                        $.each(fragments, function(key, value) {
                            $(key).replaceWith(value);
                        });
                    }
                    $('.widget_shopping_cart, .updating').stop(true).css('opacity', '1').unblock();
                    $('.shop_table.cart').load(this_page + ' .shop_table.cart:eq(0) > *', function() {
                        $('.shop_table.cart').stop(true).css('opacity', '1').unblock();
                        $(document.body).trigger('cart_page_refreshed');
                    });
                    $('.cart_totals').load(this_page + ' .cart_totals:eq(0) > *', function() {
                        $('.cart_totals').stop(true).css('opacity', '1').unblock();
                    });*/
                    var cart_content = response.fragments['div.widget_shopping_cart_content'];

                    $('.mini-cart-content').html(cart_content);

                    var count_item = cart_content.split("product-mini-cart").length;
                    var cart_item_count = $('.cart-item-count').html();

                    $('.mini-cart-link .mb-count-ajax').html(count_item-1);
                    var price = $('.mini-cart-content').find('.mini-cart-total').find('.woocommerce-Price-amount').html();
                    $('.mini-cart-link .mb-price').html(price);
                    $thisbutton.addClass('added');
                }
            });
            return false;
        } else {
            return true;
        }
    });

});




function pop_init(event) {
    var top;
    var variable = $('.single_variation_wrap');

    if ($(window).width() < 700 && variable.length > 0){
        top = (event.pageY)+604;
    }
    else if($(window).width() < 700){
    //    alert("mobile");
        top = ((event.pageY)*2)-300;
    }
    else if( $(window).width() > 1024 && variable.length > 0){
        top = (event.pageY)+200;
    }
    else {
        top = 100+(event.pageY)*2;
    }

    console.log(top);

    $(".pop-wrap").css({top: top});

//	var pop_height = '25%';
//	var pop_html = '<div class="pop-bg"></div><div class="pop-wrap"><p class="pop-x">X</p><div class="pop-content"></div></div>';

//	$("body").prepend( pop_html );
	$("#popup_mpc").show();

/*	$(".pop-wrap").animate({ "height" : pop_height }, 250).click(function(event){
		event.stopPropagation();
	});
*/
	$(".pop-bg, .pop-x").bind("click", function(event) {
		pop_close();
	});

//	$(".pop-content").text(my_content);

}

function pop_close() {
	$(".pop-bg, .pop-wrap").remove();
	$("body").unbind("click");
}

});