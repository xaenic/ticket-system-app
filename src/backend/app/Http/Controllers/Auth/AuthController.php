<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Validations\UserValidation as UserRequest;
use App\Validations\UserLoginValidation as LoginRequest;

use App\Services\UserService;


use Exception;
class AuthController extends Controller
{
    /**
     * Register a new user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    protected $userService;

    public function __construct(UserService $userService) {
        $this->userService = $userService;
        $this->middleware('auth:api',['except' => ['register', 'login']]);
    }

    public function register(UserRequest $request)
    {
        $data = $request->validated();

        $user = $this->userService->createUser($data);
        $token = $user->createToken('Personal Access Token')->accessToken;
        
        return response()->json([
            'message' => 'User registered successfully',
            'user' => [
                "name" => $user->name,
                "id" => $user->id,
                "email" => $user->email,
                "role" => $user->roles->first()->name ?? null
            ],
            'token' => $token
        ], 201);
    }
    public function login(LoginRequest $request)
    {

        $data = $request->validated();

         try {
            $user = $this->userService->getUserByEmail($data['email']);

            if(!$user || !Hash::check($data['password'], $user->password)) {
                return response()->json([
                    'message' => 'The provided credentials are incorrect.',
                ], 401);
            }
    
            $token = $user->createToken('Personal Access Token')->accessToken;

            return response()->json([
                'message' => 'User logged in successfully',
                'user' => [
                    'name' => $user->name,
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->roles->first()->name ?? null
                ],
                'token' => $token
            ]);

        }catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Invalid email / password',
            ], 404);

        }catch(Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);

        }
       
    }

    public function user()
    {
        
        try {
            $user = $this->userService->getUserById(auth()->id());
            return response()->json([
                'message' => 'User retrieved successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()->name ?? null
                ]
            ]);
        }catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Invalid email / password',
            ], 404);
        }catch(Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
        
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->token()->revoke();

            return response()->json([
                'message' => 'Successfully logged out'
            ]);
        }catch(Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
