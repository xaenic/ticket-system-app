<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\UserController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:api', 'role:admin'])->get('/user', function (Request $request) {
    return $request->user();
});



Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


// department routes

Route::prefix('departments')
    ->group(function () {

        Route::get('/', [DepartmentController::class, 'index']);
        Route::post('/', [DepartmentController::class, 'store']);

        Route::delete('/{id}', [DepartmentController::class, 'destroy'])->where('id', '[0-9]+');
        Route::put('/{id}', [DepartmentController::class, 'update'])->where('id', '[0-9]+');
});

Route::prefix('users')
    ->group(function () {

        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);

        Route::delete('/{id}', [UserController::class, 'destroy'])->where('id', '[0-9]+');
        Route::put('/{id}', [UserController::class, 'update'])->where('id', '[0-9]+');
        Route::patch('/{id}', [UserController::class, 'assign'])->where('id', '[0-9]+');
});
Route::get('/test', function () {
    return response()->json(['message' => 'Admin access granted']);
});