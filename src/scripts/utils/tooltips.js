import * as d3 from "d3";

export function toolTips() {

    $(document).ready(function () {

        console.log("ready");
        //Part 0  Due to cross browser inconsistency you need to normalize the scrollTop/pageYOffset pixels
        function getScrollTop() {
            if (typeof pageYOffset != 'undefined') {
                //most browsers except IE before #9
                return pageYOffset;
            }
            else {
                var B = document.body; //Chrome and IE 'quirks' mode use the body as the first measured element
                var D = document.documentElement; //IE with doctype, because the documentElement is the first scroll measured element THANKS IE
                D = (D.clientHeight) ? D : B; //If D has a clientHieght (true) then use D as defined above, else D will equal B as described above... just a fancy inline if else
                return D.scrollTop;
            }
        }

        // Part #1 Opt-in for bootstrap tool tip with a few options, this is for any element that is NOT a SVG drawing. The element will need to have the [data-toggle="tooltip"] attribute to work
        $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
            placement: 'auto',
            title: 'No Value',
        });

        // Part #2 Uses a hidden tooltip with id svg-tooltip to place tooltip on mouse pointer on mouse move and leave events for selections
        $("circle, rect, path").on('mousemove', function (e) { //Elements to select for the tooltip function,as we add new ones we need to update
            $("#svg-tooltip").css({ top: e.pageY + getScrollTop(), left: e.pageX });     //css absolute top is event y position plus the scroll postion of bodyn x is event x position
            $('#svg-tooltip').prop('title', $(this).attr('title'));     //Sets the tilte attribute of the element the pointer is on 
            $('#svg-tooltip').tooltip('show')   //Shows the tooltip LAST to reduce flicker and jumping
        })

        $("circle, rect, path").on('mouseleave', function (e) {
            $('#svg-tooltip').tooltip('destroy') //cannot simply 'hide' this because it will take a hit to performance as well as confuse the tooltip
        })

    });

}