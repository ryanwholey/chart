export default function() {

    'use strict';
    // function serializeWithStyles(elem) {
    // Mapping between tag names and css default values lookup tables. This allows to exclude default values in the result.
    const defaultStylesByTagName = {};

    const range = (num, cb) => new Array(num).fill(0).forEach(cb);

    // Styles inherited from style sheets will not be rendered for elements with these tag names
    const noStyleTags = {"BASE":true,"HEAD":true,"HTML":true,"META":true,"NOFRAME":true,"NOSCRIPT":true,"PARAM":true,"SCRIPT":true,"STYLE":true,"TITLE":true};

    // This list determines which css default values lookup tables are precomputed at load time
    // Lookup tables for other tag names will be automatically built at runtime if needed
    const tagNames = ["A","ABBR","ADDRESS","AREA","ARTICLE","ASIDE","AUDIO","B","BASE","BDI","BDO","BLOCKQUOTE","BODY","BR","BUTTON","CANVAS","CAPTION","CENTER","CITE","CODE","COL","COLGROUP","COMMAND","DATALIST","DD","DEL","DETAILS","DFN","DIV","DL","DT","EM","EMBED","FIELDSET","FIGCAPTION","FIGURE","FONT","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEAD","HEADER","HGROUP","HR","HTML","I","IFRAME","IMG","INPUT","INS","KBD","KEYGEN","LABEL","LEGEND","LI","LINK","MAP","MARK","MATH","MENU","META","METER","NAV","NOBR","NOSCRIPT","OBJECT","OL","OPTION","OPTGROUP","OUTPUT","P","PARAM","PRE","PROGRESS","Q","RP","RT","RUBY","S","SAMP","SCRIPT","SECTION","SELECT","SMALL","SOURCE","SPAN","STRONG","STYLE","SUB","SUMMARY","SUP","SVG","TABLE","TBODY","TD","TEXTAREA","TFOOT","TH","THEAD","TIME","TITLE","TR","TRACK","U","UL","VAR","VIDEO","WBR"];

    // Precompute the lookup tables.
    range(tagNames.length, (_, i) => {
        if(!noStyleTags[tagNames[i]]) {
            defaultStylesByTagName[tagNames[i]] = computeDefaultStyleByTagName(tagNames[i]);
        }
    });

    function computeDefaultStyleByTagName(tagName) {
        let defaultStyle = {};
        let element = document.body.appendChild(document.createElement(tagName));
        let computedStyle = getComputedStyle(element);
        for (let i = 0; i < computedStyle.length; i++) {
            defaultStyle[computedStyle[i]] = computedStyle[computedStyle[i]];
        }
        document.body.removeChild(element);
        return defaultStyle;
    }

    const getDefaultStyleByTagName = (tagName) => {
        tagName = tagName.toUpperCase();
        if (!defaultStylesByTagName[tagName]) {
            defaultStylesByTagName[tagName] = computeDefaultStyleByTagName(tagName);
        }
        return defaultStylesByTagName[tagName];
    }

    const serializeWithStyles = (elem) => {
        return new Promise((resolve, reject) => {
            let cssTexts = [],
                elements,
                e,
                computedStyle,
                defaultStyle,
                cssPropName;

            if (elem.nodeType !== Node.ELEMENT_NODE) {
                reject(new TypeError())
            }
            cssTexts = [];
            elements = elem.querySelectorAll("*");
            range(elements.length, (_,i) => {
                // setTimeout(function(i){

                    e = elements[i];
                    if (!noStyleTags[e.tagName]) {
                        computedStyle = getComputedStyle(e);
                        defaultStyle = getDefaultStyleByTagName(e.tagName);
                        cssTexts[i] = e.style.cssText;
                        range(computedStyle.length,(_, j) =>{
                            cssPropName = computedStyle[j];
                            if (computedStyle[cssPropName] !== defaultStyle[cssPropName]) {
                                e.style[cssPropName] = computedStyle[cssPropName];
                            }
                        })
                    }
                // }.bind(this,i))

            });

            // function finish() {
                console.log('finish');
                let result = elem.outerHTML;
                for ( let i = 0; i < elements.length; i++ ) {
                    elements[i].style.cssText = cssTexts[i];
                }
                resolve(result);
            // }

        });
    }

    return serializeWithStyles;
};