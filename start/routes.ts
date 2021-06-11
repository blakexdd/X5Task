/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('login', 'Api/AuthController.login')
    Route.get('logout', 'Api/AuthController.logout').middleware('auth')
  }).prefix('auth')

  Route.post('graph/get-tree-image', 'Api/GraphsController.getTreeImageRepresentation').middleware(
    'auth'
  )
  Route.post('graph/get-tree-json', 'Api/GraphsController.getTreeJsonRepresentation').middleware(
    'auth'
  )
}).prefix('api')

// Route.get('/', async ({ request }) => {
//   return { header: request.headers(), ips: request.ips(), ip: request.ip() }
// })
