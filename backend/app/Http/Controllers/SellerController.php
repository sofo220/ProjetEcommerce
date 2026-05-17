<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SellerController extends Controller
{
    public function dashboard(Request $request)
    {
        $sellerId = $request->user()->id;
        $productIds = Product::where('seller_id', $sellerId)->pluck('id');

        $soldItems = OrderItem::whereIn('product_id', $productIds)->with('order')->get();
        $revenue = $soldItems->sum(fn ($item) => $item->quantity * $item->price);
        $orders = $soldItems->pluck('order_id')->unique()->count();

        return response()->json([
            'stats' => [
                'totalProducts' => Product::where('seller_id', $sellerId)->count(),
                'totalOrders' => $orders,
                'totalRevenue' => $revenue,
                'lowStockProducts' => Product::where('seller_id', $sellerId)->where('stock', '<', 10)->count(),
            ],
            'salesData' => collect(range(6, 0))->map(function ($daysAgo) use ($productIds) {
                $date = now()->subDays($daysAgo);

                $sales = OrderItem::whereIn('product_id', $productIds)
                    ->whereHas('order', fn ($query) => $query->whereDate('created_at', $date->format('Y-m-d')))
                    ->get()
                    ->sum(fn ($item) => $item->quantity * $item->price);

                return [
                    'date' => $date->format('d M'),
                    'sales' => $sales,
                ];
            })->values(),
        ]);
    }

    public function products(Request $request)
    {
        return response()->json(
            Product::with('category')
                ->where('seller_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function storeProduct(Request $request)
    {
        $validated = $this->validateProduct($request);

        $product = Product::create([
            ...$validated,
            'seller_id' => $request->user()->id,
            'slug' => $this->uniqueSlug($validated['name']),
            'image' => $validated['image'] ?? 'https://via.placeholder.com/300',
        ]);

        return response()->json([
            'message' => 'Produit créé avec succès',
            'product' => $product->load('category'),
        ], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::where('seller_id', $request->user()->id)->findOrFail($id);
        $validated = $this->validateProduct($request, true);

        if (isset($validated['name'])) {
            $validated['slug'] = $this->uniqueSlug($validated['name'], $product->id);
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Produit mis à jour avec succès',
            'product' => $product->fresh()->load('category'),
        ]);
    }

    public function deleteProduct(Request $request, $id)
    {
        Product::where('seller_id', $request->user()->id)->findOrFail($id)->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès'
        ]);
    }

    public function categories()
    {
        return response()->json(Category::all());
    }

    private function validateProduct(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes|required' : 'required';

        return $request->validate([
            'name' => "$required|string|max:255",
            'description' => "$required|string",
            'price' => "$required|numeric|min:0",
            'stock' => "$required|integer|min:0",
            'category_id' => "$required|exists:categories,id",
            'image' => 'nullable|url',
        ]);
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 2;

        while (Product::where('slug', $slug)->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
