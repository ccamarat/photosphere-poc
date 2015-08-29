!function () {
    'use strict';

    var container = $('#photo-viewer');

    var checkIsPhotoSphere = function (img, callback) {
        if (!window.XMLHttpRequest) {
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var binary = xhr.responseText;
                var metaStart = binary.indexOf('<x:xmpmeta');
                var metaEnd = binary.indexOf('</x:xmpmeta>');
                var data = binary.substring(metaStart, metaEnd);

                // No data retrieved
                if (metaStart == -1 || metaEnd == -1 || data.indexOf('GPano:') == -1) {
                    callback(false);
                } else {
                    callback(true);
                }
            }
        };

        xhr.open('GET', img.src, true);
        xhr.send(null);
    };

    var showImage = function (img) {
        if (img instanceof jQuery.Event) {
            img = this;
        }
        var $img = $(img).clone();

        container.empty().append($img);

        checkIsPhotoSphere(img, function (isPhotoSphere) {
            if (!isPhotoSphere) {
                return;
            }

            var $sphere = $('<img src="images/logo_photosphere.png" class="photo-sphere">');

            $sphere.click(function () {
                container.empty();
                PhotoSphereViewer({
                    container: container[0],
                    panorama: img.src
                });
            });

            container.append($sphere);
        });
    };

    $('#gallery').on('click', 'img', showImage);

    showImage($('#gallery img')[0]);
}();
