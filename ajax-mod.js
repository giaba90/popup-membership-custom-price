(function($){
    "use strict";
    $(document).ready(function() {

        $('body').on('change', '.select-product-ajax select', function(e){
            e.preventDefault();

            var current = $(this).parents('.mb-element-product-style8');
            var data_load = current.find('.select-product-ajax');
            var content = current.find('.product-load-filter');
            var data_args = data_load.attr('data-args');
            var bg_img_even = data_load.attr('data-bg_img_even');
            var bg_img_odd = data_load.attr('data-bg_img_odd');
            var number_row = data_load.attr('data-number_row');
            var image_size = data_load.attr('data-image_size');
            var animation_img = data_load.attr('data-animation_img');
            var hide_mask_img = data_load.attr('data-hide_mask_img');
            var on_off_category = data_load.attr('data-on_off_category');
            var select_filter = $(this).val();
            current.find('.icon-load').addClass('fa-circle-o-notch');
            $.ajax({
                type: 'POST',
                url: ajax_process.ajaxurl,
                crossDomain: true,
                data: {
                    action: 'load_select_filter_product',
                    data_load1 : data_args,
                    select_filter : select_filter,
                    hide_mask_img : hide_mask_img,
                    animation_img : animation_img,
                    image_size : image_size,
                    number_row : number_row,
                    bg_img_odd : bg_img_odd,
                    bg_img_even : bg_img_even,
                    on_off_category : on_off_category,
                },
                success: function(data){
                    var $newItem = $(data);
                    $('.product-load-filter').data('owlCarousel').destroy();
                    content.html(data);
                    $('.product-load-filter').each(function(){
                        var itemscustom =  $(this).data('itemscustom');
                        var autoplay =  $(this).data('autoplay');
                        var transition =  $(this).data('transition');
                        var navigation =  $(this).data('navigation');
                        var pagination =  $(this).data('pagination');

                        $(this).owlCarousel({
                            addClassActive:true,
                            stopOnHover:true,
                            lazyLoad:true,
                            navigation: navigation,
                            itemsCustom:itemscustom,
                            autoPlay:autoplay,
                            transitionStyle:transition,
                            pagination: pagination,
                            navigationText:['<i class="icon ion-ios-arrow-left"></i>','<i class="icon ion-ios-arrow-right"></i>'],
                        });
                    });
                    current.find('.icon-load').removeClass('fa-circle-o-notch');
                },
                error: function(MLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
            return false;
        });

        $('.wishlist-close').on('click',function(){
            $('.wishlist-mask').fadeOut();
        })

        $('.add_to_wishlist').live('click',function(){
            $('.wishlist-countdown').html('3');
            $(this).addClass('added');
            var product_id = $(this).attr("data-product-id");
            var product_title = $(this).attr("data-product-title");
            $('.wishlist-title').html(product_title);
            $('.wishlist-mask').fadeIn();
            var counter = 3;
            var popup;
            popup = setInterval(function() {
                counter--;
                if(counter < 0) {
                    clearInterval(popup);
                    $('.wishlist-mask').hide();
                } else {
                    $(".wishlist-countdown").text(counter.toString());
                }
            }, 1000);
        })

        $('body').on('click','.product-ajax-popup', function(e){
            $.fancybox.showLoading();
            var product_id = $(this).attr('data-product-id');

            $.ajax({
                type: 'POST',
                url: ajax_process.ajaxurl,
                crossDomain: true,
                data: {
                    action: 'product_popup_content',
                    product_id: product_id
                },
                success: function(res){
                    if(res[res.length-1] == '0' ){
                        res = res.split('');
                        res[res.length-1] = '';
                        res = res.join('');
                    }
                    $.fancybox.hideLoading();
                    $.fancybox(res, {
                        width: 800,
                        height: 470,
                        autoSize: false,
                        onStart: function(opener) {
                            if ($(opener).attr('id') == 'login') {
                                $.get('/hicommon/authenticated', function(res) {
                                    if ('yes' == res) {
                                        console.log('this user must have already authenticated in another browser tab, SO I want to avoid opening the fancybox.');
                                        return false;
                                    } else {
                                        console.log('the user is not authenticated');
                                        return true;
                                    }
                                });
                            }
                        },
                    });
                    /**
                     * @TODO Code a function the calculate available combination instead of use WC hooks
                     */
                    $.fn.tawcvs_variation_swatches_form = function () {
                        return this.each( function() {
                            var $form = $( this ),
                                clicked = null,
                                selected = [];

                            $form
                                .addClass( 'swatches-support' )
                                .on( 'click', '.swatch', function ( e ) {
                                    e.preventDefault();
                                    var $el = $( this ),
                                        $select = $el.closest( '.value' ).find( 'select' ),
                                        attribute_name = $select.data( 'attribute_name' ) || $select.attr( 'name' ),
                                        value = $el.data( 'value' );

                                    $select.trigger( 'focusin' );

                                    // Check if this combination is available
                                    if ( ! $select.find( 'option[value="' + value + '"]' ).length ) {
                                        $el.siblings( '.swatch' ).removeClass( 'selected' );
                                        $select.val( '' ).change();
                                        $form.trigger( 'tawcvs_no_matching_variations', [$el] );
                                        return;
                                    }

                                    clicked = attribute_name;

                                    if ( selected.indexOf( attribute_name ) === -1 ) {
                                        selected.push(attribute_name);
                                    }

                                    if ( $el.hasClass( 'selected' ) ) {
                                        $select.val( '' );
                                        $el.removeClass( 'selected' );

                                        delete selected[selected.indexOf(attribute_name)];
                                    } else {
                                        $el.addClass( 'selected' ).siblings( '.selected' ).removeClass( 'selected' );
                                        $select.val( value );
                                    }

                                    $select.change();
                                } )
                                .on( 'click', '.reset_variations', function () {
                                    $( this ).closest( '.variations_form' ).find( '.swatch.selected' ).removeClass( 'selected' );
                                    selected = [];
                                } )
                                .on( 'tawcvs_no_matching_variations', function() {
                                    window.alert( wc_add_to_cart_variation_params.i18n_no_matching_variations_text );
                                } );
                        } );
                    };

                    $( function () {
                        $( '.variations_form' ).tawcvs_variation_swatches_form();
                        $( document.body ).trigger( 'tawcvs_initialized' );
                    } );
                    if($('.detail-gallery').length>0){
                        $('.detail-gallery').each(function(){
                            if($(this).find('.carousel').length>0) {
                                var data = $(this).find(".carousel").data();
                                $(this).find(".carousel").jCarouselLite({
                                    btnNext: $(this).find(".gallery-control .mbnext"),
                                    btnPrev: $(this).find(".gallery-control .mbprev"),
                                    visible: data.visible,
                                    vertical: data.vertical,
                                });
                            }
                            //Elevate Zoom
                            $('.detail-gallery').find('.mid img').elevateZoom({
                                zoomType: "lens",
                                lensShape: "square",
                                lensSize: 100,
                                borderSize:1,
                                containLensZoom:true
                            });
                            $(this).find(".carousel a").on('click',function(event) {
                                event.preventDefault();
                                $(this).parents('.detail-gallery').find(".carousel a").removeClass('active');
                                $(this).addClass('active');
                                var z_url =  $(this).find('img').attr("src");
                                var z_srcset =  $(this).find('img').attr("srcset");
                                $(this).parents('.detail-gallery').find(".mid img").attr("src", z_url);
                                $(this).parents('.detail-gallery').find(".mid img").attr("srcset", z_srcset);
                                $('.zoomLens').css('background-image','url("'+z_url+'")');
                            });
                        });
                    }
                    $('.fancybox-overlay, .fancybox-close').on('click',function () {
                        $('.zoomContainer').remove();
                    })
                    /*!
                     * Variations Plugin
                     */
                    !function(t,a,i,r){var e=function(t){this.$form=t,this.$attributeFields=t.find(".variations select"),this.$singleVariation=t.find(".single_variation"),this.$singleVariationWrap=t.find(".single_variation_wrap"),this.$resetVariations=t.find(".reset_variations"),this.$product=t.closest(".product"),this.variationData=t.data("product_variations"),this.useAjax=!1===this.variationData,this.xhr=!1,this.$singleVariationWrap.show(),this.$form.off(".wc-variation-form"),this.getChosenAttributes=this.getChosenAttributes.bind(this),this.findMatchingVariations=this.findMatchingVariations.bind(this),this.isMatch=this.isMatch.bind(this),this.toggleResetLink=this.toggleResetLink.bind(this),t.on("click.wc-variation-form",".reset_variations",{variationForm:this},this.onReset),t.on("reload_product_variations",{variationForm:this},this.onReload),t.on("hide_variation",{variationForm:this},this.onHide),t.on("show_variation",{variationForm:this},this.onShow),t.on("click",".single_add_to_cart_button",{variationForm:this},this.onAddToCart),t.on("reset_data",{variationForm:this},this.onResetDisplayedVariation),t.on("reset_image",{variationForm:this},this.onResetImage),t.on("change.wc-variation-form",".variations select",{variationForm:this},this.onChange),t.on("found_variation.wc-variation-form",{variationForm:this},this.onFoundVariation),t.on("check_variations.wc-variation-form",{variationForm:this},this.onFindVariation),t.on("update_variation_values.wc-variation-form",{variationForm:this},this.onUpdateAttributes),setTimeout(function(){t.trigger("check_variations"),t.trigger("wc_variation_form")},100)};e.prototype.onReset=function(t){t.preventDefault(),t.data.variationForm.$attributeFields.val("").change(),t.data.variationForm.$form.trigger("reset_data")},e.prototype.onReload=function(t){var a=t.data.variationForm;a.variationData=a.$form.data("product_variations"),a.useAjax=!1===a.variationData,a.$form.trigger("check_variations")},e.prototype.onHide=function(t){t.preventDefault(),t.data.variationForm.$form.find(".single_add_to_cart_button").removeClass("wc-variation-is-unavailable").addClass("disabled wc-variation-selection-needed"),t.data.variationForm.$form.find(".woocommerce-variation-add-to-cart").removeClass("woocommerce-variation-add-to-cart-enabled").addClass("woocommerce-variation-add-to-cart-disabled")},e.prototype.onShow=function(t,a,i){t.preventDefault(),i?(t.data.variationForm.$form.find(".single_add_to_cart_button").removeClass("disabled wc-variation-selection-needed wc-variation-is-unavailable"),t.data.variationForm.$form.find(".woocommerce-variation-add-to-cart").removeClass("woocommerce-variation-add-to-cart-disabled").addClass("woocommerce-variation-add-to-cart-enabled")):(t.data.variationForm.$form.find(".single_add_to_cart_button").removeClass("wc-variation-selection-needed").addClass("disabled wc-variation-is-unavailable"),t.data.variationForm.$form.find(".woocommerce-variation-add-to-cart").removeClass("woocommerce-variation-add-to-cart-enabled").addClass("woocommerce-variation-add-to-cart-disabled"))},e.prototype.onAddToCart=function(i){t(this).is(".disabled")&&(i.preventDefault(),t(this).is(".wc-variation-is-unavailable")?a.alert(wc_add_to_cart_variation_params.i18n_unavailable_text):t(this).is(".wc-variation-selection-needed")&&a.alert(wc_add_to_cart_variation_params.i18n_make_a_selection_text))},e.prototype.onResetDisplayedVariation=function(t){var a=t.data.variationForm;a.$product.find(".product_meta").find(".sku").wc_reset_content(),a.$product.find(".product_weight").wc_reset_content(),a.$product.find(".product_dimensions").wc_reset_content(),a.$form.trigger("reset_image"),a.$singleVariation.slideUp(200).trigger("hide_variation")},e.prototype.onResetImage=function(t){t.data.variationForm.$form.wc_variations_image_update(!1)},e.prototype.onFindVariation=function(a){var i=a.data.variationForm,r=i.getChosenAttributes(),e=r.data;if(r.count===r.chosenCount)if(i.useAjax)i.xhr&&i.xhr.abort(),i.$form.block({message:null,overlayCSS:{background:"#fff",opacity:.6}}),e.product_id=parseInt(i.$form.data("product_id"),10),e.custom_data=i.$form.data("custom_data"),i.xhr=t.ajax({url:wc_add_to_cart_variation_params.wc_ajax_url.toString().replace("%%endpoint%%","get_variation"),type:"POST",data:e,success:function(t){t?i.$form.trigger("found_variation",[t]):(i.$form.trigger("reset_data"),i.$form.find(".single_variation").after('<p class="wc-no-matching-variations woocommerce-info">'+wc_add_to_cart_variation_params.i18n_no_matching_variations_text+"</p>"),i.$form.find(".wc-no-matching-variations").slideDown(200))},complete:function(){i.$form.unblock()}});else{i.$form.trigger("update_variation_values");var o=i.findMatchingVariations(i.variationData,e).shift();o?i.$form.trigger("found_variation",[o]):(i.$form.trigger("reset_data"),i.$form.find(".single_variation").after('<p class="wc-no-matching-variations woocommerce-info">'+wc_add_to_cart_variation_params.i18n_no_matching_variations_text+"</p>"),i.$form.find(".wc-no-matching-variations").slideDown(200))}else i.$form.trigger("update_variation_values"),i.$form.trigger("reset_data");i.toggleResetLink(r.chosenCount>0)},e.prototype.onFoundVariation=function(a,i){var r=a.data.variationForm,e=r.$product.find(".product_meta").find(".sku"),o=r.$product.find(".product_weight"),n=r.$product.find(".product_dimensions"),s=r.$singleVariationWrap.find(".quantity"),_=!0,c=!1,d="";i.sku?e.wc_set_content(i.sku):e.wc_reset_content(),i.weight?o.wc_set_content(i.weight_html):o.wc_reset_content(),i.dimensions?n.wc_set_content(i.dimensions_html):n.wc_reset_content(),r.$form.wc_variations_image_update(i),i.variation_is_visible?(c=wp.template("variation-template"),i.variation_id):c=wp.template("unavailable-variation-template"),d=(d=(d=c({variation:i})).replace("/*<![CDATA[*/","")).replace("/*]]>*/",""),r.$singleVariation.html(d),r.$form.find('input[name="variation_id"], input.variation_id').val(i.variation_id).change(),"yes"===i.is_sold_individually?(s.find("input.qty").val("1").attr("min","1").attr("max",""),s.hide()):(s.find("input.qty").attr("min",i.min_qty).attr("max",i.max_qty),s.show()),i.is_purchasable&&i.is_in_stock&&i.variation_is_visible||(_=!1),t.trim(r.$singleVariation.text())?r.$singleVariation.slideDown(200).trigger("show_variation",[i,_]):r.$singleVariation.show().trigger("show_variation",[i,_])},e.prototype.onChange=function(a){var i=a.data.variationForm;i.$form.find('input[name="variation_id"], input.variation_id').val("").change(),i.$form.find(".wc-no-matching-variations").remove(),i.useAjax?i.$form.trigger("check_variations"):(i.$form.trigger("woocommerce_variation_select_change"),i.$form.trigger("check_variations"),t(this).blur()),i.$form.trigger("woocommerce_variation_has_changed")},e.prototype.addSlashes=function(t){return t=t.replace(/'/g,"\\'"),t=t.replace(/"/g,'\\"')},e.prototype.onUpdateAttributes=function(a){var i=a.data.variationForm,r=i.getChosenAttributes().data;i.useAjax||(i.$attributeFields.each(function(a,e){var o=t(e),n=o.data("attribute_name")||o.attr("name"),s=t(e).data("show_option_none"),_=":gt(0)",c=0,d=t("<select/>"),m=o.val()||"",v=!0;if(!o.data("attribute_html")){var l=o.clone();l.find("option").removeAttr("disabled attached").removeAttr("selected"),o.data("attribute_options",l.find("option"+_).get()),o.data("attribute_html",l.html())}d.html(o.data("attribute_html"));var h=t.extend(!0,{},r);h[n]="";var g=i.findMatchingVariations(i.variationData,h);for(var f in g)if("undefined"!=typeof g[f]){var u=g[f].attributes;for(var p in u)if(u.hasOwnProperty(p)){var w=u[p],b="";p===n&&(g[f].variation_is_active&&(b="enabled"),w?(w=t("<div/>").html(w).text(),d.find('option[value="'+i.addSlashes(w)+'"]').addClass("attached "+b)):d.find("option:gt(0)").addClass("attached "+b))}}c=d.find("option.attached").length,!m||0!==c&&0!==d.find('option.attached.enabled[value="'+i.addSlashes(m)+'"]').length||(v=!1),c>0&&m&&v&&"no"===s&&(d.find("option:first").remove(),_=""),d.find("option"+_+":not(.attached)").remove(),o.html(d.html()),o.find("option"+_+":not(.enabled)").prop("disabled",!0),m?v?o.val(m):o.val("").change():o.val("")}),i.$form.trigger("woocommerce_update_variation_values"))},e.prototype.getChosenAttributes=function(){var a={},i=0,r=0;return this.$attributeFields.each(function(){var e=t(this).data("attribute_name")||t(this).attr("name"),o=t(this).val()||"";o.length>0&&r++,i++,a[e]=o}),{count:i,chosenCount:r,data:a}},e.prototype.findMatchingVariations=function(t,a){for(var i=[],r=0;r<t.length;r++){var e=t[r];this.isMatch(e.attributes,a)&&i.push(e)}return i},e.prototype.isMatch=function(t,a){var i=!0;for(var r in t)if(t.hasOwnProperty(r)){var e=t[r],o=a[r];void 0!==e&&void 0!==o&&0!==e.length&&0!==o.length&&e!==o&&(i=!1)}return i},e.prototype.toggleResetLink=function(t){t?"hidden"===this.$resetVariations.css("visibility")&&this.$resetVariations.css("visibility","visible").hide().fadeIn():this.$resetVariations.css("visibility","hidden")},t.fn.wc_variation_form=function(){return new e(this),this},t.fn.wc_set_content=function(t){void 0===this.attr("data-o_content")&&this.attr("data-o_content",this.text()),this.text(t)},t.fn.wc_reset_content=function(){void 0!==this.attr("data-o_content")&&this.text(this.attr("data-o_content"))},t.fn.wc_set_variation_attr=function(t,a){void 0===this.attr("data-o_"+t)&&this.attr("data-o_"+t,this.attr(t)?this.attr(t):""),!1===a?this.removeAttr(t):this.attr(t,a)},t.fn.wc_reset_variation_attr=function(t){void 0!==this.attr("data-o_"+t)&&this.attr(t,this.attr("data-o_"+t))},t.fn.wc_maybe_trigger_slide_position_reset=function(a){var i=t(this),r=i.closest(".product").find(".images"),e=!1,o=a&&a.image_id?a.image_id:"";i.attr("current-image")!==o&&(e=!0),i.attr("current-image",o),e&&r.trigger("woocommerce_gallery_reset_slide_position")},t.fn.wc_variations_image_update=function(i){var r=this,e=r.closest(".product"),o=e.find(".images"),n=e.find(".flex-control-nav"),s=n.find("li:eq(0) img"),_=o.find(".woocommerce-product-gallery__image, .woocommerce-product-gallery__image--placeholder").eq(0),c=_.find(".wp-post-image"),d=_.find("a").eq(0);if(i&&i.image&&i.image.src&&i.image.src.length>1){if(n.find('li img[src="'+i.image.thumb_src+'"]').length>0)return n.find('li img[src="'+i.image.thumb_src+'"]').trigger("click"),void r.attr("current-image",i.image_id);c.wc_set_variation_attr("src",i.image.src),c.wc_set_variation_attr("height",i.image.src_h),c.wc_set_variation_attr("width",i.image.src_w),c.wc_set_variation_attr("srcset",i.image.srcset),c.wc_set_variation_attr("sizes",i.image.sizes),c.wc_set_variation_attr("title",i.image.title),c.wc_set_variation_attr("alt",i.image.alt),c.wc_set_variation_attr("data-src",i.image.full_src),c.wc_set_variation_attr("data-large_image",i.image.full_src),c.wc_set_variation_attr("data-large_image_width",i.image.full_src_w),c.wc_set_variation_attr("data-large_image_height",i.image.full_src_h),_.wc_set_variation_attr("data-thumb",i.image.src),s.wc_set_variation_attr("src",i.image.thumb_src),d.wc_set_variation_attr("href",i.image.full_src)}else c.wc_reset_variation_attr("src"),c.wc_reset_variation_attr("width"),c.wc_reset_variation_attr("height"),c.wc_reset_variation_attr("srcset"),c.wc_reset_variation_attr("sizes"),c.wc_reset_variation_attr("title"),c.wc_reset_variation_attr("alt"),c.wc_reset_variation_attr("data-src"),c.wc_reset_variation_attr("data-large_image"),c.wc_reset_variation_attr("data-large_image_width"),c.wc_reset_variation_attr("data-large_image_height"),_.wc_reset_variation_attr("data-thumb"),s.wc_reset_variation_attr("src"),d.wc_reset_variation_attr("href");a.setTimeout(function(){t(a).trigger("resize"),r.wc_maybe_trigger_slide_position_reset(i),o.trigger("woocommerce_gallery_init_zoom")},20)},t(function(){"undefined"!=typeof wc_add_to_cart_variation_params&&t(".variations_form").each(function(){t(this).wc_variation_form()})})}(jQuery,window,document);



                    //Fix product variable thumb
                    $('body .variations_form select').live('change',function(){
                        var text = $(this).val();
                        $(this).parents('.attr-product').find('.current-color').html(text);
                        var id = $('input[name="variation_id"]').val();
                        if(id){
                            $('.product-gallery .bx-pager').find('a[data-variation_id="'+id+'"]').trigger( 'click' );
                            if($('.product-supper11').length > 0){
                                var slider_owl = $(this).parents('.product-supper11').find('.product-detail11 .wrap-item');
                                var index = slider_owl.find('.item[data-variation_id="'+id+'"]').attr('data-index');
                                slider_owl.trigger('owl.goTo', index);
                            }
                            if($('.trend-box18').length > 0){
                                $(this).parents('.item-detail18').find('.trend-thumb18').find('img').removeClass('active');
                                $(this).parents('.item-detail18').find('.trend-thumb18').find('div[data-variation_id="'+id+'"]').find('img').addClass('active');
                            }
                        }
                    })
                    // variable product
                    if($('.wrap-attr-product.special').length > 0){
                        $('.attr-filter ul li a').live('click',function(){
                            event.preventDefault();
                            var text = $(this).html();
                            $(this).parents('.attr-product').find('.current-color').html(text);
                            $(this).parents('ul').find('li').removeClass('active');
                            $(this).parents('ul').find('li a').removeClass('active');
                            $(this).parent().addClass('active');
                            $(this).addClass('active');
                            var attribute = $(this).parent().attr('data-attribute');
                            var id = $(this).parents('ul').attr('data-attribute-id');
                            $('#'+id).val(attribute);
                            $('#'+id).trigger( 'change' );
                            $('#'+id).trigger( 'focusin' );
                            return false;
                        })
                        $('.attr-hover-box').hover(function(){
                            var seff = $(this);
                            var old_html = $(this).find('ul').html();
                            var current_val = $(this).find('ul li.active').attr('data-attribute');
                            $(this).next().find('select').trigger( 'focusin' );
                            var content = '';
                            $(this).next().find('select').find('option').each(function(){
                                var val = $(this).attr('value');
                                var title = $(this).html();
                                var el_class = '';
                                var in_class = '';
                                if(current_val == val){
                                    el_class = ' class="active"';
                                    in_class = 'active';
                                }
                                if(val != ''){
                                    content += '<li'+el_class+' data-attribute="'+val+'"><a href="#" class="bgcolor-'+val+' '+in_class+'"><span></span>'+title+'</a></li>';
                                }
                            })
                            if(old_html != content) $(this).find('ul').html(content);
                        })
                        $('body .reset_variations').live('click',function(){
                            $('.attr-hover-box').each(function(){
                                var seff = $(this);
                                var old_html = $(this).find('ul').html();
                                var current_val = $(this).find('ul li.active').attr('data-attribute');
                                $(this).next().find('select').trigger( 'focusin' );
                                var content = '';
                                $(this).next().find('select').find('option').each(function(){
                                    var val = $(this).attr('value');
                                    var title = $(this).html();
                                    var el_class = '';
                                    var in_class = '';
                                    if(current_val == val){
                                        el_class = ' class="active"';
                                        in_class = 'active';
                                    }
                                    if(val != ''){
                                        content += '<li'+el_class+' data-attribute="'+val+'"><a href="#" class="bgcolor-'+val+' '+in_class+'"><span></span>'+title+'</a></li>';
                                    }
                                })
                                if(old_html != content) $(this).find('ul').html(content);
                                $(this).find('ul li').removeClass('active');
                            })
                        })
                    }

                    //QUANTITY CLICK
                    $("body").on("click",".quantity .qty-up",function(){
                        var seff = $(this).parents('.quantity').find('input');
                        var min = seff.attr("min");
                        var max = seff.attr("max");
                        var step = seff.attr("step");
                        if(step === undefined) step = 1;
                        if(max !==undefined && Number($(this).prev().val())< Number(max) || max === undefined){
                            if(step!='') $(this).prev().val(Number($(this).prev().val())+Number(step));
                        }
                        $( 'div.woocommerce > form input[name="update_cart"]' ).prop( 'disabled', false );
                        return false;
                    })
                    $("body").on("click",".quantity .qty-down",function(){
                        var seff = $(this).parents('.quantity').find('input');
                        var min = seff.attr("min");
                        var max = seff.attr("max");
                        var step = seff.attr("step");
                        if(step === undefined) step = 1;
                        if(Number($(this).next().val()) > 1){
                            if(min !==undefined && $(this).next().val()>min || min === undefined){
                                if(step!='') $(this).next().val(Number($(this).next().val())-Number(step));
                            }
                        }
                        $( 'div.woocommerce > form input[name="update_cart"]' ).prop( 'disabled', false );
                        return false;
                    })
                    $("body").on("keyup change","input.qty-val",function(){
                        var max = $(this).attr('data-max');
                        if( Number($(this).val()) > Number(max) ) $(this).val(max);
                        $( 'div.woocommerce > form input[name="update_cart"]' ).prop( 'disabled', false );
                    })
                    //END
                },
                error: function(MLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
            return false;
        })


        $("body").on("click",".add_to_cart_button.s7up-ajax_add_to_cart:not(.product_type_variable)",function(e){

            e.preventDefault();
            var seff = $(this);
            seff.removeClass('added');
            seff.addClass('loading');
            var product_id = $(this).attr("data-product_id");
            var custom_price = $(this).attr("data-custom_price");
            $.ajax({
                type : "post",
                url : ajax_process.ajaxurl,
                crossDomain: true,
                data: {
                    action: "add_to_cart",
                    product_id: product_id,
                    custom_price: custom_price
                },

                success: function(data){
                    seff.removeClass('loading');
                    var cart_content = data.fragments['div.widget_shopping_cart_content'];

                    $('.mini-cart-content').html(cart_content);

                    var count_item = cart_content.split("product-mini-cart").length;
                    var cart_item_count = $('.cart-item-count').html();

                    $('.mini-cart-link .mb-count-ajax').html(count_item-1);
                    var price = $('.mini-cart-content').find('.mini-cart-total').find('.woocommerce-Price-amount').html();
                    $('.mini-cart-link .mb-price').html(price);
                    seff.addClass('added');
                },
                error: function(MLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        });
        $('body').on('click', '.product-mini-cart .remove', function(e){
            e.preventDefault();
            $(this).parents('.product-mini-cart').addClass("hidden");
            var cart_item_key = $(this).parents('.product-mini-cart').attr("data-key");
            $.ajax({
                type: 'POST',
                url: ajax_process.ajaxurl,
                crossDomain: true,
                data: {
                    action: 'product_remove',
                    cart_item_key: cart_item_key
                },
                success: function(data){
                    var cart_content = data.fragments['div.widget_shopping_cart_content'];
                    $('.mini-cart-content').html(cart_content);
                    // set count
                    var count_item = cart_content.split("product-mini-cart").length;
                    var cart_item_count = $('.product-mini-cart').html();
                    $('.mini-cart-link .mb-count-ajax').html(count_item-1);
                    //$('.cart-item-count').html(cart_item_count);
                    // set price
                    var price = $('.mini-cart-content').find('.mini-cart-total').find('.woocommerce-Price-amount').html();
                    if(price) $('.mini-cart-link .mb-price').html(price);
                    else $('.mini-cart-link .mb-price').html($('.total-default').html());
                },
                error: function(MLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
            return false;
        });/*
        $('body').on('click', '.product-mini-cart .remove', function(e){
            e.preventDefault();
            var cart_item_key = $(this).parents('.product-mini-cart').attr("data-key");
            var element = $(this).parents('.product-mini-cart');
            var currency = ["د.إ","лв.","kr.","Kr.","Rs.","руб."];
            var decimal = $(".num-decimal").val();
            function get_currency(pricehtml){
                var check,index,price,i;
                for(i = 0;i<6;i++){
                    if(pricehtml.search(currency[i]) != -1)  {
                        check = true;
                        index = i;
                    }
                }
                if(check) price =  pricehtml.replace(currency[index],"");
                else price = pricehtml.replace(/[^0-9\.]+/g,"");
                return price;
            }

            $.ajax({
                type: 'POST',
                url: ajax_process.ajaxurl,
                crossDomain: true,
                data: {
                    action: 'product_remove',
                    cart_item_key: cart_item_key
                },
                success: function(data){
                    console.log(cart_item_key);
                    var price_html = element.find('span.amount').html();

                    var price = get_currency(price_html);

                    var qty = element.find('.mini-cart-qty').find('span').html();
                    var price_remove = price*qty;
                    var current_total_html = $(".mini-cart-total").find(".amount").html();
                    var current_total = get_currency(current_total_html);
                    var new_total = current_total-price_remove;
                    new_total = parseFloat(new_total).toFixed(decimal);
                    current_total_html = current_total_html.replace(',','');
                    var new_total_html = current_total_html.replace(current_total,new_total);

                    element.slideUp().remove();
                    //gia
                    $(".mini-cart-total").find(".amount").html(new_total_html);
                    $(".mb-cart-total .woocommerce-Price-amount").html(new_total_html);
                    $('.mini-cart-link .mb-price').html(new_total_html);
                    //so luong
                    var current_html = $('.mb-count-ajax').html();
                    $('.mb-count-ajax').html(current_html-1);

                    $('.item-info-cart[data-key="'+cart_item_key+'"]').remove();
                },
                error: function(MLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
            return false;
        });
*/
        $('.live-search-true input[name="s"]').on('keyup',function(){
            console.log('run');
            var key = $(this).val();
            var trim_key = key.trim();
            var post_type = $(this).parent('.live-search-true').find('input[name="post_type"]').val();
            var seff = $(this);
            var content = seff.parent().find('.list-product-search');
            content.html('<i class="fa fa-spinner fa-spin"></i>');
            content.addClass('ajax-loading');
            $(this).parent('.live-search-true').toggleClass('active');

            $.ajax({
                type : "post",
                url : ajax_process.ajaxurl,
                crossDomain: true,
                data: {
                    action: "live_search",
                    key: key,
                    post_type: post_type,
                },
                success: function(data){
                    if(data[data.length-1] == '0' ){
                        data = data.split('');
                        data[data.length-1] = '';
                        data = data.join('');
                    }
                    content.html(data);
                },
                error: function(MLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        })
    });
})(jQuery);