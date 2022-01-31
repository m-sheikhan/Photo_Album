$(function(){
    
    $('#post-comment').hide();  // Hide the #post-comment block of the image.handlebar to hide the comment form
    $('#btn-comment').on('click', function(event){  // If the Post Comment button clicked,
        event.preventDefault();  // Prevent the default event of the button
        $('#post-comment').show(); // Show the #post-comment block of the image.handlebar to show the comment form
    }); // End of $('#btn-comment').on('click'...
    $('#btn-like').on('click', function(event) {  // If the Like button is clicked
        event.preventDefault(); // Prevent the default event of the button
        let imgId = $(this).data('id');   // Get the image ID of the current photo (Original in the book)
        console.log('The like button is pressed for image: ', imgId);
        $.post(`/images/${imgId}/like`).done( function(data) { // When the Post like is done
            $('.likes-count').text(data.likes);  // Update text of Likes Count by the value gotten from
        });
    }); // End of $('#btn-like').on('click' ...
    $('#btn-delete').on('click', function(event) {  // If Delete X Button is clicked for image
        event.preventDefault(); // Prevent the default event of the button
        var $this = $(this);
        var remove = confirm('Are you sure you want to delete this image ? ');
        if (remove) {
            var imgId = $(this).data('id');
            $.ajax({
                url: '/images/' + imgId,
                type: 'DELETE'
            }).done(function(result) {
                if (result) {
                    // $this.removeClass('btn-danger').addClass('btn-success '); // This line was in original code but the btn-success made error when clicked! 
                    // $this.removeClass('btn-danger').addClass('text-muted ');
                    // $this.find('i').removeClass('fa -times ').addClass('fa - check ');
                    // $this.append('<span> Deleted!</span>');
                    $('#btn-delete').hide();                    
                }
            });
        }

    }); // End of $('#btn-delete').on('click' ...
});