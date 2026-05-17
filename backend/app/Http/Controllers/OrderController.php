<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Order::where('user_id', $request->user()->id)->with('items.product')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'total_amount' => 'required|numeric',
            'items' => 'required|array'
        ]);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'total_amount' => $request->total_amount,
            'status' => 'paid'
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
        }

        return response()->json(['message' => 'Commande validée', 'order' => $order], 201);
    }
}
