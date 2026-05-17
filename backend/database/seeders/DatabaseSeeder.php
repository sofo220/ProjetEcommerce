<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {

        User::updateOrCreate(
            ['email' => 'admin@shoppex.ma'],
            [
                'name' => 'Admin Shoppex',
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'vendeur@shoppex.ma'],
            [
                'name' => 'Vendeur Pro',
                'password' => Hash::make('password123'),
                'is_admin' => false,
                'is_seller' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'client@shoppex.ma'],
            [
                'name' => 'Client Test',
                'password' => Hash::make('password123'),
                'is_admin' => false,
            ]
        );

        $catElectro = Category::updateOrCreate(['slug' => 'electronique'], ['name' => 'Électronique']);
        $catVetements = Category::updateOrCreate(['slug' => 'vetements'], ['name' => 'Vêtements']);
        $catMaison = Category::updateOrCreate(['slug' => 'maison'], ['name' => 'Maison']);

        Product::updateOrCreate(['slug' => 'iphone-14-pro'], ['category_id' => $catElectro->id, 'name' => 'iPhone 14 Pro', 'price' => 8999.00, 'stock' => 50, 'description' => 'Le dernier iPhone avec appareil photo 48Mpx.', 'image' => 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'sony-wh-1000xm5'], ['category_id' => $catElectro->id, 'name' => 'Casque Bluetooth Sony', 'price' => 599.00, 'stock' => 30, 'description' => 'Réduction de bruit exceptionnelle.', 'image' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'samsung-tv-55'], ['category_id' => $catElectro->id, 'name' => 'Smart TV Samsung 55"', 'price' => 7499.00, 'stock' => 15, 'description' => 'Téléviseur 4K UHD Smart.', 'image' => 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'macbook-air-m2'], ['category_id' => $catElectro->id, 'name' => 'MacBook Air M2', 'price' => 15999.00, 'stock' => 10, 'description' => 'Puce M2, ultra fin et puissant.', 'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'jbl-flip-6'], ['category_id' => $catElectro->id, 'name' => 'Enceinte JBL', 'price' => 899.00, 'stock' => 45, 'description' => 'Enceinte Bluetooth étanche.', 'image' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60']);

        Product::updateOrCreate(['slug' => 't-shirt-blanc'], ['category_id' => $catVetements->id, 'name' => 'T-shirt Blanc', 'price' => 149.00, 'stock' => 100, 'description' => 'T-shirt basique en coton bio.', 'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'jean-slim'], ['category_id' => $catVetements->id, 'name' => 'Jean Slim', 'price' => 399.00, 'stock' => 60, 'description' => 'Jeans bleu slim pour homme.', 'image' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'robe-ete'], ['category_id' => $catVetements->id, 'name' => 'Robe d\'été', 'price' => 299.00, 'stock' => 40, 'description' => 'Robe fleurie légère pour femme.', 'image' => 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'sneakers-nike'], ['category_id' => $catVetements->id, 'name' => 'Sneakers Nike', 'price' => 899.00, 'stock' => 25, 'description' => 'Chaussures de sport confortables.', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'veste-cuir'], ['category_id' => $catVetements->id, 'name' => 'Veste Cuir', 'price' => 1299.00, 'stock' => 15, 'description' => 'Veste en cuir véritable.', 'image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60']);

        Product::updateOrCreate(['slug' => 'set-cuisine-12'], ['category_id' => $catMaison->id, 'name' => 'Set de cuisine 12 pièces', 'price' => 449.00, 'stock' => 30, 'description' => 'Ustensiles complets pour la cuisine.', 'image' => 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'lampe-led'], ['category_id' => $catMaison->id, 'name' => 'Lampe LED', 'price' => 199.00, 'stock' => 50, 'description' => 'Lampe de bureau économique.', 'image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'tapis-marocain'], ['category_id' => $catMaison->id, 'name' => 'Tapis Marocain', 'price' => 1499.00, 'stock' => 10, 'description' => 'Tapis artisanal de haute qualité.', 'image' => 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'cafetiere-elec'], ['category_id' => $catMaison->id, 'name' => 'Cafetière électrique', 'price' => 599.00, 'stock' => 20, 'description' => 'Cafetière filtre programmable.', 'image' => 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&auto=format&fit=crop&q=60']);
        Product::updateOrCreate(['slug' => 'lot-serviettes'], ['category_id' => $catMaison->id, 'name' => 'Lot serviettes de bain', 'price' => 249.00, 'stock' => 80, 'description' => '3 serviettes 100% coton doux.', 'image' => 'https://images.unsplash.com/photo-1617957743103-310accdf7005?w=900&auto=format&fit=crop&q=80']);
    }
}
