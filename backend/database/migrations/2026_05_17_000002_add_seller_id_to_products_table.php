<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('seller_id')->nullable()->after('category_id')->constrained('users')->nullOnDelete();
        });

        $seller = User::where('is_seller', true)->where('is_admin', false)->first()
            ?: User::where('is_admin', true)->first();

        if ($seller) {
            \DB::table('products')->whereNull('seller_id')->update(['seller_id' => $seller->id]);
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('seller_id');
        });
    }
};
