<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/become-seller', [AuthController::class, 'becomeSeller']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    Route::prefix('admin')->middleware('is_admin')->group(function () {

        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        Route::get('/products', [AdminController::class, 'products']);
        Route::post('/products', [AdminController::class, 'storeProduct']);
        Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);

        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

        Route::get('/categories', [AdminController::class, 'categories']);

        Route::get('/orders', [AdminController::class, 'orders']);
        Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    });
});
