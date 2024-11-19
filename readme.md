# Restaurant API Documentation

## Home Route

- `GET /`  
  Returns restaurant's information.

---

## User Routes

### `/user/register`

- **Method:** POST  
- **Required Fields:**
  - `name`: User's name  
  - `email`: User's email  
  - `pass`: User's password  
  - `role`: User's role (Admin/User)  

---

### `/user/login`

- **Method:** POST  
- **Required Fields:**
  - `email`: User's email  
  - `pass`: User's password  
- **Response:**  
  - Returns a token and user information.

---

### `/user/logout`

- **Method:** GET  
- **Required Fields:**
  - `token`: from req.headers.authorization

---

## Menu Routes

### `GET /menu/`

- Returns all menu items.  
- **Query Parameters:**
  - `page`: Page number (e.g., `1`)  
  - `limit`: Number of items per page (e.g., `10`)  
  - `category`: Filter by category (e.g., `salad`)  
  - `minprice`: Minimum price (e.g., `20`)  
  - `maxprice`: Maximum price (e.g., `200`)  
  - `q`: Search query (e.g., `chapati`)

---

### `POST /menu/`

- Adds a new menu item.  
- **Access:** Only Admin can access.  
- **Required Fields:**
  - `name`: Item name  
  - `description`: Item description  
  - `price`: Item price  
  - `category`: Item category  
  - `image`: Item image  

---

### `PUT /menu/:id`

- Updates an existing menu item.  
- **Access:** Only Admin can access.  
- **At least one of the following fields is required:**
  - `name`: Updated item name  
  - `description`: Updated item description  
  - `price`: Updated item price  
  - `category`: Updated item category  
  - `image`: Updated item image  

---

### `DELETE /menu/:id`

- Removes a menu item from the database.  
- **Access:** Only Admin can access.

---

## Wishlist Routes

### `GET /wishlist/`
- Returns the user's wishlisted items.

---

### `POST /wishlist/`
- Adds an item to the wishlist.  
- **Required Fields:**
  - `itemid`

---

### `DELETE /wishlist/:id`
- Removes a wishlisted item from the user's account.  
- **Required Fields:**
  - `id`: From URL parameter  

---

## Cart Routes

### `GET /cart/`
- Returns the user's cart with items and total price.

---

### `POST /cart/`
- Adds an item to the cart.  
- **Required Fields:**
  - `itemid`  
  - `quantity`

---

### `PUT /cart/:id`
- Updates the quantity of an item in the cart.  
- **Required Fields:**
  - `id`: From URL parameter  
  - `quantity`

---

### `DELETE /cart/:id`
- Removes an item from the cart.  
- **Required Fields:**
  - `id`: From URL parameter  

---

## Order Routes

### `GET /order/`
- Returns the user's order list.  
- **Query Parameters:**
  - `status`: Filter orders by status (e.g., `pending`)

---

### `POST /order/`
- Creates a new order.  
- **Response:**  
  - Returns `userid`, `items`, `totalprice`, and `status`.  
- **Required Fields:**
  - `cartid`

---

### `PUT /order/:id`
- Updates the status of an order.  
- **Access:** Only Admin can access.  
- **Response:**  
  - Returns `userid`, `items`, `totalprice`, and `status`.  
- **Required Fields:**
  - `orderid`: From URL parameter  
  - `status`: `Pending`, `Preparing`, or `Delivered`.
