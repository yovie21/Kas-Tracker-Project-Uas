<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\IncomeController;
use App\Http\Controllers\Api\SummaryController;

Route::get('/health', fn() => ['status' => 'ok']);

// ================= PUBLIC =================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// ================= PROTECTED =================
Route::middleware(['auth:sanctum'])->group(function () {
    // Profil dan logout (bisa diakses semua role)
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // 🔓 Semua role (user & admin) bisa lihat summary
    Route::get('/summary', [SummaryController::class, 'index'])->middleware('role:admin,user');
    Route::get('/transactions', [ExpenseController::class, 'transactions'])->middleware('role:admin,user');

    // 🔒 Admin only: CRUD data
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('expenses', ExpenseController::class);
        Route::apiResource('incomes', IncomeController::class);
    });
});
