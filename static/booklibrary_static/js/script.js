// CSRF PROTECTION
$.ajaxSetup({
    headers: { "X-CSRFToken": $('input[name=csrfmiddlewaretoken]').val() }
});

// BUTTONS
// $('#bookDetailsModal').on('show.bs.modal', function(event) {
//     var button = $(event.relatedTarget);  // Button that triggered the modal
//     var source = button.data('source');  // Get the data-source value

//     if (source === 'bookshelf') {
//         $('#borrowReadButton').text('Complete Reading');
//     } else {
//         $('#borrowReadButton').text('Borrow/Read');
//     }
// });

// LIBRARY TAB
$(document).on('click', '.card-link', function() {
    const bookId = $(this).data('book-id');
    const title = $(this).data('title');
    const author = $(this).data('author');
    const year = $(this).data('year');
    const genre = $(this).data('genre');
    const pages = $(this).data('pages');
    const description = $(this).data('description');
    const thumbnail = $(this).data('thumbnail');
    const ratings_avg = $(this).data('ratings_avg');
    const ratings_count = $(this).data('ratings_count');
    const isbn10 = $(this).data('isbn10');
    const isbn13 = $(this).data('isbn13');
    const source = $(this).data('source');

    const baseUrl = $('#base-url').data('base-url').replace('/9999', '');
    const fullUrl = `${baseUrl}${bookId}`;

    // Now populate the modal with these values
    $("#modalBookTitle").text(title);
    $('#modalBookThumbnail').attr('src', thumbnail);
    $("#modalBookGenreYear").text(genre + " | " + year);
    $("#modalBookAuthor").text(author);
    $("#modalBookPages").text(pages);
    $("#modalBookDescription").text(description);
    $("#modalBookAvgRate").text(ratings_avg);
    $("#modalBookCountRate").text(ratings_count);
    $("#modalBookIsbn10").text(isbn10);
    $("#modalBookIsbn13").text(isbn13);
    
    // Buttons
    $('#buyOnAmazonButton').attr('href', `https://www.amazon.com/s?k=${isbn13}`);
    $('#borrowReadButton').data('book-id', bookId);
    $('#bookmark').attr('href', fullUrl);


    // Check the source and adjust the button text
    if(source === 'library') {
        $('#borrowReadButton').text('Borrow/Read');
        $('#borrowReadButton').attr('class', 'btn btn-primary');
    } else if(source === 'bookshelf') {
        $('#borrowReadButton').attr('class', 'btn btn-success');
        $('#borrowReadButton').text('Complete Reading');
    }

    // Finally, display the modal
    $("#bookDetailsModal").modal('show');
});

// BOOKSHELF TAB
$(document).ready(function() {
    $("#bookshelfLink").click(function(event) {
        event.preventDefault();
        $("#library").hide();
        $.ajax({
        url: '/booklibrary/get-user-bookshelf/',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            var content = '';
            $.each(data, function(index, book) {
                content += `
                    <a href="#" class="card-link"
                       data-book-id="${book.id}" 
                       data-title="${book.title}"
                       data-author="${book.author}"
                       data-year="${book.published_year}"
                       data-genre="${book.genre}"
                       data-pages="${book.pages}"
                       data-description="${book.description}"
                       data-thumbnail="${book.thumbnail}"
                       data-ratings_avg="${book.ratings_avg}"
                       data-ratings_count="${book.ratings_count}"
                       data-isbn10="${book.isbn10}" 
                       data-isbn13="${book.isbn13}" 
                       data-source="bookshelf">
                        <div class="card item">
                            <img src="${book.thumbnail}" class="card-img-top" alt="a book">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">Status: ${book.status}</p>
                            </div>
                        </div>
                    </a>`;
            });
            $("#bookshelf").html(content).show();
        },
        error: function(error) {
            console.error("Error fetching bookshelf:", error);
        }
    });
    });

    $("#libraryLink").click(function(event) {
        event.preventDefault();
        $("#bookshelf").hide();
        $("#library").show();
    });
});

// BORROW/READ FEATURE
function showNotification() {
    $('#notification').show().delay(5000).fadeOut(); // This will display the notification and hide it after 5 seconds.
  }

$(document).on('click', '#borrowReadButton', function(event) {
    event.preventDefault();
    let bookId = $(this).data('book-id');
    $.ajax({
        url: '/booklibrary/borrow-book/', // Update the URL based on your Django URL structure
        method: 'POST',
        data: {
            'book_id': bookId,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(response) {
            if (response.status === 'success') {
                showNotification()
                $('#bookDetailsModal').modal('hide');

                // Optional: Reload the bookshelf tab or use AJAX to dynamically update it
                // loadUserBookshelf(); 
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function() {
            alert('An error occurred. Please try again.');
        }
    });
});


