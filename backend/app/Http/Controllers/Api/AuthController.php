<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
  public function register(Request $r)
{
    try {
        $data = $r->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email|max:150',
            'password' => ['required', 'confirmed', Password::min(6)],
            'role' => 'in:admin,user', // ✅ opsional kalau kamu mau user pilih role
        ]);
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'], 
        ]);
        return response()->json(['message' => 'registered', 'data' => $user], 201);
    } catch (\Throwable $e) {
        return response()->json([
            'message' => 'register error',
            'error' => $e->getMessage(),
        ], 500);
    }
}

  public function login(Request $r)
  {
    $cred = $r->validate(['email'=>'required|email','password'=>'required']);
    $user = User::where('email',$cred['email'])->first();
    if (!$user || !Hash::check($cred['password'],$user->password)) {
      return response()->json(['message'=>'invalid credentials'],401);
    }
    $token = $user->createToken('api')->plainTextToken;
    return response()->json(['message'=>'ok','data'=>['token'=>$token,'user'=>$user]]);
  }

  public function me(Request $r){ return response()->json(['data'=>$r->user()]); }

  public function logout(Request $r){
    $r->user()->currentAccessToken()->delete();
    return response()->json(['message'=>'logged out']);
  }
}
