# ExpressJs API with Access token and Refresh token

### Description
This is a simple ExpressJs API that implements access token and refresh token authentication. The API allows users to register, login, and access protected routes using JWT tokens. The refresh token is used to obtain a new access token when the current one expires.
### Setup
## 1. Clone the repository:
```bash
git clone https://github.com/jimenezraul/secure-express-api.git
```
## 2. Navigate to the project directory:
```bash
cd secure-express-api
```
## 3. Install the dependencies:
```bash
npm install
```
## 4. Rename the `.env.development.local.example` file to `.env.development.local` and update the environment variables as needed.

## 5. Generate the JWT private and public keys:
Open the terminal and run the following commands to generate the private and public keys for both access and refresh tokens. The keys will be used to sign and verify the JWT tokens.

### For the access token:
```bash
openssl genpkey -algorithm RSA -out access_private_key.pem
openssl rsa -pubout -in access_private_key.pem -out access_public_key.pem
```
### For the refresh token:
```bash
openssl genpkey -algorithm RSA -out refresh_private_key.pem
openssl rsa -pubout -in refresh_private_key.pem -out refresh_public_key.pem
```
### Base64 Encode the Keys
```bash
base64 -i access_private_key.pem -o access_private_key.pem.b64
base64 -i access_public_key.pem -o access_public_key.pem.b64

base64 -i refresh_private_key.pem -o refresh_private_key.pem.b64
base64 -i refresh_public_key.pem -o refresh_public_key.pem.b64
```
### copy the content of the files and paste them in the `.env.development.local` file
```bash
ACCESS_PRIVATE_KEY=base64_encoded_private_key
ACCESS_PUBLIC_KEY=base64_encoded_public_key
REFRESH_PRIVATE_KEY=base64_encoded_private_key
REFRESH_PUBLIC_KEY=base64_encoded_public_key
```
### MySQL database
1. Create a MySQL database and user.
2. Update the `.env.development.local` file with the database connection details:
```bash
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```
3. Run the seeders to create the necessary tables and insert initial data:
```bash
npm run db:seed
```

## 6. Run Server
```bash
npm run dev
```

## 7. Access the API Swagger
Open your browser and navigate to `http://localhost:3000/api-docs` to access the Swagger UI documentation for the API. You can test the API endpoints directly from the Swagger UI.

## 8. Test the API
To test the api use the following usernames and passwords:
- email: `example1@email.com`
- Password: `password123456789`