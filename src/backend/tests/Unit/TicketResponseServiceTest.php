<?php

namespace Tests\Unit;

use Tests\TestCase;

use Mockery;
use App\Models\TicketResponse;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Department;

use App\Services\TicketResponseService;
use Illuminate\Http\UploadedFile;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

class TicketResponseServiceTest extends TestCase
{
    /**
     * A basic unit test example.
     */

    use RefreshDatabase;
    protected TicketResponseService $service;

    protected function setUp(): void
    {
        parent::setUp();
       
    }
    protected function tearDown(): void
    {
        Mockery::close(); 
        parent::tearDown();
    }

    public function __construct($name = 'TicketResponseServiceTest')
    {
        
        parent::__construct($name);

        $this->service = new TicketResponseService(new TicketResponse());
    }
    public function test_using_mocked_ticket_response_model()
    {
        $mock = Mockery::mock(TicketResponse::class);

        $service = new TicketResponseService($mock);

        $this->assertInstanceOf(TicketResponseService::class, $service);
    }

    public function test_create_response_successfully()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
      
        $ticket = Ticket::factory()->create([
            'assigned_user_id' => $user->id,
            'client_id' => $user->id,

        ]);
        $response = $this->service->createResponse([
            'message' => 'Test response',
            'ticket_id' => $ticket->id,
        ]);

        $this->assertDatabaseHas('ticket_responses', [
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => 'Test response',
        ]);
    }

    public function test_cannot_create_response_if_ticket_not_assigned()
    {
        $this->expectException(AuthorizationException::class);
     
        $user = User::factory()->create();
        $this->actingAs($user);

        $ticket = Ticket::factory()->create([
            'client_id' => $user->id,
            'assigned_user_id' => null
        ]);

        $this->service->createResponse([
            'message' => 'Invalid test',
            'ticket_id' => $ticket->id,
        ]);
    }
    public function test_attachments_are_uploaded_when_present_in_data() {
        $user = User::factory()->create();
        $this->actingAs($user);
      
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');
        $ticket = Ticket::factory()->create([
            'assigned_user_id' => $user->id,
            'client_id' => $user->id,
            
         
        ]);

        $response = $this->service->createResponse([
            'ticket_id' => $ticket->id,
            'attachments' => [$file],
            'message' => "haha",
            'uploaded_by' => $user->id
        ]);

       
         Storage::disk('private')->assertExists('attachments/' . $file->hashName());
    }

     public function test_non_owner_cannot_add_response_to_ticket()
    {
        $this->expectException(AuthorizationException::class);
     
        $ticket = Ticket::factory()->create([
            'status' => 'in-progress'
        ]);

        $this->service->createResponse([
            'message' => 'Invalid test',
            'ticket_id' => $ticket->id,
        ]);

    }
    public function test_cannot_create_response_if_ticket_closed_or_resolved()
    {
        $this->expectException(AuthorizationException::class);
     
        $user = User::factory()->create();
        $this->actingAs($user);

        $ticket = Ticket::factory()->create([
            'client_id' => $user->id,
            'status' => 'closed'
        ]);

        $this->service->createResponse([
            'message' => 'Invalid test',
            'ticket_id' => $ticket->id,
        ]);

    }
    public function test_get_ticket_responses()
    {
        $user = User::factory()->create();
        
        $this->actingAs($user);
        $ticket = Ticket::factory()->create([
            "client_id" => $user->id,
            'status' => 'open'
        ]);

       $this->service->createResponse([
            'ticket_id' => $ticket->id,
            'message' => 'test',
          
        ]);
        $result = $this->service->getResponsesById($ticket->id, $user->id);
        $this->assertNotNull($result);
        $this->assertCount(1, $result);
        $this->assertEquals('test', $result->first()->message);

    }

    
}
