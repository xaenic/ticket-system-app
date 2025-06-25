<?php

namespace App\Exceptions;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use League\OAuth2\Server\Exception\OAuthServerException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
     public function register(): void
    {
        $this->renderable(function (Throwable $e) {
            if ($e instanceof ValidationException) {
                    return response()->json([
                        'code' => 422,
                        'error' => 'Validation failed',
                        'messages' => $e->errors(),
                    ], 422);
            }

        });

    }

    
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return response()->json(['code' => 401, 'error' => 'Unauthenticated'], 401);
    }


}
