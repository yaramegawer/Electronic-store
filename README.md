📜 API Body Requirements
Endpoint	Method	Body Parameters
/auth/register	POST	{ "userName": "string (3-20 chars)", "email": "valid email", "password": "string", "confirmPassword": "same as password" }
/auth/login	POST	{ "email": "valid email", "password": "string" }
/auth/forgetCode	PATCH	{ "email": "valid email" }
/auth/resetPassword	PATCH	{ "email": "valid email", "forgetCode": "5 characters code", "password": "string", "confirmPassword": "same as password" }
/cart/ (Add to cart)	POST	{ "productId": "valid MongoDB ID", "quantity": number (min 1) }
/cart/ (Get user cart)	GET	No body required, only optional query param: cartId
/cart/:productId (Remove from cart / Decrease quantity)	PATCH	{ "productId": "valid MongoDB ID" }
/cart/ (Clear cart)	PUT	No body required
/order/ (Create order)	POST	{ "phone": "string", "address": "string", "payment": "cash" or "visa" }
/order/:id (Cancel order)	PATCH	{ "id": "valid MongoDB ID" }
/product/ (Create product)	POST	Form-Data with:
- name: string (2-20 chars)
- description: string (10-200 chars) (optional)
- availableItems: integer >=1
- price: integer >=1
- productImage: file (image file upload)
/product/:id (Delete product)	DELETE	{ "id": "valid MongoDB ID" }
/product/ (Get products)	GET	No body required
📌 Important Notes:
confirmPassword must exactly match password in /register and /resetPassword.

For /product/ POST you must send a multipart/form-data request (not JSON) because it includes an image file.

MongoDB IDs should be valid (24 hex characters).
