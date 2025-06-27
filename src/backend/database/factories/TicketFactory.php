<?php

namespace Database\Factories;
use App\Models\Department;
use App\Models\User;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->name(),
            'description' => $this->faker->sentence(),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'status' => 'in-progress',
            'department_id' => Department::factory(),
            'assigned_user_id' => User::factory(),
            'client_id' => User::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
