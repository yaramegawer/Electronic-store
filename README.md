📚 API Endpoints and Body Requirements
Authentication APIs (/auth)
Endpoint	Method	Body
/register	POST	json { "userName": "string (3-20 chars)", "email": "valid email", "password": "string", "confirmPassword": "same as password" }
/login	POST	json { "email": "valid email", "password": "string" }
/forgetCode	PATCH	json { "email": "valid email" }
/resetPassword	PATCH	json { "email": "valid email", "forgetCode": "5 characters code", "password": "string", "confirmPassword": "same as password" }
Cart APIs (/cart)
Endpoint	Method	Body
/ (Add to cart)	POST	json { "productId": "valid MongoDB ID", "quantity": number (min 1) }
/ (Get user cart)	GET	No body required. Optional query param: cartId
/:productId (Remove from cart / Decrease quantity)	PATCH	json { "productId": "valid MongoDB ID" }
/ (Clear cart)	PUT	No body required.
Order APIs (/order)
Endpoint	Method	Body
/ (Create order)	POST	json { "phone": "string", "address": "string", "payment": "cash" or "visa" }
/:id (Cancel order)	PATCH	json { "id": "valid MongoDB ID" }
Product APIs (/product)
Endpoint	Method	Body
/ (Create product)	POST	Form-Data (not JSON) <ul><li>name: string (2-20 chars)</li><li>description: string (10-200 chars) (optional)</li><li>availableItems: integer (>=1)</li><li>price: integer (>=1)</li><li>productImage: file (image upload)</li></ul>
/:id (Delete product)	DELETE	json { "id": "valid MongoDB ID" }
/ (Get products)	GET	No body required.
📌 Notes
confirmPassword must match password exactly in register and resetPassword endpoints.

For creating a product, use multipart/form-data (because of file upload).

MongoDB Object IDs must be valid (24 hexadecimal characters).

Make sure to be authenticated (Bearer Token) for cart, order, and product creation actions.

