<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;

class AgentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agentRole = Role::where('name', 'agent')->first();
        $departments = Department::all();

        $agents = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'password' => Hash::make('password'),
                'department_id' => $departments->where('name', 'Technical Support')->first()?->id,
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@example.com',
                'password' => Hash::make('password'),
                'department_id' => $departments->where('name', 'Customer Service')->first()?->id,
            ],
            [
                'name' => 'Mike Chen',
                'email' => 'mike.chen@example.com',
                'password' => Hash::make('password'),
                'department_id' => $departments->where('name', 'IT Infrastructure')->first()?->id,
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily.davis@example.com',
                'password' => Hash::make('password'),
                'department_id' => $departments->where('name', 'Billing & Payments')->first()?->id,
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david.wilson@example.com',
                'password' => Hash::make('password'),
                'department_id' => $departments->where('name', 'Sales & Marketing')->first()?->id,
            ],
            [
                'name' => 'Lisa Brown',
                'email' => 'lisa.brown@example.com',
                'password' => Hash::make('password'),
                'department_id' => $departments->where('name', 'Quality Assurance')->first()?->id,
            ],
        ];

        foreach ($agents as $agentData) {
            $agent = User::create($agentData);
            $agent->assignRole($agentRole);
        }
    }
}
