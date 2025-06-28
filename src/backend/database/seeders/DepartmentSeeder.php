<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            ['name' => 'Technical Support'],
            ['name' => 'Billing & Payments'],
            ['name' => 'Sales & Marketing'],
            ['name' => 'Human Resources'],
            ['name' => 'IT Infrastructure'],
            ['name' => 'Customer Service'],
            ['name' => 'Quality Assurance'],
            ['name' => 'Product Development'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
