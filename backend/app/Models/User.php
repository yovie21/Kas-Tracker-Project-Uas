<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];
    protected $hidden = ['password', 'remember_token'];

    // Relasi ke Expense
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    // Relasi ke Income
    public function incomes()
    {
        return $this->hasMany(Income::class);
    }
}
