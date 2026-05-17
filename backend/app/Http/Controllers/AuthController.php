<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (app()->environment('local') || app()->environment('development')) {
            if (!$user) {
                \Log::warning('Login attempt failed: User not found', [
                    'email' => $request->email,
                    'all_users' => User::all(['id', 'name', 'email'])->toArray()
                ]);
            } elseif (!Hash::check($request->password, $user->password)) {
                \Log::warning('Login attempt failed: Invalid password', [
                    'email' => $request->email,
                    'user_id' => $user->id
                ]);
            }
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        $user->is_admin = (bool) $user->is_admin;
        $user->is_seller = (bool) $user->is_seller;

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function becomeSeller(Request $request)
    {
        $user = $request->user();

        if ($user->is_seller) {
            return response()->json([
                'message' => 'Vous êtes déjà un vendeur'
            ], 400);
        }

        $user->update(['is_seller' => true]);

        return response()->json([
            'message' => 'Félicitations ! Vous êtes maintenant un vendeur. Vous pouvez maintenant ajouter et gérer vos produits.',
            'user' => $user
        ]);
    }
}
