/**
 * Mail autocomplete jQuery plugin.
 * Author: uniring
 * Original author: nuintun
 * $(selector).mailtip({
 *   mails: [], // Mail domains list as array of strings.
 *   onSelected： function(mail) {}, // On selected callback.
 *   width: 'auto', // Popup tip's width.
 *   offsetTop: -1, // Offset top relative default position.
 *   offsetLeft: 0, // Offset left relative default position.
 *   zIndex: 10 // Popup tip's z-index.
 *   disableAutocomplete: false // Allows autocomplete over this tooltip.
 * });
 */

'use strict';

(function ($) {
    // invalid email char test regexp
    var INVALIDEMAILRE = /[^\u4e00-\u9fa5_a-zA-Z0-9]/;
    // is support oninput event
    var hasInputEvent = 'oninput' in document.createElement('input');
    // is ie 9
    var ISIE9 = /MSIE 9.0/i.test(window.navigator.appVersion || window.navigator.userAgent);

    /**
     * Check if a value is a number.
     *
     * @param value
     * @returns {boolean}
     */
    function isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }

    /**
     * Create the popup tip element.
     *
     * @param input
     * @param config
     * @returns {*}
     */
    function createTip(input, config) {
        var tip = null;

        // Only create tip and binding event once.
        if (!input.data('data-mailtip')) {
            // Disable input autocomplete if config says so.
            if (config.disableAutocomplete) {
                input.attr('autocomplete', 'off');
            }

            tip = $('<ul class="ui-mailtip" style="display: none; float: none; '
                + 'position:absolute; margin: 0; padding: 0; z-index: '
                + config.zIndex + '"></ul>');

            // Append the element into document body.
            $('body').append(tip);

            // Bind needed events.
            tip.on('mouseenter mouseleave click', 'li', function (e) {
                var selected = $(this);

                switch (e.type) {
                    case 'mouseenter':
                        selected.addClass('hover');
                        break;
                    case 'click':
                        var mail = selected.attr('title');
                        input.val(mail).focus();
                        config.onSelected.call(input[0], mail);
                        break;
                    case 'mouseleave':
                        selected.removeClass('hover');
                        break;
                    default:
                        break;
                }
            });

            // Detect clicks outside tooltip to hide it.
            $(document).on('click', function (e) {
                if (e.target === input[0]) return;
                tip.hide();
            });

            input.data('data-mailtip', tip);
        }

        return tip || input.data('data-mailtip');
    }

    /**
     * Position the tooltip under input element.
     *
     * @param tip
     */
    function positionTip(tip) {
        var input = tip.input;
        var config = tip.config;
        var offset = input.offset();
        var calculatedWidth = input.outerWidth() - (tip.outerWidth() - tip.innerWidth()) + 1;

        // Calculate and apply position and size styles.
        tip.css({
            top: offset.top + input.outerHeight() + config.offsetTop,
            left: offset.left + config.offsetLeft,
            width: config.width === 'input' ? calculatedWidth : config.width
        });

        // When width is auto, set min width equal input width.
        if (config.width === 'auto') {
            tip.css('min-width', calculatedWidth);
        }
    }

    /**
     * Create mail hint list elements.
     *
     * @param value
     * @param tip
     * @returns {*}
     */
    function createItems(value, tip) {
        var mail;
        var domain;
        var items = '';
        var atIndex = value.indexOf('@');
        var hasAt = atIndex !== -1;

        if (hasAt) {
            domain = value.substring(atIndex + 1);
            value = value.substring(0, atIndex);
        }

        var count = 0;
        for (var i = 0, len = tip.config.mails.length; i < len; i++) {
            mail = tip.config.mails[i];

            if (hasAt && mail.indexOf(domain) !== 0) continue;

            items += '<li title="' + value + '@' + mail + '"><p>' + value + '@' + mail + '</p></li>';

            count++;
            if (count > tip.config.maximumVisibleOptions) {
                break;
            }
        }

        // active first item
        return items.replace('<li', '<li class="active"');
    }

    /**
     * Change current active list element.
     *
     * @param tip
     * @param up
     */
    function changeActive(tip, up) {
        var itemActive = tip.find('li.active');

        if (up) {
            var itemPrev = itemActive.prev();

            itemPrev = itemPrev.length ? itemPrev : tip.find('li:last');
            itemActive.removeClass('active');
            itemPrev.addClass('active');
        } else {
            var itemNext = itemActive.next();

            itemNext = itemNext.length ? itemNext : tip.find('li:first');
            itemActive.removeClass('active');
            itemNext.addClass('active');
        }
    }

    /**
     * Update email hint list and toggle tooltip visibility.
     *
     * @param tip
     * @param value
     * @param mails
     */
    function toggleTip(tip, value) {
        var atIndex = value.indexOf('@');

        // If input text is empty, has invalid chars or begin with @ or more than two @, hide the tooltip.
        if (!value
            || atIndex === 0
            || atIndex !== value.lastIndexOf('@')
            || INVALIDEMAILRE.test(atIndex === -1 ? value : value.substring(0, atIndex))) {
            tip.hide();
        } else {
            var items = createItems(value, tip);

            // If there's matching mails, show the tooltip.
            if (items) {
                positionTip(tip);
                tip.html(items).show();
            } else {
                tip.hide();
            }
        }
    }

    /**
     * Mailip jQuery plugin function.
     *
     * @param config
     * @returns {*}
     */
    $.fn.mailtip = function (config) {
        var defaults = {
            mails: [
                'gmail.com',
                'hotmail.com',
                'yahoo.com',
                'msn.com'
            ],
            onSelected: $.noop,
            width: 'auto',
            offsetTop: -1,
            offsetLeft: 0,
            zIndex: 10000,
            maximumVisibleOptions: 10,
            disableAutocomplete: true
        };

        config = $.extend({}, defaults, config);
        config.zIndex = isNumber(config.zIndex) ? config.zIndex : defaults.zIndex;
        config.offsetTop = isNumber(config.offsetTop) ? config.offsetTop : defaults.offsetTop;
        config.offsetLeft = isNumber(config.offsetLeft) ? config.offsetLeft : defaults.offsetLeft;
        config.onSelected = $.isFunction(config.onSelected) ? config.onSelected : defaults.onSelected;
        config.width = config.width === 'input' || isNumber(config.width) ? config.width : defaults.width;

        return this.each(function () {
            var input = $(this);
            var tip = createTip(input, config);

            // Attach related references to tooltip object.
            tip.config = config;
            tip.input = input;

            // Keyboard bindings.
            input.on('keydown', function (e) {
                // Ignore event if tooltip is hidden.
                if (tip.css('display') === 'none') return;

                switch (e.keyCode) {
                    // Backspace.
                    case 8:
                        // shit! ie9 input event has a bug, backspace do not trigger input event
                        if (ISIE9) {
                            input.trigger('input');
                        }
                        break;
                    // Tab.
                    case 9:
                        tip.hide();
                        break;
                    // Up arrow.
                    case 38:
                        e.preventDefault();
                        changeActive(tip, true);
                        break;
                    // Down arrow.
                    case 40:
                        e.preventDefault();
                        changeActive(tip);
                        break;
                    // Enter.
                    case 13:
                        e.preventDefault();

                        var mail = tip.find('li.active').attr('title');
                        input.val(mail).focus();
                        tip.hide();
                        config.onSelected.call(this, mail);
                        break;
                    default:
                        break;
                }
            });

            // Bind events that toggle tooltip visibility.
            if (hasInputEvent) {
                input.on('input', function () {
                    toggleTip(tip, this.value);
                });
            } else {
                input.on('propertychange', function (e) {
                    if (e.originalEvent.propertyName === 'value') {
                        toggleTip(tip, this.value);
                    }
                });
            }

            // IE9 shit :)
            if (ISIE9) {
                input.on('keyup', function (e) {
                    if (e.keyCode === 8) {
                        toggleTip(tip, this.value);
                    }
                });
            }
        });
    };
}(jQuery));
