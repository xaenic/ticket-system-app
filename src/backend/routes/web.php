<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/{any?}', function () {
    $frontend = public_path('frontend-index.html');

    if (file_exists($frontend)) {
        return response()->file($frontend);
    }

    return view('welcome');
})->where('any', '^(?!api|oauth|broadcasting).*$');
