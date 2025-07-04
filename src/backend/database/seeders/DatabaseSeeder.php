<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\DepartmentSeeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
         $this->call([
        RoleSeeder::class, // Roles must be seeded before users
        DepartmentSeeder::class, // Departments must be seeded before users (for agent department assignment)
        UserSeeder::class,
        AgentSeeder::class, // Agents must be seeded after roles and departments
        TicketSeeder::class, // Tickets must be seeded after users and departments
        TicketResponseSeeder::class, // Responses must be seeded after tickets
    ]);
    }
}
