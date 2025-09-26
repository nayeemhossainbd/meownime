    $('.server-item').click(function () {
        $('.server-item .btn').removeClass('active');
        $(this).find('.btn').addClass('active');
        var src = $(this).data('src');

$('#iframe-embed').attr('src', src);
               $('#iframe-embed').show();

        
    });
