<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{

    public function handle(Request $request, Closure $next): Response
    {

        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json([
                'message' => 'Accès non autorisé. Vous devez être administrateur pour accéder à cette ressource.'
            ], 403);
        }

        return $next($request);
    }
}