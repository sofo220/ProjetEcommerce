<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('seller_store_name')->nullable()->after('is_seller');
            $table->string('seller_phone')->nullable()->after('seller_store_name');
            $table->string('seller_city')->nullable()->after('seller_phone');
            $table->text('seller_description')->nullable()->after('seller_city');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'seller_store_name',
                'seller_phone',
                'seller_city',
                'seller_description',
            ]);
        });
    }
};
