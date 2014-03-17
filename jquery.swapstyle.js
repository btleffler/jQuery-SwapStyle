/**
 * jQuery.SwapStyle: Swap Stylesheets
 * Author: Benjamin Leffler <btleffler@gmail.com>
 * Date: 03/17/14
 */

(function ($) {
    "use strict";

    $.swapstyle = function (original, replacement) {
        var s,         // Sheet index
            r,         // Rule index
            thisSheet, // Cache each sheet as we loop through
            thisNode,  // Node for link tags
            href,      // Cache the href
            cssRules,  // So we can have where the browser keeps import rules
            rule;      // Cache the rule

        // Loop through all the stylesheets
        for (s = 0; s < document.styleSheets.length; s++) {
            // The current stylesheet
            thisSheet = document.styleSheets[s];

            // If the href property isn't null, we should check the rule.
            if (thisSheet.href !== null && typeof thisSheet.href !== "undefined") {
                if (thisSheet.href.indexOf(original) !== -1) {
                    // Modify the link in question
                    thisNode = thisSheet.ownerNode;

                    if (thisSheet.owningElement) {
                        thisNode = thisSheet.owningElement; //IE
                    }

                    href = thisNode.href;
                    thisNode.href = href.replace(original, replacement);

                    // We've already replaced the stylesheet, so we
                    // shouldn't haveto check any of it's rules.
                    continue;
                }
            }

            // Figure out where the browser keeps it's css rules
            cssRules = thisSheet.cssRules;

            if (thisSheet.imports) {
                cssRules = thisSheet.imports; // IE
            }

            // Go through the stylesheet's rules if there are any
            if (cssRules !== null) {
                for (r = 0; r < cssRules.length; r++) {
                    // The current rule
                    rule = cssRules[r];

                    /*
                     * If the rule has an href, it's an @import! We
                     * should check the href. I tried using 'instanceof,'
                     * but Opera had no idea how to handle that
                     *
                    if (rule instanceof CSSImportRule && rule.href.indexOf(original) != -1) { */

                    if (rule.href !== null && typeof rule.href !== "undefined") {
                        if (rule.href.indexOf(original) !== -1) {
                            // Insert the new rule at the end
                            if (thisSheet.insertRule) {
                                thisSheet.insertRule("@import url(" + replacement + ");", cssRules.length);
                            } else {
                                // IE
                                thisSheet.addImport(replacement, cssRules.length);
                            }

                            // Delete the old one to get rid of clutter
                            if (thisSheet.deleteRule) {
                                thisSheet.deleteRule(r);
                            } else {
                                // IE
                                thisSheet.removeImport(r);
                            }
                        } // IF: rule.href.indexOf( original ) !== -1
                    } // IF: rule.href !== null && typeof rule.href !== "undefined"
                } // FOR: r = 0; r < cssRules.length; r++
            } // IF: typeof cssRules !== "undefined"
        } // FOR: s = 0; s < document.styleSheets.length; s++
    };
})(jQuery);
