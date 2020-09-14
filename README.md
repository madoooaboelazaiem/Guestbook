# Guestbook Readme File

## Deployed Using Heroku:

**Link:** https://guestbookdemo.herokuapp.com/

## The Guestbook demo is implemented based on the idea of a simple comment/messaging interface, where guests can post a message to all other registered guests and the user has the ability to edit/delete his post.

## Tools Used:

### Backend:

- MongoDB (having 3 tables (User,Post,Reply))
- NodeMailer for the notification(only made for registration just to give a taste of quality)
- JWT for authentication since it is a mostly used authentication process amoung various application with the same idea of implementation (where we are sure that users are verified.)
- The structure of the folders and files are based on **Bulletproof project architecture**

### Frontend:

- Simple design of a login page and commentary page
- Using alert system for notification because of the simplicity and its good user experience rating.
- Infinite scrolling technique as long as the messages take for the ease of use.
- FontAwesome for the icons and Bootstrap for the navbar.

### Note

**Backend is more advanced than the frontend where a forget password and multiple extra features was added so that it can make a better website if I had the time.**
**Nodemailer working locally since google removed the oauth2 keys from the latest authentication protocol of nodemailer.**
