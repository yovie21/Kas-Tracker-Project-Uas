<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIncomeRequest;
use App\Http\Requests\UpdateIncomeRequest;
use App\Http\Resources\IncomeResource;
use App\Models\Income;
use App\Models\Expense; 
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class IncomeController extends Controller
{
    public function index()
    {
        $incomes = Income::where('user_id', Auth::id())->orderBy('date','desc')->get();
        return IncomeResource::collection($incomes);
    }

    public function store(StoreIncomeRequest $request)
    {
        $validated = $request->validated();

        // Simpan waktu lokal
        $validated['date'] = Carbon::parse($request->date, 'Asia/Jakarta');

        // --- DEBUG DITAMBAHKAN DI SINI ---//

        $income = Income::create(array_merge($validated, [
            'user_id' => Auth::id(),
        ]));

        return new IncomeResource($income);
    }


    public function show($id)
    {
        $income = Income::where('user_id', Auth::id())->findOrFail($id);
        return new IncomeResource($income);
    }

    public function update(UpdateIncomeRequest $request, $id)
    {
        $income = Income::where('id',$id)->where('user_id',Auth::id())->firstOrFail();
        $income->update($request->validated());
        return new IncomeResource($income);
    }

    public function destroy($id)
    {
        $income = Income::where('id',$id)->where('user_id',Auth::id())->firstOrFail();
        $income->delete();
        return response()->json(['message'=>'deleted']);
    }

    public function transactions()
{
    $user = Auth::user();

    // Ambil semua expense + income yang diinput oleh admin
    $expenses = Expense::with('user')->whereHas('user', function($q){
        $q->where('role', 'admin');
    })->get();

    $incomes = Income::with('user')->whereHas('user', function($q){
        $q->where('role', 'admin');
    })->get();

    // Gabungkan dan beri tipe
    $expenseData = $expenses->map(fn($e) => [
        'id' => 'E'.$e->id,
        'type' => 'expense',
        'description' => $e->description,
        'amount' => $e->amount,
        'date' => $e->date,
        'user' => $e->user
    ]);

    $incomeData = $incomes->map(fn($i) => [
        'id' => 'I'.$i->id,
        'type' => 'income',
        'description' => $i->description,
        'amount' => $i->amount,
        'date' => $i->date,
        'user' => $i->user
    ]);

    $transactions = $expenseData->merge($incomeData)->sortByDesc('date')->values();

    return response()->json(['data' => $transactions]);
}
}