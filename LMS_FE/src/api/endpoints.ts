export const API_ENDPOINTS = {
  BOOKS: {
    GET_ALL_BOOKS: "/Books/GetAllBooks",
    GET_BOOK_BY_ID : "/Books/GetBookById/",
    ADD_BOOK : "/Books/AddBook",
    UPDATE_BOOK : "/Books/UpdateBook",
    DELETE_BOOK : "/Books/DeleteBook"
    
  },

  BORROW: {
    BORROW_BOOK : "Borrow/BorrowBook",
    RETURN_BOOK : "Borrow/ReturnBook",
    GET_BOOK_BY_STATUS : "Borrow/GetBooksByStatus",
    GET_USER_BORROW_HISTORY : "Borrow/GetUserBorrowHistory",
    GET_OVERDUE_BOOKS : "Borrow/GetOverdueBooks",
    RENEW_BOOK : "Borrow/RenewBook",
    SEARCH_BOOKS : "Borrow/SearchBooks",
    GET_BORROW_SUMMARY : "Borrow/GetBorrowSummary",
    CHECK_BORROW_ELIGIBLITY : "Borrow/CheckBorrowEligibility",
    PAY_FINE : "Borrow/PayFine",
    GET_DUEBOOK_SOON : "Borrow/GetDueBookSoon"

  },

  USER: {
      GET_ALL_USERS : "User/GetAllUsers",
      CREATE_USER : "User/CreateUser",
      UPDATE_USER : "User/UpdateUser",
      DELETE_USER : "User/DeleteUser",
      GET_USER_BY_ID : "User/GetUserById"
  }
};