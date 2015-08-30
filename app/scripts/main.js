(function ($, createPhotoSphereViewer) {
    'use strict';

    var $container = $('.photo-viewer');
    var $imageTitle = $('.media-heading');

    var checkIsPhotoSphere = function (img, callback) {
        if (!window.XMLHttpRequest) {
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var binary = xhr.responseText;
                var metaStart = binary.indexOf('<x:xmpmeta');
                var metaEnd = binary.indexOf('</x:xmpmeta>');
                var data = binary.substring(metaStart, metaEnd);

                // No data retrieved
                if (metaStart === -1 || metaEnd === -1 || data.indexOf('GPano:') === -1) {
                    callback(false);
                } else {
                    callback(true);
                }
            }
        };

        xhr.open('GET', img.src, true);
        xhr.send();
    };

    var showImage = function (img) {
        if (img instanceof $.Event) {
            img = this;
        }
        var $img = $(img).clone();
        $img.attr('src', $img.attr('src').replace('.thumb', ''));

        $imageTitle.text(img.src.substring(img.src.lastIndexOf('/') + 1));
        $container
            .empty()
            .removeClass('psv-container')
            .append($img);

        checkIsPhotoSphere($img[0], function (isPhotoSphere) {
            if (!isPhotoSphere) {
                $imageTitle.append('<small class="pull-right">This has no "GPano" data.</small>');
                return;
            }

            var $sphere = $('<img src="images/logo_photosphere.png" class="photo-sphere-icon">');

            $sphere.click(function () {
                $container.empty();
                createPhotoSphereViewer({
                    container: $container[0],
                    panorama: $img.attr('src')
                });
            });

            $imageTitle.append('<small class="pull-right">Click the icon to go 3D!</small>');
            $container.append($sphere);
        });
    };

    $('.gallery').on('click', 'img', showImage);

    showImage($('.gallery img')[0]);
}(window.jQuery, window.PhotoSphereViewer));
