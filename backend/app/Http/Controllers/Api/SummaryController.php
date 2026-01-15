<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\Expense;
use Illuminate\Support\Facades\Auth;

class SummaryController extends Controller
{
    public function index()
{
    // Kalau admin: tampilkan milik sendiri
    if (Auth::user()->role === 'admin') {
        $userId = Auth::id();
        $totalIncome = (float) Income::where('user_id', $userId)->sum('amount');
        $totalExpense = (float) Expense::where('user_id', $userId)->sum('amount');
    } else {
        // Kalau user: tampilkan data semua admin (atau data global)
        $totalIncome = (float) Income::sum('amount');
        $totalExpense = (float) Expense::sum('amount');
    }

    $balance = $totalIncome - $totalExpense;

    return response()->json([
        'data' => [
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'balance' => $balance,
        ]
    ]);
}

}
