<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Department;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = User::whereHas('roles', function ($query) {
            $query->where('name', 'client');
        })->first();

        $agents = User::whereHas('roles', function ($query) {
            $query->where('name', 'agent');
        })->get();

        $departments = Department::all();

        $tickets = [
            [
                'title' => 'Login Issues with Portal',
                'description' => 'I am unable to login to the customer portal. Getting error message "Invalid credentials" even with correct password.',
                'status' => 'open',
                'priority' => 'high',
                'client_id' => $client->id,
                'department_id' => $departments->where('name', 'Technical Support')->first()?->id,
                'assigned_user_id' => $agents->where('department_id', $departments->where('name', 'Technical Support')->first()?->id)->first()?->id,
            ],
            [
                'title' => 'Billing Discrepancy',
                'description' => 'There seems to be a discrepancy in my latest invoice. I was charged for services I did not use.',
                'status' => 'in-progress',
                'priority' => 'medium',
                'client_id' => $client->id,
                'department_id' => $departments->where('name', 'Billing & Payments')->first()?->id,
                'assigned_user_id' => $agents->where('department_id', $departments->where('name', 'Billing & Payments')->first()?->id)->first()?->id,
            ],
            [
                'title' => 'Feature Request: Dark Mode',
                'description' => 'Would it be possible to add a dark mode feature to the application? It would greatly improve user experience during night hours.',
                'status' => 'open',
                'priority' => 'low',
                'client_id' => $client->id,
                'department_id' => $departments->where('name', 'Product Development')->first()?->id,
                'assigned_user_id' => null,
            ],
            [
                'title' => 'Server Performance Issues',
                'description' => 'The application has been running very slowly since yesterday. Page load times are significantly increased.',
                'status' => 'in-progress',
                'priority' => 'high',
                'client_id' => $client->id,
                'department_id' => $departments->where('name', 'IT Infrastructure')->first()?->id,
                'assigned_user_id' => $agents->where('department_id', $departments->where('name', 'IT Infrastructure')->first()?->id)->first()?->id,
            ],
            [
                'title' => 'Password Reset Not Working',
                'description' => 'The password reset email is not being received. I have checked spam folder as well.',
                'status' => 'closed',
                'priority' => 'medium',
                'client_id' => $client->id,
                'department_id' => $departments->where('name', 'Technical Support')->first()?->id,
                'assigned_user_id' => $agents->where('department_id', $departments->where('name', 'Technical Support')->first()?->id)->first()?->id,
            ],
            [
                'title' => 'Account Upgrade Request',
                'description' => 'I would like to upgrade my account to the premium plan. Please provide information about the process.',
                'status' => 'open',
                'priority' => 'low',
                'client_id' => $client->id,
                'department_id' => $departments->where('name', 'Sales & Marketing')->first()?->id,
                'assigned_user_id' => $agents->where('department_id', $departments->where('name', 'Sales & Marketing')->first()?->id)->first()?->id,
            ],
            [
                'title' => 'Data Export Functionality',
                'description' => 'I need to export my data for backup purposes. How can I access the data export feature?',
                'status' => 'in-progress',
                'priority' => 'medium',
                'client_id' => $client->id,
                'department_id' => $departments->where('name', 'Customer Service')->first()?->id,
                'assigned_user_id' => $agents->where('department_id', $departments->where('name', 'Customer Service')->first()?->id)->first()?->id,
            ],
            [
                'title' => 'Mobile App Crashes',
                'description' => 'The mobile application keeps crashing when I try to access the reports section.',
                'status' => 'open',
                'priority' => 'high',
                'client_id' => $client->id,
                'department_id' => $departments->where('name', 'Quality Assurance')->first()?->id,
                'assigned_user_id' => $agents->where('department_id', $departments->where('name', 'Quality Assurance')->first()?->id)->first()?->id,
            ],
        ];

        foreach ($tickets as $ticketData) {
            Ticket::create($ticketData);
        }
    }
}
