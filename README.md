# exoTicTacTrip
To test this application you should:
1- create mysql database named exo_justify_text <br />
2- create table named users and insert userId "1" and email "foo@bar.com" <br />
3-Open postman to test requests <br />
4-put post request in postman like this localhost:5000/api/token?email=foo@bar.com <br />
5-get token and put it in headers with authorization as key <br />
6-put text of input in the body section row and make sure the type is text <br />
7-put post request in postman like this:  localhost:5000/api/justify <br />
8-now you'll get the output text justified <br />
