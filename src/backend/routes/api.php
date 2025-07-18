<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketResponseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttachmentController;
use App\Notifications\NewTicket;
use App\Models\User;
use App\Models\Ticket;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:api', 'role:admin'])->get('/user', function (Request $request) {
    return $request->user();
});


//auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/me', [AuthController::class, 'user']);

Route::prefix('departments')
    ->group(function () {

        Route::get('/', [DepartmentController::class, 'index']);
        Route::post('/', [DepartmentController::class, 'store']);

        Route::delete('/{id}', [DepartmentController::class, 'destroy'])->where('id', '[0-9]+');
        Route::put('/{id}', [DepartmentController::class, 'update'])->where('id', '[0-9]+');
});

Route::get('/notifications/{status}', [UserController::class, 'notifications']);
Route::patch('/notifications/{id}/read', [UserController::class, 'markAsRead']);
Route::get('/messages', [UserController::class, 'responses']);

Route::prefix('users')
    ->group(function () {

        Route::get('/', [UserController::class, 'index']);
        Route::get('/agents', [UserController::class, 'agents']);


      
        //create agents
        Route::post('/', [UserController::class, 'store']);

        Route::delete('/{id}', [UserController::class, 'destroy'])->where('id', '[0-9]+');
        Route::put('/{id}', [UserController::class, 'update'])->where('id', '[0-9]+');
        Route::patch('/{id}', [UserController::class, 'assign'])->where('id', '[0-9]+');

        Route::post('/profile', [UserController::class, 'profileUpdate']);

});
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/dashboard/data', [DashboardController::class, 'userData']);
Route::get('/attachments/{id}/download', [AttachmentController::class, 'download']);

Route::prefix('tickets')
    ->group(function () {

        Route::get('/', [TicketController::class, 'userTickets']);
        Route::get('/open', [UserController::class, 'openedTickets']);
        Route::get('/all', [TicketController::class, 'index']);
        Route::post('/', [TicketController::class, 'store']);

        Route::post('/{id}', [TicketController::class, 'update'])->where('id', '[0-9]+');
        Route::patch('/{id}', [TicketController::class, 'assign'])->where('id', '[0-9]+');
        Route::get('/{id}', [TicketController::class, 'show'])->where('id', '[0-9]+');


        Route::patch('/status/{id}', [TicketController::class, 'updateStatus'])->where('id', '[0-9]+');


        Route::prefix('responses')
            ->group(function() {
                Route::get('/{id}', [TicketResponseController::class, 'index']);
                Route::post('/', [TicketResponseController::class, 'store']);
        });
});
Route::get('/test', function () {
    // Get all users and notify them
    $user = User::find(2);
    
    $ticket = Ticket::create([
        'title' => 'asdsad Ticket Title',
        'description' => 'This is a sample description for the ticket.',
        'status' => 'open',        // example status
        'priority' => 'high',      // example priority
        'client_id' => 1,          // as you requested
        'department_id' => 2,      // as you requested
        'assigned_user_id' => null // or some user id if assigned
    ]);
    $users = User::where('department_id', 2)->get();

    foreach ($users as $user) {
        $user->notify(new NewTicket($ticket));
    }

    return response()->json(['message' => $ticket]);
});