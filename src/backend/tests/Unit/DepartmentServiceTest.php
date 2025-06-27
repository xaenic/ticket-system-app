<?php

namespace Tests\Unit;

use Tests\TestCase;
use Mockery;
use App\Models\Department;
use App\Services\DepartmentService;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;


class DepartmentServiceTest extends TestCase
{
    /**
     * A basic unit test example.
     */

    use RefreshDatabase;
    protected DepartmentService $service;

    protected function setUp(): void
    {
        parent::setUp();
       
    }
    protected function tearDown(): void
    {
        Mockery::close(); 
        parent::tearDown();
    }
    public function __construct($name = 'DepartmentServiceTest')
    {
        
        parent::__construct($name);
        
        $this->service = new DepartmentService(new Department());
    }

    public function test_using_mocked_department_model()
    {
        $mock = Mockery::mock(Department::class);

        $service = new DepartmentService($mock);

        $this->assertInstanceOf(DepartmentService::class, $service);
    }
    public function test_delete_existing_department()
    {
        $department = Department::factory()->create();

        $result = $this->service->deleteDepartment($department->id);

        $this->assertTrue($result);
        $this->assertSoftDeleted('departments', ['id' => $department->id]);
    }

    public function test_delete_nonexistent_department_throws_exception()
    {
        $this->expectException(ModelNotFoundException::class);

        $this->service->deleteDepartment(9999); 
    }

    public function test_update_existing_department()
    {
       $department = Department::factory()->create();

        $result = $this->service->updateDepartment($department->id, [
            'name' => 'updated name',
        ]);

        $this->assertNotNull($result);
        $this->assertEquals('updated name', $result->name);
        $this->assertDatabaseHas('departments', [
            'id' => $department->id,
            'name' => 'updated name',
        ]);
    }
    public function test_update_nonexistent_department_throws_exception()
    {
        $this->expectException(ModelNotFoundException::class);
       
        $this->service->updateDepartment(9999, ['name' => 'Does Not Matter']);

    }
    
    public function test_create_existing_name_department_throws_exception()
    {
        Department::factory()->create(['name' => 'Finance']);

        $this->expectException(QueryException::class);

        $this->service->createDepartment(['name' => 'Finance']);

    }
     public function test_updating_existing_name_department_throws_exception()
    {
        $department = Department::factory()->create(['name' => 'Finance']);
        $department_2 = Department::factory()->create(['name' => 'HR']);

        $this->expectException(QueryException::class);

        $this->service->updateDepartment($department_2->id, ['name' => 'Finance']);

    }

    public function test_get_existing_department()
    {
        $department = Department::factory()->create(['name' => 'Finance']);

        $result = $this->service->getDepartmentById($department->id);

        $this->assertNotNull($result);  

    }
    public function test_get_all_existing_department()
    {
        $department = Department::factory()->create(['name' => 'Finance']);

        $result = $this->service->getAllDepartments();

        $this->assertNotNull($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Finance', $result->first()->name);
    }
    public function test_get_all_department_count()
    {
        $department = Department::factory()->create(['name' => 'Finance']);

        $result = $this->service->getDepartmentCounts();

        $this->assertNotNull($result);
        $this->assertEquals(1, $result);
    }

   
}
