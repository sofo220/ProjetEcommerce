<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminController extends Controller
{

    public function dashboard()
    {
        $stats = [
            'totalProducts' => Product::count(),
            'totalOrders' => Order::count(),
            'totalRevenue' => Order::sum('total_price'),
            'totalCustomers' => User::where('is_admin', false)->count(),
            'totalSellers' => User::where('is_seller', true)->count(),
            'lowStockProducts' => Product::where('stock', '<', 10)->count(),
            'outOfStockProducts' => Product::where('stock', 0)->count(),
        ];


        $recentOrders = Order::with('user', 'items.product')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();


        $salesData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $daySales = Order::whereDate('created_at', $date)->sum('total_price');
            $salesData[] = [
                'date' => now()->subDays($i)->format('d M'),
                'sales' => $daySales
            ];
        }

        return response()->json([
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'salesData' => $salesData
        ]);
    }


    public function products()
    {
        $products = Product::with('category', 'seller:id,name,email,seller_store_name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($products);
    }


    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'seller_id' => 'nullable|exists:users,id',
            'image' => 'nullable|url',
        ]);
        $sellerId = $validated['seller_id'] ?? auth()->id();

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => $this->uniqueSlug($validated['name']),
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'category_id' => $validated['category_id'],
            'seller_id' => $sellerId,
            'image' => $validated['image'] ?? 'https://via.placeholder.com/300',
        ]);

        return response()->json([
            'message' => 'Produit créé avec succès',
            'product' => $product
        ], 201);
    }


    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'seller_id' => 'nullable|exists:users,id',
            'image' => 'nullable|url',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = $this->uniqueSlug($validated['name'], $product->id);
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Produit mis à jour avec succès',
            'product' => $product
        ]);
    }


    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès'
        ]);
    }


    public function users()
    {
        $users = User::with('orders')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin,
                    'is_seller' => $user->is_seller,
                    'seller_store_name' => $user->seller_store_name,
                    'seller_phone' => $user->seller_phone,
                    'seller_city' => $user->seller_city,
                    'seller_description' => $user->seller_description,
                    'created_at' => $user->created_at,
                    'total_orders' => $user->orders->count(),
                    'total_spent' => $user->orders->sum('total_price'),
                    'total_products' => $user->sellerProducts()->count(),
                ];
            });

        return response()->json($users);
    }


    public function updateUserRole(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'is_admin' => 'sometimes|required|boolean',
            'is_seller' => 'sometimes|required|boolean',
        ]);

        if (($validated['is_admin'] ?? $user->is_admin) && ($validated['is_seller'] ?? $user->is_seller)) {
            $validated['is_seller'] = false;
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Rôle mis à jour avec succès',
            'user' => $user
        ]);
    }


    public function deleteUser($id)
    {
        $user = User::findOrFail($id);


        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'Vous ne pouvez pas vous supprimer vous-même'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }


    public function categories()
    {
        $categories = Category::all();
        return response()->json($categories);
    }


    public function orders()
    {
        $orders = Order::with('user', 'items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }


    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update($validated);

        return response()->json([
            'message' => 'Statut de la commande mis à jour',
            'order' => $order
        ]);
    }

    public function sellerAnalytics()
    {
        $sellers = User::where('is_seller', true)
            ->withCount('sellerProducts')
            ->orderBy('name')
            ->get()
            ->map(function ($seller) {
                $productIds = $seller->sellerProducts()->pluck('id');
                $items = \App\Models\OrderItem::whereIn('product_id', $productIds)->get();

                return [
                    'id' => $seller->id,
                    'name' => $seller->name,
                    'email' => $seller->email,
                    'store_name' => $seller->seller_store_name,
                    'city' => $seller->seller_city,
                    'products' => $seller->seller_products_count,
                    'orders' => $items->pluck('order_id')->unique()->count(),
                    'units_sold' => $items->sum('quantity'),
                    'revenue' => $items->sum(fn ($item) => $item->quantity * $item->price),
                ];
            });

        return response()->json([
            'sellers' => $sellers,
            'totals' => [
                'sellers' => $sellers->count(),
                'products' => $sellers->sum('products'),
                'orders' => $sellers->sum('orders'),
                'revenue' => $sellers->sum('revenue'),
            ],
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
