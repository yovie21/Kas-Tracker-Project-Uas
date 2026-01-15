<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense; 
use App\Models\Income;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ExpenseController extends Controller
{
  public function index()
  {
    $expenses = Expense::where('user_id', Auth::id())->orderBy('date','desc')->get();
    return ExpenseResource::collection($expenses);
  }

   public function store(StoreExpenseRequest $request)
    {
        $validated = $request->validated();

        $validated['date'] = Carbon::parse($request->date, 'Asia/Jakarta');

        $validated['user_id'] = Auth::id();

        $expense = Expense::create($validated);

        return new ExpenseResource($expense);
    }


  public function show($id)
  {
    $expense = Expense::where('user_id', Auth::id())->findOrFail($id);
    return new ExpenseResource($expense);
  }

  public function update(UpdateExpenseRequest $request, $id)
  {
    $expense = Expense::where('id',$id)->where('user_id',Auth::id())->firstOrFail();
    $expense->update($request->validated());
    return new ExpenseResource($expense);
  }

  public function destroy($id)
  {
    $expense = Expense::where('id',$id)->where('user_id',Auth::id())->firstOrFail();
    $expense->delete();
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
