## Objectives overview:

- The webapp should display a form for children to enter their id and a free text message to santa.
  - 完成
- When submitting the form, the server should check:

  - 1.  that the child is registered
    - 完成
  - 2.  that the child is less than 10 years old.
    - 完成
  - To this purpose, the server can fetch user and profiles data in JSON format from:
    - 完成
    - https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json
    - https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json

- If the child is not registered (no match for the user id) or more than 10years old, the webapp should display a basic error page with an error message explaining the problem.\
  - 完成
- If the child is registered and less than 10 years old, the server should show a page indicating that the request has been received.
  - 完成
- Every 15seconds, the server should send an email with information on all pending (not yet sent) requests including:
  - 完成
  - child username (eg. charlie.brown)
  - child's address (eg. 219-1130, Ikanikeisaiganaibaai, Musashino-shi, Tokyo)
  - request free text as was input in the form

 - Email sender should be set as do_not_reply@northpole.com, and sent to santa@northpole.com

#### My experience in Java

- I have about 2 years experience in Nodejs
- I have about 5 years experience in Jquery
- I have about 5 years experience in Html
