<?php

namespace Tests\Unit;

use Tests\TestCase;

use Mockery;
use App\Models\TicketResponse;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Department;

use App\Services\TicketResponseService;
use App\Services\TicketService;
use Illuminate\Http\UploadedFile;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

class TicketServiceTest extends TestCase
{
    /**
     * A basic unit test example.
     */

    use RefreshDatabase;
    protected TicketService $service;

    protected function setUp(): void
    {
        parent::setUp();
       
    }
    protected function tearDown(): void
    {
        Mockery::close(); 
        parent::tearDown();
    }

    public function __construct($name = 'TicketServiceTest')
    {
        
        parent::__construct($name);

        $this->service = new TicketService(new Ticket());
    }
    public function test_using_mocked_ticket_response_model()
    {
        $mock = Mockery::mock(Ticket::class);

        $service = new TicketService($mock);

        $this->assertInstanceOf(TicketService::class, $service);
    }

    public function test_create_ticket_successfully()
    {
        $user = User::factory()->create();
        $department = Department::factory()->create();
        $this->actingAs($user);

        $result = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'in-progress',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);
        
        
        $this->assertNotNull($result);
    }

    public function test_create_ticket_with_attachments()
    {
       
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $user = User::factory()->create();
        $department = Department::factory()->create();

        $this->actingAs($user);

        $result = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'in-progress',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);
        
        
        $this->assertNotNull($result);
    }

    public function test_update_ticket_successfully()
    {
        $user = User::factory()->create();
        $department = Department::factory()->create();

        $this->actingAs($user);

        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'open',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->updateTicket($ticket->id, [
            'title' => 'Test Ticket Update',
        ]);


        $this->assertNotNull($result);
        $this->assertEquals('Test Ticket Update', $result->title);
    }

    public function test_update_ticket_not_found()
    {
        $this->expectException(ModelNotFoundException::class);
        $result = $this->service->updateTicket(231213, [
            'title' => 'Test Ticket Update',
        ]);     
    }

    public function test_update_ticket_throws_exception_when_not_open()
    {
        $this->expectException(AuthorizationException::class);
        $user = User::factory()->create();
        $department = Department::factory()->create();

        $this->actingAs($user);

        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->updateTicket($ticket->id, [
            'title' => 'Test Ticket Update',
        ]);
    }

    public function test_update_ticket_throws_exception_when_unauthorized_user()
    {
        $this->expectException(AuthorizationException::class);
        $user = User::factory()->create();
        $department = Department::factory()->create();

        $this->actingAs($user);
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => 123,
        ]);
        $result = $this->service->updateTicket($ticket->id, [
            'title' => 'Test Ticket Update',
        ]);
    }

    public function test_assign_agent_successfully()
    {
        $user = User::factory()->create();
        $department = Department::factory()->create();
        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $agent->department_id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->assignAgent($agent->id, $ticket->id);
        $this->assertNotNull($result->assigned_user_id);
        $this->assertEquals($agent->id, $result->assigned_user_id);

    }

    public function test_assign_agent_throws_exception_when_already_assigned()
    {
        $this->expectException(AuthorizationException::class);

        $user = User::factory()->create();
        $department = Department::factory()->create();
        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $agent->department_id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->assignAgent($agent->id, $ticket->id);

        $this->service->assignAgent($agent->id, $ticket->id);
        
    }

    public function test_assign_agent_throws_exception_when_different_department()
    {
        $this->expectException(AuthorizationException::class);

        $user = User::factory()->create();
        $department = Department::factory()->create();
        $department_2 = Department::factory()->create();
        $agent = User::factory()->create([
            "department_id" => $department_2->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $this->service->assignAgent($agent->id, $ticket->id);
    }

    public function test_update_ticket_status_successfully()
    {
        $user = User::factory()->create();
        $department = Department::factory()->create();
        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($agent);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'open',
            'department_id' => $agent->department_id,
            'client_id' => $user->id,
            'assigned_user_id' => $agent->id
        ]);

        $result = $this->service->updateTicketStatus('closed', $ticket->id);
        $this->assertNotNull($result);
        $this->assertEquals('closed', $result->status);
    }

    public function test_update_ticket_status_throws_exception_when_ticket_not_found()
    {
        $this->expectException(ModelNotFoundException::class);

        $this->service->updateTicketStatus('closed', 555);
    }

    public function test_update_ticket_status_throws_exception_when_unauthorized()
    {
        $this->expectException(AuthorizationException::class);

        $user = User::factory()->create();
        $department = Department::factory()->create();
        $department_2 = Department::factory()->create();
        $agent = User::factory()->create([
            "department_id" => $department_2->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'open',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $this->service->updateTicketStatus('closed', $ticket->id);
    }

    public function test_update_ticket_status_throws_exception_when_invalid_status()
    {
        $this->expectException(AuthorizationException::class);

        $user = User::factory()->create();
        $department = Department::factory()->create();
        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $this->service->updateTicketStatus('closed', $ticket->id);
    }

    public function test_get_ticket_by_id_successfully()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getTicketById($ticket->id);
        $this->assertNotNull($result);
    }

    public function test_get_ticket_by_id_throws_exception_when_not_found()
    {
        $this->expectException(ModelNotFoundException::class);
        $result = $this->service->getTicketById(5);
    }

    public function test_get_all_tickets_for_admin()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getAllTickets('admin');

        $this->assertNotNull($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Test Ticket', $result->first()->title);
    }

    public function test_get_all_tickets_for_agent()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getAllTickets('agent');

        $this->assertNotNull($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Test Ticket', $result->first()->title);
    }

    public function test_get_all_tickets_for_client()
    {
         $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getAllTickets('client', $user->id);

        $this->assertNotNull($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Test Ticket', $result->first()->title);
    }

    public function test_get_all_tickets_with_filters()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getAllTickets('admin', null, 1, 10, 'Test', 'closed', 'low');

        $this->assertNotNull($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Test Ticket', $result->first()->title);
    }

    public function test_get_recent_tickets_for_admin()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getRecentTickets('admin');

        $this->assertNotNull($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Test Ticket', $result->first()->title);
    }

    public function test_get_recent_tickets_for_non_admin()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getRecentTickets('client');

        $this->assertNotNull($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Test Ticket', $result->first()->title);
    }

    public function test_get_ticket_counts_for_admin()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getTicketCounts('admin');

        $this->assertNotNull($result);
        $this->assertEquals(1, $result);
    }

    public function test_get_ticket_counts_for_non_admin()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getTicketCounts('client');

        $this->assertNotNull($result);
        $this->assertEquals(1, $result);
    }

    public function test_get_ticket_count_by_status_for_admin()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getTicketCountByStatus('admin','closed');

        $this->assertNotNull($result);
        $this->assertEquals(1, $result);
    }

    public function test_get_ticket_count_by_status_for_non_admin()
    { 
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getTicketCountByStatus('client','closed');

        $this->assertNotNull($result);
        $this->assertEquals(1, $result);
    }

    public function test_get_ticket_count_by_priority()
    {
        $user = User::factory()->create();

        $department = Department::factory()->create();

        $agent = User::factory()->create([
            "department_id" => $department->id
        ]);

        $this->actingAs($user);
        
        $ticket = $this->service->createTicket([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'uploaded_by' => $user->id,
            'priority' => 'low',
            'status' => 'closed',
            'department_id' => $department->id,
            'client_id' => $user->id,
        ]);

        $result = $this->service->getTicketCountByPriority('low');

        $this->assertNotNull($result);
        $this->assertEquals(1, $result);
    }
}
