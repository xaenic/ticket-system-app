<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->nullable()->onDelete('cascade');
            $table->foreignId('response_id')->nullable()->constrained('ticket_responses')->onDelete('cascade');
            $table->string('filename'); 
            $table->string('file_path'); 
            $table->string('mime_type'); 
            $table->bigInteger('size'); 
            $table->string('extension'); 
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
