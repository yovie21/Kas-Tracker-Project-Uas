<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Jika request tidak terautentikasi, kembalikan JSON, bukan redirect.
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null; // biar Laravel kembalikan response JSON otomatis
        }

        abort(response()->json([
            'message' => 'Unauthenticated.',
        ], 401));
    }
}
