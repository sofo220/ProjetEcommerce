<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Cart::where('user_id', $request->user()->id)->with('product')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::updateOrCreate(
            ['user_id' => $request->user()->id, 'product_id' => $request->product_id],
            ['quantity' => \DB::raw('quantity + ' . $request->quantity)]
        );

        return response()->json($cartItem);
    }

    public function destroy(Request $request, $id)
    {
        Cart::where('user_id', $request->user()->id)->where('id', $id)->delete();
        return response()->json(['message' => 'Article retiré']);
    }
}
