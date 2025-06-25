<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use App\Validations\UserValidation as UserRequest;
use App\Validations\UserLoginValidation as LoginRequest;

use App\Services\UserService;
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
                "email" => $user->email,
                "role" => $user->roles->first()->name ?? null
            ],
            'token' => $token
        ], 201);
    }
    public function login(LoginRequest $request)
    {

        $data = $request->validated();

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
                'email' => $user->email,
                'role' => $user->roles->first()->name ?? null
            ],
            'token' => $token
        ]);
    }

    public function user()
    {
        $user = $this->userService->getUserById(auth()->id());

        return response()->json([
            'message' => 'User retrieved successfully',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()->name ?? null
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
