<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Department;
use App\Models\Ticket;
use App\Services\UserService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Illuminate\Pagination\LengthAwarePaginator;

class UserServiceTest extends TestCase
{
    use RefreshDatabase;
    
    protected UserService $userService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userService = new UserService(new User());
        
        // Create roles for testing
        Role::create(['name' => 'agent']);
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'client']);
    }

    public function test_create_user_without_avatar()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ];

        $user = $this->userService->createUser($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
        $this->assertNull($user->avatar);
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    }

    public function test_create_user_with_avatar()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('avatar.jpg');
        $userData = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
        ];
        $userData['avatar'] = $file;
        $user = $this->userService->createUser($userData);
        $this->assertInstanceOf(User::class, $user);
        $this->assertNotNull($user->avatar);
        Storage::disk('public')->assertExists($user->avatar);
    }

    public function test_update_user_successfully()
    {
        $user = User::factory()->create([
            'name' => 'Original Name',
            'email' => 'original@example.com',
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ];

        $updatedUser = $this->userService->updateUser($user->id, $updateData);

        $this->assertEquals('Updated Name', $updatedUser->name);
        $this->assertEquals('updated@example.com', $updatedUser->email);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_update_user_with_avatar()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('new-avatar.jpg');
        
        $updateData = [
            'name' => 'Updated Name',
            'avatar' => $file,
        ];

        $updatedUser = $this->userService->updateUser($user->id, $updateData);

        $this->assertEquals('Updated Name', $updatedUser->name);
        $this->assertNotNull($updatedUser->avatar);
        Storage::disk('public')->assertExists($updatedUser->avatar);
    }

    public function test_update_user_throws_exception_when_user_not_found()
    {
        $this->expectException(ModelNotFoundException::class);
        $this->expectExceptionMessage('User not found');

        $this->userService->updateUser(999, ['name' => 'Test']);
    }

    public function test_assign_department_successfully()
    {
        $user = User::factory()->create();
        $department = Department::factory()->create();

        $result = $this->userService->assignDepartment($user->id, $department->id);

        $this->assertTrue($result);
        $user->refresh();
        $this->assertEquals($department->id, $user->department_id);
    }

    public function test_assign_department_throws_exception_when_user_not_found()
    {
        $department = Department::factory()->create();
        
        $this->expectException(ModelNotFoundException::class);
        $this->expectExceptionMessage('User not found');

        $this->userService->assignDepartment(999, $department->id);
    }

    public function test_delete_user_successfully()
    {
        $user = User::factory()->create();

        $result = $this->userService->deleteUser($user->id);

        $this->assertTrue($result);
        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }

    public function test_delete_user_throws_exception_when_user_not_found()
    {
        $this->expectException(ModelNotFoundException::class);
        $this->expectExceptionMessage('User not found');

        $this->userService->deleteUser(999);
    }

    public function test_get_user_by_id_successfully()
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $foundUser = $this->userService->getUserById($user->id);

        $this->assertInstanceOf(User::class, $foundUser);
        $this->assertEquals($user->id, $foundUser->id);
        $this->assertEquals('Test User', $foundUser->name);
        $this->assertEquals('test@example.com', $foundUser->email);
    }

    public function test_get_user_by_id_throws_exception_when_user_not_found()
    {
        $this->expectException(ModelNotFoundException::class);
        $this->expectExceptionMessage('User not found');

        $this->userService->getUserById(999);
    }

    public function test_get_user_by_email_successfully()
    {
        $user = User::factory()->create([
            'email' => 'unique@example.com',
        ]);

        $foundUser = $this->userService->getUserByEmail('unique@example.com');

        $this->assertInstanceOf(User::class, $foundUser);
        $this->assertEquals($user->id, $foundUser->id);
        $this->assertEquals('unique@example.com', $foundUser->email);
    }

    public function test_get_user_by_email_throws_exception_when_user_not_found()
    {
        $this->expectException(ModelNotFoundException::class);
        $this->expectExceptionMessage('User not found');

        $this->userService->getUserByEmail('nonexistent@example.com');
    }

    public function test_get_all_users_with_pagination()
    {
        User::factory()->count(15)->create();

        $result = $this->userService->getAllUsers(1, 10);

        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(10, $result->perPage());
        $this->assertEquals(1, $result->currentPage());
        $this->assertEquals(15, $result->total());
        $this->assertCount(10, $result->items());
    }

    public function test_get_all_agents_without_query()
    {
        $department = Department::factory()->create();
        
        // Create users with agent role
        $agents = User::factory()->count(5)->create(['department_id' => $department->id]);
        foreach ($agents as $agent) {
            $agent->assignRole('agent');
        }
        
        // Create non-agent users
        User::factory()->count(3)->create();

        $result = $this->userService->getAllAgents(1, 10);

        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(5, $result->total());
        $this->assertCount(5, $result->items());
        
        // Check that department relationship is loaded
        $this->assertTrue($result->first()->relationLoaded('department'));
    }

    public function test_get_all_agents_with_search_query()
    {
        $department = Department::factory()->create();
        
        // Create agents with specific names/emails for search testing
        $agent1 = User::factory()->create([
            'name' => 'John Agent',
            'email' => 'john.agent@example.com',
            'department_id' => $department->id
        ]);
        $agent1->assignRole('agent');
        
        $agent2 = User::factory()->create([
            'name' => 'Jane Smith',
            'email' => 'jane.smith@example.com',
            'department_id' => $department->id
        ]);
        $agent2->assignRole('agent');
        
        $agent3 = User::factory()->create([
            'name' => 'Bob Wilson',
            'email' => 'bob.wilson@example.com',
            'department_id' => $department->id
        ]);
        $agent3->assignRole('agent');

        // Search by name
        $result = $this->userService->getAllAgents(1, 10, 'John');
        $this->assertEquals(1, $result->total());
        $this->assertEquals('John Agent', $result->first()->name);

        // Search by email
        $result = $this->userService->getAllAgents(1, 10, 'jane.smith');
        $this->assertEquals(1, $result->total());
        $this->assertEquals('jane.smith@example.com', $result->first()->email);
    }

    public function test_get_user_counts_by_role()
    {
        // Create users with different roles
        $agents = User::factory()->count(5)->create();
        foreach ($agents as $agent) {
            $agent->assignRole('agent');
        }
        
        $admins = User::factory()->count(2)->create();
        foreach ($admins as $admin) {
            $admin->assignRole('admin');
        }
        
        $clients = User::factory()->count(8)->create();
        foreach ($clients as $client) {
            $client->assignRole('client');
        }

        $agentCount = $this->userService->getUserCountsByRole('agent');
        $adminCount = $this->userService->getUserCountsByRole('admin');
        $clientCount = $this->userService->getUserCountsByRole('client');

        $this->assertEquals(5, $agentCount);
        $this->assertEquals(2, $adminCount);
        $this->assertEquals(8, $clientCount);
    }

    public function test_get_opened_tickets_for_user_with_department()
    {
        $department = Department::factory()->create();
        $user = User::factory()->create(['department_id' => $department->id]);
        
        // Create tickets for the department
        $openTickets = Ticket::factory()->count(3)->create([
            'department_id' => $department->id,
            'status' => 'open'
        ]);
        
        // Create closed tickets (should not be included)
        Ticket::factory()->count(2)->create([
            'department_id' => $department->id,
            'status' => 'closed'
        ]);

        $result = $this->userService->getOpenedTickets($user->id, 1, 10);

        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(3, $result->total());
        $this->assertCount(3, $result->items());
        
        // Verify all returned tickets are open
        foreach ($result->items() as $ticket) {
            $this->assertEquals('open', $ticket->status);
        }
    }

    public function test_get_opened_tickets_for_user_without_department()
    {
        $user = User::factory()->create(['department_id' => null]);

        $result = $this->userService->getOpenedTickets($user->id, 1, 10);

        $this->assertInstanceOf(\Illuminate\Support\Collection::class, $result);
        $this->assertTrue($result->isEmpty());
    }

    public function test_get_opened_tickets_throws_exception_when_user_not_found()
    {
        $this->expectException(ModelNotFoundException::class);
        $this->expectExceptionMessage('User not found');

        $this->userService->getOpenedTickets(999);
    }

    protected function tearDown(): void
    {
        \Mockery::close();
        parent::tearDown();
    }
}
