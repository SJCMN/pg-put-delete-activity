$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.deleteBtn', handleDelete)
  $('#bookShelf').on('click', '.isReadBtn', handleIsRead)
  // TODO - Add code for edit & delete buttons
}

function handleDelete() {
  console.log('In delete button');
  let idToDelete = $(this).closest('tr').data('id');
  console.log(idToDelete);
  $.ajax({
    method: 'DELETE',
    url: `/books/${idToDelete}`
  }).then(function(response){
    console.log('Response from delete ', response);
    refreshBooks();    
  }).catch(function(error) {
    console.log('Delete failed', error);
  })
}

function handleIsRead(){
  console.log('In isRead button');
  let idToRead =  $(this).closest('tr').data('id');
  let isRead = $(this);
  console.log(idToRead);
  console.log(isRead);
  $.ajax({
    method: 'PUT',
    url: `/books/${idToRead}`,
    data:  {isRead}
  }).then(function(response){
    console.log('Response from is Read ', response);
    refreshBooks();    
  }).catch(function(error) {
    console.log('Is read failed', error);
  })
   
}

// make a little object package function
function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
  $('#author').val('');
  $('#title').val('');
}

// send the book package to the server.then the database.
// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log('GET response:', response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // console.log(book);
    
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr data-id=${book.id}>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button class="deleteBtn">Delete</button><td>
        <td><button class="isReadBtn" data-isRead=${book.isRead}>Read It</button><td>
      </tr>
    `);
  }
}
