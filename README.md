Map Extent Popup
================

This project contains a page that launches another page from which the user can select an extent on a map. When the map page is closed, the selected extent is displaed on the first page.

## Why? ##

We needed to put a map control from which a user could select an extent into a legacy ASP.NET Web Forms application. The map was supposed to go inside of an AJAX Control Toolkit control, but [that caused problems with the map]. This project is a workaround: the map will now instead be opened in a new browser window.

<!-- [Demo](http://wsdot-gis.github.io/map-extent-popup/) -->

## License ##
Licensed under [The MIT License](http://opensource.org/licenses/MIT). See the LICENSE.txt file for details.
